import React, { useState, useEffect } from 'react';
import { Check, ChevronRight, Loader2, Sparkles } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const dayoutMetadata = {
  "Hanthana Escape Dayout": { audience: "Per Person (Min 2 Pax)", type: "DAYOUT" },
  "Golden Wellness Dayout": { audience: "Per Person", type: "DAYOUT" },
  "Royal Heritage Dayout": { audience: "Per Person (Min 4 Pax)", type: "DAYOUT" }
};

export default function DayoutPage({ onOpenBooking }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDayouts() {
      try {
        const response = await fetch(`${API_BASE}/rooms`);
        if (!response.ok) throw new Error("Failed fetch");
        const data = await response.json();
        const filtered = data.filter(r => r.type === 'DAYOUT');
        setItems(filtered);
      } catch (err) {
        console.warn("Backend API offline. Loading fallback dayout options...");
        const fallbackImages = [
          "/images/dining_escape.jpg",
          "/images/dining_wellness.jpg",
          "/images/dining_heritage.jpg"
        ];
        const fallbackItems = Object.keys(dayoutMetadata).map((name, index) => ({
          id: `fallback-do${index + 1}`,
          name,
          type: "DAYOUT",
          price: name.includes("Escape") ? 6500 : (name.includes("Wellness") ? 12500 : 9500),
          capacity: name.includes("Heritage") ? 4 : (name.includes("Escape") ? 2 : 1),
          description: name.includes("Escape")
            ? "Our classic dayout package designed to offer a peaceful mountain escape with gourmet buffet dining and access to our scenic viewpoints."
            : (name.includes("Wellness")
                ? "An elevated package that combines healthy 3-course organic lunches with private herbal steam baths and wellness review consultations."
                : "Includes a guided mountain peak trek, tour of a historic tea factory, customized high tea experience, and panoramic forest deck access."),
          amenities: name.includes("Escape")
            ? "Welcome Fruit Elixir, Organic Lunch Buffet, Scenic View Deck Access, Ceylon High Tea Platter"
            : (name.includes("Wellness")
                ? "Welcome Detox Shot, Curated 3-Course Organic Lunch, 30-min Herbal Steam Bath, Yoga Lawn access"
                : "Guided Mountain Trek, Tea Factory Tour, Historic High Tea, Buffet Lunch, Viewing Deck Access"),
          imageUrl: fallbackImages[index]
        }));
        setItems(fallbackItems);
      } finally {
        setLoading(false);
      }
    }
    fetchDayouts();
  }, []);

  return (
    <div className="page-transition" style={{ backgroundColor: 'var(--color-bg-ivory)', minHeight: '100vh' }}>
      
      {/* HERO BANNER */}
      <section className="page-hero-banner" style={{
        position: 'relative',
        height: '55vh',
        background: 'linear-gradient(rgba(14, 13, 11, 0.45), rgba(14, 13, 11, 0.7)), url("/images/dining_escape.jpg")',
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
            Highland Excursions
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#fff', fontFamily: 'var(--font-serif)', margin: '0.5rem 0 1rem 0' }}>
            Mountain Escape <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Day-outs</span>
          </h1>
          <p style={{ maxWidth: '600px', color: 'rgba(255,255,255,0.8)', margin: '0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
            Unwind in nature's lap with premium day passes, scenic forest hikes, and organic lunches perched 780m high.
          </p>
        </div>
      </section>

      {/* LOADING STATE */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6rem 0', gap: '1rem', color: 'var(--color-gold)' }}>
          <Loader2 size={36} className="animate-spin" />
          <span style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Preparing Excursions Selections...</span>
        </div>
      ) : (
        <section className="container responsive-section-padding" style={{ paddingBottom: '6rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)', display: 'block', textAlign: 'center', marginBottom: '0.3rem' }}>EXCURSIONS</span>
          <h2 style={{ fontSize: '2.3rem', fontFamily: 'var(--font-serif)', textAlign: 'center', marginBottom: '3rem' }}>
            Mountain Escape <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Day-out Packages</span>
          </h2>

          <div className="responsive-layout-grid">
            {items.map((pkg) => {
              const meta = dayoutMetadata[pkg.name] || { audience: "Per Person" };
              return (
                <div 
                  key={pkg.id}
                  className="glass-panel"
                  style={{
                    borderRadius: '20px',
                    padding: '2.2rem',
                    border: '1px solid rgba(212,175,55,0.18)',
                    backgroundColor: '#fff',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.01)',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Image header for packages */}
                    <div style={{
                      height: '200px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '1.5rem',
                      border: '1px solid rgba(212, 175, 55, 0.1)'
                    }}>
                      <img 
                        src={pkg.imageUrl} 
                        alt={pkg.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.8rem' }}>
                      <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)' }}>{pkg.name}</h3>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.25rem', color: 'var(--color-gold-dark)', fontWeight: '600', fontFamily: 'var(--font-serif)', display: 'block' }}>
                          LKR {pkg.price.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{meta.audience}</span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '1.5rem', minHeight: '4.5rem' }}>
                      {pkg.description}
                    </p>

                    <h4 style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-gold)', letterSpacing: '0.08em', marginBottom: '0.6rem', fontWeight: '600' }}>Package Inclusions</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', paddingLeft: 0, marginBottom: '2rem' }}>
                      {pkg.amenities.split(',').map((feat, i) => (
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
                    onClick={() => onOpenBooking('DAYOUT', pkg.name)}
                  >
                    <span>Book Day Package</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
