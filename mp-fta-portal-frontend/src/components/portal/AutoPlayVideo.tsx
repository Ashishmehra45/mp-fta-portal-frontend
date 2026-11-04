import { useEffect, useRef, type VideoHTMLAttributes } from 'react';

/** Plays (muted, as browsers require) when at least half the video is on screen; pauses when scrolled away. */
export function AutoPlayVideo(props: VideoHTMLAttributes<HTMLVideoElement>) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} muted playsInline {...props} />;
}
