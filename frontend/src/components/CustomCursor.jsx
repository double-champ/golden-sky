import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const glow = glowRef.current;
    if (!cursor || !glow) return;

    let mouseX = -100;
    let mouseY = -100;
    let glowX = -100;
    let glowY = -100;

    // Track mouse coordinates directly on GPU layer
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      cursor.style.opacity = '1';
      glow.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
      glow.style.opacity = '0';
    };

    // Smooth animation frame loop for the outer glow ring
    let rafId;
    const animateGlow = () => {
      const dx = mouseX - glowX;
      const dy = mouseY - glowY;
      glowX += dx * 0.15;
      glowY += dy * 0.15;

      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
      
      rafId = requestAnimationFrame(animateGlow);
    };

    // High-performance event delegation: listen for mouseover globally
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      // Determine if cursor is hovering over an interactive element
      const interactive = target.closest('a, button, select, input, [role="button"], .interactive-card, .room-card, .bento-item, .luxury-tab-btn');
      if (interactive) {
        cursor.classList.add('hovered');
        glow.classList.add('hovered');
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (!target) return;

      const interactive = target.closest('a, button, select, input, [role="button"], .interactive-card, .room-card, .bento-item, .luxury-tab-btn');
      if (interactive) {
        const related = e.relatedTarget;
        // Check if cursor actually left the interactive element boundary
        if (!related || !interactive.contains(related)) {
          cursor.classList.remove('hovered');
          glow.classList.remove('hovered');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    
    // Launch paint loop
    rafId = requestAnimationFrame(animateGlow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" style={{ opacity: 0, pointerEvents: 'none' }} />
      <div ref={glowRef} className="custom-cursor-glow" style={{ opacity: 0, pointerEvents: 'none' }} />
    </>
  );
}
