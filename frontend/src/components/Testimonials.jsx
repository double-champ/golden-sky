import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: "A heavenly escape above the mist. Waking up to panoramic mountain ridges engulfed in cooling mist while our private butler served estate-grown tea was unforgettable.",
    author: "John & Sarah D.",
    role: "United Kingdom — Honeymooners",
    date: "May 2026"
  },
  {
    quote: "The Hanthana Herbal Wellness and Spiced Glow massage at Shadara Wellness are legendary. I felt a profound sense of relaxation and detox. Architectural luxury at its finest.",
    author: "Dr. Evelyn R.",
    role: "Australia — Wellness Consultant",
    date: "April 2026"
  },
  {
    quote: "Fine dining with mountain sunsets, followed by starlit cocktails around the fire-pit at Aura Rooftop was a dream. The service is incredibly polite, personalized, and seamless.",
    author: "Marcus L.",
    role: "Singapore — Travel Writer",
    date: "March 2026"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const visibleSlides = 1;
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef(null);

  // Swipe gesture hooks for mobile manual controls
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const maxIndex = testimonials.length - visibleSlides;

  // Seamless loop transition timer
  useEffect(() => {
    if (!isTransitioning) return;

    const transitionEndTimer = setTimeout(() => {
      setIsTransitioning(false);
      
      if (maxIndex > 0) {
        if (currentIndex === 0) {
          setTransitionEnabled(false);
          setCurrentIndex(testimonials.length);
        } else if (currentIndex === testimonials.length + 1) {
          setTransitionEnabled(false);
          setCurrentIndex(1);
        }
      }
    }, 450);

    return () => clearTimeout(transitionEndTimer);
  }, [currentIndex, isTransitioning, maxIndex]);

  // Auto-play logic
  const startAutoPlay = () => {
    stopAutoPlay();
    if (maxIndex <= 0) return;

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 4500);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentIndex]);

  const handlePrev = () => {
    if (maxIndex <= 0 || isTransitioning) return;
    setIsTransitioning(true);
    setTransitionEnabled(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (maxIndex <= 0 || isTransitioning) return;
    setIsTransitioning(true);
    setTransitionEnabled(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const viewportRef = useRef(null);
  const touchStartRef = useRef(null);

  const onTouchStart = (e) => {
    if (isTransitioning) return;
    setTouchEnd(null);
    const clientX = e.targetTouches[0].clientX;
    setTouchStart(clientX);
    touchStartRef.current = clientX;
  };

  const onTouchMove = (e) => {
    if (isTransitioning) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    const startX = touchStartRef.current;
    touchStartRef.current = null;
    setTouchStart(null);

    if (!startX || !touchEnd || isTransitioning) return;
    const distance = startX - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Lock page scrolling when horizontal swipe is active
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleTouchMove = (e) => {
      const startX = touchStartRef.current;
      if (startX !== null) {
        const currentX = e.touches[0].clientX;
        const diffX = Math.abs(startX - currentX);
        const diffY = Math.abs(e.touches[0].clientY - e.touches[0].clientY); // Just focus on horizontal dominancy

        // If horizontal movement is significant, prevent page scrolling
        if (diffX > 8) {
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      }
    };

    viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      viewport.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const getInitials = (authorName) => {
    const clean = authorName.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, "");
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length > 1) {
      return (parts[1] === '&' && parts[2]) 
        ? (parts[0][0] + parts[2][0]).toUpperCase()
        : (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0] ? parts[0][0].toUpperCase() : "";
  };

  // Get active dot index mapping for looping array
  const getActiveDotIndex = () => {
    if (maxIndex <= 0) return 0;
    if (currentIndex === 0) return testimonials.length - 1;
    if (currentIndex === testimonials.length + 1) return 0;
    return currentIndex - 1;
  };

  const handleDotClick = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTransitionEnabled(true);
    setCurrentIndex(index + 1);
  };

  // Define slides to render: extend with clones on ends if carousel is active
  const slidesToRender = maxIndex > 0
    ? [testimonials[testimonials.length - 1], ...testimonials, testimonials[0]]
    : testimonials;

  return (
    <div 
      className="testimonials-section-wrapper"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
      style={{
        position: 'relative',
        width: '100%',
        margin: '0 auto',
        padding: maxIndex > 0 ? '0 3.5rem' : '0' // Pad arrow space if carousel is active
      }}
    >
      {/* Slider Viewport */}
      <div 
        ref={viewportRef}
        style={{ 
          overflow: 'hidden', 
          width: '100%', 
          cursor: 'grab',
          touchAction: 'pan-y', // Prevent vertical page scrolling when swiping horizontally
          paddingTop: '1.2rem', // Prevent absolute quote icons from being clipped
          marginTop: '-1.2rem',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          style={{
            display: 'flex',
            transform: `translate3d(-${currentIndex * (100 / visibleSlides)}%, 0, 0)`,
            transition: transitionEnabled ? 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            width: '100%',
            willChange: 'transform'
          }}
        >
          {slidesToRender.map((rev, idx) => {
            const initials = getInitials(rev.author);
            return (
              <div 
                key={idx} 
                style={{
                  width: `${100 / visibleSlides}%`,
                  flexShrink: 0,
                  padding: '0 0.85rem',
                  boxSizing: 'border-box'
                }}
              >
                <div className="review-card-premium" style={{ border: 'none', background: 'none', boxShadow: 'none', padding: 0 }}>
                  <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <p style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
                      lineHeight: '1.8',
                      color: 'var(--color-text-dark)',
                      fontStyle: 'italic',
                      marginBottom: '0'
                    }}>
                      “{rev.quote}”
                    </p>
                  </div>
                  <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-gold)', margin: '1.8rem auto' }} />
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text-dark)', fontFamily: 'var(--font-helvetica)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
                      {rev.author}
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginTop: '0.4rem', letterSpacing: '0.05em' }}>
                      {rev.role} — <span style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>{rev.date}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Render controls only if there are offscreen slides */}
      {maxIndex > 0 && (
        <>
          {/* Arrow Left */}
          <button 
            onClick={handlePrev}
            className="carousel-control-btn prev"
            aria-label="Previous review"
            style={{
              position: 'absolute',
              top: '50%',
              left: '0.5rem',
              transform: 'translateY(-50%)',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              color: 'var(--color-gold-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(24,23,21,0.06)',
              transition: 'all 0.3s ease',
              zIndex: 10
            }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Arrow Right */}
          <button 
            onClick={handleNext}
            className="carousel-control-btn next"
            aria-label="Next review"
            style={{
              position: 'absolute',
              top: '50%',
              right: '0.5rem',
              transform: 'translateY(-50%)',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              color: 'var(--color-gold-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(24,23,21,0.06)',
              transition: 'all 0.3s ease',
              zIndex: 10
            }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Pagination dots indicator */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.2rem',
              marginTop: '1.75rem'
            }}
          >
            {testimonials.map((_, index) => {
              const isActive = getActiveDotIndex() === index;
              return (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '12px 8px', // High hit hitbox for mobile fingertips
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 'none'
                  }}
                >
                  <div
                    style={{
                      width: isActive ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? 'var(--color-gold)' : 'rgba(212, 175, 55, 0.25)',
                      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                </button>
              );
            })}
          </div>
        </>
      )}

      <style>{`
        .carousel-control-btn:hover {
          background-color: var(--color-gold) !important;
          color: #fff !important;
          border-color: var(--color-gold) !important;
          transform: translateY(-50%) scale(1.08) !important;
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3) !important;
        }
        .carousel-control-btn:active {
          transform: translateY(-50%) scale(0.98) !important;
        }
        @media (max-width: 768px) {
          .testimonials-section-wrapper {
            padding: 0 !important;
          }
          .carousel-control-btn {
            display: none !important; /* Hide arrows on small screens, rely on swipe/dots */
          }
        }
      `}</style>
    </div>
  );
}
