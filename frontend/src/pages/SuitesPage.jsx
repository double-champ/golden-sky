import React, { useState, useEffect } from 'react';
import { Maximize2, Users, BedDouble, Check, X, Calendar, ArrowRight, Loader2, Sparkles } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const roomMetadata = {
  "Standard Room 01": { size: "65 m²", bed: "King Bed", category: "Standard rooms" },
  "Deluxe Triple Room 01": { size: "95 m²", bed: "King & Daybed", category: "Deluxe rooms" },
  "Standard Room 02": { size: "72 m²", bed: "King Bed", category: "Standard rooms" },
  "Deluxe Family Suite": { size: "120 m²", bed: "King & Queen Bed", category: "Suite" },
  "Standard Room 03": { size: "65 m²", bed: "King Bed", category: "Standard rooms" },
  "Deluxe Double Room 01": { size: "85 m²", bed: "King Bed", category: "Deluxe rooms" },
  "Deluxe Double Room 02": { size: "60 m²", bed: "King Bed", category: "Deluxe rooms" },
  "Deluxe Triple Room 02": { size: "150 m²", bed: "2 King Beds", category: "Deluxe rooms" },
  "Deluxe Triple Room 03": { size: "78 m²", bed: "King & Daybed", category: "Deluxe rooms" },
  "Standard Room 04": { size: "55 m²", bed: "Twin Bed", category: "Standard rooms" },
  "Standard Room 05": { size: "70 m²", bed: "Queen Bed", category: "Standard rooms" },
  "Deluxe Triple Room 04": { size: "88 m²", bed: "King Bed", category: "Deluxe rooms" }
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
  const [viewFilter, setViewFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);



  useEffect(() => {
    setActiveSlideIndex(0);
  }, [selectedCategory, priceFilter, capacityFilter, viewFilter, sortBy]);

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
          price: name === "Deluxe Family Suite" ? 17000 : 
                 (roomMetadata[name].category === "Standard rooms" ? 10000 : 
                 (name.includes("Triple") ? 14000 : 12000)),
          capacity: (name.includes("Triple") || name === "Deluxe Family Suite") ? 3 : 2,
          description: name === "Standard Room 01" ? "A quiet mountain retreat with views of the Hanthana range. Features a private jacuzzi, organic Ceylon tea bar, and a scenic mountainside balcony." :
                       name === "Deluxe Triple Room 01" ? "A private standalone villa with glass walls overlooking the sunset. Features a private butler and an outdoor infinity deck." :
                       name === "Standard Room 02" ? "A dedicated wellness suite for rejuvenation. Features custom aromatherapy, a private soaking tub, and spaces for yoga and stretching." :
                       name === "Deluxe Family Suite" ? "Our signature Haritha family suite featuring a private stargazing deck, a glass floor, and a dedicated butler team." :
                       name === "Standard Room 03" ? "A cozy cabin nestled in the pine woods, featuring a stone fireplace, open-sky rain shower, and a private patio." :
                       name === "Deluxe Double Room 01" ? "A unique water villa suspended over a spring lotus pond. Features glass floor view panels and private sun decks." :
                       name === "Deluxe Double Room 02" ? "A beautiful east-facing suite designed to catch the Kandy sunrise. Equipped with telescopes and private viewing decks." :
                       name === "Deluxe Triple Room 02" ? "A spacious 2-bedroom mountainside estate with a private heated hot tub, fireplace lounge, and personal butler." :
                       name === "Deluxe Triple Room 03" ? "A quiet chalet surrounded by wild cardamom fields, featuring a wood-fired hot tub and scenic valley views." :
                       name === "Standard Room 04" ? "An eco-friendly bamboo loft with cozy hand-woven hammocks, natural breeze cooling, and panoramic forest views." :
                       name === "Standard Room 05" ? "A peaceful soundproof studio space complete with premium aromatherapy and organic cotton yoga mats." :
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
      if (capacityFilter === '2' && room.capacity < 2) return false;
      if (capacityFilter === '3' && room.capacity < 3) return false;

      // 4. View Filter
      if (viewFilter !== 'all') {
        const amenitiesLower = room.amenities.toLowerCase();
        const descriptionLower = room.description.toLowerCase();
        const combined = (amenitiesLower + " " + descriptionLower);
        if (viewFilter === 'mountain' && !combined.includes('mountain')) return false;
        if (viewFilter === 'city' && !combined.includes('city')) return false;
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

  const categories = ["All Chambers", "Standard rooms", "Deluxe rooms", "Suite"];

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
        background: 'linear-gradient(rgba(14, 13, 11, 0.45), rgba(14, 13, 11, 0.7)), url("/images/20260418_114222_1.jpg")',
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
                <option value="all">Any Occupancy</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
              </select>
            </div>

            {/* Scenic View Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold-dark)', fontWeight: '600' }}>Scenic View</label>
              <select
                className="refinement-select"
                value={viewFilter}
                onChange={(e) => setViewFilter(e.target.value)}
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
                <option value="all">Any View</option>
                <option value="mountain">Mountain View</option>
                <option value="city">City View</option>
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
                    loading="lazy"
                    decoding="async"
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
                    background: 'rgba(14, 13, 11, 0.8)',
                    backdropFilter: 'blur(5px)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '30px',
                    border: '1px solid var(--color-border-gold)'
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

                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1.2rem', fontWeight: '300' }}>
                    {activeRoom.description}
                  </p>

                  {/* Standard Sanctuary Specifications Panel */}
                  <div style={{
                    backgroundColor: 'rgba(212,175,55,0.04)',
                    border: '1px solid rgba(212,175,55,0.15)',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1.2rem',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    color: 'var(--color-text-dark)'
                  }}>
                    <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--color-gold-dark)', letterSpacing: '0.08em', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                      Standard Sanctuary Specifications
                    </span>
                    <ul style={{ paddingLeft: '1.1rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <li><strong>In-Room:</strong> AC, minibar, balcony, free Wi-Fi, safety deposit box, all-day hot water, hairdryer, iron, toiletries (no kitchenette).</li>
                      <li><strong>Extra Bed Policy:</strong> All chambers are double or triple occupancy; <em>no extra bed/cot option</em> is available.</li>
                      <li><strong>Check-in / Check-out:</strong> 2:00 PM / 12:00 PM.</li>
                    </ul>
                  </div>

                  {/* Specs Grid */}
                  <div className="room-specs-grid" style={{
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
                question: "What are the check-in/out times and bedding policies?",
                answer: <span>Check-in is from <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>2:00 PM</strong>, and check-out is until <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>12:00 PM</strong>. Please note that all our rooms are designed as luxury sanctuaries for up to 2 or 3 guests, and <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>we do not offer extra beds or cot options</strong>.</span>
              },
              {
                question: "What in-room amenities are included?",
                answer: <span>Each room is equipped with premium air conditioning (AC), a minibar, a private balcony, complimentary Wi-Fi, a safety deposit box, all-day hot water, a hairdryer, an iron, and luxury toiletries. Please note that <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>no kitchenettes are available</strong> in guest chambers.</span>
              },
              {
                question: "What dining options and rates do you offer?",
                answer: <span>We feature an <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>indoor formal restaurant</strong>, an <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>outdoor/rooftop casual restaurant</strong>, and full room service. We also offer a premium Sunset High Tea package for <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>LKR 4,500</strong>. Guests receive a complimentary welcome drink on arrival. Breakfast is included only on B&B rate plans. There is no dedicated bar (drinks are served via the restaurants only) and no separate lounge area.</span>
              },
              {
                question: "What are the wellness center facilities?",
                answer: <span>Our brand new <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>Shadara Wellness</strong> center offers professional Ayurveda treatments, spa and body massages, and dedicated sauna/steam facilities to aid in physical and mental rejuvenation.</span>
              },
              {
                question: "What other guest services and parking options are available?",
                answer: <span>We offer a 24/7 front desk, daily housekeeping, laundry service, airport transfers, currency exchange, a tour desk / excursion bookings, and secure luggage storage. We also feature an event/function space (no separate meeting room) and <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>complimentary secured parking</strong> guarded 24/7 with a dedicated security guard and CCTV surveillance.</span>
              },
              {
                question: "What are your house rules regarding pets, smoking, and children?",
                answer: <span>Golden Sky is a <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>fully non-smoking property</strong>. Pets are not allowed on the premises. Children of all ages are welcome, and we do not have any age restrictions for staying guests.</span>
              },
              {
                question: "What are the booking, payment, and cancellation terms?",
                answer: <span>We support both <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>pay-on-booking</strong> (online) and <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>pay-at-property</strong>. We accept credit/debit cards, cash, bank transfers, and online payments. A free cancellation window is available up to 72 hours before arrival.</span>
              },
              {
                question: "Are there specific features or services not available at the resort?",
                answer: <span>To ensure transparency, please note that we do <strong style={{ color: 'var(--color-gold-dark)', fontWeight: '600' }}>not have an on-site swimming pool, gift shop, bicycle rentals, backup generators, or an on-call doctor</strong>. Additionally, the property does not currently offer accessibility features. Our staff mainly communicates in Sinhala and English.</span>
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
          .showroom-showcase {
            border-radius: 16px !important;
            margin: 0 0.5rem !important;
          }
          .showroom-showcase > div:first-child {
            height: 180px !important;
          }
          .room-specs-grid {
            grid-template-columns: 1fr !important;
            gap: 0.8rem !important;
            padding: 0.8rem 0 !important;
          }
          .room-specs-grid > div {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 0.2rem 0 !important;
            border-bottom: 1px dashed rgba(212, 175, 55, 0.1);
          }
          .room-specs-grid > div:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </div>
  );
}
