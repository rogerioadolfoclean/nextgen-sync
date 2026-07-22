"use client";

import { useEffect, useState } from "react";

/** Niveau micro normalisé (0..1) calculé dans le navigateur. */
export function useAudioLevel(stream: MediaStream | null, active = true): number {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!active || !stream || stream.getAudioTracks().length === 0) {
      return;
    }

    const AudioContextClass = window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.72;
    const source = context.createMediaStreamSource(stream);
    source.connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    let frame = 0;

    const measure = () => {
      analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (const sample of samples) {
        const value = (sample - 128) / 128;
        sum += value * value;
      }
      const rms = Math.sqrt(sum / samples.length);
      setLevel(Math.min(1, rms * 5.5));
      frame = requestAnimationFrame(measure);
    };
    measure();

    return () => {
      cancelAnimationFrame(frame);
      source.disconnect();
      analyser.disconnect();
      void context.close();
    };
  }, [stream, active]);

  return level;
}
