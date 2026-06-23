import React, { useState, useEffect } from 'react';
import { X, Sparkles, ChevronLeft, ChevronRight, Gift, Tag } from 'lucide-react';

const OFFERS = [
  {
    id: "offer-misty-retreat",
    title: "Misty Hanthana Retreat",
    badge: "Limited Stay Offer",
    discount: "20% OFF ALL SUITES",
    description: "Enjoy 20% off when you book for 3+ nights. Includes complimentary Hanthana Sunset High Tea.",
    type: "STAY",
    packageName: "Hanthana Misty Suite",
    cta: "Book Stay"
  },
  {
    id: "offer-spa-glow",
    title: "Ayurveda Wellness Glow",
    badge: "Spa Special",
    discount: "FREE HERBAL SCRUB",
    description: "Book any Signature Ritual wellness therapy and receive a complimentary cardamon scrub add-on.",
    type: "SPA",
    packageName: "Royal Lotus Relaxation Therapy",
    cta: "Book Spa"
  },
  {
    id: "offer-rooftop-cocktail",
    title: "Canopy Starlit Dining",
    badge: "Dining Exclusive",
    discount: "FREE SUNSET COCKTAIL",
    description: "Reserve an Aura Rooftop Fire-pit table and get a round of signature cocktails on us.",
    type: "DINING",
    packageName: "Aura Rooftop Fire-pit Dining",
    cta: "Reserve Table"
  }
];

export default function OfferPopper({ onOpenBooking }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Check if user already dismissed offers in this session
    const isDismissed = sessionStorage.getItem('gs_offers_dismissed');
    if (isDismissed) return;

    // Premium entrance delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('gs_offers_dismissed', 'true');
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % OFFERS.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + OFFERS.length) % OFFERS.length);
  };

  const handleClaim = () => {
    const offer = OFFERS[currentIndex];
    handleDismiss();
    onOpenBooking(offer.type, offer.packageName);
  };

  if (!isVisible) return null;

  const currentOffer = OFFERS[currentIndex];

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '340px',
        backgroundColor: 'rgba(24, 23, 21, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 15px 45px rgba(0, 0, 0, 0.35), 0 0 20px rgba(212, 175, 55, 0.1)',
        zIndex: 10002, // Just above WhatsApp/sticky layers, below BookingForm modal
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        textAlign: 'left',
        animation: 'slideUpPopper 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
      className="offer-popper-container"
    >
      {/* Header with Badge & Dismiss */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold)' }}>
          <Sparkles size={14} className="animate-spin-slow" />
          <span style={{ fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {currentOffer.badge}
          </span>
        </div>
        <button 
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.25s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
        >
          <X size={15} />
        </button>
      </div>

      {/* Offer Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <h4 style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: '1.25rem', 
          margin: 0, 
          color: '#ffffff',
          lineHeight: '1.3'
        }}>
          {currentOffer.title}
        </h4>
        <div style={{ 
          fontSize: '0.78rem', 
          fontWeight: '700', 
          color: 'var(--color-gold)', 
          letterSpacing: '0.04em' 
        }}>
          {currentOffer.discount}
        </div>
        <p style={{ 
          fontSize: '0.82rem', 
          color: 'rgba(255, 255, 255, 0.7)', 
          margin: '0.2rem 0 0 0', 
          lineHeight: '1.45' 
        }}>
          {currentOffer.description}
        </p>
      </div>

      {/* Controls & CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem', gap: '1rem' }}>
        {/* Navigation arrows */}
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button 
            onClick={handlePrev}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              transition: 'all 0.25s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-gold)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <button 
            onClick={handleNext}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              transition: 'all 0.25s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-gold)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* CTA Button */}
        <button 
          onClick={handleClaim}
          style={{
            backgroundColor: 'var(--color-gold)',
            color: 'var(--color-primary)',
            border: 'none',
            borderRadius: '30px',
            padding: '0.5rem 1.2rem',
            fontSize: '0.78rem',
            fontWeight: '700',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            transition: 'all 0.25s',
            boxShadow: '0 4px 12px rgba(212,175,55,0.15)'
          }}
          className="claim-offer-btn"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-gold-light)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-gold)';
          }}
        >
          {currentOffer.cta}
        </button>
      </div>

      <style>{`
        @keyframes slideUpPopper {
          from {
            transform: translateY(120%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 480px) {
          .offer-popper-container {
            width: calc(100% - 2rem) !important;
            bottom: 1rem !important;
            right: 1rem !important;
            left: 1rem !important;
            padding: 1.2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
