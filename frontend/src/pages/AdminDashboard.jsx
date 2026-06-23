import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Calendar, TrendingUp, ShieldAlert, Check, X, RefreshCw, Database } from 'lucide-react';

const API_BASE = "http://localhost:5000/api";

const initialMockBookings = [
  {
    id: "RES-001",
    type: "STAY",
    guestName: "Aruni Perera",
    guestEmail: "aruni@example.com",
    guestPhone: "+94 77 123 4567",
    targetDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    durationDays: 3,
    guestsCount: 2,
    roomOrPackageName: "Hanthana Misty Suite",
    specialRequests: "Anniversary celebration setup, high floor if possible.",
    status: "CONFIRMED",
    createdAt: new Date().toISOString()
  },
  {
    id: "RES-002",
    type: "DAYOUT",
    guestName: "Nihal Fernando",
    guestEmail: "nihal@example.com",
    guestPhone: "+94 71 987 6543",
    targetDate: new Date(Date.now() + 86400000).toISOString(),
    durationDays: 1,
    guestsCount: 4,
    roomOrPackageName: "Hanthana Escape Dayout",
    specialRequests: "Vegetarian meals preferred.",
    status: "PENDING",
    createdAt: new Date().toISOString()
  },
  {
    id: "RES-003",
    type: "SPA",
    guestName: "Sarah Jenkins",
    guestEmail: "sarah@example.com",
    guestPhone: "+1 415 555 2671",
    targetDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    durationDays: null,
    guestsCount: 1,
    roomOrPackageName: "Sacred Lotus Shanti Therapy",
    specialRequests: "Prefers female therapist.",
    status: "CONFIRMED",
    createdAt: new Date().toISOString()
  }
];

