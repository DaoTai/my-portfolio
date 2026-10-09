#!/usr/bin/env python3
"""Convert raster images (png/jpg/jpeg) under a directory to WebP.

A ``name.webp`` file is written next to every source image. Originals are kept
unless ``--delete-originals`` is passed. Up-to-date WebP files are skipped
unless ``--force`` is given.

Usage:
    python3 scripts/optimize_images.py                      # public/, q=80, max 1920px
    python3 scripts/optimize_images.py --dry-run            # show what would happen
    python3 scripts/optimize_images.py --quality 75 --max-width 1600
    python3 scripts/optimize_images.py --lossless-png --force
    npm run optimize:images -- --dry-run

Requires Pillow (see scripts/requirements.txt).
"""

from __future__ import annotations

import argparse
import os
import sys
from concurrent.futures import ProcessPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageOps

RASTER_EXTS = {".png", ".jpg", ".jpeg"}
WEBP_MAX_DIM = 16383  # hard limit of the WebP format, per side

try:  # Pillow >= 9.1
    LANCZOS = Image.Resampling.LANCZOS  # type: ignore[attr-defined]
except AttributeError:  # pragma: no cover - older Pillow
    LANCZOS = Image.LANCZOS  # type: ignore[attr-defined]


@dataclass(frozen=True)
class Options:
    quality: int
    max_width: int
    lossless_png: bool
    delete_originals: bool
    force: bool
    dry_run: bool


@dataclass
class Result:
    src: Path
    status: str  # "converted" | "skipped" | "dry-run" | "error"
    orig_size: int = 0
    webp_size: int = 0
    resized: tuple[int, int] | None = None
    message: str = ""

    @property
    def larger(self) -> bool:
        return self.status == "converted" and self.webp_size > self.orig_size


def human(n: float) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if abs(n) < 1024 or unit == "GB":
            return f"{n:.1f} {unit}" if unit != "B" else f"{int(n)} B"
        n /= 1024
    return f"{n:.1f} GB"


def find_images(src: Path) -> tuple[list[Path], list[list[Path]]]:
    """Return (convertible images, groups of images that share one .webp target).

    ``logo.png`` and ``logo.jpg`` would both become ``logo.webp``; such
    ambiguous groups are not converted and are reported instead.
    """
    by_target: dict[Path, list[Path]] = {}
    for p in sorted(src.rglob("*")):
        if p.is_file() and p.suffix.lower() in RASTER_EXTS:
            by_target.setdefault(p.with_suffix(".webp"), []).append(p)
    images = [g[0] for g in by_target.values() if len(g) == 1]
    collisions = [g for g in by_target.values() if len(g) > 1]
    return images, collisions


def is_up_to_date(src: Path, dst: Path) -> bool:
    return dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime


def normalize_mode(img: Image.Image) -> Image.Image:
    """Convert to RGB or RGBA, keeping transparency where present."""
    has_alpha = img.mode in ("RGBA", "LA", "PA") or (
        img.mode == "P" and "transparency" in img.info
    )
    if img.mode == "CMYK":
        return img.convert("RGB")
    if has_alpha:
        return img.convert("RGBA") if img.mode != "RGBA" else img
    if img.mode != "RGB":
        return img.convert("RGB")
    return img


def fit_size(size: tuple[int, int], max_width: int) -> tuple[int, int]:
    """Downscale (never upscale) to max_width and to the WebP dimension limit."""
    w, h = size
    scale = 1.0
    if max_width and w > max_width:
        scale = max_width / w
    scale = min(scale, WEBP_MAX_DIM / w, WEBP_MAX_DIM / h)
    if scale >= 1.0:
        return size
    return max(1, int(w * scale)), max(1, int(h * scale))


def convert_one(src: Path, opts: Options) -> Result:
    dst = src.with_suffix(".webp")
    orig_size = src.stat().st_size

    if not opts.force and is_up_to_date(src, dst):
        return Result(src, "skipped", orig_size, dst.stat().st_size, message="up-to-date")

    try:
        with Image.open(src) as im:
            im.load()
            img = ImageOps.exif_transpose(im) or im
            img = normalize_mode(img)

            resized: tuple[int, int] | None = None
            target = fit_size(img.size, opts.max_width)
            if target != img.size:
                img = img.resize(target, LANCZOS)
                resized = target

            if opts.dry_run:
                return Result(src, "dry-run", orig_size, 0, resized)

            lossless = opts.lossless_png and src.suffix.lower() == ".png"
            save_kwargs: dict[str, object] = {"method": 6}
            if lossless:
                save_kwargs.update(lossless=True, quality=100)
            else:
                save_kwargs.update(quality=opts.quality)

            tmp = dst.with_name(f"{dst.name}.{os.getpid()}.tmp")
            img.save(tmp, "WEBP", **save_kwargs)
            os.replace(tmp, dst)

        webp_size = dst.stat().st_size
        result = Result(src, "converted", orig_size, webp_size, resized)
        if opts.delete_originals and not result.larger:
            src.unlink()
            result.message = "original deleted"
        elif opts.delete_originals:
            result.message = "original kept (webp larger)"
        return result
    except Exception as exc:  # noqa: BLE001 - report and continue
        return Result(src, "error", orig_size, message=f"{type(exc).__name__}: {exc}")


