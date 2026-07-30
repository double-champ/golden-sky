import React, { useState, useEffect } from 'react';
import { Utensils, Check, ChevronRight, Coffee, Waves, Loader2, Sparkles } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const diningMetadata = {
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
        // Filter for DINING items
        const filtered = data.filter(r => r.type === 'DINING');
        setItems(filtered);
      } catch (err) {
        console.warn("Backend API offline. Loading fallback dining options...");
        const fallbackImages = [
          "/images/dining_dinner.jpg",
          "/images/dining_hightea.jpg",
          "/images/dining_rooftop.jpg"
        ];
        const fallbackItems = Object.keys(diningMetadata).map((name, index) => ({
          id: `fallback-d${index + 1}`,
          name,
          type: "DINING",
          price: name.includes("Dinner") ? 9500 : (name.includes("High Tea") ? 4500 : 15000),
          capacity: 1,
          description: name.includes("Dinner")
            ? "A fine-dining gastronomic tour showcasing Kandyan heritage spices, fresh mountain greens, and organic mountain harvests."
            : (name.includes("High Tea")
                ? "A gorgeous collection of local and international pastries served alongside single-estate organic Hanthana tea."
                : "Private starlit dining around copper fire-pits, including custom mixology drink pairings and a dedicated chef."),
          amenities: name.includes("Dinner")
            ? "Organic cardamom, Cinnamon infusions, Sunset views, Cardamon tea bar"
            : (name.includes("High Tea")
                ? "Single-estate Tea, Custom Scones, Fresh Jam, Clotted Cream"
                : "Private Chef, Fire-pit Table, Customized Drinks, Skyline Views"),
          imageUrl: fallbackImages[index]
        }));
        setItems(fallbackItems);
      } finally {
        setLoading(false);
      }
    }
    fetchDining();
  }, []);

  const diningOptions = items;

  return (
    <div className="page-transition" style={{ backgroundColor: 'var(--color-bg-ivory)', minHeight: '100vh' }}>
      
      {/* 1. HERO BANNER */}
      <section className="page-hero-banner" style={{
        position: 'relative',
        height: '55vh',
        background: 'linear-gradient(rgba(14, 13, 11, 0.45), rgba(14, 13, 11, 0.7)), url("/images/20260418_095058_1.jpg")',
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
            The Canopy <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Dine-in</span>
          </h1>
          <p style={{ maxWidth: '600px', color: 'rgba(255,255,255,0.8)', margin: '0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
            Indulge in organic harvests from Kandy's mountain ranges paired with scenic forest backdrops and premium dining selections.
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
          {/* PREMIUM DINING OPTIONS */}
          <section className="container responsive-section-padding" style={{ paddingBottom: '6rem', paddingTop: '5rem' }}>
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

              <span style={{ fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)', display: 'block', textAlign: 'center', marginBottom: '0.5rem', marginTop: '0.8rem' }}>DINING MENU</span>
              <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', textAlign: 'center', marginBottom: '3rem' }}>
                Sunset Dine-in <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Selections</span>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {diningOptions.map((item) => {
                  const meta = diningMetadata[item.name] || { timing: "Daily" };
                  return (
                    <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                      {/* Classic menu dot-leader display */}
                      <div className="menu-item-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span className="menu-item-name" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: '500' }}>
                          {item.name}
                        </span>
                        <div className="menu-item-dots" style={{ flexGrow: 1, borderBottom: '1px dotted rgba(0,0,0,0.2)', margin: '0 1rem' }} />
                        <div style={{ textAlign: 'right' }}>
                          <span className="menu-item-price" style={{ fontSize: '1.25rem', color: 'var(--color-gold-dark)', fontWeight: '600', fontFamily: 'var(--font-serif)', display: 'block' }}>
                            LKR {item.price.toLocaleString()}
                          </span>
                          <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginTop: '0.2rem' }}>
                            Per Person
                          </span>
                        </div>
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
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.4' }}>Prior booking is highly recommended for dining tables, especially for Aura Fire-pit seating. Bookings are held for up to <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>15 minutes</strong>.</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.3rem', fontWeight: '600' }}>Operational Hours</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.4' }}>Lunch service runs from <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>12:00 PM to 3:00 PM</strong>. Sunset and dinner service operates from <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>7:00 PM until 10:30 PM daily</strong>.</p>
                </div>
              </div>

            </div>
          </section>
        </>
      )}

    </div>
  );
}
