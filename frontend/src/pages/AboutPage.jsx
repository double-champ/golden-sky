import React, { useState, useEffect } from 'react';
import { MapPin, Compass, ShieldCheck, Sparkles, Clock, Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Testimonials from '../components/Testimonials';

export default function AboutPage({ onOpenBooking }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  const galleryItems = [
    {
      url: "/images/20260418_112608_1.jpg",
      title: "Misty Valley Ridges",
      category: "Guest Memories",
      caption: "Stunning valley views captured from the outdoor canopy platforms by our guests."
    },
    {
      url: "/images/20260418_065800_1.jpg",
      title: "Morning Sunrays on Balcony",
      category: "Wellness",
      caption: "Guests relaxing on the private wooden balconies during the golden sunrise."
    },
    {
      url: "/images/20260418_102057_1.jpg",
      title: "Botanical Shanti Spa Lounge",
      category: "Wellness",
      caption: "Soothing architectural stone spaces where our herbal therapies are practiced."
    },
    {
      url: "/images/20260418_072718_1.jpg",
      title: "Sunsets over Aura Bar",
      category: "Explorations",
      caption: "A panoramic guest spot overlooking the high-altitude forest landscape."
    },
    {
      url: "/images/20260418_114222_1.jpg",
      title: "Starlit Aura Fire-pit",
      category: "Guest Memories",
      caption: "Sharing stories around the stone fire pits as night settles over Kandy's peaks."
    },
    {
      url: "/images/20260418_064528_1.jpg",
      title: "Hanthana Peak Vista",
      category: "Explorations",
      caption: "A view of the rolling mountain peaks directly outside the resort grounds."
    },
    {
      url: "/images/20260418_095058_1.jpg",
      title: "Ceylon High Tea Deck",
      category: "Culinary",
      caption: "Gourmet High Tea setups ready for visitors on the sunset balcony."
    },
    {
      url: "/images/20260418_074232_1.jpg",
      title: "Organic Gastronomic Platters",
      category: "Culinary",
      caption: "Artisan breakfast courses designed by our chefs using fresh regional farm picks."
    }
  ];

  const categories = ['All', 'Guest Memories', 'Wellness', 'Explorations', 'Culinary'];

  const filteredItems = activeCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  // Local Experiences list
  const experiences = [
    {
      title: "Hanthana Mountain Hike",
      desc: "Embark on an unforgettable trekking adventure through the misty pine forests, lush tea fields, and high-altitude grasslands surrounding the resort. Led by our naturalist guides, this trek offers spectacular panoramic views of the entire Kandy valley and introduces you to the rich endemic flora and fauna of the region.",
      time: "Starts at Resort Gates",
      image: "/images/exp_hike.jpg"
    },
    {
      title: "Peradeniya Botanical Gardens",
      desc: "Explore Sri Lanka's largest and most historic royal botanical gardens, renowned for its spectacular collection of orchids, medicinal herbs, and giant palm avenues. Spanning over 147 acres, the gardens house more than 4,000 species of tropical flora, including the famous giant bamboo forests and towering double-palm trees.",
      time: "25 Mins from Resort",
      image: "/images/exp_gardens.jpg"
    },
    {
      title: "Temple of the Sacred Tooth Relic",
      desc: "Visit the globally revered UNESCO World Heritage site, Sri Dalada Maligawa, located within the royal palace complex of the former Kingdom of Kandy. This sacred temple houses the relic of the tooth of the Buddha, making it one of the most prominent Buddhist pilgrimage sites in the world, filled with rich history, architecture, and rituals.",
      time: "20 Mins from Resort",
      image: "/images/exp_temple.jpg"
    },
    {
      title: "Ceylon Tea Museum Hantana",
      desc: "Journey through the fascinating history of Sri Lankan tea cultivation inside a beautifully restored vintage 1925 factory building. The museum showcases early tea-processing machinery, pioneering exhibits on Thomas Lipton and James Taylor, and offers an exquisite tea-tasting experience overlooking the scenic Hantana mountain hills.",
      time: "10 Mins from Resort",
      image: "/images/exp_tea.jpg"
    },
    {
      title: "Kandy Lake Sunset Walk",
      desc: "Take a peaceful stroll along the historic banks of Kandy Lake at golden hour. Watch the sunset paint the sky in vibrant shades of amber and gold, casting reflections of the nearby temple and palace complex onto the tranquil waters. This relaxing experience is the perfect way to unwind after a day of mountain exploration.",
      time: "20 Mins from Resort",
      image: "/images/exp_lake.jpg"
    }
  ];

  const [carouselIndex, setCarouselIndex] = useState(0);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % experiences.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + experiences.length) % experiences.length);
  };

  // Automated scrolling effect
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [experiences.length]);


  return (
    <div className="page-transition" style={{ backgroundColor: 'var(--color-bg-ivory)', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* 1. HERO BANNER */}
      <section className="page-hero-banner" style={{
        position: 'relative',
        height: '55vh',
        background: 'linear-gradient(rgba(24, 23, 21, 0.45), rgba(24, 23, 21, 0.7)), url("/images/20260418_112608_1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
            Our Heritage
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#fff', fontFamily: 'var(--font-serif)', margin: '0.5rem 0 1rem 0' }}>
            About <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Golden Sky</span>
          </h1>
          <p style={{ maxWidth: '600px', color: 'rgba(255,255,255,0.8)', margin: '0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
            Learn the story behind our eco-conscious mountain sanctuary, perched 780m above the Kandy Valley.
          </p>
        </div>
      </section>

      {/* 2. THE STORY SECTION (TWO COLUMN EDITORIAL) */}
      <section className="container responsive-section-padding" style={{ paddingBottom: '2rem' }}>
        <div className="responsive-layout-grid" style={{ alignItems: 'center', textAlign: 'left', marginBottom: '4rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>01 / PHILOSOPHY</span>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-serif)', marginTop: '0.3rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
              Where Luxury Meets <br />
              <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Curative Serenity</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: '1.75' }}>
              <p>
                Golden Sky Hotel & Wellness represents an architectural bridge between modern luxury and raw mountain environment. Built along the ridges of the Hanthana Mountain range in Kandy, Sri Lanka, our suites are crafted from hand-carved local granite and high-strength structural glass.
              </p>
              <p>
                Each chamber is designed to merge the guest visually with the shifting mist valleys, offering an experience of deep isolation, peace, and ecological connection. We run on advanced eco-conscious principles, utilizing organic water recycling, low-carbon natural ventilations, and local farming cooperatives.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div style={{
              padding: '2.5rem 2rem',
              borderRadius: '20px',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              background: '#ffffff',
              textAlign: 'left',
              boxShadow: '0 10px 30px rgba(0,0,0,0.015)'
            }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-gold-dark)', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Elevation</span>
              <span style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)', display: 'block', lineHeight: 1.1, marginBottom: '0.3rem' }}>780 Meters</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>High-altitude estate perched directly within the clouds of Kandy.</p>
            </div>
            
            <div style={{
              padding: '2.5rem 2rem',
              borderRadius: '20px',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              background: '#ffffff',
              textAlign: 'left',
              boxShadow: '0 10px 30px rgba(0,0,0,0.015)'
            }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-gold-dark)', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Micro-Climate</span>
              <span style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)', display: 'block', lineHeight: 1.1, marginBottom: '0.3rem' }}>18°C - 24°C</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>Refreshing alpine temperatures offering year-round serenity.</p>
            </div>

            <div style={{
              padding: '2.5rem 2rem',
              borderRadius: '20px',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              background: '#ffffff',
              textAlign: 'left',
              boxShadow: '0 10px 30px rgba(0,0,0,0.015)'
            }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-gold-dark)', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nature</span>
              <span style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)', display: 'block', lineHeight: 1.1, marginBottom: '0.3rem' }}>100% Organic</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>Lush mountain flora and botanicals cultivated surrounding the resort.</p>
            </div>

            <div style={{
              padding: '2.5rem 2rem',
              borderRadius: '20px',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              background: '#ffffff',
              textAlign: 'left',
              boxShadow: '0 10px 30px rgba(0,0,0,0.015)'
            }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-gold-dark)', textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Hosting</span>
              <span style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)', display: 'block', lineHeight: 1.1, marginBottom: '0.3rem' }}>24/7 Butler</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>Private, personalized, and seamless service from our elite hosts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 UNIQUE LOCAL EXPERIENCES CAROUSEL */}
      <section className="container animate-slide-up responsive-section-padding" style={{ paddingBottom: '4rem' }}>
        <div style={{ textAlign: 'left', marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>Kandy Explorations</span>
            <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem', color: 'var(--color-text-dark)', lineHeight: 1.1 }}>
              Curated Kandy <br />
              <span className="text-gold-gradient" style={{ fontStyle: 'italic', fontWeight: '400' }}>Encounters</span>
            </h2>
          </div>
          <p style={{ maxWidth: '480px', fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: '1.7', margin: 0 }}>
            Embark on automated, elite guided journeys to discover regional historic gems and breathtaking wilderness.
          </p>
        </div>

        {/* Carousel Window */}
        <div style={{ position: 'relative', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.06)', width: '100%' }}>
          <div style={{
            display: 'flex',
            width: '100%',
            transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
            transform: `translateX(-${carouselIndex * 100}%)`
          }}>
            {experiences.map((exp, idx) => (
              <div 
                key={idx} 
                className="experience-carousel-item"
              >
                {/* Image panel with Ken Burns animation */}
                <div style={{ position: 'relative', overflow: 'hidden', minHeight: '350px' }}>
                  <img 
                    src={exp.image} 
                    alt={exp.title} 
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    className={carouselIndex === idx ? 'ken-burns-image' : ''}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to right, rgba(28,27,24,0.9) 0%, rgba(28,27,24,0.2) 60%, rgba(28,27,24,0) 100%)'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '30px',
                    background: 'rgba(212,175,55,0.15)',
                    border: '1px solid rgba(212,175,55,0.4)',
                    backdropFilter: 'blur(12px)',
                    padding: '0.5rem 1.2rem',
                    borderRadius: '30px',
                    fontSize: '0.75rem',
                    color: '#fff',
                    fontWeight: '500',
                    letterSpacing: '0.08em'
                  }}>
                    {exp.time}
                  </div>
                </div>

                {/* Content side */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }} className="responsive-block-padding">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold)', marginBottom: '1.2rem' }}>
                    <Sparkles size={14} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                      Exclusive Tour 0{idx + 1}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-serif)', color: '#fff', marginBottom: '1.2rem', lineHeight: '1.2' }}>
                    {exp.title}
                  </h3>
                  <p style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', marginBottom: '2.5rem' }}>
                    {exp.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={prevSlide}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gold)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button 
                        onClick={nextSlide}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gold)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator inside container */}
          <div style={{ position: 'absolute', bottom: '25px', right: '40px', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
            {experiences.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                style={{
                  width: carouselIndex === idx ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '10px',
                  background: carouselIndex === idx ? 'var(--color-gold)' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease'
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. REAL INTERACTIVE GOOGLE MAP */}
      <section className="container map-section" style={{ padding: '4rem 2rem 2rem 2rem' }}>
        <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>Sojourn &amp; Sanctuary</span>
          <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginTop: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-text-dark)', lineHeight: 1.1 }}>
            Find Your Way to <br />
            <span className="text-gold-gradient" style={{ fontStyle: 'italic', fontWeight: '400' }}>Golden Sky</span>
          </h2>
        </div>

        <div 
          className="responsive-layout-grid responsive-block-padding"
          style={{
            backgroundColor: 'var(--color-primary)',
            border: '1px solid rgba(212,175,55,0.28)',
            borderRadius: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
            alignItems: 'center'
          }}
        >
          {/* Map Frame Container */}
          <div className="map-frame" style={{
            height: '350px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(212,175,55,0.22)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
          }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.5186591038593!2d80.63216708532454!3d7.281654800000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae367a8324dcca5%3A0x3c71179c8ca99fa0!2sGolden+Sky+Hotel+%26+Wellness!5e0!3m2!1sen!2slk!4v1718567123456"
              width="100%" 
              height="100%" 
              style={{ 
                border: 0,
                filter: 'invert(90%) hue-rotate(180deg) grayscale(0.25) contrast(1.2)',
                opacity: 0.85
              }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map showing Golden Sky Hotel & Wellness Location in Hanthana, Kandy"
            />
          </div>

          {/* Details & Location Description */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold)', marginBottom: '0.8rem' }}>
              <MapPin size={18} />
              <span style={{ fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Our Location</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: '#ffffff', marginBottom: '1rem' }}>
              Hanthana Range, <br />
              <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Kandy, Sri Lanka</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.72)', lineHeight: '1.6', marginBottom: '2rem' }}>
              Golden Sky Resort is situated on a lush private estate along the slopes of the Hanthana Mountains, just a 20-minute drive from Kandy’s historic city center. Our remote altitude isolates us from urban noise, offering a cooling alpine micro-climate and pure, mist-fresh air.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                className="btn-gold-solid" 
                style={{ width: 'fit-content' }}
                onClick={() => onOpenBooking('STAY', '')}
              >
                Book Your Mountain Escape
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. IMAGES DYNAMIC SANCTUARY GALLERY */}
      <section className="container responsive-section-padding" style={{ paddingBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '3.5rem', textAlign: 'left' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold)', marginBottom: '0.6rem' }}>
              <Camera size={18} />
              <span style={{ fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Visual Showcase</span>
            </div>
            <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)', lineHeight: 1.1 }}>
              Guest Experience <br />
              <span className="text-gold-gradient" style={{ fontStyle: 'italic', fontWeight: '400' }}>Chronicles</span>
            </h2>
          </div>

          {/* Luxury Tab Bar */}
          <div style={{ maxWidth: '600px', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <div className="luxury-tabs" style={{ marginBottom: 0 }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`luxury-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Redesigned Gallery Grid with Editorial Card Details */}
        <div 
          key={activeCategory}
          className="responsive-layout-grid gallery-grid-container"
          style={{ 
            gap: '3rem 2rem',
            minHeight: '450px'
          }}
        >
          {filteredItems.map((item, index) => (
            <div 
              key={item.url} 
              className="gallery-item-card" 
              style={{
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                '--card-idx': index
              }}
            >
              {/* Image Container with Gold Border Frame */}
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(212,175,55,0.18)',
                height: '340px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.015)',
                position: 'relative'
              }}>
                <img 
                  src={item.url} 
                  alt={item.title} 
                  loading="lazy"
                  decoding="async"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' 
                  }}
                  className="gallery-grid-img"
                />
              </div>

              {/* Text details beneath the card */}
              <div style={{ padding: '0 0.5rem' }}>
                <span style={{ 
                  fontSize: '0.68rem', 
                  color: 'var(--color-gold-dark)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.15em', 
                  fontWeight: '700',
                  display: 'block',
                  marginBottom: '0.4rem'
                }}>
                  {item.category}
                </span>
                <h4 style={{ 
                  color: 'var(--color-text-dark)', 
                  fontFamily: 'var(--font-serif)', 
                  fontSize: '1.3rem', 
                  margin: '0 0 0.5rem 0', 
                  fontWeight: '500',
                  lineHeight: '1.2'
                }}>
                  {item.title}
                </h4>
                <p style={{ 
                  color: 'var(--color-text-muted)', 
                  fontSize: '0.85rem', 
                  lineHeight: '1.6', 
                  margin: 0 
                }}>
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX LIGHTBOX POPUP MODAL */}
      {lightboxImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(12,11,10,0.96)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            animation: 'fadeIn 0.3s ease forwards'
          }}
          onClick={() => setLightboxImage(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxImage(null)}
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          >
            <X size={28} />
          </button>

          <div 
            style={{
              maxWidth: '900px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(212,175,55,0.25)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                maxHeight: '70vh'
              }}
            >
              <img 
                src={lightboxImage.url} 
                alt={lightboxImage.title} 
                decoding="async"
                style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain', display: 'block', margin: '0 auto' }} 
              />
            </div>
            <div style={{ color: '#ffffff', textAlign: 'left', maxWidth: '750px', margin: '0 auto' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '600' }}>
                {lightboxImage.category}
              </span>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', margin: '0.4rem 0 0.8rem 0', color: '#ffffff' }}>
                {lightboxImage.title}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' }}>
                {lightboxImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. CUSTOMER REVIEWS SECTION */}
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
  );
}
