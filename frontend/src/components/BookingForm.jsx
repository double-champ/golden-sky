import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Mail, Phone, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const API_BASE = "http://localhost:5000/api";

const ROOM_CATEGORIES = {
  "Hanthana Misty Suite": "Double rooms",
  "Golden Sky Canopy Villa": "Triple rooms",
  "Ayur Sanctuary Suite": "Double rooms",
  "Cloud Nine Penthouse": "Suite",
  "Pine Forest Pavilion": "Double rooms",
  "Sacred Lotus Water Villa": "Double rooms",
  "Sunrise Horizon Suite": "Double rooms",
  "Majestic Peaks Residence": "Triple rooms",
  "Cardamom Hill Chalet": "Triple rooms",
  "Whispering Bamboo Loft": "Single rooms",
  "Nirvana Zen Studio": "Double rooms",
  "Kandy Kings Suite": "Triple rooms"
};

export default function BookingForm({ isOpen, onClose, initialType = 'STAY', initialPackage = '' }) {
  const [step, setStep] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    type: 'STAY',
    roomOrPackageName: '',
    targetDate: '',
    durationDays: 1,
    guestsCount: 2,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');

  const fallbackRooms = [
    { name: "Hanthana Misty Suite", type: "STAY", price: 45000 },
    { name: "Golden Sky Canopy Villa", type: "STAY", price: 75000 },
    { name: "Serenity Sanctuary Suite", type: "STAY", price: 55000 },
    { name: "Cloud Nine Penthouse", type: "STAY", price: 120000 },
    { name: "Pine Forest Pavilion", type: "STAY", price: 65000 },
    { name: "Royal Lotus Water Villa", type: "STAY", price: 90000 },
    { name: "Sunrise Horizon Suite", type: "STAY", price: 50000 },
    { name: "Majestic Peaks Residence", type: "STAY", price: 150000 },
    { name: "Cardamom Hill Chalet", type: "STAY", price: 60000 },
    { name: "Whispering Bamboo Loft", type: "STAY", price: 48000 },
    { name: "Hanthana Forest Studio", type: "STAY", price: 52000 },
    { name: "Kandy Kings Suite", type: "STAY", price: 85000 },
    { name: "Hanthana Escape Dayout", type: "DAYOUT", price: 6500 },
    { name: "Golden Wellness Dayout", type: "DAYOUT", price: 12500 },
    { name: "Royal Heritage Dayout", type: "DAYOUT", price: 9500 },
    { name: "Royal Lotus Relaxation Therapy", type: "SPA", price: 18000 },
    { name: "Kandy Spiced Herbal Glow", type: "SPA", price: 15000 },
    { name: "Hanthana Herbal Wellness Massage", type: "SPA", price: 10000 },
    { name: "Curated 5-Course Dinner", type: "DINING", price: 9500 },
    { name: "Hanthana Sunset High Tea", type: "DINING", price: 4000 },
    { name: "Aura Rooftop Fire-pit Dining", type: "DINING", price: 15000 }
  ];

  useEffect(() => {
    if (!isOpen) return;

    setStep(1);
    setSuccessInfo(null);
    setErrorMsg('');
    
    const qDate = localStorage.getItem('quick_date') || '';
    const qGuests = localStorage.getItem('quick_guests') || '2';
    const qNights = localStorage.getItem('quick_nights') || '1';

    async function loadRoomsAndInit() {
      let activeRooms = [];
      try {
        const res = await fetch(`${API_BASE}/rooms`);
        if (res.ok) {
          const data = await res.json();
          setRooms(data);
          activeRooms = data;
        }
      } catch (err) {
        console.warn("Could not fetch database rooms for booking form. Using offline mock rooms.");
      }

      if (activeRooms.length === 0) {
        setRooms(fallbackRooms);
        activeRooms = fallbackRooms;
      }

      const getFirstItem = (type, list) => {
        const matched = list.filter(r => r.type === type);
        return matched.length > 0 ? matched[0].name : '';
      };

      const initDate = qDate || formData.targetDate || new Date().toISOString().split('T')[0];
      const initNights = parseInt(qNights) || formData.durationDays || 1;
      
      const start = new Date(initDate);
      const end = new Date(start);
      end.setDate(end.getDate() + initNights);
      setCheckoutDate(end.toISOString().split('T')[0]);

      setFormData(prev => ({
        ...prev,
        type: initialType,
        roomOrPackageName: initialPackage || getFirstItem(initialType, activeRooms),
        targetDate: initDate,
        guestsCount: parseInt(qGuests) || prev.guestsCount,
        durationDays: initNights
      }));
    }

    loadRoomsAndInit();

    localStorage.removeItem('quick_date');
    localStorage.removeItem('quick_guests');
    localStorage.removeItem('quick_nights');
  }, [isOpen, initialType, initialPackage]);

  const getFirstItemForType = (type) => {
    const list = rooms.length > 0 ? rooms : fallbackRooms;
    const matched = list.filter(r => r.type === type);
    return matched.length > 0 ? matched[0].name : '';
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      roomOrPackageName: getFirstItemForType(type)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckinChange = (val) => {
    setFormData(prev => {
      const nextDate = val;
      let nextNights = prev.durationDays;
      
      const start = new Date(nextDate);
      let end = checkoutDate ? new Date(checkoutDate) : null;
      
      if (!end || end <= start) {
        const nextEnd = new Date(start);
        nextEnd.setDate(nextEnd.getDate() + prev.durationDays);
        const nextEndStr = nextEnd.toISOString().split('T')[0];
        setCheckoutDate(nextEndStr);
        nextNights = prev.durationDays;
      } else {
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        nextNights = diffDays >= 1 ? diffDays : 1;
      }

      return {
        ...prev,
        targetDate: nextDate,
        durationDays: nextNights
      };
    });
  };

  const handleCheckoutChange = (val) => {
    setCheckoutDate(val);
    if (formData.targetDate && val) {
      const start = new Date(formData.targetDate);
      const end = new Date(val);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 1) {
        setFormData(prev => ({
          ...prev,
          durationDays: diffDays
        }));
      }
    }
  };

  const getMinCheckoutDate = () => {
    if (!formData.targetDate) return new Date().toISOString().split('T')[0];
    const checkin = new Date(formData.targetDate);
    const minDate = new Date(checkin);
    minDate.setDate(minDate.getDate() + 1);
    return minDate.toISOString().split('T')[0];
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessInfo({
          bookingId: data.booking.id,
          mode: 'LIVE (MySQL Saved)'
        });
        setStep(3);
      } else {
        const data = await response.json();
        const err = new Error(data.error || "The selected dates/times are not available.");
        err.isApiError = true;
        throw err;
      }
    } catch (err) {
      if (err.isApiError) {
        setErrorMsg(err.message);
        setIsSubmitting(false);
        return;
      }

      console.warn("Backend server offline. Saving booking to Local Storage Fallback...");
      // Save locally to display in Admin dashboard instantly
      try {
        const localSaved = localStorage.getItem('golden_sky_bookings');
        const bookingsList = localSaved ? JSON.parse(localSaved) : [];
        
        // 1. Offline availability check
        const reqStart = new Date(formData.targetDate);
        const duration = formData.type === 'STAY' ? formData.durationDays : 1;
        const reqEnd = new Date(reqStart);
        reqEnd.setDate(reqEnd.getDate() + duration);

        const hasLocalConflict = bookingsList.some(b => {
          if (b.roomOrPackageName.toLowerCase() !== formData.roomOrPackageName.toLowerCase()) return false;
          if (b.status === "CANCELLED") return false;

          const existStart = new Date(b.targetDate);
          if (formData.type === 'STAY') {
            const existDuration = b.durationDays ? parseInt(b.durationDays) : 1;
            const existEnd = new Date(existStart);
            existEnd.setDate(existEnd.getDate() + existDuration);
            return reqStart < existEnd && existStart < reqEnd;
          } else {
            return reqStart.toDateString() === existStart.toDateString();
          }
        });

        if (hasLocalConflict) {
          setErrorMsg(formData.type === 'STAY' 
            ? "Offline Mode: This room is already reserved locally for the selected dates." 
            : "Offline Mode: This experience is already booked locally for the selected date.");
          setIsSubmitting(false);
          return;
        }

        // 2. Proceed to save simulated booking
        let lastNum = 0;
        bookingsList.forEach(b => {
          if (b.id && b.id.startsWith("RES-")) {
            const num = parseInt(b.id.replace("RES-", ""), 10);
            if (!isNaN(num) && num > lastNum) {
              lastNum = num;
            }
          }
        });
        const nextId = `RES-${String(lastNum + 1).padStart(3, '0')}`;

        const simulatedBooking = {
          id: nextId,
          ...formData,
          targetDate: new Date(formData.targetDate).toISOString(),
          status: 'PENDING',
          createdAt: new Date().toISOString()
        };
        bookingsList.push(simulatedBooking);
        localStorage.setItem('golden_sky_bookings', JSON.stringify(bookingsList));
        
        setSuccessInfo({
          bookingId: simulatedBooking.id,
          mode: 'STANDALONE OFFLINE (Local Host Persisted)'
        });
        setStep(3);
      } catch (storageErr) {
        setErrorMsg("Could not process booking. Local Storage is full.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10005, // Raised z-index to stay on top of the luxury sticky header (zIndex: 9999)
      padding: '2rem 1rem',
      overflowY: 'auto'
    }}>
      <div 
        className="luxury-booking-modal animate-slide-up"
        style={{ margin: 'auto' }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            cursor: 'pointer',
            transition: 'color 0.3s ease',
            zIndex: 10 // Ensure it stays on top of content layers
          }}
          className="cursor-hover"
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
        >
          <X size={22} />
        </button>

        {/* Wizard Progress Bar */}
        {step < 3 && (
          <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2.5rem', marginTop: '1rem' }}>
            <div style={{ height: '3px', flex: 1, backgroundColor: step >= 1 ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)', borderRadius: '4px', transition: '0.3s' }} />
            <div style={{ height: '3px', flex: 1, backgroundColor: step >= 2 ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)', borderRadius: '4px', transition: '0.3s' }} />
          </div>
        )}

        {/* STEP 1: SELECT EXPERIENCE */}
        {step === 1 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.4rem', color: '#fff', textAlign: 'left' }}>
              Reserve Your <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Sanctuary</span>
            </h3>
            <p style={{ textAlign: 'left', marginBottom: '2.5rem', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>Choose your experience and preferences.</p>

            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', textAlign: 'left' }}>
              {/* Experience Type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="booking-label">Experience Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem' }}>
                  {['STAY', 'DAYOUT', 'SPA', 'DINING'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`booking-type-btn ${formData.type === t ? 'active' : ''}`}
                      onClick={() => handleTypeChange(t)}
                    >
                      {t === 'STAY' && 'Room Stays'}
                      {t === 'DAYOUT' && 'Day Outings'}
                      {t === 'SPA' && 'Spa Session'}
                      {t === 'DINING' && 'Dining & Tea'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room or Package Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="booking-label">Selection</label>
                <select
                  name="roomOrPackageName"
                  value={formData.roomOrPackageName}
                  onChange={handleChange}
                  required
                  className="dark-refinement-select"
                >
                  {formData.type === 'STAY' ? (
                    ['Single rooms', 'Double rooms', 'Triple rooms', 'Suite'].map((cat) => {
                      const catRooms = rooms.filter(
                        (r) => r.type === 'STAY' && (ROOM_CATEGORIES[r.name] === cat || (!ROOM_CATEGORIES[r.name] && cat === 'Suite'))
                      );
                      if (catRooms.length === 0) return null;
                      return (
                        <optgroup key={cat} label={cat}>
                          {catRooms.map((room) => (
                            <option key={room.id || room.name} value={room.name}>
                              {room.name} {room.price ? `(LKR ${room.price.toLocaleString()} / Night)` : ''}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })
                  ) : (
                    rooms
                      .filter((r) => r.type === formData.type)
                      .map((room) => (
                        <option key={room.id || room.name} value={room.name}>
                          {room.name} {room.price ? `(LKR ${room.price.toLocaleString()})` : ''}
                        </option>
                      ))
                  )}
                </select>
              </div>

              {/* Date & Guests / Stays Duration */}
              {formData.type === 'STAY' ? (
                <>
                  <div className="form-grid-2-col">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="booking-label">Check-in Date (From)</label>
                      <input
                        type="date"
                        name="targetDate"
                        value={formData.targetDate}
                        onChange={(e) => handleCheckinChange(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="booking-input"
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="booking-label">Check-out Date (To)</label>
                      <input
                        type="date"
                        name="checkoutDate"
                        value={checkoutDate}
                        onChange={(e) => handleCheckoutChange(e.target.value)}
                        required
                        min={getMinCheckoutDate()}
                        className="booking-input"
                      />
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '0.78rem', 
                    color: 'var(--color-gold)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    fontWeight: '600',
                    marginTop: '-0.4rem',
                    textAlign: 'left'
                  }}>
                    Duration: {formData.durationDays} night{formData.durationDays > 1 ? 's' : ''}
                  </div>
                </>
              ) : (
                <div className="form-grid-2-col">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="booking-label">Booking Date</label>
                    <input
                      type="date"
                      name="targetDate"
                      value={formData.targetDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="booking-input"
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="booking-label">Guests Count</label>
                    <input
                      type="number"
                      name="guestsCount"
                      value={formData.guestsCount}
                      onChange={handleChange}
                      required
                      min="1"
                      max="10"
                      className="booking-input"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="btn-gold-solid" 
                style={{ 
                  marginTop: '1.8rem', 
                  width: '100%',
                  padding: '0.9rem 2rem',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  letterSpacing: '0.15em'
                }}
              >
                Continue to Details
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: GUEST DETAILS & SUBMIT */}
        {step === 2 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.4rem', color: '#fff', textAlign: 'left' }}>
              Guest <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Information</span>
            </h3>
            <p style={{ textAlign: 'left', marginBottom: '2.5rem', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Fill in your contact details to finalize your mountain sanctuary reservation.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', textAlign: 'left' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="booking-label">Full Name</label>
                <div className="booking-input-wrapper">
                  <User size={16} className="booking-input-icon" />
                  <input
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleChange}
                    required
                    placeholder="Aruni Perera"
                    className="booking-input booking-input-with-icon"
                  />
                </div>
              </div>

              <div className="form-grid-2-col">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="booking-label">Email Address</label>
                  <div className="booking-input-wrapper">
                    <Mail size={16} className="booking-input-icon" />
                    <input
                      type="email"
                      name="guestEmail"
                      value={formData.guestEmail}
                      onChange={handleChange}
                      required
                      placeholder="aruni@example.com"
                      className="booking-input booking-input-with-icon"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label className="booking-label">Phone Number</label>
                  <div className="booking-input-wrapper">
                    <Phone size={16} className="booking-input-icon" />
                    <input
                      type="tel"
                      name="guestPhone"
                      value={formData.guestPhone}
                      onChange={handleChange}
                      required
                      placeholder="+94 77 123 4567"
                      className="booking-input booking-input-with-icon"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="booking-label">Special Requests</label>
                <div className="booking-input-wrapper">
                  <FileText size={16} className="booking-input-icon" style={{ top: '18px' }} />
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Dietary requirements, room views, massage preferences, etc."
                    rows="3"
                    className="booking-input booking-input-with-icon"
                    style={{ resize: 'none', minHeight: '100px', padding: '0.9rem 1.2rem 0.9rem 2.8rem' }}
                  />
                </div>
              </div>

              {errorMsg && (
                <div style={{ color: '#ff6b6b', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center', margin: '0.2rem 0' }}>
                  <AlertTriangle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  className="btn-gold" 
                  style={{ 
                    flex: 1, 
                    padding: '0.9rem 0', 
                    fontSize: '0.85rem', 
                    fontWeight: '600' 
                  }} 
                  onClick={prevStep} 
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="btn-gold-solid" 
                  style={{ 
                    flex: 2, 
                    padding: '0.9rem 0', 
                    fontSize: '0.85rem', 
                    fontWeight: '700',
                    letterSpacing: '0.15em'
                  }} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Request Reservation'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {step === 3 && successInfo && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ 
              display: 'inline-flex', 
              background: 'rgba(212, 175, 55, 0.1)', 
              padding: '1.8rem', 
              borderRadius: '50%', 
              color: 'var(--color-gold)', 
              marginBottom: '2rem',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.15)'
            }}>
              <CheckCircle size={64} className="animate-float" />
            </div>
            
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', marginBottom: '0.8rem', color: '#fff' }}>
              Request <span className="text-gold-gradient" style={{ fontStyle: 'italic' }}>Received</span>
            </h3>
            
            <p style={{ maxWidth: '420px', margin: '0 auto 2rem auto', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Thank you, {formData.guestName}. Your reservation request for <strong>{formData.roomOrPackageName}</strong> has been logged in our reservation desk.
            </p>

            <div 
              style={{ 
                padding: '1.5rem', 
                fontSize: '0.88rem', 
                color: 'rgba(255, 255, 255, 0.7)', 
                maxWidth: '440px', 
                margin: '0 auto 2.5rem auto',
                border: '1px dashed rgba(212, 175, 55, 0.35)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.01)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div><strong>Reservation ID:</strong> <span style={{ color: 'var(--color-gold-light)', fontFamily: 'monospace' }}>{successInfo.bookingId}</span></div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-gold)', borderTop: '1px solid rgba(212, 175, 55, 0.15)', paddingTop: '0.5rem' }}>
                Our guest services desk will contact you via email shortly to finalize your custom preferences.
              </div>
            </div>

            <button 
              className="btn-gold-solid" 
              style={{ minWidth: '220px', padding: '0.9rem 2rem', fontSize: '0.85rem' }} 
              onClick={onClose}
            >
              Back to Sanctuary
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
