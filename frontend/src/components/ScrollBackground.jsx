import React, { useEffect, useRef } from 'react';
import bgVideo from '../assets/Mud_huts_with_thatched_roofs_202606040528.mp4';

export default function ScrollBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force video to load
    video.load();

    let targetTime = 0;
    let currentTime = 0;
    let animationFrameId = null;
    let initialized = false;

    let lastSeekTime = 0;
    const seekThrottleMs = 50; // Throttle to maximum ~20 seeking operations per second to allow decoder to keep up

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

        const progress = getScrollProgress();
        targetTime = progress * video.duration;

        // Initialize to current scroll position immediately on first load
        if (!initialized) {
          currentTime = targetTime;
          video.currentTime = currentTime;
          initialized = true;
        }

        const diff = targetTime - currentTime;
        const now = performance.now();
        
        // Use a smooth linear interpolation (lerp) to glide the video currentTime.
        // We only push currentTime updates to the video element if it's not currently seeking 
        // and we have throttled seeks to prevent decoder overload.
        if (Math.abs(diff) > 0.01) {
          currentTime += diff * 0.1; // Smoothness factor
          if (!video.seeking && (now - lastSeekTime > seekThrottleMs)) {
            video.currentTime = currentTime;
            lastSeekTime = now;
          }
        } else if (Math.abs(video.currentTime - targetTime) > 0.01) {
          currentTime = targetTime;
          if (!video.seeking && (now - lastSeekTime > seekThrottleMs)) {
            video.currentTime = currentTime;
            lastSeekTime = now;
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
