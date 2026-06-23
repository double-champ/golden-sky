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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef(null);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 6000); // Auto-play interval: 6 seconds
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [activeIndex]);

  const changeSlide = (newIndex) => {
    if (isTransitioning || newIndex === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(newIndex);
      setIsTransitioning(false);
    }, 350); // Timeout matches CSS transition duration
  };

  const handlePrev = () => {
    const newIndex = activeIndex === 0 ? testimonials.length - 1 : activeIndex - 1;
    changeSlide(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex === testimonials.length - 1 ? 0 : activeIndex + 1;
    changeSlide(newIndex);
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
      className="testimonials-carousel-wrapper"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '750px',
        margin: '0 auto',
        padding: '0 1rem'
      }}
    >
      {/* Testimonial Card Container */}
      <div 
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
          transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          minHeight: '290px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {(() => {
          const rev = testimonials[activeIndex];
          const initials = getInitials(rev.author);
          return (
            <div className="review-card-premium" style={{ width: '100%', height: 'auto', minHeight: '290px' }}>
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
                <div style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-gold-light)',
                  color: 'var(--color-gold-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  {initials}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <h4 style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-text-dark)' }}>{rev.author}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(24,23,21,0.6)' }}>{rev.role}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-gold-dark)', fontWeight: '600' }}>{rev.date}</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Manual Side Controls */}
      <button 
        onClick={handlePrev}
        className="carousel-control-btn prev"
        aria-label="Previous review"
        style={{
          position: 'absolute',
          top: '50%',
          left: '-3.5rem',
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

      <button 
        onClick={handleNext}
        className="carousel-control-btn next"
        aria-label="Next review"
        style={{
          position: 'absolute',
          top: '50%',
          right: '-3.5rem',
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

      {/* Navigation Indicators / Dots */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          marginTop: '1.75rem'
        }}
      >
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => changeSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            style={{
              width: activeIndex === index ? '24px' : '8px',
              height: '8px',
              borderRadius: '8px',
              backgroundColor: activeIndex === index ? 'var(--color-gold)' : 'rgba(212, 175, 55, 0.25)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        ))}
      </div>

      {/* Dynamic Hover Styles inside standard inline tag */}
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
        @media (max-width: 900px) {
          .carousel-control-btn.prev {
            left: -0.5rem !important;
          }
          .carousel-control-btn.next {
            right: -0.5rem !important;
          }
          .carousel-control-btn {
            background-color: rgba(255, 255, 255, 0.9) !important;
            backdrop-filter: blur(5px);
          }
        }
      `}</style>
    </div>
  );
}
