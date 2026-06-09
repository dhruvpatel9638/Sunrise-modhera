import React, { useEffect, useRef } from 'react';

export default function ScrollBackground({ onProgress }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const frameCount = 240;
    const images = [];
    let loadedCount = 0;
    let imagesPreloaded = false;

    let currentFrameIndex = 0;
    let targetFrameIndex = 0;
    let animationFrameId = null;

    const getScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return 0;
      return Math.min(Math.max(scrollTop / docHeight, 0), 1);
    };

    const drawImageProp = (img) => {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      const iw = img.width;
      const ih = img.height;
      
      // Calculate aspect ratio fit (object-fit: cover)
      const r = Math.max(w / iw, h / ih);
      const nw = iw * r;
      const nh = ih * r;
      const cx = (w - nw) / 2;
      const cy = (h - nh) / 2;
      
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, cx, cy, nw, nh);
    };

    const renderFrame = (index) => {
      const imgIndex = Math.min(frameCount - 1, Math.max(0, Math.round(index)));
      const img = images[imgIndex];
      if (img && img.complete) {
        drawImageProp(img);
      }
    };

    // Preload all 240 frame images
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameName = `ezgif-frame-${String(i).padStart(3, '0')}.png`;
      img.src = new URL(`../assets/ezgif-2fe938cd99012e6a-png-split/${frameName}`, import.meta.url).href;
      
      img.onload = () => {
        loadedCount++;
        const percent = Math.round((loadedCount / frameCount) * 100);
        if (onProgress) onProgress(percent);

        // Render first frame immediately once loaded to avoid blank screen
        if (i === 1) {
          renderFrame(0);
        }
        if (loadedCount === frameCount) {
          imagesPreloaded = true;
        }
      };

      img.onerror = () => {
        loadedCount++;
        const percent = Math.round((loadedCount / frameCount) * 100);
        if (onProgress) onProgress(percent);
        if (loadedCount === frameCount) {
          imagesPreloaded = true;
        }
      };

      images.push(img);
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(currentFrameIndex);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const updateLoop = () => {
      if (imagesPreloaded) {
        const progress = getScrollProgress();
        targetFrameIndex = progress * (frameCount - 1);

        // Animation engine: slowly move current value toward target value (lerp)
        const diff = targetFrameIndex - currentFrameIndex;
        if (Math.abs(diff) > 0.01) {
          // Changed lerp factor from 0.08 to 0.03 for a more pronounced "inertia" effect
          // so frames slowly slow down when scrolling stops
          currentFrameIndex += diff * 0.03; 
          renderFrame(currentFrameIndex);
        } else if (currentFrameIndex !== targetFrameIndex) {
          currentFrameIndex = targetFrameIndex;
          renderFrame(currentFrameIndex);
        }
      }
      animationFrameId = requestAnimationFrame(updateLoop);
    };

    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="scroll-bg-container">
      <div className="scroll-bg-overlay" />
      <canvas
        ref={canvasRef}
        className="scroll-bg-canvas"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
          opacity: 0.5,
          pointerEvents: 'none',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)'
        }}
      />
    </div>
  );
}
