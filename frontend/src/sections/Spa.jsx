import React from 'react';
import { Flower2, Clock, Sparkles } from 'lucide-react';

const therapies = [
  {
    id: "s1",
    name: "Royal Lotus Relaxation Therapy",
    tag: "Signature Ritual",
    duration: "90 Mins",
    price: "LKR 18,000",
    description: "A restorative head-to-toe warm oil massage using native Sri Lankan lotus oil and deep tissue pressure techniques to completely release stored tension.",
    icon: Flower2
  },
  {
    id: "s2",
    name: "Kandy Spiced Herbal Glow",
    tag: "Exfoliation & Mud",
    duration: "75 Mins",
    price: "LKR 15,000",
    description: "An organic body scrub blending mountain cardamom, cinnamon, and volcanic clay. Restores skin luster and improves circulation under misty breezes.",
    icon: Sparkles
  },
  {
    id: "s3",
    name: "Hanthana Herbal Wellness Massage",
    tag: "Warm Compression",
    duration: "60 Mins",
    price: "LKR 10,000",
    description: "A private restorative treatment using warm herbal compresses and organic botanical oils focused on muscle relief and physical relaxation.",
    icon: Clock
  }
];

export default function SpaSanctuary({ onOpenBooking }) {
  // Let's use one of the serene close-up photos for the spa background preview
  const spaImage = "/images/20260418_105523_1.jpg";

  return (
    <section id="spa" style={{ padding: '8rem 0', backgroundColor: '#060e0a', position: 'relative' }}>
      {/* Subtle overlay glow */}
      <div style={{ 
        position: 'absolute', 
        right: '-10%', 
        bottom: '10%', 
        width: '500px', 
        height: '500px', 
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.03) 0%, transparent 70%)',
        zIndex: 1
      }} />

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          {/* Visual Showcase (Serene Image + Golden Frame) */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ 
              position: 'absolute', 
              top: '-15px', 
              left: '-15px', 
              width: '100%', 
              height: '100%', 
              border: '1px solid var(--color-gold)', 
              borderRadius: '8px',
              zIndex: 1
            }} />
            <img 
              src={spaImage} 
              alt="Golden Shanti Spa Sanctuary" 
              style={{ 
                width: '100%', 
                height: '480px', 
                objectFit: 'cover', 
                borderRadius: '8px', 
                position: 'relative', 
                zIndex: 2,
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }} 
            />
            <div className="glass-panel" style={{ 
              position: 'absolute', 
              bottom: '20px', 
              right: '-20px', 
              padding: '1.5rem', 
              zIndex: 3, 
              maxWidth: '220px',
              textAlign: 'left'
            }}>
              <h4 style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Opening Hours</h4>
              <p style={{ color: '#fff', fontSize: '0.9rem', marginTop: '0.2rem' }}>Daily: 8:00 AM - 9:00 PM</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Pre-booking highly recommended.</p>
            </div>
          </div>

          {/* Text Content & Therapy Cards */}
          <div style={{ textAlign: 'left', zIndex: 2 }}>
            <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              The Wellness Sanctuary
            </p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-serif)', fontWeight: '400', marginBottom: '1.5rem' }}>
              Golden Shanti <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Wellness Spa</span>
            </h2>
            <p style={{ marginBottom: '2.5rem', color: 'var(--color-text-muted)' }}>
              Detoxify body and mind. Guided by experienced therapists, our treatments integrate fresh Sri Lankan herbs, holistic oils, and soothing thermal therapies in a serene mountainside cabin environment.
            </p>

            {/* List of Therapies */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {therapies.map((therapy) => {
                const IconComponent = therapy.icon;
                return (
                  <div 
                    key={therapy.id} 
                    className="glass-panel interactive-card"
                    style={{ 
                      padding: '1.5rem', 
                      display: 'flex', 
                      gap: '1.2rem',
                      alignItems: 'flex-start',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div style={{ 
                      background: 'rgba(197, 160, 89, 0.1)', 
                      padding: '0.8rem', 
                      borderRadius: '50%', 
                      color: 'var(--color-gold)', 
                      flexShrink: 0 
                    }}>
                      <IconComponent size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: '600', fontSize: '1rem', color: '#fff' }}>{therapy.name}</h4>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-gold-light)', fontWeight: '500' }}>{therapy.price}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-gold)', margin: '0.2rem 0 0.5rem 0', letterSpacing: '0.05em' }}>
                        <span>{therapy.tag}</span>
                        <span>•</span>
                        <span>{therapy.duration}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', marginBottom: '0.8rem' }}>{therapy.description}</p>
                      <button 
                        className="btn-gold" 
                        style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
                        onClick={() => onOpenBooking('SPA', therapy.name)}
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
