import React from 'react';
import { ExternalLink, MessageCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export default function SpaPage({ onOpenBooking, pageContent }) {
  const content = pageContent || {};
  const gatewayTitle = content.spaGatewayTitle || "Shadhara Wellness Sanctuary";
  const gatewayDesc = content.spaGatewayDescription || "To offer a fully immersive journey into authentic Sri Lankan Ayurvedic healing, Shadhara Wellness has transitioned to a dedicated digital platform. We invite you to explore the treatment catalog, consult with therapists, and manage reservations directly on our new website.";
  const extLink = content.spaExternalLink || "https://shadharawellness.com/";
  const waLink = content.spaWhatsappLink || "https://wa.me/94714831035?text=Hello%20Shadhara%20Wellness%2C%20I%20would%20like%20to%20inquire%20about%20a%20wellness%20booking.";

  // Extract italicized part from title if it ends with Sanctuary
  let displayTitle = <span>{gatewayTitle}</span>;
  if (gatewayTitle.toLowerCase().includes("sanctuary")) {
    const parts = gatewayTitle.split(/(sanctuary)/i);
    displayTitle = (
      <span>
        {parts[0]} <span className="text-gold-gradient" style={{ fontStyle: 'italic', fontWeight: '400' }}>{parts[1]}</span>
      </span>
    );
  }

  return (
    <div 
      className="page-transition" 
      style={{ 
        backgroundColor: 'var(--color-bg-ivory)', 
        minHeight: '95vh', 
        padding: '110px 1.5rem 4rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="container" style={{ maxWidth: '750px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* 1. Compact Centered Logo Medallion */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.8rem' }}>
          <div style={{
            width: '210px',
            height: '210px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            border: '2.5px solid var(--color-gold)',
            boxShadow: '0 10px 30px rgba(24, 23, 21, 0.06), 0 0 0 8px rgba(212, 175, 55, 0.01)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'logoBreathe 3s infinite alternate ease-in-out'
          }}>
            <img 
              src={content.spaLogoImage ? (content.spaLogoImage.startsWith('/raw-images/') ? `${API_BASE.replace('/api', '')}${content.spaLogoImage}` : content.spaLogoImage) : "/images/shadhara_logo.jpg"} 
              alt="Shadhara Wellness Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
        </div>
        
        {/* 2. Middled Category Row */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.6rem',
            marginBottom: '0.8rem'
          }}
        >
          <div style={{ width: '25px', height: '1px', backgroundColor: 'var(--color-gold)' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: '650', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold-dark)' }}>
            Wellness & Healing
          </span>
          <div style={{ width: '25px', height: '1px', backgroundColor: 'var(--color-gold)' }} />
        </div>

        {/* 3. Centered Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)', margin: 0, lineHeight: '1.2' }}>
            {displayTitle}
          </h1>
          
          <p style={{ fontSize: '0.94rem', color: 'var(--color-text-muted)', lineHeight: '1.75', margin: '0 auto', maxWidth: '640px' }}>
            {gatewayDesc}
          </p>

          {/* Premium CTA Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '0.8rem' }}>
            <a 
              href={extLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-gold-solid"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                fontSize: '0.82rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '30px',
                boxShadow: '0 8px 22px rgba(212, 175, 55, 0.12)',
                transition: 'all 0.3s ease'
              }}
            >
              <span>Visit Shadhara Website</span>
              <ExternalLink size={14} />
            </a>

            <a 
              href={waLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-gold"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.8rem',
                fontSize: '0.82rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '30px',
                transition: 'all 0.3s ease'
              }}
            >
              <MessageCircle size={14} />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes logoBreathe {
          0% { transform: scale(0.98); box-shadow: 0 8px 25px rgba(24, 23, 21, 0.05), 0 0 0 6px rgba(212, 175, 55, 0.01); }
          100% { transform: scale(1.02); box-shadow: 0 15px 40px rgba(24, 23, 21, 0.1), 0 0 0 12px rgba(212, 175, 55, 0.02); }
        }
        @media (max-width: 600px) {
          .btn-gold-solid, .btn-gold {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}
