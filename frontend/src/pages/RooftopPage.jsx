import React from 'react';
import { GlassWater, Moon, Music, ChevronRight, Flame, Star } from 'lucide-react';

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
    description: "A bold twist on the classic Negroni, aged in local clay barrels."
  }
];

export default function RooftopPage({ onOpenBooking }) {

  return (
    <div className="page-transition" style={{ backgroundColor: '#141311', color: '#fff', minHeight: '100vh', paddingBottom: '6rem' }}>
      
      {/* 1. HERO BANNER */}
      <section className="page-hero-banner" style={{
        position: 'relative',
        height: '60vh',
        background: 'linear-gradient(rgba(20, 19, 17, 0.35), rgba(20, 19, 17, 0.95)), url("/images/20260418_112422_1.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: '5rem',
        textAlign: 'left'
      }}>
        <div className="container" style={{ width: '100%' }}>
          <div style={{ maxWidth: '750px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-gold)', display: 'block', marginBottom: '0.8rem' }}>
              Highland Vistas & Fire-pits
            </span>
            <h1 style={{ fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', color: '#fff', fontFamily: 'var(--font-serif)', margin: '0 0 1.2rem 0', lineHeight: '1.15' }}>
              Rooftop Bar <br />
              <span className="text-gold-gradient" style={{ fontStyle: 'italic', fontWeight: '400' }}>& Lounge</span>
            </h1>
            <p style={{ maxWidth: '580px', color: 'rgba(255,255,255,0.82)', fontSize: '1rem', lineHeight: '1.65', margin: 0 }}>
              Perched at Kandy's highest peak. Feel the mountain wind, watch the twilight shadows settle over the valley, and gather around glowing fireplace hearths.
            </p>
          </div>
        </div>
      </section>

      {/* 2. ATMOSPHERIC INTRO */}
      <section className="container responsive-section-padding" style={{ paddingBottom: '4rem' }}>
        <div className="responsive-layout-grid" style={{ gap: '5rem', alignItems: 'center', textAlign: 'left' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-gold)', marginBottom: '0.8rem' }}>
              <Moon size={16} />
              <span style={{ fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Starlit Evenings</span>
            </div>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-serif)', color: '#fff', marginBottom: '1.5rem', lineHeight: '1.2' }}>
              Where the Skyline <br />
              <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Meets the Horizon</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: '1.75', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Our rooftop bar represents a dramatic alpine lounge setting, combining outdoor copper fireplaces with an innovative craft beverage menu. Our mixologists blend local double-distilled coconut arracks with hand-pressed wild passion fruit, saffron syrup, and cardamom bitters aged in clay pots.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', borderTop: '1px solid rgba(212,175,55,0.15)', paddingTop: '1.8rem' }}>
              <Music size={22} style={{ color: 'var(--color-gold)' }} />
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff', display: 'block' }}>Acoustic Sessions</span>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Friday & Saturday: 7:00 PM onwards</span>
              </div>
            </div>
          </div>

          <div style={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(212,175,55,0.22)',
            height: '420px',
            position: 'relative',
            boxShadow: '0 20px 45px rgba(0,0,0,0.4)'
          }}>
            <img 
              src="/images/20260418_112530_1.jpg" 
              alt="Rooftop Bar & Lounge at Golden Sky Hotel & Wellness" 
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      </section>

      {/* 3. SIGNATURE COCKTAILS (EDITORIAL PHYSICAL MENU STYLE) */}
      <section className="container responsive-section-padding" style={{ paddingBottom: '5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-gold)', display: 'block', marginBottom: '0.8rem' }}>THE DRINKS LIST</span>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: '#fff', margin: 0 }}>
            Highland <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Craft Mixology</span>
          </h2>
          <div style={{ width: '35px', height: '1px', backgroundColor: 'var(--color-gold)', margin: '1.5rem auto 0 auto' }} />
        </div>

        <div style={{
          maxWidth: '750px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.8rem'
        }}>
          {signatureCocktails.map((drink, i) => (
            <div 
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                paddingBottom: '2.2rem'
              }}
            >
              <div className="menu-item-header">
                <span className="menu-item-name" style={{ fontSize: '1.3rem', color: '#fff', fontFamily: 'var(--font-serif)', fontWeight: '400' }}>
                  {drink.name}
                </span>
                <span className="menu-item-price" style={{ fontSize: '1.05rem', color: 'var(--color-gold)' }}>
                  {drink.price}
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-gold-light)', fontStyle: 'italic', letterSpacing: '0.04em' }}>
                {drink.ingredients}
              </span>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.68)', lineHeight: '1.55', margin: 0, fontWeight: '300' }}>
                {drink.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PREMIUM FIRE-PIT DINING PACKAGE DISPLAY */}
      <section className="container responsive-section-padding" style={{ paddingBottom: '5rem' }}>
        <div 
          className="responsive-layout-grid"
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, #1c1b18 0%, #0d0c0b 100%)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            gap: 0
          }}
        >
          {/* Left Column - Image */}
          <div style={{ height: '100%', minHeight: '340px', position: 'relative' }}>
            <img 
              src="/images/20260418_112608_1.jpg" 
              alt="Cozy mountainside fire-pit dinner" 
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {/* Absolute badge */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'var(--color-gold)',
              color: '#fff',
              padding: '0.4rem 1.2rem',
              borderRadius: '40px',
              fontSize: '0.65rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.12em'
            }}>
              Signature Experience
            </div>
          </div>

          {/* Right Column - Text & Booking */}
          <div 
            className="responsive-block-padding"
            style={{
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1.4rem'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-gold)', display: 'block', marginBottom: '0.5rem' }}>
                Exclusive Offering
              </span>
              <h2 style={{ fontSize: '2.1rem', fontFamily: 'var(--font-serif)', color: '#fff', margin: 0, lineHeight: '1.2' }}>
                Rooftop <br />
                <span className="text-gold-gradient" style={{ fontStyle: 'italic', fontWeight: '400' }}>Fire-pit Dining</span>
              </h2>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.88rem', lineHeight: '1.65', margin: 0, fontWeight: '300' }}>
              Book our private fireside copper table for up to 4 guests. Includes custom mixology pairings, a dedicated chef grilling mountainside skewers, and starlit sky views of the entire Kandy valley.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.5rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: '1.5rem',
              marginTop: '0.5rem'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Reservations starting from</span>
              <span style={{ fontSize: '1.8rem', color: '#fff', fontFamily: 'var(--font-serif)', fontWeight: '600' }}>LKR 15,000</span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>/ table</span>
            </div>

            <button 
              className="btn-gold-solid" 
              style={{
                minWidth: '220px',
                alignSelf: 'flex-start',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onClick={() => onOpenBooking('DINING', 'Rooftop Fire-pit Dining')}
            >
              <span>Reserve Fire-pit Table</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
