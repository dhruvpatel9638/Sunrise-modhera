import React, { useEffect, useRef } from 'react';
import bgVideo from '../assets/Generate_FPV_drone_shot_video_202606081808.mp4';

export default function ScrollBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force video to load
    video.load();

    let targetTime = 0;
    let currentTime = 0;
    let initialized = false;
    let animationFrameId = null;

    let lastSeekTime = 0;
    const seekThrottleMs = 30; // Maximum seek operations throttled to ~33 per second to prevent GPU decoder lockups

    const getScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return 0;
      return Math.min(Math.max(scrollTop / docHeight, 0), 1);
    };

    const updateLoop = () => {
      if (video && !isNaN(video.duration) && video.duration > 0) {
        // Ensure the video remains paused so playback doesn't conflict with scrubbing
        if (!video.paused) {
          video.pause();
        }

        // 1. Calculate target progress (0% -> 100%)
        const progress = getScrollProgress();
        // 2. Store target value
        targetTime = progress * video.duration;

        // Initialize to current scroll position immediately on first load
        if (!initialized) {
          currentTime = targetTime;
          video.currentTime = currentTime;
          initialized = true;
        }

        // 3. Animation engine slowly moves current value toward target value
        const diff = targetTime - currentTime;
        const now = performance.now();

        if (Math.abs(diff) > 0.01) {
          currentTime += diff * 0.06; // Slow and smooth animation gliding toward target progress
          
          // 4. Video follows smoothly, avoiding seek congestion
          if (!video.seeking && (now - lastSeekTime > seekThrottleMs)) {
            video.currentTime = currentTime;
            lastSeekTime = now;
          }
        } else if (currentTime !== targetTime) {
          currentTime = targetTime;
          if (!video.seeking) {
            video.currentTime = currentTime;
          }
        }
      }
      animationFrameId = requestAnimationFrame(updateLoop);
    };

    const handleMetadata = () => {
      if (video && !isNaN(video.duration)) {
        currentTime = getScrollProgress() * video.duration;
        video.currentTime = currentTime;
        initialized = true;
      }
    };

    video.addEventListener('loadedmetadata', handleMetadata);
    animationFrameId = requestAnimationFrame(updateLoop);

    // Initial check in case video state is already loaded from cache
    if (video.readyState >= 1) {
      handleMetadata();
    }

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', handleMetadata);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="scroll-bg-container">
      <div className="scroll-bg-overlay" />
      <video
        ref={videoRef}
        src={bgVideo}
        preload="auto"
        muted
        playsInline
        className="scroll-bg-video"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
          opacity: 0.5,
          objectFit: 'cover',
          pointerEvents: 'none',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)'
        }}
      />
    </div>
  );
}
