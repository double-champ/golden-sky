import React, { useState, useEffect } from 'react';
import { Calendar, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenBooking, currentView, onViewChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'About', view: 'about' },
    { label: 'Suites', view: 'suites' },
    { label: 'Spa', view: 'spa' },
    { label: 'Dine & Dayouts', view: 'dining' },
    { label: 'Rooftop Bar', view: 'rooftop' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Luxury Sticky Header */}
      <header className={`luxury-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-left">
          <button
            onClick={() => setMenuOpen(true)}
            className="menu-btn"
            aria-label="Open Navigation Menu"
          >
            <Menu className="menu-icon" size={18} />
            <span className="menu-text">Menu</span>
          </button>
        </div>

        <div 
          onClick={() => onViewChange('home')}
          className="header-center"
          style={{ cursor: 'pointer' }}
        >
          <img 
            src="/logo.png" 
            alt="Golden Sky Logo" 
            className="header-logo"
          />
          {currentView === 'home' && (
            <span className="header-title">
              Golden Sky
            </span>
          )}
        </div>

        <div className="header-right">
          <button
            onClick={onOpenBooking}
            className="reserve-btn"
          >
            <Calendar size={14} />
            <span className="reserve-text">Reserve Stay</span>
          </button>
        </div>
      </header>

      {/* Fullscreen Navigation Overlay */}
      {menuOpen && (
        <div 
          className="nav-menu-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(18, 17, 15, 0.98)',
            backdropFilter: 'blur(15px)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeInOverlay 0.4s ease-out',
            overflowY: 'auto',
            padding: '2rem 1rem'
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '25px',
              left: '30px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              outline: 'none',
              zIndex: 10001
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.transform = 'rotate(90deg)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.transform = 'rotate(0deg)'; }}
          >
            <X size={22} />
          </button>

          {/* Luxury Navigation Links */}
          <div className="nav-menu-content-wrapper">
            <div 
              onClick={() => {
                setMenuOpen(false);
                onViewChange('home');
              }}
              className="nav-menu-logo-container"
            >
              <img src="/logo.png" className="nav-menu-logo" alt="Golden Sky Logo" style={{ height: '180px', objectFit: 'contain' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
              {navItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => {
                      setMenuOpen(false);
                      onViewChange(item.view);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isActive ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.7)',
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      padding: '0.5rem 1rem',
                      outline: 'none'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-gold)'; e.currentTarget.style.transform = 'scale(1.08)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.color = isActive ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.7)'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    {item.label}
                    {isActive && (
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '30px',
                        height: '2px',
                        backgroundColor: 'var(--color-gold)'
                      }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Styled Animations & Responsive Layout */}
      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .luxury-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 95px;
          background-color: transparent;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4rem;
          z-index: 9999;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          border-bottom: 1px solid transparent;
        }

        .luxury-header.scrolled {
          height: 70px;
          background-color: rgba(24, 23, 21, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          padding: 0 3rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .header-left {
          display: flex;
          align-items: center;
          flex: 1;
          justify-content: flex-start;
        }

        .menu-btn {
          background: none;
          border: none;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          outline: none;
          transition: all 0.3s ease;
          padding: 0.5rem 0;
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .menu-btn:hover {
          color: var(--color-gold);
          transform: translateX(3px);
        }

        .menu-icon {
          color: var(--color-gold);
          transition: transform 0.3s ease;
        }

        .menu-btn:hover .menu-icon {
          transform: scale(1.1);
        }

        .header-center {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.9rem;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0.5rem;
        }

        .luxury-header.scrolled .header-center {
          gap: 0.6rem;
        }

        .header-logo {
          height: 52px;
          object-fit: contain;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .luxury-header.scrolled .header-logo {
          height: 34px;
        }

        .header-title {
          font-family: var(--font-serif);
          font-size: 1.65rem;
          font-weight: 400;
          letter-spacing: 0.28em;
          color: #dfba6b;
          text-transform: uppercase;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
          white-space: nowrap;
        }

        .luxury-header.scrolled .header-title {
          font-size: 1.25rem;
          letter-spacing: 0.22em;
        }

        .header-right {
          display: flex;
          align-items: center;
          flex: 1;
          justify-content: flex-end;
        }

        .reserve-btn {
          padding: 0.8rem 2rem;
          border-radius: 50px;
          background-color: var(--color-gold);
          color: #ffffff;
          border: none;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
        }

        .luxury-header.scrolled .reserve-btn {
          padding: 0.65rem 1.5rem;
          font-size: 0.72rem;
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.25);
        }

        .reserve-btn:hover {
          transform: translateY(-2px);
          background-color: var(--color-gold-dark);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.5);
        }

        .reserve-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .luxury-header {
            padding: 0 1.5rem;
            height: 80px;
          }
          .luxury-header.scrolled {
            padding: 0 1.2rem;
            height: 65px;
          }
          .menu-text {
            display: none;
          }
          .menu-btn {
            gap: 0;
          }
          .header-title {
            font-size: 1.2rem;
            letter-spacing: 0.18em;
          }
          .luxury-header.scrolled .header-title {
            font-size: 1rem;
            letter-spacing: 0.12em;
          }
          .header-logo {
            height: 40px;
          }
          .luxury-header.scrolled .header-logo {
            height: 28px;
          }
          .reserve-text {
            display: none;
          }
          .reserve-btn {
            padding: 0.6rem 0.8rem;
            gap: 0;
          }
          .luxury-header.scrolled .reserve-btn {
            padding: 0.5rem 0.7rem;
          }
        }
      `}</style>
    </>
  );
}
