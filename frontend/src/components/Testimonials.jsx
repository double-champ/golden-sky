import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LOCAL_FALLBACK_REVIEWS = [
  {
    quote: "The room is spacious, clean, and incredibly comfortable. The views of the Hanthana area are out of this world! I would absolutely stay here again.",
    author: "Sophia K.",
    role: "Verified Guest via Booking.com",
    date: "June 2026"
  },
  {
    quote: "The hosts are lovely, kind, and welcoming, making us feel like family. We had an unexpectedly beautiful time and wish we could have stayed longer.",
    author: "Thomas D.",
    role: "Verified Guest via Booking.com",
    date: "May 2026"
  },
  {
    quote: "The service is outstanding with staff going above and beyond. The rooms are well-appointed, the breakfast is exceptional, and the rooftop offers a gorgeous panoramic view of Kandy.",
    author: "Elena M.",
    role: "Verified Guest via Google Reviews",
    date: "April 2026"
  },
  {
    quote: "The service was outstanding, with staff going above and beyond to ensure a pleasant experience. Kumia is a lovely, kind, welcoming host who made us feel like family.",
    author: "Oliver B.",
    role: "Verified Guest via Booking.com",
    date: "March 2026"
  },
  {
    quote: "The rooms were incredibly comfortable, clean, spacious, and filled with natural light. The breakfast was exceptional and the views of the Hanthana area were beautiful and peaceful.",
    author: "Amara P.",
    role: "Verified Guest via Google Reviews",
    date: "February 2026"
  }
];

export default function Testimonials() {
  const [reviews, setReviews] = useState(LOCAL_FALLBACK_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(1);
  const visibleSlides = 1;
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef(null);

  // Swipe gesture hooks for mobile manual controls
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const maxIndex = reviews.length - visibleSlides;

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
    fetch(`${apiBase}/reviews`)
      .then(res => {
        if (!res.ok) throw new Error('API network response was not ok');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length >= 5) {
          setReviews(data);
        }
      })
      .catch(err => {
        console.warn("[Testimonials] Could not fetch dynamic reviews from backend API, using local fallback.", err);
      });
  }, []);

  // Seamless loop transition timer
  useEffect(() => {
    if (!isTransitioning) return;

    const transitionEndTimer = setTimeout(() => {
      setIsTransitioning(false);
      
      if (maxIndex > 0) {
        if (currentIndex === 0) {
          setTransitionEnabled(false);
          setCurrentIndex(reviews.length);
        } else if (currentIndex === reviews.length + 1) {
          setTransitionEnabled(false);
          setCurrentIndex(1);
        }
      }
    }, 450);

    return () => clearTimeout(transitionEndTimer);
  }, [currentIndex, isTransitioning, maxIndex, reviews.length]);

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
  }, [currentIndex, reviews.length]);

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
    if (currentIndex === 0) return reviews.length - 1;
    if (currentIndex === reviews.length + 1) return 0;
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
    ? [reviews[reviews.length - 1], ...reviews, reviews[0]]
    : reviews;

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
                    <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'center' }}>
                      <a 
                        href={rev.source === 'Google' || rev.role.toLowerCase().includes('google')
                          ? 'https://www.google.com/travel/search?q=golden%20sky%20hotel%20%26%20wellness&g2lb=4965990%2C72471280%2C72560029%2C72573224%2C72647020%2C72686036%2C72803964%2C72882230%2C73064764%2C121529350%2C121738283%2C121762713&hl=en-LK&gl=lk&cs=1&ssta=1&ts=CAEaRwopEicyJTB4M2FlMzY3YTgzMjRkY2NhNToweDNjNzExNzljOGNhOTlmYTASGhIUCgcI6g8QCBgWEgcI6g8QCBgXGAEyAhAA&qs=CAEyE0Nnb0lvTC1tNWNqenhiZzhFQUU4AkIJCaCfqYycF3E8QgkJoJ-pjJwXcTw&ap=ugEHcmV2aWV3cw&ictx=111&ved=0CAAQ5JsGahcKEwjgsrHqh_uVAxUAAAAAHQAAAAAQCw'
                          : 'https://www.booking.com/hotel/lk/golden-sky.html'
                        }
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ 
                          fontSize: '0.68rem', 
                          color: 'var(--color-gold)', 
                          fontWeight: '600',
                          letterSpacing: '0.08em', 
                          textTransform: 'uppercase',
                          textDecoration: 'none',
                          border: '1px solid rgba(212,175,55,0.3)',
                          borderRadius: '15px',
                          padding: '0.35rem 0.9rem',
                          backgroundColor: 'rgba(212,175,55,0.02)',
                          transition: 'all 0.3s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.06)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.02)'; }}
                      >
                        <span>View on {rev.source || (rev.role.toLowerCase().includes('google') ? 'Google' : 'Booking.com')}</span>
                        <span style={{ fontSize: '0.55rem' }}>↗</span>
                      </a>
                    </div>
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
            {reviews.map((_, index) => {
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
