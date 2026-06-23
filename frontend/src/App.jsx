import React, { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import SuitesPage from './pages/SuitesPage';
import SpaPage from './pages/SpaPage';
import DiningPage from './pages/DiningPage';
import RooftopPage from './pages/RooftopPage';
import AboutPage from './pages/AboutPage';
import BookingForm from './components/BookingForm';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingParams, setBookingParams] = useState({ type: 'STAY', package: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Initial loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenBooking = (type = 'STAY', packageName = '') => {
    setBookingParams({ type, package: packageName });
    setBookingModalOpen(true);
  };

  const handleViewChange = (view) => {
    if (view === currentView) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (isLoading) return;
    if (['home', 'suites', 'spa', 'dining', 'rooftop', 'about', 'admin'].includes(view)) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentView(view);
        window.scrollTo(0, 0);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }, 550);
    } else {
      setCurrentView('home');
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    // Scroll reveal observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.08 });

    // Query and observe after page render completes (coordinating with load transitions)
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal');
      elements.forEach((el) => revealObserver.observe(el));
    }, 600);

    return () => {
      revealObserver.disconnect();
      clearTimeout(timer);
    };
  }, [currentView]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Luxury Hotel Loader Overlay */}
      <HotelViewLoader isVisible={isLoading} />

      {/* Booking Form Overlay */}
      <BookingForm
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialType={bookingParams.type}
        initialPackage={bookingParams.package}
      />

      {/* Header / Navbar */}
      <Navbar 
        onOpenBooking={() => handleOpenBooking('STAY', '')}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <Home 
            onViewChange={handleViewChange} 
            onOpenBooking={handleOpenBooking}
          />
        )}
        {currentView === 'suites' && (
          <SuitesPage onOpenBooking={handleOpenBooking} />
        )}
        {currentView === 'spa' && (
          <SpaPage onOpenBooking={handleOpenBooking} />
        )}
        {currentView === 'dining' && (
          <DiningPage onOpenBooking={handleOpenBooking} />
        )}
        {currentView === 'rooftop' && (
          <RooftopPage onOpenBooking={handleOpenBooking} />
        )}
        {currentView === 'about' && (
          <AboutPage onOpenBooking={handleOpenBooking} />
        )}
        {currentView === 'admin' && (
          <AdminDashboard onGoBack={() => handleViewChange('home')} />
        )}
      </main>

      {/* Footer (Rendered on all pages for consistent premium branding) */}
      {currentView !== 'admin' && <Footer onViewChange={handleViewChange} onOpenBooking={() => handleOpenBooking('STAY', '')} />}

      {/* WhatsApp Floater */}
      {currentView !== 'admin' && <WhatsAppFloater />}
    </div>
  );
}

function WhatsAppFloater() {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <a
        href="https://wa.me/94714831035?text=Hello%20Golden%20Sky%20Hotel%20%26%20Wellness%2C%20I%20would%20like%20to%20inquire%20about%20a%20booking."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* WhatsApp Icon Circle Container */}
        <div
          className="whatsapp-pulse-btn"
          style={{
            position: 'relative',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#25D366',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: hovered ? 'scale(1.08) translateY(-3px)' : 'scale(1)'
          }}
        >
          <svg viewBox="0 0 16 16" width="30" height="30" fill="currentColor">
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
          </svg>
        </div>

        {/* Tooltip Label */}
        <span
          style={{
            backgroundColor: '#0c1712',
            color: '#f3e5be',
            fontSize: '0.8rem',
            fontWeight: '500',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.05em',
            padding: '0.6rem 1.2rem',
            borderRadius: '30px',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(0)' : 'translateX(-10px)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
          }}
        >
          Chat on WhatsApp
        </span>
      </a>

      <style>{`
        @keyframes whatsappPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }
        .whatsapp-pulse-btn {
          animation: whatsappPulse 2.2s infinite;
        }
      `}</style>
    </>
  );
}

function HotelViewLoader({ isVisible }) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(250, 248, 245, 0.98)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 100000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isVisible ? 'all' : 'none'
      }}
    >
      {/* Luxury Golden Drawing Medallion */}
      <div style={{ position: 'relative', width: '130px', height: '130px', marginBottom: '2rem' }}>
        {/* SVG Drawing Circle (Foil Crest effect) */}
        <svg
          width="130"
          height="130"
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(-90deg)'
          }}
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="rgba(212, 175, 55, 0.15)"
            strokeWidth="1.5"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="1.5"
            strokeDasharray="276"
            strokeDashoffset="276"
            style={{
              animation: 'drawGoldCircle 2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
            }}
          />
        </svg>

        {/* Center Logo Icon */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          boxShadow: '0 8px 20px rgba(212, 175, 55, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.03)'
        }}>
          <img
            src="/logo.png"
            alt="Golden Sky Crest"
            style={{
              width: '85%',
              height: '85%',
              objectFit: 'contain',
              animation: 'logoBreathe 2s infinite alternate ease-in-out'
            }}
          />
        </div>
      </div>

      {/* Elegant Text */}
      <div style={{ textAlign: 'center', animation: 'fadeInText 1s ease-out' }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.8rem',
          fontWeight: '400',
          letterSpacing: '0.3em',
          color: '#1b1a18',
          textTransform: 'uppercase',
          margin: 0,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          Golden Sky
        </h2>
        <div style={{
          width: '35px',
          height: '1px',
          backgroundColor: 'rgba(212, 175, 55, 0.45)',
          margin: '0.8rem auto'
        }} />
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.68rem',
          fontWeight: '600',
          letterSpacing: '0.4em',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          margin: 0
        }}>
          Hotel &amp; Wellness
        </p>
      </div>

      <style>{`
        @keyframes drawGoldCircle {
          0% {
            stroke-dashoffset: 276;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -276;
          }
        }
        @keyframes logoBreathe {
          0% {
            transform: scale(0.95);
            opacity: 0.85;
          }
          100% {
            transform: scale(1.05);
            opacity: 1;
            filter: drop-shadow(0 0 4px rgba(223, 186, 107, 0.2));
          }
        }
        @keyframes fadeInText {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

