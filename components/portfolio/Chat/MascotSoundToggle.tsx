import { Volume2, VolumeX } from "lucide-react";

type MascotSoundToggleProps = { enabled: boolean; onToggle: () => void };

/** Mutes the mascot's rocket sounds; sits just left of the mascot's home. */
export const MascotSoundToggle = ({ enabled, onToggle }: MascotSoundToggleProps) => (
  <button
    type="button"
    onClick={onToggle}
    // A pressed "Mute" button: screen readers say "Mute mascot sounds, pressed" when muted.
    aria-pressed={!enabled}
    aria-label="Mute mascot sounds"
    className="fixed bottom-[calc(80px+var(--tabbar-lift,0px))] right-[92px] z-40 flex h-8 w-8 items-center justify-center rounded-full bg-pf-base2/80 text-pf-text/80 backdrop-blur transition-colors hover:text-pf-text sm:bottom-[calc(88px+var(--tabbar-lift,0px))] sm:right-[136px]"
  >
    {enabled ? (
      <Volume2 aria-hidden="true" size={15} />
    ) : (
      <VolumeX aria-hidden="true" size={15} />
    )}
  </button>
);
