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
    quote: "The Hanthana Herbal Wellness and Spiced Glow massage at Shanti Spa are legendary. I felt a profound sense of relaxation and detox. Architectural luxury at its finest.",
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(3);
  const autoPlayRef = useRef(null);

  // Swipe gesture hooks for mobile manual controls
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleSlides(1);
      } else if (window.innerWidth < 1024) {
        setVisibleSlides(2);
      } else {
        setVisibleSlides(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = testimonials.length - visibleSlides;

  // Auto-play logic
  const startAutoPlay = () => {
    stopAutoPlay();
    if (maxIndex <= 0) return; // No need to auto-play if all slides fit on screen

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 6000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentIndex, visibleSlides]);

  const handlePrev = () => {
    if (maxIndex <= 0) return;
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    if (maxIndex <= 0) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

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

  return (
    <div 
      className="testimonials-section-wrapper"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
      style={{
        position: 'relative',
        width: '100%',
        margin: '0 auto',
        padding: maxIndex > 0 ? '0 3.5rem' : '0' // Add padding only if controls are visible
      }}
    >
      {/* Slider Viewport */}
      <div 
        style={{ overflow: 'hidden', width: '100%', cursor: 'grab' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          style={{
            display: 'flex',
            transform: `translate3d(-${currentIndex * (100 / visibleSlides)}%, 0, 0)`,
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            width: '100%'
          }}
        >
          {testimonials.map((rev, idx) => {
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
                <div className="review-card-premium" style={{ height: '100%' }}>
                  <div className="review-card-quote-icon">“</div>
                  <div>
                    <div className="review-card-stars">
                      {Array(5).fill(0).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.08rem',
                      lineHeight: '1.7',
                      color: 'var(--color-text-dark)',
                      fontStyle: 'italic',
                      marginBottom: '2rem',
                      position: 'relative',
                      zIndex: 2,
                      textAlign: 'left'
                    }}>
                      "{rev.quote}"
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(212,175,55,0.12)', paddingTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="review-card-avatar">
                      {initials}
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-text-dark)', fontFamily: 'var(--font-sans)', margin: 0 }}>{rev.author}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.2rem' }}>{rev.role}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-gold-dark)', fontWeight: '600' }}>{rev.date}</span>
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
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
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
                    width: currentIndex === index ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '8px',
                    backgroundColor: currentIndex === index ? 'var(--color-gold)' : 'rgba(212, 175, 55, 0.25)',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </button>
            ))}
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