export default function AdminDashboard({ onGoBack }) {
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    pendingCount: 0,
    confirmedCount: 0,
    cancelledCount: 0,
    estimatedRevenue: 0,
    categories: { STAY: 0, DAYOUT: 0, SPA: 0, DINING: 0 }
  });
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const bookingsRes = await fetch(`${API_BASE}/bookings`);
      if (!bookingsRes.ok) throw new Error("API Offline");
      
      const bookingsData = await bookingsRes.json();
      
      const analyticsRes = await fetch(`${API_BASE}/analytics`);
      const analyticsData = await analyticsRes.json();

      setBookings(bookingsData);
      setAnalytics(analyticsData);
      setIsLive(true);
    } catch (err) {
      console.warn("Backend API not reachable. Loading from browser Local Storage Sandbox...");
      setIsLive(false);
      
      const localSaved = localStorage.getItem('golden_sky_bookings');
      let localBookingsList = [];
      
      if (localSaved) {
        localBookingsList = JSON.parse(localSaved);
      } else {
        localStorage.setItem('golden_sky_bookings', JSON.stringify(initialMockBookings));
        localBookingsList = initialMockBookings;
      }
      
      setBookings(localBookingsList.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      computeLocalAnalytics(localBookingsList);
    } finally {
      setLoading(false);
    }
  };

  const computeLocalAnalytics = (list) => {
    const totalBookings = list.length;
    const pendingCount = list.filter(b => b.status === 'PENDING').length;
    const confirmedCount = list.filter(b => b.status === 'CONFIRMED').length;
    const cancelledCount = list.filter(b => b.status === 'CANCELLED').length;

    let estimatedRevenue = 0;
    list.filter(b => b.status === 'CONFIRMED').forEach(b => {
      if (b.type === 'STAY') {
        const rate = b.roomOrPackageName.includes('Canopy') ? 75000 : (b.roomOrPackageName.includes('Ayur') ? 55000 : 45000);
        estimatedRevenue += rate * (b.durationDays || 1);
      } else if (b.type === 'DAYOUT') {
        estimatedRevenue += b.roomOrPackageName.includes('Wellness') ? 12500 * b.guestsCount : 6500 * b.guestsCount;
      } else if (b.type === 'SPA') {
        estimatedRevenue += b.roomOrPackageName.includes('Lotus') ? 18000 * b.guestsCount : (b.roomOrPackageName.includes('Spiced') ? 15000 * b.guestsCount : 10000 * b.guestsCount);
      } else if (b.type === 'DINING') {
        estimatedRevenue += b.roomOrPackageName.includes('Dinner') ? 9500 * b.guestsCount : 4000 * b.guestsCount;
      }
    });

    const categories = {
      STAY: list.filter(b => b.type === 'STAY').length,
      DAYOUT: list.filter(b => b.type === 'DAYOUT').length,
      SPA: list.filter(b => b.type === 'SPA').length,
      DINING: list.filter(b => b.type === 'DINING').length
    };

    setAnalytics({
      totalBookings,
      pendingCount,
      confirmedCount,
      cancelledCount,
      estimatedRevenue,
      categories
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (isLive) {
      try {
        const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) {
          fetchData();
        } else {
          alert("Could not update reservation status.");
        }
      } catch (err) {
        alert("Failed to connect to backend server.");
      }
    } else {
      const localSaved = localStorage.getItem('golden_sky_bookings');
      if (localSaved) {
        const list = JSON.parse(localSaved);
        const idx = list.findIndex(b => b.id === bookingId);
        if (idx !== -1) {
          list[idx].status = newStatus;
          localStorage.setItem('golden_sky_bookings', JSON.stringify(list));
          setBookings(list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
          computeLocalAnalytics(list);
        }
      }
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm("Reset browser sandbox to mock bookings? This clears any test forms you filled.")) {
      localStorage.setItem('golden_sky_bookings', JSON.stringify(initialMockBookings));
      fetchData();
    }
  };

  return (
    <div className="page-transition" style={{ backgroundColor: 'var(--color-bg-ivory)', minHeight: '100vh', padding: '7rem 0 4rem 0', textAlign: 'left', overflowY: 'auto' }}>
      <div className="container">
        
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold-dark)' }}>
              <LayoutDashboard size={20} />
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '600' }}>Management Portal</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', margin: '0.3rem 0 0 0', fontFamily: 'var(--font-serif)', color: 'var(--color-text-dark)' }}>
              Golden Sky <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Live Analytics</span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div 
              className="glass-panel" 
              style={{ 
                padding: '0.5rem 1rem', 
                fontSize: '0.8rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                borderColor: isLive ? 'rgba(46, 213, 115, 0.3)' : 'rgba(212, 175, 55, 0.3)',
                background: '#fff'
              }}
            >
              <Database size={14} style={{ color: isLive ? '#2ed573' : 'var(--color-gold)' }} />
              <span style={{ color: 'var(--color-text-dark)' }}>
                Mode: {isLive ? <strong style={{ color: '#2ed573' }}>MySQL Active</strong> : <strong style={{ color: 'var(--color-gold)' }}>Browser Sandbox</strong>}
              </span>
            </div>

            <button className="btn-gold" style={{ padding: '0.5rem 1rem' }} onClick={fetchData}>
              <RefreshCw size={14} />
            </button>

            {!isLive && (
              <button className="btn-gold" style={{ padding: '0.5rem 1.2rem', borderColor: '#ff4757', color: '#ff4757' }} onClick={handleResetDemoData}>
                Reset Demo
              </button>
            )}

            <button className="btn-gold-solid" style={{ padding: '0.5rem 1.2rem' }} onClick={onGoBack}>
              Exit Dashboard
            </button>
          </div>
        </div>

        {/* Analytics cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', background: '#fff' }}>
            <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.8rem', borderRadius: '8px', color: 'var(--color-gold)' }}>
              <Calendar size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Reservations</span>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: '700', fontSize: '1.8rem', color: 'var(--color-text-dark)' }}>{analytics.totalBookings}</h3>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', background: '#fff' }}>
            <div style={{ background: 'rgba(46, 213, 115, 0.1)', padding: '0.8rem', borderRadius: '8px', color: '#2ed573' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Revenue (LKR)</span>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: '700', fontSize: '1.8rem', color: 'var(--color-text-dark)' }}>
                {analytics.estimatedRevenue.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', background: '#fff' }}>
            <div style={{ background: 'rgba(255, 165, 2, 0.1)', padding: '0.8rem', borderRadius: '8px', color: '#ffa502' }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Pending Stays</span>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: '700', fontSize: '1.8rem', color: 'var(--color-text-dark)' }}>{analytics.pendingCount}</h3>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', background: '#fff' }}>
            <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.8rem', borderRadius: '8px', color: 'var(--color-gold)' }}>
              <Users size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Category Rates</span>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: '700', fontSize: '1.2rem', color: 'var(--color-text-dark)', marginTop: '0.3rem' }}>
                S:{analytics.categories.STAY} D:{analytics.categories.DAYOUT} Sp:{analytics.categories.SPA}
              </h3>
            </div>
          </div>

        </div>

        {/* Dynamic distribution bars */}
        <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem', background: '#fff' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: '600', fontSize: '1.1rem', color: 'var(--color-text-dark)', marginBottom: '1.5rem' }}>
            Booking Segment Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {['STAY', 'DAYOUT', 'SPA', 'DINING'].map((cat) => {
              const count = analytics.categories[cat] || 0;
              const percent = analytics.totalBookings > 0 ? (count / analytics.totalBookings) * 100 : 0;
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <strong style={{ letterSpacing: '0.05em', color: 'var(--color-text-dark)' }}>
                      {cat === 'STAY' && 'ROOM STAYS & SUITES'}
                      {cat === 'DAYOUT' && 'DAYOUT PACKAGES (THE CANOPY)'}
                      {cat === 'SPA' && 'GOLDEN SHANTI SPA'}
                      {cat === 'DINING' && 'ROOFTOP & DINE-IN'}
                    </strong>
                    <span style={{ color: 'var(--color-gold-dark)' }}>{count} Bookings ({percent.toFixed(0)}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${percent}%`, 
                        height: '100%', 
                        background: 'linear-gradient(90deg, var(--color-gold-dark), var(--color-gold))',
                        borderRadius: '4px',
                        transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking Table */}
        <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto', background: '#fff' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: '600', fontSize: '1.1rem', color: 'var(--color-text-dark)', marginBottom: '1.5rem' }}>
            Recent Reservation Logs
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>Loading records...</div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>No reservation requests logged yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '1rem', color: 'var(--color-gold-dark)' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Guest Details</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Category</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Selection/Package</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Booking Date</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '1.2rem 0.5rem' }}>
                      <div style={{ color: 'var(--color-text-dark)', fontWeight: '500' }}>{booking.guestName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{booking.guestPhone}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{booking.guestEmail}</div>
                    </td>
                    
                    <td style={{ padding: '1.2rem 0.5rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '600', 
                        letterSpacing: '0.05em',
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px',
                        background: booking.type === 'STAY' ? 'rgba(46, 213, 115, 0.15)' : 'rgba(212, 175, 55, 0.15)',
                        color: booking.type === 'STAY' ? '#27ae60' : 'var(--color-gold-dark)'
                      }}>
                        {booking.type}
                      </span>
                    </td>

                    <td style={{ padding: '1.2rem 0.5rem' }}>
                      <div style={{ color: 'var(--color-text-dark)' }}>{booking.roomOrPackageName}</div>
                      {booking.type === 'STAY' && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Duration: {booking.durationDays} Nights • {booking.guestsCount} Guests
                        </div>
                      )}
                      {booking.type !== 'STAY' && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Guests: {booking.guestsCount} Pax
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '1.2rem 0.5rem' }}>
                      <div style={{ color: 'var(--color-text-dark)' }}>{new Date(booking.targetDate).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Logged: {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td style={{ padding: '1.2rem 0.5rem' }}>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: '600',
                        color: booking.status === 'CONFIRMED' ? '#27ae60' : (booking.status === 'CANCELLED' ? '#ff4757' : '#ffa502')
                      }}>
                        {booking.status}
                      </span>
                    </td>

                    <td style={{ padding: '1.2rem 0.5rem', textAlign: 'right' }}>
                      {booking.status === 'PENDING' && (
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button 
                            className="btn-gold" 
                            style={{ 
                              padding: '0.3rem 0.5rem', 
                              borderColor: '#27ae60', 
                              color: '#27ae60',
                              borderRadius: '4px'
                            }} 
                            onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            className="btn-gold" 
                            style={{ 
                              padding: '0.3rem 0.5rem', 
                              borderColor: '#ff4757', 
                              color: '#ff4757',
                              borderRadius: '4px'
                            }} 
                            onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                      {booking.status !== 'PENDING' && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
