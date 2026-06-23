import React, { useState, useEffect } from 'react';
import { Maximize2, Users, BedDouble, Check, X, Calendar, ArrowRight, Loader2, Sparkles } from 'lucide-react';

const API_BASE = "http://localhost:5000/api";

const roomMetadata = {
  "Hanthana Misty Suite": { size: "65 m²", bed: "King Bed", category: "Double rooms" },
  "Golden Sky Canopy Villa": { size: "95 m²", bed: "King & Daybed", category: "Triple rooms" },
  "Serenity Sanctuary Suite": { size: "72 m²", bed: "King Bed", category: "Double rooms" },
  "Cloud Nine Penthouse": { size: "120 m²", bed: "King & Queen Bed", category: "Suite" },
  "Pine Forest Pavilion": { size: "65 m²", bed: "King Bed", category: "Double rooms" },
  "Sacred Lotus Water Villa": { size: "85 m²", bed: "King Bed", category: "Double rooms" },
  "Sunrise Horizon Suite": { size: "60 m²", bed: "King Bed", category: "Double rooms" },
  "Majestic Peaks Residence": { size: "150 m²", bed: "2 King Beds", category: "Triple rooms" },
  "Cardamom Hill Chalet": { size: "78 m²", bed: "King & Daybed", category: "Triple rooms" },
  "Whispering Bamboo Loft": { size: "55 m²", bed: "Twin Bed", category: "Single rooms" },
  "Hanthana Forest Studio": { size: "70 m²", bed: "Queen Bed", category: "Double rooms" },
  "Kandy Kings Suite": { size: "88 m²", bed: "King Bed", category: "Triple rooms" }
};

