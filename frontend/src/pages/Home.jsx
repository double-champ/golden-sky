import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Maximize2, Users, BedDouble, Clock, Check, X, ChevronRight, Waves, LayoutDashboard, Compass } from 'lucide-react';
import Testimonials from '../components/Testimonials';

// Suites comparison data
const suitesList = [
  {
    id: "r1",
    name: "Hanthana Misty Suite",
    price: "LKR 45,000",
    size: "65 m²",
    capacity: "2 Adults",
    bed: "King Bed",
    description: "A quiet mountain retreat with views of the Hanthana range. Features a private jacuzzi, organic Ceylon tea bar, and a scenic mountainside balcony.",
    features: [
      "Private outdoor heated Jacuzzi balcony",
      "Single-estate Ceylon organic tea bar",
      "Floor-to-ceiling glass mountain viewing wall",
      "Rainshower with forest views"
    ],
    image: "/images/20260418_064528_1.jpg"
  },
  {
    id: "r2",
    name: "Golden Sky Canopy Villa",
    price: "LKR 75,000",
    size: "95 m²",
    capacity: "3 Guests",
    bed: "King & Daybed",
    description: "A private standalone villa with glass walls overlooking the sunset. Features a private butler and an outdoor infinity deck.",
    features: [
      "Infinity pool deck access",
      "24/7 dedicated private butler service",
      "Panoramic cliff-edge glass walls",
      "Aromatherapy sleep selection catalog"
    ],
    image: "/images/20260418_114222_1.jpg"
  },
  {
    id: "r3",
    name: "Serenity Sanctuary Suite",
    price: "LKR 55,000",
    size: "72 m²",
    capacity: "2 Adults",
    bed: "King Bed",
    description: "A dedicated wellness suite for rejuvenation. Features custom aromatherapy, a private soaking tub, and spaces for yoga and stretching.",
    features: [
      "Clay purification air-filtration system",
      "In-room premium tea selection",
      "Curated essential oil diffusers & botanical library",
      "Handmade organic clay bath tubs"
    ],
    image: "/images/20260418_102057_1.jpg"
  }
];

// Spa Therapies data
const therapiesList = [
  {
    id: "s1",
    name: "Royal Lotus Relaxation Therapy",
    tag: "Signature Ritual",
    duration: "90 Mins",
    price: "LKR 18,000",
    description: "A restorative head-to-toe warm oil massage using native Sri Lankan lotus oil and deep tissue pressure techniques.",
    features: ["Pure lotus oil", "Head warm oil flow", "Hibiscus tea service"]
  },
  {
    id: "s2",
    name: "Kandy Spiced Herbal Glow",
    tag: "Exfoliation & Mud",
    duration: "75 Mins",
    price: "LKR 15,000",
    description: "An organic body scrub blending mountain cardamom, cinnamon, and volcanic clay to improve circulation.",
    features: ["Cinnamon scrub", "Clay wrap cover", "Steam bath session"]
  },
  {
    id: "s3",
    name: "Hanthana Herbal Wellness Massage",
    tag: "Herbal Compression",
    duration: "60 Mins",
    price: "LKR 10,000",
    description: "A private restorative treatment using warm herbal compresses and organic botanical oils.",
    features: ["Warm herbal compresses", "Local botanical oils", "Breathing coach guide"]
  }
];

// Dining packages data
const dayoutPackagesList = [
  {
    id: "do1",
    name: "Hanthana Escape Dayout",
    price: "LKR 6,500",
    description: "Includes organic lunch buffet at The Canopy, pool entry (2 Hrs), Ceylon High Tea, and free Wi-Fi."
  },
  {
    id: "do2",
    name: "Golden Wellness Dayout",
    price: "LKR 12,500",
    description: "Includes fresh detox elixirs, 3-course spa lunch, 30-min herbal steam bath, yoga lawns, and 15% spa discount."
  }
];

const diningOptionsList = [
  {
    id: "dn1",
    name: "Hanthana Sunset High Tea",
    price: "LKR 4,000",
    timing: "Daily 3:00 PM - 6:00 PM",
    description: "Sweet & savory Ceylon treats overlooking Kandy."
  },
  {
    id: "dn2",
    name: "Curated 5-Course Dinner",
    price: "LKR 9,500",
    timing: "Daily 7:00 PM - 10:30 PM",
    description: "Gastronomic tour using organic mountain harvest."
  }
];

