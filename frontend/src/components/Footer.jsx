import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ onViewChange, onOpenBooking }) {
  return (
    <footer style={{ 
      backgroundColor: '#030504', 
      borderTop: '1px solid rgba(197, 160, 89, 0.1)', 
      padding: '5rem 0 2rem 0',
      position: 'relative',
      zIndex: 10,
      contentVisibility: 'auto',
      containIntrinsicSize: '0 500px'
    }}>
      <div className="container">
        {/* Logo Section (Centered above the grid for perfect alignment) */}
        <div 
          onClick={() => onViewChange && onViewChange('home')}
          style={{ 
            marginBottom: '2.5rem', 
            display: 'flex', 
            justifyContent: 'center',
            cursor: onViewChange ? 'pointer' : 'default',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => { if (onViewChange) e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseOut={(e) => { if (onViewChange) e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <img src="/logo.png" alt="Golden Sky Logo" style={{ height: '100px', objectFit: 'contain' }} />
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '3rem',
          marginBottom: '4rem',
          textAlign: 'left'
        }}>
          {/* About & Description */}
          <div>
            <h4 style={{ 
              fontFamily: 'var(--font-sans)', 
              fontWeight: '600', 
              fontSize: '0.85rem', 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase', 
              color: 'var(--color-gold-light)',
              marginBottom: '1.5rem'
            }}>
              The Resort
            </h4>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.65' }}>
              A premium boutique sanctuary perched atop the misty slopes of Hanthana, Kandy. Merging absolute luxury with authentic holistic wellness.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* Instagram */}
              <a href="https://www.instagram.com/golden.sky.hotel?igsh=ZnQ1ZDhleWx6b2Zm" target="_blank" rel="noreferrer" className="btn-gold" style={{ padding: '0.4rem 0.6rem', borderRadius: '50%' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@goldenskyhotel?_r=1&_t=ZS-97JXcAJ49jw" target="_blank" rel="noreferrer" className="btn-gold" style={{ padding: '0.4rem 0.6rem', borderRadius: '50%' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://www.facebook.com/share/1DydLXzbNH/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="btn-gold" style={{ padding: '0.4rem 0.6rem', borderRadius: '50%' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ 
              fontFamily: 'var(--font-sans)', 
              fontWeight: '600', 
              fontSize: '0.85rem', 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase', 
              color: 'var(--color-gold-light)',
              marginBottom: '1.5rem'
            }}>
              Sanctuary
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingLeft: 0 }}>
              <li>
                <button 
                  onClick={() => onViewChange && onViewChange('suites')} 
                  className="nav-link"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    textAlign: 'left', 
                    font: 'inherit',
                    padding: '0.4rem 0',
                    margin: 0,
                    textTransform: 'capitalize', 
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'block',
                    color: 'rgba(255, 255, 255, 0.8)',
                    outline: 'none'
                  }}
                >
                  Suites &amp; Villas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onViewChange && onViewChange('spa')} 
                  className="nav-link"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    textAlign: 'left', 
                    font: 'inherit',
                    padding: '0.4rem 0',
                    margin: 0,
                    textTransform: 'capitalize', 
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'block',
                    color: 'rgba(255, 255, 255, 0.8)',
                    outline: 'none'
                  }}
                >
                  Golden Shanti Spa
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onViewChange && onViewChange('dining')} 
                  className="nav-link"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    textAlign: 'left', 
                    font: 'inherit',
                    padding: '0.4rem 0',
                    margin: 0,
                    textTransform: 'capitalize', 
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'block',
                    color: 'rgba(255, 255, 255, 0.8)',
                    outline: 'none'
                  }}
                >
                  The Canopy Restaurant
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onViewChange && onViewChange('rooftop')} 
                  className="nav-link"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    textAlign: 'left', 
                    font: 'inherit',
                    padding: '0.4rem 0',
                    margin: 0,
                    textTransform: 'capitalize', 
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'block',
                    color: 'rgba(255, 255, 255, 0.8)',
                    outline: 'none'
                  }}
                >
                  Aura Rooftop Bar
                </button>
              </li>
            </ul>
          </div>

          {/* Practical Info */}
          <div>
            <h4 style={{ 
              fontFamily: 'var(--font-sans)', 
              fontWeight: '600', 
              fontSize: '0.85rem', 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase', 
              color: 'var(--color-gold-light)',
              marginBottom: '1.5rem'
            }}>
              Reservations
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingLeft: 0 }}>
              <li>
                <button 
                  onClick={() => onOpenBooking && onOpenBooking('STAY', '')} 
                  className="nav-link"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    textAlign: 'left', 
                    font: 'inherit',
                    padding: '0.4rem 0',
                    margin: 0,
                    textTransform: 'capitalize', 
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                >
                  Book Stay
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenBooking && onOpenBooking('SPA', '')} 
                  className="nav-link"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    textAlign: 'left', 
                    font: 'inherit',
                    padding: '0.4rem 0',
                    margin: 0,
                    textTransform: 'capitalize', 
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                >
                  Book Spa Session
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenBooking && onOpenBooking('DAYOUT', '')} 
                  className="nav-link"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    textAlign: 'left', 
                    font: 'inherit',
                    padding: '0.4rem 0',
                    margin: 0,
                    textTransform: 'capitalize', 
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                >
                  Dayout Packages
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ 
              fontFamily: 'var(--font-sans)', 
              fontWeight: '600', 
              fontSize: '0.85rem', 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase', 
              color: 'var(--color-gold-light)',
              marginBottom: '1.5rem'
            }}>
              Get in Touch
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <a href="https://maps.app.goo.gl/jfwgBKrYWVokMaw28" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>
                  Hanthana Mountain Road, Kandy, Sri Lanka
                </a>
              </li>
              <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <Phone size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <a href="tel:+94714831035" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>
                  +94 71 483 1035
                </a>
              </li>
              <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <Mail size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <a href="mailto:hello@goldenskyhotelandwellness.com" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-gold)'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>
                  hello@goldenskyhotelandwellness.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
          paddingTop: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)'
        }} className="footer-bottom-bar">
          <p style={{ letterSpacing: '0.05em', margin: 0 }} className="footer-designed-by">
            Designed by <a href="https://inforgesoft.com/" target="_blank" rel="noopener noreferrer" className="text-gold-gradient" style={{ fontWeight: '600', textDecoration: 'none' }}>FORGE SOFTWARE SOLUTIONS</a>
          </p>
          <p style={{ margin: 0 }} className="footer-copyright">
            © {new Date().getFullYear()} Golden Sky Hotel & Wellness. All Rights Reserved.
          </p>
          <div className="footer-spacer" style={{ width: '300px' }} />
        </div>
      </div>

      <style>{`
        .footer-designed-by {
          width: 300px;
          text-align: left;
          white-space: nowrap;
        }
        .footer-copyright {
          text-align: center;
          flex: 1;
        }
        @media (max-width: 768px) {
          .footer-bottom-bar {
            flex-direction: column !important;
            text-align: center !important;
            gap: 1rem !important;
          }
          .footer-designed-by, .footer-copyright {
            width: 100% !important;
            text-align: center !important;
          }
          .footer-spacer {
            display: none !important;
          }
        }
      `}</style>
    </footer>
  );
}
