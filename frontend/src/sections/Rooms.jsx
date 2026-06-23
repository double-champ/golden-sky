import React from 'react';
import { Maximize2, Users, BedDouble, ChevronRight } from 'lucide-react';

const suites = [
  {
    id: "r1",
    name: "Hanthana Misty Suite",
    tag: "Mountain Retreat",
    description: "A quiet mountain retreat with views of the Hanthana range. Features a private jacuzzi, organic Ceylon tea bar, and a scenic mountainside balcony.",
    price: "LKR 45,000",
    size: "65 m²",
    capacity: "2 Adults",
    bed: "King Bed",
    image: "/images/20260418_064528_1.jpg"
  },
  {
    id: "r2",
    name: "Golden Sky Canopy Villa",
    tag: "Signature Villa",
    description: "A private standalone villa with glass walls overlooking the sunset. Features a private butler and an outdoor infinity deck.",
    price: "LKR 75,000",
    size: "95 m²",
    capacity: "3 Guests",
    bed: "King & Daybed",
    image: "/images/20260418_072549_1.jpg"
  },
  {
    id: "r3",
    name: "Serenity Sanctuary Suite",
    tag: "Wellness Special",
    description: "A dedicated wellness suite for rejuvenation. Features custom aromatherapy, a private soaking tub, and spaces for yoga and stretching.",
    price: "LKR 55,000",
    size: "72 m²",
    capacity: "2 Adults",
    bed: "King Bed",
    image: "/images/20260418_102057_1.jpg"
  }
];

export default function Rooms({ onOpenBooking }) {
  return (
    <section id="rooms" style={{ padding: '8rem 0', backgroundColor: 'var(--color-bg-obsidian)', position: 'relative' }}>
      {/* Decorative side element */}
      <div style={{ 
        position: 'absolute', 
        left: 0, 
        top: '20%', 
        width: '150px', 
        height: '1px', 
        background: 'linear-gradient(90deg, var(--color-gold), transparent)' 
      }} />

      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            Curated Accommodations
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-serif)', fontWeight: '400' }}>
            Luxury Suites & <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Sanctuary Villas</span>
          </h2>
          <p style={{ maxWidth: '600px', margin: '1rem auto 0 auto', color: 'var(--color-text-muted)' }}>
            Each space is designed to blend seamlessly with Kandy's misty atmosphere, utilizing natural materials, large windows, and state-of-the-art luxury amenities.
          </p>
        </div>

        <div className="showcase-grid">
          {suites.map((suite) => (
            <div key={suite.id} className="luxury-card interactive-card">
              <img src={suite.image} alt={suite.name} className="luxury-card-img" loading="lazy" decoding="async" />
              <div className="luxury-card-overlay">
                <div className="luxury-card-content">
                  <div className="luxury-card-tags">
                    <span className="luxury-card-tag">{suite.tag}</span>
                  </div>
                  <h3 className="luxury-card-title">{suite.name}</h3>
                  
                  <p className="luxury-card-description" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                    {suite.description}
                  </p>

                  <div style={{ display: 'flex', gap: '1.2rem', margin: '1rem 0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Maximize2 size={14} style={{ color: 'var(--color-gold)' }} />
                      <span>{suite.size}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Users size={14} style={{ color: 'var(--color-gold)' }} />
                      <span>{suite.capacity}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <BedDouble size={14} style={{ color: 'var(--color-gold)' }} />
                      <span>{suite.bed}</span>
                    </div>
                  </div>

                  <div className="luxury-card-footer">
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase' }}>Per Night</span>
                      <span className="luxury-card-price">{suite.price}</span>
                    </div>
                    <button 
                      className="btn-gold" 
                      style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
                      onClick={() => onOpenBooking('STAY', suite.name)}
                    >
                      <span>Reserve</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
