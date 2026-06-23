import React from 'react';
import { GlassWater, Moon, Star, Music } from 'lucide-react';

const signatureCocktails = [
  {
    name: "Hanthana Mist",
    price: "LKR 2,400",
    ingredients: "Native White Rum, Lemongrass Infusion, Wild Honey, Lime Juice, Ginger beer floater",
    description: "Served in a smoking glass to mimic the iconic mist settling over the Hanthana peak."
  },
  {
    name: "Golden Sky Elixir",
    price: "LKR 2,600",
    ingredients: "Local Arrack, Passion Fruit Puree, Saffron Nectar, Cinnamon Bitters",
    description: "A rich gold cocktail reflecting the gorgeous mountain sunset colors."
  },
  {
    name: "Spiced Ceylon Negroni",
    price: "LKR 2,500",
    ingredients: "Spiced Gin, Campari, Sweet Vermouth, Cardamom & Cloves infusion",
    description: "A bold twist on the classic Negroni, aged in clay barrels."
  }
];

export default function RooftopBar({ onOpenBooking }) {
  // Let's use a sunset image for the background
  const rooftopImage = "/images/20260418_072718_1.jpg";

  return (
    <section id="rooftop" style={{ padding: '8rem 0', backgroundColor: '#040705', position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative starry background blur */}
      <div style={{ 
        position: 'absolute', 
        left: '50%', 
        top: '50%', 
        transform: 'translate(-50%, -50%)',
        width: '600px', 
        height: '600px', 
        background: 'radial-gradient(circle, rgba(197, 160, 89, 0.02) 0%, transparent 60%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left: Cocktail Menu */}
          <div style={{ textAlign: 'left', order: { xs: 2, md: 1 } }}>
            <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              The High Altitude Experience
            </p>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-serif)', fontWeight: '400', marginBottom: '1.5rem' }}>
              Aura Rooftop <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Bar & Lounge</span>
            </h2>
            <p style={{ marginBottom: '2.5rem', color: 'var(--color-text-muted)' }}>
              Watch the starlit Kandy valley and the misty hills blend while enjoying luxury mixology, curated wines, and acoustic soundscapes. Aura represents Kandy’s most premium high-altitude bar experience.
            </p>

            {/* Cocktail List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {signatureCocktails.map((drink, i) => (
                <div 
                  key={i} 
                  style={{ 
                    borderBottom: '1px solid rgba(197, 160, 89, 0.15)', 
                    paddingBottom: '1.2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1.5rem'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: '600', fontSize: '1.05rem', color: '#fff' }}>{drink.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-gold-light)', margin: '0.2rem 0 0.5rem 0', fontStyle: 'italic' }}>
                      {drink.ingredients}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{drink.description}</p>
                  </div>
                  <span style={{ fontSize: '1.1rem', color: 'var(--color-gold)', fontWeight: '600', flexShrink: 0 }}>
                    {drink.price}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button 
                className="btn-gold" 
                onClick={() => onOpenBooking('DINING', 'Aura Rooftop Lounge (Table Reservation)')}
              >
                Reserve Lounge Table
              </button>
            </div>
          </div>

          {/* Right: Immersive Image with highlights */}
          <div style={{ position: 'relative', zIndex: 2, order: { xs: 1, md: 2 } }}>
            <div style={{ 
              position: 'absolute', 
              bottom: '-15px', 
              right: '-15px', 
              width: '100%', 
              height: '100%', 
              border: '1px solid var(--color-gold)', 
              borderRadius: '8px',
              zIndex: 1
            }} />
            <img 
              src={rooftopImage} 
              alt="Aura Rooftop Lounge View" 
              style={{ 
                width: '100%', 
                height: '500px', 
                objectFit: 'cover', 
                borderRadius: '8px', 
                position: 'relative', 
                zIndex: 2,
                boxShadow: '0 15px 35px rgba(0,0,0,0.6)'
              }} 
            />

            {/* Highlights cards */}
            <div 
              className="glass-panel" 
              style={{ 
                position: 'absolute', 
                top: '20px', 
                left: '-20px', 
                padding: '1rem 1.5rem', 
                zIndex: 3, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.8rem',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
              }}
            >
              <Moon size={18} style={{ color: 'var(--color-gold)' }} />
              <div style={{ textAlign: 'left' }}>
                <h5 style={{ fontFamily: 'var(--font-sans)', fontWeight: '600', fontSize: '0.85rem' }}>Night Lounge</h5>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>6:00 PM - Midnight</span>
              </div>
            </div>

            <div 
              className="glass-panel" 
              style={{ 
                position: 'absolute', 
                bottom: '40px', 
                left: '-20px', 
                padding: '1rem 1.5rem', 
                zIndex: 3, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.8rem',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
              }}
            >
              <Music size={18} style={{ color: 'var(--color-gold)' }} />
              <div style={{ textAlign: 'left' }}>
                <h5 style={{ fontFamily: 'var(--font-sans)', fontWeight: '600', fontSize: '0.85rem' }}>Acoustic Sessions</h5>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Fridays & Saturdays</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
