// Same artwork as the Open Graph image. Route-segment config must be declared
// literally in this file (Next can't follow re-exports for `runtime`).
export const runtime = "edge";
export { alt, size, contentType, default } from "./opengraph-image";