def format_line(r: Result, root: Path) -> str:
    rel = r.src.relative_to(root) if r.src.is_relative_to(root) else r.src
    if r.status == "error":
        return f"  ERROR    {rel}  ({r.message})"
    if r.status == "dry-run":
        extra = f" -> resize {r.resized[0]}x{r.resized[1]}" if r.resized else ""
        return f"  DRY-RUN  {rel}  {human(r.orig_size)}{extra}"
    if r.status == "skipped":
        return f"  SKIP     {rel}  ({r.message})"
    pct = (1 - r.webp_size / r.orig_size) * 100 if r.orig_size else 0.0
    flag = "  [WARN: webp larger]" if r.larger else ""
    extra = f"  resized {r.resized[0]}x{r.resized[1]}" if r.resized else ""
    note = f"  ({r.message})" if r.message else ""
    return (
        f"  OK       {rel}  {human(r.orig_size)} -> {human(r.webp_size)}"
        f"  ({pct:+.1f}% saved){extra}{flag}{note}"
    )


def print_summary(results: list[Result], ambiguous: int = 0) -> None:
    converted = [r for r in results if r.status == "converted"]
    skipped = sum(r.status == "skipped" for r in results)
    errors = sum(r.status == "error" for r in results)
    dry = sum(r.status == "dry-run" for r in results)
    orig = sum(r.orig_size for r in converted)
    webp = sum(r.webp_size for r in converted)
    saved_pct = (1 - webp / orig) * 100 if orig else 0.0

    rows = [
        ("Converted", str(len(converted))),
        ("Skipped (up-to-date)", str(skipped)),
        ("Errors", str(errors)),
    ]
    if ambiguous:
        rows.append(("Ambiguous (not converted)", str(ambiguous)))
    if dry:
        rows.append(("Would convert (dry-run)", str(dry)))
    rows += [
        ("Original total", human(orig)),
        ("WebP total", human(webp)),
        ("Saved", f"{human(orig - webp)} ({saved_pct:.1f}%)"),
    ]
    width = max(len(k) for k, _ in rows)
    bar = "-" * (width + 20)
    print(f"\n{bar}\nSummary\n{bar}")
    for k, v in rows:
        print(f"{k.ljust(width)}  {v}")

    larger = [r for r in converted if r.larger]
    if larger:
        print(f"\nWebP larger than original ({len(larger)}):")
        for r in larger:
            print(f"  {r.src}  {human(r.orig_size)} -> {human(r.webp_size)}")
    print(bar)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Convert png/jpg/jpeg images to WebP.")
    p.add_argument("--src", default="public", help="root directory (default: public)")
    p.add_argument("--quality", type=int, default=80, help="WebP quality 0-100 (default: 80)")
    p.add_argument(
        "--max-width", type=int, default=1920,
        help="downscale wider images to this width; 0 disables (default: 1920)",
    )
    p.add_argument("--lossless-png", action="store_true", help="encode PNGs losslessly")
    p.add_argument(
        "--delete-originals", action="store_true",
        help="delete source files after conversion (kept if webp is larger)",
    )
    p.add_argument("--force", action="store_true", help="re-encode even if webp is up-to-date")
    p.add_argument("--dry-run", action="store_true", help="show what would be done")
    p.add_argument("--workers", type=int, default=None, help="process count (default: CPUs)")
    return p.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    root = Path(args.src).resolve()
    if not root.is_dir():
        print(f"error: {root} is not a directory", file=sys.stderr)
        return 2
    if not 0 <= args.quality <= 100:
        print("error: --quality must be between 0 and 100", file=sys.stderr)
        return 2

    opts = Options(
        quality=args.quality,
        max_width=args.max_width,
        lossless_png=args.lossless_png,
        delete_originals=args.delete_originals,
        force=args.force,
        dry_run=args.dry_run,
    )
    images, collisions = find_images(root)
    print(f"Found {len(images)} raster image(s) under {root}")
    for group in collisions:
        names = ", ".join(str(p.relative_to(root)) for p in group)
        print(f"  AMBIGUOUS {names}  (same .webp target; rename one to convert)")

    results: list[Result] = []
    with ProcessPoolExecutor(max_workers=args.workers) as pool:
        futures = [pool.submit(convert_one, path, opts) for path in images]
        for fut in as_completed(futures):
            r = fut.result()
            results.append(r)
            print(format_line(r, root), flush=True)

    print_summary(results, sum(len(g) for g in collisions))
    return 1 if any(r.status == "error" for r in results) else 0


if __name__ == "__main__":
    sys.exit(main())