export default function Home({ onViewChange, onOpenBooking }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [quickBooking, setQuickBooking] = useState({
    type: 'STAY',
    date: '',
    guests: '2'
  });

  const slides = [
    {
      image: "/images/20260418_112608_1.jpg",
      tag: "BOUTIQUE SANCTUARY",
      title: "Where Mist Meets Mountain",
      subtitle: "Golden Sky Resort",
      desc: "A luxury mountain resort perched 780 meters above sea level in Hanthana, Kandy. Enjoy contemporary elegance, wellness spa therapies, and beautiful nature views."
    },
    {
      image: "/images/20260418_114222_1.jpg",
      tag: "INFINITY ESCAPE",
      title: "Chambers in the Clouds",
      subtitle: "Canopy Villas & Suites",
      desc: "Luxury glass and stone villas featuring private outdoor jacuzzis, personal butler services, and panoramic views of the mountain sunset."
    },
    {
      image: "/images/20260418_102057_1.jpg",
      tag: "HOLISTIC RETREAT",
      title: "Botanical Rejuvenation",
      subtitle: "Shanti Spa & Wellness",
      desc: "Rejuvenate your body and mind with our organic lotus oil massages, herbal body scrubs, and warm herbal compress sessions."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const scrollToDashboard = () => {
    const element = document.getElementById('dashboard-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="page-transition">
      {/* HERO LANDING SECTION */}
      <section className="hero-landing">
        
        {/* Dynamic Carousel backgrounds */}
        <div className="hero-bg-container">
          {slides.map((slide, idx) => (
            <img 
              key={idx}
              src={slide.image} 
              alt={slide.tag} 
              className={`hero-bg-img ${activeSlide === idx ? 'active' : ''}`} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: activeSlide === idx ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
                zIndex: 1
              }}
            />
          ))}
          <div className="hero-bg-overlay" />
        </div>

        {/* Slide navigation indicators */}
        <div className="hero-slide-nav">
          {slides.map((_, index) => (
            <button 
              key={index} 
              className={`hero-slide-nav-dot ${activeSlide === index ? 'active' : ''}`}
              onClick={() => setActiveSlide(index)}
            >
              <span>0{index + 1}</span>
              <div className="nav-dot-line" />
            </button>
          ))}
        </div>

        {/* Hero main contents */}
        <div className="hero-content-wrapper">
          <div className="hero-content-slider">
            {slides.map((slide, idx) => (
              <div 
                key={idx} 
                className={`hero-slide-content ${activeSlide === idx ? 'active' : ''}`}
              >
                <div className="hero-tag">
                  <Sparkles size={14} className="text-gold-gradient" />
                  <span>{slide.tag}</span>
                </div>
                <h1 className="hero-title">
                  {slide.title}
                  <span className="hero-subtitle">{slide.subtitle}</span>
                </h1>
                <p className="hero-desc">{slide.desc}</p>
                <div className="hero-actions">
                  <button className="btn-gold-solid hero-btn" onClick={scrollToDashboard}>
                    Explore Sanctuary
                  </button>
                  <button className="btn-gold hero-btn" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }} onClick={() => onOpenBooking(slide.tag.includes('SPA') ? 'SPA' : 'STAY', '')}>
                    Book Experience
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Quick Booking panel */}
        <div className="quick-booking-container">
          <div className="quick-booking-panel glass-panel">
            <div className="booking-field">
              <label>Experience</label>
              <select 
                value={quickBooking.type} 
                onChange={(e) => setQuickBooking({...quickBooking, type: e.target.value})}
              >
                <option value="STAY">Luxury Stay</option>
                <option value="DAYOUT">Day Outing</option>
                <option value="SPA">Ayur Spa</option>
                <option value="DINING">Fine Dining</option>
              </select>
            </div>
            
            <div className="booking-divider" />
            
            <div className="booking-field">
              <label>Arrival Date</label>
              <input 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                value={quickBooking.date} 
                onChange={(e) => setQuickBooking({...quickBooking, date: e.target.value})}
              />
            </div>
            
            <div className="booking-divider" />
            
            <div className="booking-field">
              <label>{quickBooking.type === 'STAY' ? 'Nights' : 'Guests'}</label>
              <input 
                type="number" 
                min="1" 
                max="10"
                value={quickBooking.guests} 
                onChange={(e) => setQuickBooking({...quickBooking, guests: e.target.value})}
              />
            </div>
            
            <button className="btn-gold-solid booking-submit-btn" onClick={() => {
              localStorage.setItem('quick_date', quickBooking.date);
              if (quickBooking.type === 'STAY') {
                localStorage.setItem('quick_nights', quickBooking.guests);
              } else {
                localStorage.setItem('quick_guests', quickBooking.guests);
              }
              onOpenBooking(quickBooking.type, '');
            }}>
              Check Availability
            </button>
          </div>
        </div>
      </section>

      <div style={{ backgroundColor: 'var(--color-bg-ivory)', width: '100%' }}>
        {/* 9-CELL GOLDEN BENTO GRID */}
        <div id="dashboard-grid" className="container bento-section" style={{ paddingBottom: '3rem' }}>
        <div className="bento-container">
          
          {/* Cell 1: Cinematic Greeting (span 2-2) */}
          <div className="bento-item span-2-2 reveal" style={{ border: 'none', background: '#1c1b18', cursor: 'pointer' }} onClick={() => onViewChange('about')}>
            <img src="/images/20260418_112608_1.jpg" alt="Misty Hills" className="bento-img-bg bento-hero-pan" style={{ opacity: 0.6 }} loading="lazy" decoding="async" />
            <div className="bento-dark-overlay" />
            <div className="bento-content" style={{ color: '#fff', maxWidth: '480px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold)', marginBottom: '0.8rem' }}>
                <Sparkles size={16} />
                <span style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Boutique Sanctuary</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', color: '#fff', lineHeight: '1.1', fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>
                Mist, Mountains & <br />
                <span className="text-gold-gradient" style={{ fontStyle: 'italic', fontWeight: '500' }}>Pure Serenity</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                A unique hotel dashboard perched high above the clouds in Hanthana, Kandy. Select an interactive cell to explore our chambers, spa, and dining.
              </p>
              <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <span>Click a grid card to begin</span>
                <div style={{ width: '20px', height: '1px', backgroundColor: 'var(--color-gold)' }} />
              </div>
            </div>
          </div>
   
          {/* Cell 2: Luxury Suites card (span 1-2) */}
          <div className="bento-item span-1-2 reveal" style={{ cursor: 'pointer' }} onClick={() => onViewChange('suites')}>
            <img src="/images/20260418_064528_1.jpg" alt="Suites" className="bento-img-bg" loading="lazy" decoding="async" />
            <div className="bento-overlay" />
            <div className="bento-content">
              <span style={{ fontSize: '0.65rem', color: 'var(--color-gold-dark)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', marginBottom: '0.2rem' }}>01 / ACCOMMODATIONS</span>
              <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)' }}>Luxury Suites</h3>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Chambers perched in the clouds with panoramic jacuzzis.</p>
            </div>
          </div>
   
          {/* Cell 3: Reserve Booking CTAs (span 1-2) */}
          <div 
            className="bento-item span-1-2 bento-pulse reveal" 
            style={{ 
              cursor: 'pointer', 
              background: 'linear-gradient(135deg, #fdfcf9 0%, #faf3db 100%)', 
              borderColor: 'var(--color-gold)', 
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center' 
            }}
            onClick={() => onOpenBooking('STAY', '')}
          >
            <div className="bento-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.8rem', borderRadius: '50%', color: 'var(--color-gold)' }}>
                <Calendar size={20} />
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-gold-dark)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>Instant Check</span>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)' }}>Book Stays</h3>
            </div>
          </div>
   
          {/* Cell 5: Spa & Ayurveda (span 2-1) */}
          <div className="bento-item span-2-1 reveal" style={{ cursor: 'pointer' }} onClick={() => onViewChange('spa')}>
            <img src="/images/20260418_111209_1.jpg" alt="Spa" className="bento-img-bg" loading="lazy" decoding="async" />
            <div className="bento-overlay" />
            <div className="bento-content">
              <span style={{ fontSize: '0.65rem', color: 'var(--color-gold-dark)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', marginBottom: '0.2rem' }}>02 / HEALTH</span>
              <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)' }}>Shanti Spa & Wellness</h3>
            </div>
          </div>
   
          {/* Cell 6: Culinary & Restaurant (span 1-1) */}
          <div className="bento-item span-1-1 reveal" style={{ cursor: 'pointer' }} onClick={() => onViewChange('dining')}>
            <img src="/images/20260418_074232_1.jpg" alt="Restaurant" className="bento-img-bg" loading="lazy" decoding="async" />
            <div className="bento-overlay" />
            <div className="bento-content">
              <span style={{ fontSize: '0.65rem', color: 'var(--color-gold-dark)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', marginBottom: '0.2rem' }}>03 / CULINARY</span>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)' }}>Dine & Dayouts</h3>
            </div>
          </div>
   
          {/* Cell 7: Rooftop Lounge (span 1-1) */}
          <div className="bento-item span-1-1 reveal" style={{ cursor: 'pointer' }} onClick={() => onViewChange('rooftop')}>
            <img src="/images/20260418_112422_1.jpg" alt="Rooftop" className="bento-img-bg" loading="lazy" decoding="async" />
            <div className="bento-overlay" />
            <div className="bento-content">
              <span style={{ fontSize: '0.65rem', color: 'var(--color-gold-dark)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', marginBottom: '0.2rem' }}>04 / BAR</span>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)' }}>Aura Lounge</h3>
            </div>
          </div>
   
        </div>
      </div>

      {/* CUSTOMER REVIEWS SECTION */}
      <section className="container reveal" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>Testimonials</span>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--color-text-dark)' }}>
            Whispered Praises & <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Guest Memories</span>
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.1rem', color: 'var(--color-gold)' }}>
            {Array(5).fill(0).map((_, i) => (
              <span key={i} style={{ fontSize: '1.2rem' }}>★</span>
            ))}
          </div>
        </div>

        <Testimonials />
      </section>
      </div>

    </div>
  );
}
