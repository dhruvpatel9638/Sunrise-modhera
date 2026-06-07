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

    const getScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return 0;
      return Math.min(Math.max(scrollTop / docHeight, 0), 1);
    };

    const updateLoop = () => {
      if (video && !isNaN(video.duration) && video.duration > 0) {
        const progress = getScrollProgress();
        targetTime = progress * video.duration;

        // Initialize to current scroll position immediately on first load
        if (!initialized) {
          currentTime = targetTime;
          video.currentTime = currentTime;
          initialized = true;
        }

        const diff = targetTime - currentTime;
        
        // Use a smooth linear interpolation (lerp) to glide the video currentTime.
        // This is significantly smoother than raw seeking because seeks happen in close steps,
        // which helps the browser hardware decoder process frames efficiently.
        if (Math.abs(diff) > 0.02) {
          currentTime += diff * 0.12; // Smoothness factor (0.12 feels like premium inertial scroll)
          video.currentTime = currentTime;
        } else if (currentTime !== targetTime) {
          currentTime = targetTime;
          video.currentTime = currentTime;
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
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
