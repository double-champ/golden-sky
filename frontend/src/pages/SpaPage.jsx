import React, { useState, useEffect, useRef } from 'react';
import { Clock, Check, ChevronRight, Loader2, Sparkles, Heart } from 'lucide-react';

const API_BASE = "http://localhost:5000/api";

const spaMetadata = {
  "Royal Lotus Relaxation Therapy": { tag: "Signature Ritual", duration: "90 Mins", focus: "Full-body restoration" },
  "Kandy Spiced Herbal Glow": { tag: "Exfoliation & Mud", duration: "75 Mins", focus: "Rejuvenation & detox" },
  "Hanthana Herbal Wellness Massage": { tag: "Herbal Compression", duration: "60 Mins", focus: "Deep muscle relief" }
};

export default function SpaPage({ onOpenBooking }) {
  const [therapies, setTherapies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breathPhase, setBreathPhase] = useState("Breathe In");
  const breathingRef = useRef(null);

  useEffect(() => {
    let interval = null;
    let phase = 0; // 0: inhale, 1: hold, 2: exhale

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Reset and start breathing when scrolled into view if not already running
          if (!interval) {
            phase = 0;
            setBreathPhase("Breathe In");
            
            interval = setInterval(() => {
              phase = (phase + 1) % 3;
              if (phase === 0) {
                setBreathPhase("Breathe In");
              } else if (phase === 1) {
                setBreathPhase("Hold");
              } else {
                setBreathPhase("Breathe Out");
              }
            }, 4000);
          }
        } else {
          // Clear interval if scrolled out of view
          if (interval) {
            clearInterval(interval);
            interval = null;
          }
          setBreathPhase("Breathe In"); // Reset to initial state
        }
      });
    }, { threshold: 0.1 });

    if (breathingRef.current) {
      observer.observe(breathingRef.current);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    async function fetchSpa() {
      try {
        const response = await fetch(`${API_BASE}/rooms`);
        if (!response.ok) throw new Error("Failed to fetch.");
        const data = await response.json();
        const spaList = data.filter(r => r.type === 'SPA');
        setTherapies(spaList);
      } catch (err) {
        console.warn("Backend API offline. Loading fallback spa therapies...");
        // Fallback mock stayed spa list representing the 3 seeded therapies
        const fallbackSpa = Object.keys(spaMetadata).map((name, index) => ({
          id: `fallback-s${index + 1}`,
          name,
          type: "SPA",
          price: name.includes("Lotus") ? 18000 : (name.includes("Glow") ? 15000 : 10000),
          capacity: 1,
          description: name.includes("Lotus") 
            ? "A restorative head-to-toe warm oil massage using native Sri Lankan lotus oil and deep tissue pressure techniques to release stored tension."
            : (name.includes("Glow") 
                ? "An organic body scrub blending mountain cardamom, cinnamon, and volcanic clay. Restores skin luster and improves circulation under misty breezes."
                : "A private restorative treatment using warm herbal compresses and organic botanical oils focused on muscle relief and physical relaxation."),
          amenities: name.includes("Lotus")
            ? "Pure Lotus Oil, Deep Tissue Massage, Warm Copper Wash, Hibiscus Tea"
            : (name.includes("Glow")
                ? "Cardamom Cinnamon Scrub, Volcanic Clay Wrap, Herbal Steam Box, Lemongrass Oil"
                : "Herbal Compresses, Local Botanical Oils, Bird Audio Ambient, Breathing Coach"),
          imageUrl: `/images/20260418_1${index === 0 ? '11209' : (index === 1 ? '05523' : '11748')}_1.jpg`
        }));
        setTherapies(fallbackSpa);
      } finally {
        setLoading(false);
      }
    }
    fetchSpa();
  }, []);

  const getMeta = (name) => {
    return spaMetadata[name] || { tag: "Herbal Treatment", duration: "60 Mins", focus: "Deep relaxation" };
  };

  return (
    <div className="page-transition" style={{ backgroundColor: '#f2f4f0', minHeight: '100vh' }}>
      
      {/* 1. HERO BANNER */}
      <section className="page-hero-banner" style={{
        position: 'relative',
        height: '55vh',
        background: 'linear-gradient(rgba(24, 23, 21, 0.45), rgba(24, 23, 21, 0.7)), url("/images/20260418_111209_1.jpg")',
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
            Wellness & Healing
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#fff', fontFamily: 'var(--font-serif)', margin: '0.5rem 0 1rem 0' }}>
            Golden Shanti <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Wellness Spa</span>
          </h1>
          <p style={{ maxWidth: '600px', color: 'rgba(255,255,255,0.8)', margin: '0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
            Experience restorative Sri Lankan therapies, cardamon scrubs, and botanical wraps in our high-altitude chambers.
          </p>
        </div>
      </section>

      {/* 2. INTRO EDITORIAL SECTION */}
      <section className="container responsive-section-padding" style={{ paddingBottom: '2rem' }}>
        <div className="responsive-layout-grid" style={{ gap: '3rem', alignItems: 'center', textAlign: 'left', marginBottom: '4rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>The Shanti Philosophy</span>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', marginTop: '0.3rem', marginBottom: '1.2rem', lineHeight: '1.2' }}>
              Curative Rituals <br />
              <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>of the Mountain Mist</span>
            </h2>
            <p style={{ lineHeight: '1.75', color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Set high on the Hanthana peaks, Golden Shanti Spa blends ancient Hela Wedakama (traditional Sri Lankan wellness) with classical herbal therapies. We source organic cardamom, wild forest honey, and native lotus extracts from our private reservation to blend customized aromatic oils for your journey. Each treatment is tailored to your unique energy profile, harnessing the local micro-climate and pure alpine mist to accelerate cellular recovery, soothe the nervous system, and restore deep, natural equilibrium.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', borderTop: '1px solid rgba(212,175,55,0.18)', paddingTop: '1.8rem' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-dark)', lineHeight: '1.6' }}>
                <span style={{ color: 'var(--color-gold-dark)', fontWeight: '600', fontFamily: 'var(--font-serif)', fontStyle: 'italic', marginRight: '0.5rem' }}>Organic Blends:</span>
                Custom-distilled oils infused with organic cardamom, local lotus extracts, wild mountain ginger, and estate sandalwood.
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-text-dark)', lineHeight: '1.6' }}>
                <span style={{ color: 'var(--color-gold-dark)', fontWeight: '600', fontFamily: 'var(--font-serif)', fontStyle: 'italic', marginRight: '0.5rem' }}>Sanctuary Hours:</span>
                Open from 8:00 AM to 9:00 PM daily. Prior reservations recommended for herbal baths and wellness consultations.
              </div>
            </div>
          </div>
          <div style={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(212,175,55,0.22)',
            height: '440px',
            position: 'relative',
            boxShadow: '0 15px 40px rgba(0,0,0,0.03)'
          }}>
            <img 
              src="/images/20260418_111209_1.jpg" 
              alt="Botanical Shanti Spa Lounge at Golden Sky Hotel & Wellness" 
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="gallery-grid-img"
            />
          </div>
        </div>
      </section>

      {/* MINDFUL BREATHING SANCTUARY (INTERACTIVE SPA INTERACTION) */}
      <section ref={breathingRef} className="container reveal" style={{ padding: '1.5rem 2rem 2.5rem 2rem' }}>
        <div 
          className="responsive-block-padding"
          style={{
            backgroundColor: 'var(--color-primary)',
            borderRadius: '30px',
            color: '#fff',
            border: '1px solid rgba(212,175,55,0.3)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative ambient background blur */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0) 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
            zIndex: 1
          }} />

          <div 
            className="breathing-layout"
            style={{
              alignItems: 'center',
              gap: '2rem',
              position: 'relative',
              zIndex: 2
            }}
          >
            {/* Left Content Column */}
            <div style={{
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              flex: 1
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                High-Altitude Relaxation
              </span>
              <h3 style={{ fontSize: '2.1rem', fontFamily: 'var(--font-serif)', color: '#fff', margin: 0, lineHeight: '1.25' }}>
                Acclimatize Your Lungs <br />
                <span className="text-gold-gradient" style={{ fontStyle: 'italic', fontWeight: '400' }}>with Kandy's Peak Mist</span>
              </h3>
              <p className="breathing-desc" style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', lineHeight: '1.65', margin: 0 }}>
                Before embarking on your spa treatments, we invite you to take a moment to adjust to the high-altitude rhythm of the Hanthana Mountains. Sit comfortably, focus on a slow breathing rhythm, and draw in the pure, crisp mountain air infused with wild eucalyptus and pine mist. This natural respiration helps adjust your lungs to our 780m elevation, oxygenating your system and preparing your body for deep herbal relaxation.
              </p>
            </div>

            {/* Right Circle Column */}
            <div className="breathing-orb-col" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '220px',
              position: 'relative',
              flexShrink: 0
            }}>
              {/* Pulsing Breathing Circle */}
              <div style={{
                width: '160px',
                height: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {/* Outer pulsing ring */}
                <div 
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '1px solid rgba(212, 175, 55, 0.45)',
                    transition: 'transform 4s cubic-bezier(0.25, 1, 0.5, 1), opacity 4s ease-in-out',
                    transform: breathPhase === 'Hold' ? 'scale(1.35)' : (breathPhase === 'Breathe In' ? 'scale(1.25)' : 'scale(0.85)'),
                    opacity: breathPhase === 'Hold' ? 0.7 : (breathPhase === 'Breathe In' ? 0.45 : 0.15)
                  }}
                />
                
                {/* Inner glowing circle */}
                <div 
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0.02) 75%)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1rem',
                    fontStyle: 'italic',
                    boxShadow: '0 0 30px rgba(212,175,55,0.18)',
                    transition: 'transform 4s cubic-bezier(0.25, 1, 0.5, 1)',
                    transform: breathPhase === 'Breathe Out' ? 'scale(0.85)' : 'scale(1.2)'
                  }}
                >
                  {breathPhase}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THERAPIES LIST (ASYNCHRONOUS EDITORIAL BLOCKS) */}
      <section className="container" style={{ padding: '2rem 2rem 5rem 2rem' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0', gap: '1rem', color: 'var(--color-gold)' }}>
            <Loader2 size={36} className="animate-spin" />
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Gathering Healing Rituals...</span>
          </div>
        ) : (
          <div className="therapy-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {therapies.map((item, idx) => {
              const meta = getMeta(item.name);
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={item.id}
                  className="responsive-layout-grid"
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    border: '1px solid rgba(212,175,55,0.12)',
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                    alignItems: 'stretch',
                    gap: 0
                  }}
                >
                  {/* Photo Section (left/right alternates on desktop) */}
                  <div 
                    className="therapy-card-image"
                    style={{ order: isEven ? 0 : 1 }}
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px',
                      background: 'rgba(255,255,255,0.95)',
                      padding: '0.5rem 1rem',
                      border: '1px solid var(--color-gold)',
                      borderRadius: '4px'
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-gold-dark)' }}>{meta.tag}</span>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="therapy-card-details">
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.6rem' }}>
                        <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)' }}>{item.name}</h3>
                        <span style={{ fontSize: '1.35rem', color: 'var(--color-gold-dark)', fontWeight: '600', fontFamily: 'var(--font-serif)' }}>
                          LKR {item.price.toLocaleString()}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '1.2rem', letterSpacing: '0.05em', fontWeight: '500' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Clock size={12} />
                          {meta.duration}
                        </span>
                        <span>•</span>
                        <span>Focus: {meta.focus}</span>
                      </div>

                      <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginBottom: '1.8rem', lineHeight: '1.65' }}>
                        {item.description}
                      </p>

                      <h4 style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-gold)', letterSpacing: '0.1em', marginBottom: '0.6rem', fontWeight: '600' }}>Therapy Elements</h4>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', paddingLeft: 0, marginBottom: '2rem' }}>
                        {item.amenities.split(',').map((feat, i) => (
                          <li key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                            <Check size={12} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                            <span>{feat.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      className="btn-gold-solid" 
                      style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}
                      onClick={() => onOpenBooking('SPA', item.name)}
                    >
                      <span>Book Appointment</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. SPA PREPARATION NOTES */}
      <section style={{ backgroundColor: '#1c1b18', color: '#fff', padding: '5rem 2rem' }}>
        <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <Sparkles size={28} style={{ color: 'var(--color-gold)', marginBottom: '1rem', display: 'inline-block' }} />
          <h2 style={{ fontSize: '2.2rem', color: '#fff', fontFamily: 'var(--font-serif)', marginBottom: '1.2rem' }}>
            Preparing for <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Your Spa Journey</span>
          </h2>
          <div className="responsive-layout-grid" style={{ marginTop: '3rem', textAlign: 'left' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>Arrive Early</span>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: '1.6' }}>We recommend arriving 15 minutes before your treatment time. Enjoy a freshly brewed hibiscus oil infusion and complete a wellness questionnaire to tailor your massage oils.</p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>Sanctuary Wear</span>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: '1.6' }}>We supply plush luxury cotton robes, towels, and slippers. Lockers are available for personal items; however, we suggest leaving jewelry in your in-room safe.</p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>Aroma customizer</span>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: '1.6' }}>Each guest selects their preferred essential oil blend—cooling lemongrass, spiced mountain cinnamon, or floral lotus. Inform your therapist of any physical pressure preferences.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
