import React, { useState, useEffect } from 'react';
import { Utensils, Check, ChevronRight, Coffee, Waves, Loader2, Sparkles } from 'lucide-react';

const API_BASE = "http://localhost:5000/api";

const diningMetadata = {
  "Hanthana Escape Dayout": { audience: "Per Person (Min 2 Pax)", type: "DAYOUT" },
  "Golden Wellness Dayout": { audience: "Per Person", type: "DAYOUT" },
  "Royal Heritage Dayout": { audience: "Per Person (Min 4 Pax)", type: "DAYOUT" },
  "Curated 5-Course Dinner": { timing: "Daily 7:00 PM - 10:30 PM", type: "DINING" },
  "Hanthana Sunset High Tea": { timing: "Daily 3:00 PM - 6:00 PM", type: "DINING" },
  "Aura Rooftop Fire-pit Dining": { timing: "Fri & Sat 7:00 PM - 11:00 PM", type: "DINING" }
};

export default function DiningPage({ onOpenBooking }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDining() {
      try {
        const response = await fetch(`${API_BASE}/rooms`);
        if (!response.ok) throw new Error("Failed fetch");
        const data = await response.json();
        // Filter for DAYOUT and DINING items
        const filtered = data.filter(r => r.type === 'DAYOUT' || r.type === 'DINING');
        setItems(filtered);
      } catch (err) {
        console.warn("Backend API offline. Loading fallback dayout and dining options...");
        // Fallback mock items list representing the seeded packages
        const fallbackItems = Object.keys(diningMetadata).map((name, index) => ({
          id: `fallback-d${index + 1}`,
          name,
          type: diningMetadata[name].type,
          price: name.includes("Escape") ? 6500 : (name.includes("Wellness") ? 12500 : (name.includes("Heritage") ? 9500 : (name.includes("Dinner") ? 9500 : (name.includes("High Tea") ? 4000 : 15000)))),
          capacity: name.includes("Heritage") ? 4 : (name.includes("Escape") ? 2 : 1),
          description: name.includes("Escape")
            ? "Our classic dayout package designed to offer a peaceful mountain escape with gourmet buffet dining and access to our sky pool."
            : (name.includes("Wellness")
                ? "An elevated package that combines healthy 3-course organic lunches with private herbal steam baths and wellness review consultations."
                : (name.includes("Heritage")
                    ? "Includes a guided mountain peak trek, tour of a historic tea factory, customized high tea experience, and panoramic pool access."
                    : (name.includes("Dinner")
                        ? "A fine-dining gastronomic tour showcasing Kandyan heritage spices, fresh mountain greens, and organic mountain harvests."
                        : (name.includes("High Tea")
                            ? "A gorgeous collection of local and international pastries served alongside single-estate organic Hanthana tea."
                            : "Private starlit dining around copper fire-pits, including custom mixology drink pairings and a dedicated chef.")))),
          amenities: name.includes("Escape")
            ? "Welcome Fruit Elixir, Organic Lunch Buffet, Panoramic Pool Access (2 hrs), Ceylon High Tea Platter"
            : (name.includes("Wellness")
                ? "Welcome Detox Shot, Curated 3-Course Organic Lunch, 30-min Herbal Steam Bath, Yoga Lawn access"
                : (name.includes("Heritage")
                    ? "Guided Mountain Trek, Tea Factory Tour, Historic High Tea, Buffet Lunch, Pool Access"
                    : "Organic cardamon, Cinnamon infusions, Sunset views, Cardamon tea bar")),
          imageUrl: `/images/20260418_09${50 + index}_1.jpg`
        }));
        setItems(fallbackItems);
      } finally {
        setLoading(false);
      }
    }
    fetchDining();
  }, []);

  const dayoutPackages = items.filter(i => i.type === 'DAYOUT');
  const diningOptions = items.filter(i => i.type === 'DINING');

  return (
    <div className="page-transition" style={{ backgroundColor: 'var(--color-bg-ivory)', minHeight: '100vh' }}>
      
      {/* 1. HERO BANNER */}
      <section className="page-hero-banner" style={{
        position: 'relative',
        height: '55vh',
        background: 'linear-gradient(rgba(24, 23, 21, 0.45), rgba(24, 23, 21, 0.7)), url("/images/20260418_095058_1.jpg")',
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
            Highland Gastronomy
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#fff', fontFamily: 'var(--font-serif)', margin: '0.5rem 0 1rem 0' }}>
            The Canopy <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Dine & Day-outs</span>
          </h1>
          <p style={{ maxWidth: '600px', color: 'rgba(255,255,255,0.8)', margin: '0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
            Indulge in organic harvests from Kandy's mountain ranges paired with scenic forest backdrops and premium day packages.
          </p>
        </div>
      </section>

      {/* LOADING STATE */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6rem 0', gap: '1rem', color: 'var(--color-gold)' }}>
          <Loader2 size={36} className="animate-spin" />
          <span style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Preparing Gastronomy Selections...</span>
        </div>
      ) : (
        <>
          {/* 2. DAY OUTING PACKAGES (GRID LAYOUT) */}
          <section className="container responsive-section-padding" style={{ paddingBottom: '2rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)', display: 'block', textAlign: 'center', marginBottom: '0.3rem' }}>01 / EXCURSIONS</span>
            <h2 style={{ fontSize: '2.3rem', fontFamily: 'var(--font-serif)', textAlign: 'center', marginBottom: '3rem' }}>
              Mountain Escape <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Day-out Packages</span>
            </h2>

            <div className="responsive-layout-grid">
              {dayoutPackages.map((pkg) => {
                const meta = diningMetadata[pkg.name] || { audience: "Per Person" };
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.8rem' }}>
                        <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)' }}>{pkg.name}</h3>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.25rem', color: 'var(--color-gold-dark)', fontWeight: '600', fontFamily: 'var(--font-serif)', display: 'block' }}>
                            LKR {pkg.price.toLocaleString()}
                          </span>
                          <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{meta.audience}</span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
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

          {/* 3. PREMIUM DINING OPTIONS (luxurious menu format with dot leaders) */}
          <section className="container responsive-section-padding" style={{ paddingBottom: '6rem' }}>
            <div 
              className="responsive-block-padding"
              style={{
                maxWidth: '900px',
                margin: '0 auto',
                backgroundColor: '#fff',
                border: '1px solid rgba(212,175,55,0.18)',
                borderRadius: '24px',
                boxShadow: '0 15px 50px rgba(0,0,0,0.03)',
                position: 'relative'
              }}
            >
              
              {/* Subtle gold design flourish */}
              <div style={{ position: 'absolute', top: '25px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', color: 'var(--color-gold)' }}>
                <Sparkles size={16} />
                <Sparkles size={16} />
              </div>

              <span style={{ fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)', display: 'block', textAlign: 'center', marginBottom: '0.5rem', marginTop: '0.8rem' }}>02 / DINING MENU</span>
              <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', textAlign: 'center', marginBottom: '3rem' }}>
                Sunset Dine-in <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Selections</span>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {diningOptions.map((item) => {
                  const meta = diningMetadata[item.name] || { timing: "Daily" };
                  return (
                    <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                      {/* Classic menu dot-leader display */}
                      <div className="menu-item-header">
                        <span className="menu-item-name" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: '500' }}>
                          {item.name}
                        </span>
                        <div className="menu-item-dots" />
                        <span className="menu-item-price" style={{ fontSize: '1.2rem' }}>
                          LKR {item.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Timings / operational info */}
                      <span style={{ fontSize: '0.68rem', color: 'var(--color-gold-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                        {meta.timing}
                      </span>

                      {/* Description */}
                      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0.1rem 0 0.8rem 0', lineHeight: '1.5' }}>
                        {item.description}
                      </p>

                      <button 
                        className="btn-gold" 
                        style={{ padding: '0.4rem 1rem', fontSize: '0.68rem', width: 'fit-content' }} 
                        onClick={() => onOpenBooking('DINING', item.name)}
                      >
                        Reserve Table for {item.name.replace('Hanthana ', '')}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Fine Hours info panel */}
              <div style={{
                marginTop: '4rem',
                paddingTop: '2.5rem',
                borderTop: '1px solid rgba(212,175,55,0.12)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                textAlign: 'left'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Reservations Policy</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.4' }}>Prior booking is highly recommended for dining tables, especially for Aura Fire-pit seating. Bookings are held for up to 15 minutes.</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Operational Hours</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.4' }}>Lunch service runs from 12:00 PM to 3:00 PM. Sunset and dinner service operates from 7:00 PM until 10:30 PM daily.</p>
                </div>
              </div>

            </div>
          </section>
        </>
      )}

    </div>
  );
}
