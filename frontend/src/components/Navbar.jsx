import React, { useState, useEffect } from 'react';
import { Calendar, Menu, X, Lock } from 'lucide-react';

export default function Navbar({ onOpenBooking, currentView, onViewChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showStaffLogin, setShowStaffLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'About', view: 'about' },
    { label: 'Chambers', view: 'suites' },
    { label: 'Spa', view: 'spa' },
    { label: 'Day-outs', view: 'dayout' },
    { label: 'Dining', view: 'dining' },
    { label: 'Rooftop Bar', view: 'rooftop' }
  ];

  const handleStaffLoginSubmit = (e) => {
    e.preventDefault();
    if (username.toLowerCase() === 'admin' && password === 'adminadminadmin') {
      setShowStaffLogin(false);
      setUsername('');
      setPassword('');
      setLoginError('');
      onViewChange('admin');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

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
      <header className={`luxury-header ${scrolled || currentView !== 'home' ? 'scrolled' : ''}`}>
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
            justifyContent: 'flex-start',
            animation: 'fadeInOverlay 0.4s ease-out',
            overflowY: 'auto',
            padding: '3.5rem 1rem 3rem 1rem'
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', margin: '0', width: '100%', maxWidth: '400px' }}>
            <div 
              onClick={() => {
                setMenuOpen(false);
                onViewChange('home');
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}
            >
              <img src="/logo.png" className="nav-menu-logo" alt="Golden Sky Logo" style={{ objectFit: 'contain' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center', width: '100%' }}>
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
                      padding: '0.4rem 1rem',
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

              {/* Dedicated Staff Portal Link in Mobile Menu */}
              <div style={{ marginTop: '1.2rem', borderTop: '1px solid rgba(207, 168, 81, 0.2)', paddingTop: '1.2rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowStaffLogin(true);
                  }}
                  style={{
                    background: 'rgba(207, 168, 81, 0.12)',
                    border: '1px solid var(--color-gold)',
                    color: 'var(--color-gold)',
                    padding: '0.65rem 1.6rem',
                    borderRadius: '30px',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: '600',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Lock size={15} />
                  <span>Staff Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Staff Portal Login Modal */}
      {showStaffLogin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(10, 9, 8, 0.88)',
          backdropFilter: 'blur(10px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '380px',
            width: '100%',
            padding: '2.5rem 1.8rem',
            backgroundColor: '#1c1b18',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            textAlign: 'center',
            position: 'relative'
          }}>
            <button 
              onClick={() => { setShowStaffLogin(false); setUsername(''); setPassword(''); setLoginError(''); }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem auto', color: 'var(--color-gold)' }}>
              <Lock size={22} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fff', margin: '0 0 0.4rem 0' }}>
              Staff Portal Access
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.8rem' }}>
              Management &amp; Staff Content Management System
            </p>

            {loginError && (
              <div style={{ backgroundColor: 'rgba(255, 80, 80, 0.15)', border: '1px solid rgba(255, 80, 80, 0.3)', color: '#ff8080', fontSize: '0.78rem', padding: '0.6rem', borderRadius: '8px', marginBottom: '1.2rem' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleStaffLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Username</label>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              <button 
                type="submit"
                className="btn-gold"
                style={{ marginTop: '0.8rem', padding: '0.8rem', fontSize: '0.78rem', width: '100%' }}
              >
                Authenticate &amp; Launch Portal
              </button>
            </form>
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
          height: 80px;
          background-color: rgba(14, 13, 11, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--color-border-gold);
          padding: 0 3rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
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
          height: 80px;
          object-fit: contain;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .luxury-header.scrolled .header-logo {
          height: 60px;
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
          .header-center {
            gap: 0.4rem;
          }
          .header-title {
            font-size: 1.1rem;
            letter-spacing: 0.14em;
          }
          .luxury-header.scrolled .header-title {
            font-size: 0.95rem;
            letter-spacing: 0.1em;
          }
          .header-logo {
            height: 62px;
          }
          .luxury-header.scrolled .header-logo {
            height: 50px;
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
