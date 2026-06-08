import React, { useEffect, useRef } from 'react';
import bgVideo from '../assets/Mud_huts_with_thatched_roofs_202606040528.mp4';

export default function ScrollBackground() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force video to load
    video.load();

    let animationFrameId = null;

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
        const targetTime = progress * video.duration;

        // Directly update currentTime to match scroll position exactly (millisecond by millisecond)
        // playing forward when scrolling down, and backward (reverse) when scrolling up.
        if (Math.abs(video.currentTime - targetTime) > 0.001) {
          video.currentTime = targetTime;
        }
      }
      animationFrameId = requestAnimationFrame(updateLoop);
    };

    const handleMetadata = () => {
      if (video && !isNaN(video.duration)) {
        video.currentTime = getScrollProgress() * video.duration;
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