export default function SuitesPage({ onOpenBooking }) {
  const [rooms, setRooms] = useState([]);
  const [animating, setAnimating] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Chambers");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Advanced refinement filters states
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [amenityFilter, setAmenityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);



  useEffect(() => {
    setActiveSlideIndex(0);
  }, [selectedCategory, priceFilter, capacityFilter, amenityFilter, sortBy]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await fetch(`${API_BASE}/rooms`);
        if (!response.ok) throw new Error("Failed to fetch rooms list.");
        const data = await response.json();
        // Filter to show only STAY type rooms
        const stayRooms = data.filter(r => r.type === 'STAY');
        setRooms(stayRooms);
      } catch (err) {
        console.warn("Backend API unreachable. Loading offline rooms fallback...");
        // Fallback mock stayed rooms list representing the 12 seeded rooms
        const fallbackImages = [
          "/images/20260418_064528_1.jpg", // Misty Suite
          "/images/20260418_072549_1.jpg", // Canopy Villa
          "/images/20260418_102057_1.jpg", // Ayur Sanctuary
          "/images/20260418_114222_1.jpg", // Penthouse
          "/images/20260418_063038_1.jpg", // Pine Forest Pavilion
          "/images/20260418_064654_1.jpg", // Water Villa
          "/images/20260418_065800_1.jpg", // Sunrise Horizon
          "/images/20260418_113827_1.jpg", // Peaks Residence
          "/images/20260418_062826_1.jpg", // Cardamom Chalet
          "/images/20260418_065313_1.jpg", // Bamboo Loft
          "/images/20260418_111748_1.jpg", // Zen Studio
          "/images/20260418_063431_2.jpg"  // Kandy Kings
        ];
        
        const fallbackRooms = Object.keys(roomMetadata).map((name, index) => ({
          id: `fallback-r${index + 1}`,
          name,
          type: "STAY",
          price: name.includes("Penthouse") ? 120000 : (name.includes("Residence") ? 150000 : (name.includes("Canopy") ? 75000 : 55000)),
          capacity: name.includes("Residence") ? 6 : (name.includes("Penthouse") ? 4 : 2),
          description: name === "Hanthana Misty Suite" ? "A quiet mountain retreat with views of the Hanthana range. Features a private jacuzzi, organic Ceylon tea bar, and a scenic mountainside balcony." :
                       name === "Golden Sky Canopy Villa" ? "A private standalone villa with glass walls overlooking the sunset. Features a private butler and an outdoor infinity deck." :
                       name === "Serenity Sanctuary Suite" ? "A dedicated wellness suite for rejuvenation. Features custom aromatherapy, a private soaking tub, and spaces for yoga and stretching." :
                       name === "Cloud Nine Penthouse" ? "Our ultra-luxury signature penthouse featuring a private infinity pool, a glass floor, and a dedicated butler team." :
                       name === "Pine Forest Pavilion" ? "A cozy cabin nestled in the pine woods, featuring a stone fireplace, open-sky rain shower, and a private patio." :
                       name === "Sacred Lotus Water Villa" ? "A unique water villa suspended over a spring lotus pond. Features glass floor view panels and private sun decks." :
                       name === "Sunrise Horizon Suite" ? "A beautiful east-facing suite designed to catch the Kandy sunrise. Equipped with telescopes and private viewing decks." :
                       name === "Majestic Peaks Residence" ? "A spacious 2-bedroom mountainside estate with a private heated hot tub, fireplace lounge, and personal butler." :
                       name === "Cardamom Hill Chalet" ? "A quiet chalet surrounded by wild cardamom fields, featuring a wood-fired hot tub and scenic valley views." :
                       name === "Whispering Bamboo Loft" ? "An eco-friendly bamboo loft with cozy hand-woven hammocks, natural breeze cooling, and panoramic forest views." :
                       name === "Hanthana Forest Studio" ? "A peaceful soundproof studio space complete with premium aromatherapy and organic cotton yoga mats." :
                       "A suite decorated in royal Kandyan style, featuring antique clawfoot tubs, private viewing decks, and elite butler service.",
          amenities: "Mountain View, Wi-Fi, Coffee Machine, Organic Bedding, Private Terrace",
          imageUrl: fallbackImages[index]
        }));
        setRooms(fallbackRooms);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);


  // Get localized metadata for a room
  const getMeta = (roomName) => {
    return roomMetadata[roomName] || { size: "70 m²", bed: "King Bed", category: "Suite" };
  };

  // Filter and sort rooms based on selection
  const filteredRooms = rooms
    .filter(room => {
      // 1. Category Filter
      if (selectedCategory !== "All Chambers" && getMeta(room.name).category !== selectedCategory) {
        return false;
      }
      
      // 2. Price Filter
      if (priceFilter === 'under60' && room.price >= 60000) return false;
      if (priceFilter === '60to90' && (room.price < 60000 || room.price > 90000)) return false;
      if (priceFilter === 'over90' && room.price <= 90000) return false;

      // 3. Capacity Filter
      if (capacityFilter === '2' && room.capacity !== 2) return false;
      if (capacityFilter === '3' && room.capacity !== 3) return false;
      if (capacityFilter === '4plus' && room.capacity < 4) return false;

      // 4. Amenity Filter
      if (amenityFilter !== 'all') {
        const amenitiesLower = room.amenities.toLowerCase();
        if (amenityFilter === 'Jacuzzi' && !amenitiesLower.includes('jacuzzi')) return false;
        if (amenityFilter === 'Butler' && !amenitiesLower.includes('butler')) return false;
        if (amenityFilter === 'View' && !amenitiesLower.includes('view')) return false;
        if (amenityFilter === 'Fireplace' && !amenitiesLower.includes('fireplace')) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'sizeDesc') {
        const sizeA = parseInt(getMeta(a.name).size) || 0;
        const sizeB = parseInt(getMeta(b.name).size) || 0;
        return sizeB - sizeA;
      }
      return 0; // Default
    });

  const categories = ["All Chambers", "Single rooms", "Double rooms", "Triple rooms", "Suite"];

  const activeRoom = filteredRooms[activeSlideIndex] || filteredRooms[0] || null;
  const halfCount = Math.ceil(filteredRooms.length / 2);

  return (
    <div 
      className={animating ? "page-transition" : ""} 
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) {
          setAnimating(false);
        }
      }} 
      style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--color-bg-ivory)' }}
    >
      {/* 1. EDITORIAL HERO HEADER */}
      <section className="page-hero-banner" style={{
        position: 'relative',
        height: '55vh',
        background: 'linear-gradient(rgba(24, 23, 21, 0.45), rgba(24, 23, 21, 0.7)), url("/images/20260418_114222_1.jpg")',
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
            Accommodations
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#fff', fontFamily: 'var(--font-serif)', margin: '0.5rem 0 1rem 0' }}>
            Chambers in <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>the Clouds</span>
          </h1>
          <p style={{ maxWidth: '600px', color: 'rgba(255,255,255,0.8)', margin: '0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
            Choose from our 12 beautifully appointed sanctuary suites and standalone canopy villas perched 780 meters above sea level in Hanthana, Kandy.
          </p>
        </div>
      </section>

      {/* 2. FILTER & CATALOG AREA */}
      <section className="container" style={{ padding: '4rem 2rem' }}>
        {/* Luxury Category Selection Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div className="luxury-tabs" style={{ maxWidth: '900px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`luxury-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Refine Search Collapsible Trigger Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <button 
            className="btn-gold" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.5rem 1.8rem', 
              fontSize: '0.72rem',
              borderRadius: '30px'
            }}
            onClick={() => setFiltersVisible(!filtersVisible)}
          >
            <span>{filtersVisible ? 'Hide Specs & Prices filters' : 'Refine Specs & Prices'}</span>
            <span style={{ fontSize: '0.7rem' }}>{filtersVisible ? '▲' : '▼'}</span>
          </button>
        </div>

        {/* Refine Search Collapsible Menu Panel */}
        {filtersVisible && (
          <div className="glass-panel filter-panel-reveal" style={{
            maxWidth: '900px',
            margin: '0 auto 3rem auto',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(212,175,55,0.25)',
            backgroundColor: '#fff',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            {/* Price Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold-dark)', fontWeight: '600' }}>Price limit</label>
              <select
                className="refinement-select"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                style={{
                  backgroundColor: 'var(--color-bg-ivory)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  color: 'var(--color-text-dark)',
                  padding: '0.6rem',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Prices</option>
                <option value="under60">Under LKR 60,000</option>
                <option value="60to90">LKR 60,000 - 90,000</option>
                <option value="over90">Above LKR 90,000</option>
              </select>
            </div>

            {/* Capacity Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold-dark)', fontWeight: '600' }}>Occupancy Limit</label>
              <select
                className="refinement-select"
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
                style={{
                  backgroundColor: 'var(--color-bg-ivory)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  color: 'var(--color-text-dark)',
                  padding: '0.6rem',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Any Capacity</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4plus">4 or more Guests</option>
              </select>
            </div>

            {/* Spec / Amenity Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold-dark)', fontWeight: '600' }}>Key Amenity</label>
              <select
                className="refinement-select"
                value={amenityFilter}
                onChange={(e) => setAmenityFilter(e.target.value)}
                style={{
                  backgroundColor: 'var(--color-bg-ivory)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  color: 'var(--color-text-dark)',
                  padding: '0.6rem',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Any Amenity</option>
                <option value="Jacuzzi">Private Jacuzzi</option>
                <option value="Butler">Private Butler</option>
                <option value="View">Scenic View</option>
                <option value="Fireplace">Fireplace</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold-dark)', fontWeight: '600' }}>Sort Results</label>
              <select
                className="refinement-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  backgroundColor: 'var(--color-bg-ivory)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  color: 'var(--color-text-dark)',
                  padding: '0.6rem',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="default">Default Order</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}

        {/* LOADING SHIMMER STATE */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6rem 0', gap: '1rem', color: 'var(--color-gold)' }}>
            <Loader2 size={36} className="animate-spin" />
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Gathering Sanctuary Chambers...</span>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <Sparkles size={28} style={{ color: 'var(--color-gold)', marginBottom: '1rem', display: 'inline-block' }} />
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)', marginBottom: '0.5rem' }}>
              No Sanctuary Chambers Match Your Criteria
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Try adjusting the limits, choosing another category, or reset all parameters below.
            </p>
            <button 
              className="btn-gold" 
              style={{ padding: '0.5rem 1.5rem', fontSize: '0.72rem', borderRadius: '30px' }}
              onClick={() => {
                setPriceFilter('all');
                setCapacityFilter('all');
                setAmenityFilter('all');
                setSelectedCategory('All Chambers');
                setSortBy('default');
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* LUXURY INTERACTIVE SPLIT SHOWROOM VIEW */
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            
            {/* Mobile/Tablet Room Selector (Hidden on Desktop) */}
            <div className="mobile-room-selector" style={{ display: 'none', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', overflowX: 'auto', gap: '0.5rem', whiteSpace: 'nowrap', paddingBottom: '0.5rem' }}>
                {filteredRooms.map((room, idx) => {
                  const isActive = idx === activeSlideIndex;
                  return (
                    <button
                      key={room.id}
                      onClick={() => setActiveSlideIndex(idx)}
                      style={{
                        background: isActive ? 'rgba(212,175,55,0.08)' : 'transparent',
                        border: 'none',
                        borderBottom: isActive ? '3px solid var(--color-gold)' : '3px solid transparent',
                        padding: '0.8rem 1rem',
                        cursor: 'pointer',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        flexShrink: 0,
                        minWidth: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.1rem',
                        outline: 'none'
                      }}
                      className={isActive ? 'active' : ''}
                    >
                      <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)' }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)', fontWeight: isActive ? '600' : '400' }}>
                        {room.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '260px 1fr 260px', 
              gap: '2rem', 
              alignItems: 'start'
            }} className="showroom-container">
              
              {/* Left Column: Selector Sidebar (First Half of Rooms) */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
                position: 'sticky',
                top: '100px',
                textAlign: 'left'
              }} className="showroom-sidebar desktop-sidebar">
                <span style={{ 
                  fontSize: '0.68rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.15em', 
                  color: 'var(--color-gold-dark)', 
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  borderBottom: '1px solid rgba(212,175,55,0.18)',
                  paddingBottom: '0.5rem'
                }}>
                  Directory A ({halfCount})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {filteredRooms.slice(0, halfCount).map((room, idx) => {
                    const isActive = idx === activeSlideIndex;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setActiveSlideIndex(idx)}
                        style={{
                          background: isActive ? 'rgba(212,175,55,0.08)' : 'transparent',
                          border: 'none',
                          borderLeft: isActive ? '3px solid var(--color-gold)' : '3px solid transparent',
                          padding: '0.8rem 1rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          borderRadius: '0 12px 12px 0',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.1rem',
                          outline: 'none'
                        }}
                        className={`showroom-btn ${isActive ? 'active' : ''}`}
                      >
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontFamily: 'var(--font-sans)', 
                          fontWeight: '600', 
                          color: isActive ? 'var(--color-gold-dark)' : 'var(--color-text-muted)',
                          letterSpacing: '0.05em' 
                        }}>
                          {String(idx + 1).padStart(2, '0')} — {getMeta(room.name).category}
                        </span>
                        <span style={{ 
                          fontSize: '0.95rem', 
                          fontFamily: 'var(--font-serif)', 
                          color: isActive ? 'var(--color-text-dark)' : 'var(--color-text-muted)',
                          fontWeight: isActive ? '600' : '400',
                        }}>
                          {room.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Center Column: Selected Room Details Showcase Card */}
              <div style={{
                backgroundColor: '#fff',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeIn 0.5s ease-out'
              }} className="showroom-showcase" key={activeRoom?.id || activeSlideIndex}>
                {/* Top Image Banner */}
                <div style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={activeRoom.imageUrl} 
                    alt={activeRoom.name} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    background: 'rgba(24, 23, 21, 0.8)',
                    backdropFilter: 'blur(5px)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '30px',
                    border: '1px solid rgba(212, 175, 55, 0.25)'
                  }}>
                    <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--color-gold)', letterSpacing: '0.08em', fontWeight: '600' }}>
                      {getMeta(activeRoom.name).category}
                    </span>
                  </div>
                </div>

                {/* Showcase Details */}
                <div style={{ padding: '1.5rem 1.8rem', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '0.7rem' }}>
                    <h2 style={{ fontSize: '1.55rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)', margin: 0, lineHeight: '1.2' }}>
                      {activeRoom.name}
                    </h2>
                    <span style={{ fontSize: '1.25rem', color: 'var(--color-gold-dark)', fontWeight: '600', fontFamily: 'var(--font-serif)' }}>
                      LKR {activeRoom.price.toLocaleString()} <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 'normal' }}>/ night</span>
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1rem', fontWeight: '300' }}>
                    {activeRoom.description}
                  </p>

                  {/* Specs Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    borderTop: '1px solid rgba(212,175,55,0.08)',
                    borderBottom: '1px solid rgba(212,175,55,0.08)',
                    padding: '0.8rem 0',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', color: 'var(--color-gold)' }}>
                        <Maximize2 size={12} />
                        <span style={{ fontWeight: '500' }}>Size</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)', fontWeight: '600' }}>{getMeta(activeRoom.name).size}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', color: 'var(--color-gold)' }}>
                        <Users size={12} />
                        <span style={{ fontWeight: '500' }}>Occupancy</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)', fontWeight: '600' }}>{activeRoom.capacity} Guests</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', color: 'var(--color-gold)' }}>
                        <BedDouble size={12} />
                        <span style={{ fontWeight: '500' }}>Bed</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)', fontWeight: '600' }}>{getMeta(activeRoom.name).bed}</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <h4 style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-gold)', letterSpacing: '0.1em', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Amenities & Comforts
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.4rem', fontSize: '0.78rem', marginBottom: '1.5rem', paddingLeft: 0 }}>
                    {activeRoom.amenities.split(',').map((feat, i) => (
                      <li key={i} style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                        <Check size={12} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                        <span>{feat.trim()}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: '1.2rem' }}>
                    <button 
                      className="btn-gold-solid" 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.7rem 1.2rem',
                        fontSize: '0.78rem'
                      }} 
                      onClick={() => onOpenBooking('STAY', activeRoom.name)}
                    >
                      <span>Reserve {getMeta(activeRoom.name).category === 'Suite' ? 'Suite' : 'Chamber'}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Selector Sidebar (Second Half of Rooms) */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
                position: 'sticky',
                top: '100px',
                textAlign: 'left'
              }} className="showroom-sidebar desktop-sidebar">
                <span style={{ 
                  fontSize: '0.68rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.15em', 
                  color: 'var(--color-gold-dark)', 
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  borderBottom: '1px solid rgba(212,175,55,0.18)',
                  paddingBottom: '0.5rem'
                }}>
                  Directory B ({filteredRooms.length - halfCount})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {filteredRooms.slice(halfCount).map((room, idx) => {
                    const actualIndex = halfCount + idx;
                    const isActive = actualIndex === activeSlideIndex;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setActiveSlideIndex(actualIndex)}
                        style={{
                          background: isActive ? 'rgba(212,175,55,0.08)' : 'transparent',
                          border: 'none',
                          borderLeft: isActive ? '3px solid var(--color-gold)' : '3px solid transparent',
                          padding: '0.8rem 1rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          borderRadius: '0 12px 12px 0',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.1rem',
                          outline: 'none'
                        }}
                        className={`showroom-btn ${isActive ? 'active' : ''}`}
                      >
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontFamily: 'var(--font-sans)', 
                          fontWeight: '600', 
                          color: isActive ? 'var(--color-gold-dark)' : 'var(--color-text-muted)',
                          letterSpacing: '0.05em' 
                        }}>
                          {String(actualIndex + 1).padStart(2, '0')} — {getMeta(room.name).category}
                        </span>
                        <span style={{ 
                          fontSize: '0.95rem', 
                          fontFamily: 'var(--font-serif)', 
                          color: isActive ? 'var(--color-text-dark)' : 'var(--color-text-muted)',
                          fontWeight: isActive ? '600' : '400',
                        }}>
                          {room.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

    </section>

      {/* 3. PREMIUM ACCORDION FAQ SECTION */}
      <section style={{ padding: '5rem 2rem', backgroundColor: 'rgba(212,175,55,0.02)', borderTop: '1px solid rgba(212,175,55,0.08)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
              Comfort & Policies
            </span>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              Stay & Sanctuary FAQs
            </h2>
            <div style={{ width: '60px', height: '2px', backgroundColor: 'var(--color-gold)', margin: '1rem auto' }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                question: "What are the check-in and check-out times?",
                answer: "Check-in begins at 2:00 PM, and check-out is until 12:00 PM. Early check-in or late check-out can be requested and is subject to availability."
              },
              {
                question: "What is your cancellation policy?",
                answer: "Reservations can be modified or canceled free of charge up to 72 hours prior to your scheduled arrival. Cancellations made within 72 hours of arrival may be subject to a fee."
              },
              {
                question: "Is high-speed Wi-Fi available at the hotel?",
                answer: "Yes, complimentary high-speed Wi-Fi is available in all guest rooms and throughout all common areas of the property."
              },
              {
                question: "Can I store my luggage before check-in or after check-out?",
                answer: "Yes, we offer complimentary secure luggage storage at the front desk, so you can explore the area hands-free before your room is ready or after you check out."
              },
              {
                question: "Is guest parking available on-site?",
                answer: "Yes, complimentary secure self-parking is available on-site for all staying guests. No prior reservation is required."
              }
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  style={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid rgba(212,175,55,0.15)', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    transition: 'all 0.3s ease',
                    boxShadow: isOpen ? '0 10px 25px rgba(0,0,0,0.02)' : 'none'
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      padding: '1.2rem 1.8rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <span style={{ fontSize: '0.95rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)', fontWeight: '600' }}>
                      {faq.question}
                    </span>
                    <span style={{ 
                      color: 'var(--color-gold-dark)', 
                      fontSize: '0.75rem', 
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}>
                      ▼
                    </span>
                  </button>
                  <div style={{
                    maxHeight: isOpen ? '200px' : '0',
                    opacity: isOpen ? 1 : 0,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    padding: isOpen ? '0 1.8rem 1.5rem 1.8rem' : '0 1.8rem'
                  }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.6', margin: 0 }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Styled slide animation */}
      <style>{`
        .showroom-btn:hover {
          background: rgba(212,175,55,0.03) !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .showroom-container {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .desktop-sidebar {
            display: none !important;
          }
          .mobile-room-selector {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
