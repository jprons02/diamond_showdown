"use client";

interface ParallaxImageProps {
  src: string;
}

/**
 * Uses CSS background-attachment:fixed for a native parallax feel.
 * Falls back to a static image on iOS Safari (expected browser behaviour).
 */
export default function ParallaxImage({ src }: ParallaxImageProps) {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center bg-scroll sm:bg-fixed"
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}
