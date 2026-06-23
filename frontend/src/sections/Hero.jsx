import React from 'react';
import { Calendar, Users, Eye } from 'lucide-react';

export default function Hero({ onOpenBooking }) {
  // Let's use one of the spectacular misty morning photos from the hotel
  const heroImage = "/images/20260418_061119_1.jpg";

  return (
    <header id="home" className="parallax-banner">
      <div 
        className="parallax-bg" 
        style={{ backgroundImage: `url(${heroImage})` }} 
      />
      <div className="parallax-overlay" />

      <div className="container" style={{ position: 'relative', zIndex: 3, textAlign: 'center', marginTop: '-3rem' }}>
        <p className="animate-fade" style={{ 
          fontSize: '0.9rem', 
          letterSpacing: '0.3em', 
          textTransform: 'uppercase', 
          color: 'var(--color-gold)', 
          marginBottom: '1rem',
          fontWeight: '500'
        }}>
          A Sanctuary Above Kandy
        </p>
        
        <h1 className="animate-slide-up" style={{ 
          fontSize: 'clamp(2.5rem, 6vw, 5rem)', 
          fontFamily: 'var(--font-serif)', 
          lineHeight: '1.1',
          marginBottom: '2rem',
          fontWeight: '400'
        }}>
          Mist, Mountains & <br />
          <span className="text-gold-gradient" style={{ fontStyle: 'italic', fontWeight: '500' }}>Pure Rejuvenation</span>
        </h1>

        <p className="animate-fade" style={{ 
          maxWidth: '600px', 
          margin: '0 auto 3rem auto', 
          fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', 
          color: 'rgba(255, 255, 255, 0.8)' 
        }}>
          Perched on the scenic peaks of Hanthana. Experience curated wellness journeys, luxury mountainside suites, and gourmet culinary experiences.
        </p>

        {/* Floating Quick Reservation Widget */}
        <div 
          className="glass-panel animate-slide-up" 
          style={{ 
            maxWidth: '900px', 
            margin: '0 auto', 
            padding: '1.2rem 2rem', 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
            borderRadius: '8px'
          }}
        >
          <div style={{ display: 'flex', gap: '2rem', flex: 1, flexWrap: 'wrap', textAlign: 'left' }}>
            {/* Stays widget link */}
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
              <Calendar size={20} style={{ color: 'var(--color-gold)' }} />
              <div>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>Experience</label>
                <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#fff' }}>Room stays / Day-outs</div>
              </div>
            </div>

            {/* Wellness widget link */}
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
              <Users size={20} style={{ color: 'var(--color-gold)' }} />
              <div>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)' }}>Guests</label>
                <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#fff' }}>2 Adults</div>
              </div>
            </div>
          </div>

          <button 
            className="btn-gold-solid" 
            style={{ width: '100%', maxWidth: '200px' }}
            onClick={onOpenBooking}
          >
            Check Availability
          </button>
        </div>
      </div>

      {/* Floating scroll indicator */}
      <a 
        href="#rooms" 
        className="animate-float" 
        style={{ 
          position: 'absolute', 
          bottom: '2.5rem', 
          zIndex: 3, 
          color: 'var(--color-gold)', 
          textDecoration: 'none', 
          fontSize: '0.8rem', 
          letterSpacing: '0.2em', 
          textTransform: 'uppercase',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span>Discover More</span>
        <div style={{ 
          width: '1px', 
          height: '40px', 
          backgroundColor: 'rgba(197, 160, 89, 0.4)', 
          margin: '0 auto' 
        }} />
      </a>
    </header>
  );
}
