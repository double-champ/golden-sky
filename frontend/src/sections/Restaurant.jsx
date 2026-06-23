import React, { useState } from 'react';
import { Utensils, Calendar, ShieldCheck, Waves, Coffee, Compass } from 'lucide-react';

const dayoutPackages = [
  {
    id: "do1",
    name: "Hanthana Escape Dayout",
    price: "LKR 6,500",
    audience: "Per Person (Min 2 Pax)",
    description: "Our classic dayout package designed to offer a peaceful mountain escape with gourmet dining.",
    inclusions: [
      "Welcome fresh fruit elixir on arrival",
      "Sumptuous organic lunch buffet at The Canopy",
      "Access to the panoramic main infinity pool (2 Hours)",
      "Complimentary Ceylon high-tea platter in the evening",
      "Free Wi-Fi and relaxation cabin access"
    ]
  },
  {
    id: "do2",
    name: "Golden Wellness Dayout",
    price: "LKR 12,500",
    audience: "Per Person",
    description: "An elevated package that combines dining and access to our luxury spa facilities.",
    inclusions: [
      "Welcome detox shot & custom wellness review",
      "curated 3-course organic spa-lunch",
      "30-minute herbal steam bath & sauna access",
      "Access to infinity pool & yoga meditation lawns",
      "15% Discount on all full-length spa therapies",
      "Evening herbal infusion tea with local treats"
    ]
  }
];

const dinnerOptions = [
  {
    id: "dn1",
    name: "Hanthana Sunset High Tea",
    price: "LKR 4,000",
    audience: "Per Tier (Serves 2)",
    description: "A gorgeous collection of local and international pastries served alongside single-estate organic Hanthana tea.",
    timing: "Daily 3:00 PM - 6:00 PM"
  },
  {
    id: "dn2",
    name: "Curated 5-Course Dinner",
    price: "LKR 9,500",
    audience: "Per Person",
    description: "A fine-dining gastronomic tour showcasing Kandyan heritage spices, fresh mountain greens, and organic meats.",
    timing: "Daily 7:00 PM - 10:30 PM"
  }
];

export default function Restaurant({ onOpenBooking }) {
  const [activeTab, setActiveTab] = useState('dayout'); // 'dayout' or 'dining'
  const restaurantImage = "/images/20260418_095058_1.jpg";

  return (
    <section id="restaurant" style={{ padding: '8rem 0', backgroundColor: 'var(--color-bg-obsidian)', position: 'relative' }}>
      {/* Visual background element */}
      <div style={{ 
        position: 'absolute', 
        left: 0, 
        bottom: 0, 
        width: '100%', 
        height: '100%', 
        backgroundImage: `linear-gradient(to right, #050806 30%, transparent 100%), url(${restaurantImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'right center',
        opacity: 0.12,
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'flex-start' }}>
          
          {/* Left: Text & Tabs */}
          <div style={{ textAlign: 'left' }}>
            <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              Culinary & Leisure
            </p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-serif)', fontWeight: '400', marginBottom: '1.5rem' }}>
              The Canopy <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Dine & Day-outs</span>
            </h2>
            <p style={{ marginBottom: '2.5rem', color: 'var(--color-text-muted)' }}>
              Whether you are an overnight resident or visiting for the afternoon, The Canopy Restaurant serves organic, farm-to-table cuisine prepared with fresh harvest from the Hanthana hills.
            </p>

            {/* Tab Toggles */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button 
                className={activeTab === 'dayout' ? 'btn-gold-solid' : 'btn-gold'}
                style={{ flex: 1, padding: '0.6rem' }}
                onClick={() => setActiveTab('dayout')}
              >
                Dayout Packages
              </button>
              <button 
                className={activeTab === 'dining' ? 'btn-gold-solid' : 'btn-gold'}
                style={{ flex: 1, padding: '0.6rem' }}
                onClick={() => setActiveTab('dining')}
              >
                Restaurant Dine-In
              </button>
            </div>

            {/* General Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--color-text-muted)' }}>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <Waves size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem' }}>Infinity pool entry included in Dayout Packages.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <Coffee size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem' }}>Fresh organic coffee and tea grown on local estate estates.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <ShieldCheck size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem' }}>Advanced reservations required at least 24 hours prior.</span>
              </div>
            </div>
          </div>

          {/* Right: Tab Contents */}
          <div style={{ textAlign: 'left' }}>
            {activeTab === 'dayout' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {dayoutPackages.map((pkg) => (
                  <div 
                    key={pkg.id} 
                    className="glass-panel" 
                    style={{ padding: '2rem', borderLeft: '4px solid var(--color-gold)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: '700', fontSize: '1.2rem', color: '#fff' }}>{pkg.name}</h3>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.3rem', color: 'var(--color-gold-light)', fontWeight: '600', display: 'block' }}>{pkg.price}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{pkg.audience}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1.2rem' }}>{pkg.description}</p>
                    
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-gold)', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>Package Inclusions:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                      {pkg.inclusions.map((inc, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ color: 'var(--color-gold)', fontSize: '1.1rem' }}>✓</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>

                    <button 
                      className="btn-gold-solid" 
                      style={{ width: '100%' }}
                      onClick={() => onOpenBooking('DAYOUT', pkg.name)}
                    >
                      Book Dayout
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {dinnerOptions.map((opt) => (
                  <div 
                    key={opt.id} 
                    className="glass-panel" 
                    style={{ padding: '2rem' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: '700', fontSize: '1.2rem', color: '#fff' }}>{opt.name}</h3>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.2rem', color: 'var(--color-gold-light)', fontWeight: '600', display: 'block' }}>{opt.price}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{opt.audience}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1.2rem' }}>{opt.description}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: '500' }}>{opt.timing}</span>
                      <button 
                        className="btn-gold" 
                        style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}
                        onClick={() => onOpenBooking('DINING', opt.name)}
                      >
                        Reserve Table
                      </button>
                    </div>
                  </div>
                ))}

                {/* Additional Restaurant Card */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Utensils size={24} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: '600', fontSize: '0.9rem', color: '#fff' }}>Private Romantic Dining</h4>
                    <p style={{ fontSize: '0.8rem' }}>Reserve a private glass pagoda overlooking the cliffside. Contact guest relations for custom setups.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
