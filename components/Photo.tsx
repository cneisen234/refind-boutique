import Image from "next/image";

/** A photo in the flier's thin tan frame; the wrapper's classes set the shape. */
export default function Photo({
  src,
  alt,
  sizes,
  className = "",
  priority,
  position,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** object-position, to keep the subject in frame when cropped. */
  position?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[var(--radius)] ${className}`}
      style={{ border: "var(--outline-width) solid var(--tan)", background: "var(--linen)" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}
