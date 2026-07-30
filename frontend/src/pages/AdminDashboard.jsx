import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, Star, RefreshCw, Database, ArrowLeft, X 
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// Reusable Image Selection & Upload widget for Page Editing
function PageImageSelector({ label, value, onChange, rawImages, API_BASE, isLive }) {
  const [source, setSource] = useState('select'); // select, upload, custom
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (value) {
      if (value.startsWith('/raw-images/')) {
        setSource('select');
      } else if (value.startsWith('data:image/') || value.includes('uploaded_')) {
        setSource('upload');
      } else {
        setSource('custom');
      }
    }
  }, [value]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const res = await fetch(`${API_BASE}/upload-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, base64Data: reader.result })
        });
        if (res.ok) {
          const data = await res.json();
          onChange(data.imageUrl);
        } else {
          alert("Server upload failed, saving to local sandbox.");
          onChange(reader.result);
        }
      } catch (err) {
        onChange(reader.result);
      } finally {
        setUploading(false);
      }
    };
  };

  return (
    <div style={{ marginBottom: '1.2rem' }}>
      <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>{label}</label>
      <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.5rem', maxWidth: '400px' }}>
        {['select', 'upload', 'custom'].map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setSource(t)}
            style={{
              flex: 1, padding: '0.4rem', fontSize: '0.7rem', fontWeight: '600', cursor: 'pointer', border: 'none',
              backgroundColor: source === t ? '#d4af37' : '#1a1917',
              color: source === t ? '#000' : 'rgba(255,255,255,0.6)',
              outline: 'none'
            }}
          >
            {t === 'select' ? 'Camera Roll' : t === 'upload' ? 'Upload Local' : 'Custom URL'}
          </button>
        ))}
      </div>
      {source === 'select' && (
        <select
          value={value.startsWith('/raw-images/') ? value.replace('/raw-images/', '') : ''}
          onChange={(e) => onChange(e.target.value ? `/raw-images/${e.target.value}` : '')}
          style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
        >
          <option value="">-- Choose Camera Photo --</option>
          {rawImages.map(img => (
            <option key={img} value={img}>{img}</option>
          ))}
        </select>
      )}
      {source === 'upload' && (
        <div style={{ border: '2px dashed rgba(212,175,55,0.3)', borderRadius: '8px', padding: '1rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', position: 'relative', cursor: 'pointer' }}>
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
          {uploading ? <span style={{ color: '#d4af37', fontSize: '0.8rem' }}>Uploading...</span> : <span style={{ color: '#bcbbba', fontSize: '0.8rem' }}>Click or drop to upload local image</span>}
        </div>
      )}
      {source === 'custom' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/... or http://..."
          style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
        />
      )}
      {value && (
        <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all' }}>
          <span style={{ color: '#d4af37', fontWeight: '600' }}>Selected Image:</span> {value}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard({ onGoBack, pageContent, onRefreshPageContent }) {
  const [activeTab, setActiveTab] = useState('stay'); // stay, dayout, dining, reviews, pages
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rawImages, setRawImages] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Image source picker toggle: 'select', 'upload', 'custom'
  const [imageSource, setImageSource] = useState('select');
  const [uploading, setUploading] = useState(false);

  // Page copy sub-tabs and forms
  const [activePageTab, setActivePageTab] = useState('home');
  const [pageForm, setPageForm] = useState({});

  useEffect(() => {
    if (pageContent) {
      setPageForm(pageContent);
    }
  }, [pageContent]);

  // Modal forms states
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomForm, setRoomForm] = useState({
    id: null,
    name: '',
    type: 'STAY',
    description: '',
    price: '',
    capacity: '2',
    amenities: '',
    imageUrl: ''
  });

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    id: null,
    quote: '',
    author: '',
    role: '',
    rating: 5,
    source: 'Google',
    date: ''
  });

  // Fetch all site details
  const fetchAllData = async () => {
    setLoading(true);
    let liveSuccess = false;
    
    // 1. Fetch Rooms/Accommodations
    try {
      const res = await fetch(`${API_BASE}/rooms`);
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
        liveSuccess = true;
      }
    } catch (err) {
      console.warn("Backend /rooms offline, loading local sandbox rooms.");
    }

    // 2. Fetch Reviews
    try {
      const reviewsRes = await fetch(`${API_BASE}/reviews`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
        liveSuccess = true;
      }
    } catch (err) {
      console.warn("Backend /reviews offline, loading local sandbox reviews.");
    }

    // 3. Fetch Raw Images List
    try {
      const imagesRes = await fetch(`${API_BASE}/raw-images-list`);
      if (imagesRes.ok) {
        const imagesData = await imagesRes.json();
        setRawImages(imagesData);
      }
    } catch (err) {
      console.warn("Raw images scanner offline.");
    }

    setIsLive(liveSuccess);

    // Sandbox fallbacks if MySQL backend is offline
    if (!liveSuccess) {
      const SANDBOX_VERSION = 'v3'; // bump this to force-refresh all browsers
      const cachedVersion = localStorage.getItem('golden_sky_sandbox_version');
      if (cachedVersion !== SANDBOX_VERSION) {
        // Clear stale old data so real seed is applied
        localStorage.removeItem('golden_sky_rooms');
        localStorage.removeItem('golden_sky_reviews');
        localStorage.setItem('golden_sky_sandbox_version', SANDBOX_VERSION);
      }
      // Accommodations fallback
      const savedRooms = localStorage.getItem('golden_sky_rooms');
      if (savedRooms) {
        setRooms(JSON.parse(savedRooms));
      } else {
        const mockRooms = [
          // ── STAY ──────────────────────────────────────────────────────
          { id: "db4df70c-87ee-448b-ae2c-1a4526f65e76", name: "Standard Room 01", type: "STAY", description: "A quiet mountain retreat with views of the Hanthana range. Features a private jacuzzi, organic Ceylon tea bar, and a scenic mountainside balcony.", price: 10000, capacity: 2, amenities: "Mountain View, Jacuzzi, Private balcony, Tea Bar, Wi-Fi, King Bed", imageUrl: "/images/20260418_064528_1.jpg" },
          { id: "a8d23557-b8c3-43cc-9f9c-5897d4293152", name: "Standard Room 02", type: "STAY", description: "A dedicated wellness suite for rejuvenation. Features custom aromatherapy, a private soaking tub, and spaces for yoga and stretching.", price: 10000, capacity: 2, amenities: "Mountain View, Soaking Tub, Aroma Diffuser, Organic Bedding, Yoga Mat, Balcony, Wi-Fi", imageUrl: "/images/20260418_102057_1.jpg" },
          { id: "9269dd02-9b02-42b8-9086-d966b7c7b58d", name: "Standard Room 03", type: "STAY", description: "A cozy cabin nestled in the pine woods, featuring a stone fireplace, open-sky rain shower, and a private patio.", price: 10000, capacity: 2, amenities: "Mountain View, Pine Forest View, Outdoor Shower, Fireplace, King Bed, Private Patio, Wi-Fi", imageUrl: "/images/20260418_063038_1.jpg" },
          { id: "74dd411a-7006-4825-a3bf-73b67bda24bf", name: "Standard Room 05", type: "STAY", description: "A peaceful soundproof studio space complete with premium aromatherapy and organic cotton yoga mats.", price: 10000, capacity: 2, amenities: "Mountain View, Yoga Studio, Soundproof walls, Yoga mats, Organic tea bar, Wi-Fi", imageUrl: "/images/20260418_111748_1.jpg" },
          { id: "3fbcf0b2-1640-45c6-9e43-0f9e2ef7bf3c", name: "Deluxe Double Room 01", type: "STAY", description: "A unique water villa suspended over a spring lotus pond. Features glass floor view panels and private sun decks.", price: 12000, capacity: 2, amenities: "City View, Glass Bottom, Spring Pond View, King Bed, Sun loungers, Coffee Machine, Organic toiletries", imageUrl: "/images/20260418_112608_1.jpg" },
          { id: "6a4a0fb8-79ce-4e30-a3ab-0ad8e64fcd94", name: "Deluxe Double Room 02", type: "STAY", description: "A beautiful east-facing suite designed to catch the Kandy sunrise. Equipped with telescopes and private viewing decks.", price: 12000, capacity: 2, amenities: "City View, Sunrise View, Telescope, Outdoor Tea Deck, King Bed, Wi-Fi", imageUrl: "/images/20260418_072549_1.jpg" },
          { id: "99922d87-a27c-46eb-bbb6-39a64bb8d689", name: "Deluxe Triple Room 01", type: "STAY", description: "A private standalone villa with glass walls overlooking the sunset. Features a private butler and an outdoor infinity deck.", price: 14000, capacity: 3, amenities: "Mountain View, Glass Walls, Mini Bar, Private Butler, Sun Deck, Air Conditioning", imageUrl: "/images/20260418_072549_1.jpg" },
          { id: "fba25d2a-3475-4866-8f2d-0573f9437892", name: "Deluxe Triple Room 02", type: "STAY", description: "A spacious 2-bedroom mountainside estate with a private heated hot tub, fireplace lounge, and personal butler.", price: 14000, capacity: 3, amenities: "Mountain View, 2 Bedrooms, Private Butler, Luxury Hot Tub, Full Kitchen, Private Terrace, Cardamom tea bar", imageUrl: "/images/20260418_113827_1.jpg" },
          { id: "c2797bd9-813a-405c-97c8-f546c9628d41", name: "Deluxe Triple Room 03", type: "STAY", description: "A quiet chalet surrounded by wild cardamom fields, featuring a wood-fired hot tub and scenic valley views.", price: 14000, capacity: 3, amenities: "Mountain View, Aromatherapy room, Cardamom fields view, King Bed, Fireplace, Rainshower, Organic bedding", imageUrl: "/images/20260418_062826_1.jpg" },
          { id: "e8e3628d-3884-4373-9347-d699dcebf678", name: "Deluxe Family Suite", type: "STAY", description: "Our signature Haritha family suite featuring a private stargazing deck, a glass floor, and a dedicated butler team.", price: 17000, capacity: 3, amenities: "City View, Glass Floor, Private Stargazing Deck, Panoramic View, 24/7 Butler, Wine Cellar, Airport Transfer", imageUrl: "/images/20260418_114222_1.jpg" },
          // ── DAYOUT ────────────────────────────────────────────────────
          { id: "5b97f3a2-3d1e-4c2a-a1f0-8e9b7c6d5e4f", name: "Hanthana Escape Dayout", type: "DAYOUT", description: "Our classic dayout package designed to offer a peaceful mountain escape with gourmet dining.", price: 6500, capacity: 6, amenities: "Welcome drink, Guided nature trail, Buffet lunch, Infinity pool access", imageUrl: "/images/dining_dayout.jpg" },
          { id: "756c071c-4b33-456d-bdf9-d21023be5ae7", name: "Golden Wellness Dayout", type: "DAYOUT", description: "A wellness day package combining healthy lunches, herbal steam baths, and priority spa lounge access.", price: 12500, capacity: 6, amenities: "Detox elixir, 3-course spa lunch, Steam bath (30 min), Yoga lawn, 15% Spa discount", imageUrl: "/images/dining_wellness.jpg" },
          { id: "6fc5f879-8771-4dcc-88cb-68a68c8b2199", name: "Royal Heritage Dayout", type: "DAYOUT", description: "An active day package including a guided mountain trek, tea factory tour, and traditional high tea.", price: 9500, capacity: 8, amenities: "Guided mountain trek, Tea factory visit, Historic high tea, Buffet Lunch", imageUrl: "/images/dining_heritage.jpg" },
          // ── DINING ────────────────────────────────────────────────────
          { id: "4c2e1f8b-5a9d-4e3c-b7f2-9d6c8e1a0f5b", name: "Curated 5-Course Dinner", type: "DINING", description: "A fine-dining gastronomic tour showcasing Kandyan heritage spices, fresh mountain greens, and organic harvests.", price: 9500, capacity: 4, amenities: "5 Courses, Welcome mocktail, Live classical music, Valet parking", imageUrl: "/images/dining_dinner.jpg" },
          { id: "a5952d89-eff0-491d-95bc-ceb23d37575e", name: "Hanthana Sunset High Tea", type: "DINING", description: "A selection of sweet and savory pastries served alongside single-estate organic tea.", price: 4500, capacity: 2, amenities: "Sweet & savory platters, Organic Hanthana tea, Valley sunset, Live flute music", imageUrl: "/images/dining_hightea.jpg" },
          { id: "d0725a93-de01-483e-807b-5e2b77cd14ee", name: "Aura Rooftop Fire-pit Dining", type: "DINING", description: "A private starlit dining experience around copper fire pits with custom mixology pairings.", price: 15000, capacity: 4, amenities: "Private fire-pit table, Mixology pairings, Private chef service, Starlit skies", imageUrl: "/images/dining_rooftop.jpg" }
        ];
        localStorage.setItem('golden_sky_rooms', JSON.stringify(mockRooms));
        setRooms(mockRooms);
      }

      // Reviews fallback
      const savedReviews = localStorage.getItem('golden_sky_reviews');
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      } else {
        const mockReviews = [
          { id: "rev-1", quote: "The room is spacious, clean, and incredibly comfortable. The views of the Hanthana area are out of this world! I would absolutely stay here again.", author: "Sophia K.", role: "Verified Guest via Booking.com", rating: 5, source: "Booking.com", date: "July 2026" },
          { id: "rev-2", quote: "The hosts are lovely, kind, and welcoming, making us feel like family. We had an unexpectedly beautiful time and wish we could have stayed longer.", author: "Thomas D.", role: "Verified Guest via Booking.com", rating: 5, source: "Booking.com", date: "July 2026" },
          { id: "rev-3", quote: "The service is outstanding with staff going above and beyond. The rooms are well-appointed, the breakfast is exceptional, and the rooftop offers a gorgeous panoramic view of Kandy.", author: "Elena M.", role: "Verified Guest via Google Reviews", rating: 5, source: "Google", date: "July 2026" },
          { id: "rev-4", quote: "The service was outstanding, with staff going above and beyond to ensure a pleasant experience. Kumia is a lovely, kind, welcoming host who made us feel like family.", author: "Oliver B.", role: "Verified Guest via Booking.com", rating: 5, source: "Booking.com", date: "July 2026" },
          { id: "rev-5", quote: "The rooms were incredibly comfortable, clean, spacious, and filled with natural light. The breakfast was exceptional and the views of the Hanthana area were beautiful and peaceful.", author: "Amara P.", role: "Verified Guest via Google Reviews", rating: 5, source: "Google", date: "July 2026" },
          { id: "rev-6", quote: "A hidden gem in Kandy! High-quality rooms with amazing views. The staff was extremely polite and prepared local breakfast specialties that were delicious.", author: "Ruwan F.", role: "Verified Guest via Google Reviews", rating: 5, source: "Google", date: "June 2026" },
          { id: "rev-7", quote: "The rooftop is open to guests and gives a spectacular panoramic view of Kandy. Excellent rooms, high-strength structural glass balconies, and the most peaceful environment.", author: "Charlotte W.", role: "Verified Guest via Booking.com", rating: 5, source: "Booking.com", date: "June 2026" },
          { id: "rev-8", quote: "Outstanding hospitality! The owners accommodated all our requests and took care of us like family. Very clean, modern rooms, and a wonderful location.", author: "Daniel H.", role: "Verified Guest via Booking.com", rating: 5, source: "Booking.com", date: "June 2026" }
        ];
        localStorage.setItem('golden_sky_reviews', JSON.stringify(mockReviews));
        setReviews(mockReviews);
      }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // -------------------------------------------------------------
  // CRUD FOR ROOMS / PACKAGES (STAY, DAYOUT, DINING)
  // -------------------------------------------------------------
  const handleOpenRoomForm = (room = null, defaultType = 'STAY') => {
    if (room) {
      setRoomForm({
        id: room.id,
        name: room.name,
        type: room.type,
        description: room.description,
        price: room.price.toString(),
        capacity: room.capacity.toString(),
        amenities: room.amenities,
        imageUrl: room.imageUrl
      });
      // Smart guess the active image source tab
      if (room.imageUrl.startsWith('/raw-images/')) {
        setImageSource('select');
      } else if (room.imageUrl.startsWith('data:image/') || room.imageUrl.includes('uploaded_')) {
        setImageSource('upload');
      } else {
        setImageSource('custom');
      }
    } else {
      setRoomForm({
        id: null,
        name: '',
        type: defaultType,
        description: '',
        price: '',
        capacity: defaultType === 'STAY' ? '2' : '1',
        amenities: '',
        imageUrl: ''
      });
      setImageSource('select');
    }
    setShowRoomModal(true);
  };

  // Image Upload Logic (Device -> Base64 -> Node backend filesystem)
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const res = await fetch(`${API_BASE}/upload-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            base64Data: reader.result
          })
        });

        if (res.ok) {
          const data = await res.json();
          setRoomForm(prev => ({ ...prev, imageUrl: data.imageUrl }));
          
          // Refresh list of camera photos
          const imagesRes = await fetch(`${API_BASE}/raw-images-list`);
          if (imagesRes.ok) {
            const imagesData = await imagesRes.json();
            setRawImages(imagesData);
          }
        } else {
          alert("Upload failed. Saving to browser memory sandbox instead.");
          setRoomForm(prev => ({ ...prev, imageUrl: reader.result }));
        }
      } catch (err) {
        console.warn("Express server unavailable. Saving image base64 locally.");
        setRoomForm(prev => ({ ...prev, imageUrl: reader.result }));
      } finally {
        setUploading(false);
      }
    };
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    const payload = {
      name: roomForm.name,
      type: roomForm.type,
      description: roomForm.description,
      price: parseFloat(roomForm.price) || 0,
      capacity: parseInt(roomForm.capacity) || 1,
      amenities: roomForm.amenities,
      imageUrl: roomForm.imageUrl
    };

    if (roomForm.id) {
      // Edit mode
      if (isLive) {
        try {
          const res = await fetch(`${API_BASE}/rooms/${roomForm.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) fetchAllData();
        } catch (e) {
          alert("Error updating details.");
        }
      } else {
        const localRooms = JSON.parse(localStorage.getItem('golden_sky_rooms') || '[]');
        const idx = localRooms.findIndex(r => r.id === roomForm.id);
        if (idx !== -1) {
          localRooms[idx] = { ...localRooms[idx], ...payload };
          localStorage.setItem('golden_sky_rooms', JSON.stringify(localRooms));
          setRooms(localRooms);
        }
      }
    } else {
      // Add mode
      if (isLive) {
        try {
          const res = await fetch(`${API_BASE}/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) fetchAllData();
        } catch (e) {
          alert("Error creating details.");
        }
      } else {
        const localRooms = JSON.parse(localStorage.getItem('golden_sky_rooms') || '[]');
        const newRoom = { id: `r-${Date.now()}`, ...payload };
        localRooms.push(newRoom);
        localStorage.setItem('golden_sky_rooms', JSON.stringify(localRooms));
        setRooms(localRooms);
      }
    }

    setShowRoomModal(false);
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this website item?")) return;

    if (isLive) {
      try {
        const res = await fetch(`${API_BASE}/slate-rooms/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) fetchAllData();
      } catch (e) {
        // Retry with main routes
        try {
          const res2 = await fetch(`${API_BASE}/rooms/${id}`, {
            method: 'DELETE'
          });
          if (res2.ok) fetchAllData();
        } catch (err) {
          alert("Error deleting item.");
        }
      }
    } else {
      const localRooms = JSON.parse(localStorage.getItem('golden_sky_rooms') || '[]');
      const filtered = localRooms.filter(r => r.id !== id);
      localStorage.setItem('golden_sky_rooms', JSON.stringify(filtered));
      setRooms(filtered);
    }
  };

  // -------------------------------------------------------------
  // CRUD FOR GUEST REVIEWS
  // -------------------------------------------------------------
  const handleOpenReviewForm = (review = null) => {
    if (review) {
      setReviewForm({
        id: review.id,
        quote: review.quote,
        author: review.author,
        role: review.role,
        rating: review.rating || 5,
        source: review.source || 'Google',
        date: review.date
      });
    } else {
      setReviewForm({
        id: null,
        quote: '',
        author: '',
        role: '',
        rating: 5,
        source: 'Google',
        date: ''
      });
    }
    setShowReviewModal(true);
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    const payload = {
      quote: reviewForm.quote,
      author: reviewForm.author,
      role: reviewForm.role,
      rating: parseInt(reviewForm.rating) || 5,
      source: reviewForm.source,
      date: reviewForm.date
    };

    if (reviewForm.id) {
      // Edit
      if (isLive) {
        try {
          const res = await fetch(`${API_BASE}/reviews/${reviewForm.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) fetchAllData();
        } catch (e) {
          alert("Error saving review.");
        }
      } else {
        const localReviews = JSON.parse(localStorage.getItem('golden_sky_reviews') || '[]');
        const idx = localReviews.findIndex(r => r.id === reviewForm.id);
        if (idx !== -1) {
          localReviews[idx] = { ...localReviews[idx], ...payload };
          localStorage.setItem('golden_sky_reviews', JSON.stringify(localReviews));
          setReviews(localReviews);
        }
      }
    } else {
      // Add
      if (isLive) {
        try {
          const res = await fetch(`${API_BASE}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) fetchAllData();
        } catch (e) {
          alert("Error creating review.");
        }
      } else {
        const localReviews = JSON.parse(localStorage.getItem('golden_sky_reviews') || '[]');
        const newReview = { id: `rev-${Date.now()}`, ...payload };
        localReviews.unshift(newReview);
        localStorage.setItem('golden_sky_reviews', JSON.stringify(localReviews));
        setReviews(localReviews);
      }
    }
    setShowReviewModal(false);
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this guest review?")) return;

    if (isLive) {
      try {
        const res = await fetch(`${API_BASE}/reviews/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) fetchAllData();
      } catch (e) {
        alert("Error deleting review.");
      }
    } else {
      const localReviews = JSON.parse(localStorage.getItem('golden_sky_reviews') || '[]');
      const filtered = localReviews.filter(r => r.id !== id);
      localStorage.setItem('golden_sky_reviews', JSON.stringify(filtered));
      setReviews(filtered);
    }
  };

  // -------------------------------------------------------------
  // SAVE PAGE COPY CONTENT
  // -------------------------------------------------------------
  const handleSavePageContent = async (e) => {
    e.preventDefault();
    if (isLive) {
      try {
        const res = await fetch(`${API_BASE}/page-content`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pageForm)
        });
        if (res.ok) {
          alert("Website page content updated successfully on the live server!");
          onRefreshPageContent();
        }
      } catch (err) {
        alert("Error saving page content updates.");
      }
    } else {
      localStorage.setItem('gs_page_content_sandbox', JSON.stringify(pageForm));
      alert("Website page content saved to local sandbox memory!");
      onRefreshPageContent();
    }
  };

  return (
    <div className="page-transition" style={{ 
      backgroundColor: '#0c0b0a', 
      minHeight: '100vh', 
      padding: '110px 1.5rem 5rem 1.5rem', 
      color: '#ffffff', 
      textAlign: 'left',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header Block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <button 
              onClick={onGoBack} 
              style={{
                background: 'none', border: 'none', color: '#d4af37', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', 
                fontSize: '0.8rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.6rem', padding: 0,
                fontWeight: '600', transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#fff'}
              onMouseLeave={(e) => e.target.style.color = '#d4af37'}
            >
              <ArrowLeft size={14} />
              <span>Back to Live Website</span>
            </button>
            <h1 style={{ fontSize: '2.2rem', margin: 0, fontWeight: '700', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Website Content <span style={{ color: '#d4af37', fontStyle: 'italic', fontWeight: '400' }}>Manager</span>
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div 
              style={{ 
                padding: '0.6rem 1.2rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem', 
                backgroundColor: '#161513', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '30px'
              }}
            >
              <Database size={14} style={{ color: isLive ? '#2ed573' : '#d4af37' }} />
              <span style={{ fontWeight: '500' }}>
                Mode: {isLive ? <strong style={{ color: '#2ed573' }}>Live Server (Active)</strong> : <strong style={{ color: '#d4af37' }}>Local Sandbox</strong>}
              </span>
            </div>

            <button 
              style={{ 
                backgroundColor: '#161513', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', 
                padding: '0.6rem 0.9rem', borderRadius: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
              }} 
              onClick={fetchAllData} 
              title="Refresh Website Data"
            >
              <RefreshCw size={14} />
              <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Sync</span>
            </button>
          </div>
        </div>

        {/* LOADING INDICATOR */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', gap: '1.2rem', color: '#d4af37' }}>
            <RefreshCw size={36} className="animate-spin" />
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '600' }}>Syncing website details...</span>
          </div>
        ) : (
          <>
            {/* TABS CONTAINER */}
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
              {[
                { id: 'stay', label: 'Accommodations (STAY)' },
                { id: 'dayout', label: 'Day-outs (DAYOUT)' },
                { id: 'dining', label: 'Dining (DINING)' },
                { id: 'reviews', label: 'Guest Reviews' },
                { id: 'pages', label: 'Page Copy Editor' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: 'none', border: 'none', color: activeTab === tab.id ? '#d4af37' : 'rgba(255,255,255,0.6)',
                    padding: '0.8rem 1.5rem', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', 
                    borderBottom: activeTab === tab.id ? '2px solid #d4af37' : '2px solid transparent',
                    whiteSpace: 'nowrap', transition: 'all 0.2s ease', outline: 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS (STAY / DAYOUT / DINING / REVIEWS / PAGES) */}
            
            {/* ACCOMMODATIONS (STAY) */}
            {activeTab === 'stay' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#fff' }}>
                    Chambers & Suites
                  </h3>
                  <button 
                    style={{ 
                      backgroundColor: '#d4af37', border: 'none', color: '#000', padding: '0.6rem 1.2rem', 
                      borderRadius: '30px', fontWeight: '600', fontSize: '0.8rem', display: 'flex', alignItems: 'center', 
                      gap: '0.4rem', cursor: 'pointer', transition: 'opacity 0.2s' 
                    }} 
                    onClick={() => handleOpenRoomForm(null, 'STAY')}
                    onMouseEnter={(e) => e.target.style.opacity = 0.9}
                    onMouseLeave={(e) => e.target.style.opacity = 1}
                  >
                    <Plus size={14} />
                    <span>Add New Suite</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.8rem' }}>
                  {rooms.filter(r => r.type === 'STAY').map(room => (
                    <div key={room.id} style={{ 
                      backgroundColor: '#141311', border: '1px solid rgba(255,255,255,0.06)', 
                      borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' 
                    }}>
                      <div style={{ height: '190px', position: 'relative', overflow: 'hidden' }}>
                        <img 
                          src={room.imageUrl.startsWith('/raw-images/') ? `${API_BASE.replace('/api', '')}${room.imageUrl}` : room.imageUrl} 
                          alt={room.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.85)', padding: '0.4rem 0.8rem', borderRadius: '30px', border: '1px solid #d4af37', fontSize: '0.8rem', color: '#d4af37', fontWeight: '700' }}>
                          LKR {room.price.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 0.4rem 0', color: '#ffffff' }}>{room.name}</h4>
                        <div style={{ fontSize: '0.75rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem', fontWeight: '700' }}>
                          Capacity: {room.capacity} Guests
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#bcbbba', lineHeight: '1.6', margin: '0 0 1.2rem 0', flex: 1 }}>
                          {room.description}
                        </p>
                        <div style={{ fontSize: '0.8rem', color: '#bcbbba', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.8rem', marginBottom: '1.2rem' }}>
                          <strong style={{ color: '#fff' }}>Amenities:</strong> {room.amenities}
                        </div>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                          <button 
                            style={{ 
                              flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', 
                              fontSize: '0.8rem', fontWeight: '600', backgroundColor: '#1a1816', border: '1px solid rgba(255,255,255,0.15)', 
                              color: '#fff', borderRadius: '8px', cursor: 'pointer' 
                            }} 
                            onClick={() => handleOpenRoomForm(room)}
                          >
                            <Edit2 size={12} />
                            <span>Edit Suite</span>
                          </button>
                          <button 
                            style={{ 
                              flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', 
                              fontSize: '0.8rem', fontWeight: '600', backgroundColor: 'transparent', border: '1px solid rgba(255,71,87,0.3)', 
                              color: '#ff4757', borderRadius: '8px', cursor: 'pointer' 
                            }} 
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DAY-OUTS (DAYOUT) */}
            {activeTab === 'dayout' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#fff' }}>
                    Day-out Packages
                  </h3>
                  <button 
                    style={{ 
                      backgroundColor: '#d4af37', border: 'none', color: '#000', padding: '0.6rem 1.2rem', 
                      borderRadius: '30px', fontWeight: '600', fontSize: '0.8rem', display: 'flex', alignItems: 'center', 
                      gap: '0.4rem', cursor: 'pointer', transition: 'opacity 0.2s' 
                    }} 
                    onClick={() => handleOpenRoomForm(null, 'DAYOUT')}
                    onMouseEnter={(e) => e.target.style.opacity = 0.9}
                    onMouseLeave={(e) => e.target.style.opacity = 1}
                  >
                    <Plus size={14} />
                    <span>Add Package</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.8rem' }}>
                  {rooms.filter(r => r.type === 'DAYOUT').map(room => (
                    <div key={room.id} style={{ 
                      backgroundColor: '#141311', border: '1px solid rgba(255,255,255,0.06)', 
                      borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' 
                    }}>
                      <div style={{ height: '190px', position: 'relative', overflow: 'hidden' }}>
                        <img 
                          src={room.imageUrl.startsWith('/raw-images/') ? `${API_BASE.replace('/api', '')}${room.imageUrl}` : room.imageUrl} 
                          alt={room.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.85)', padding: '0.4rem 0.8rem', borderRadius: '30px', border: '1px solid #d4af37', fontSize: '0.8rem', color: '#d4af37', fontWeight: '700' }}>
                          LKR {room.price.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 0.4rem 0', color: '#ffffff' }}>{room.name}</h4>
                        <p style={{ fontSize: '0.88rem', color: '#bcbbba', lineHeight: '1.6', margin: '0 0 1.2rem 0', flex: 1 }}>
                          {room.description}
                        </p>
                        <div style={{ fontSize: '0.8rem', color: '#bcbbba', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.8rem', marginBottom: '1.2rem' }}>
                          <strong style={{ color: '#fff' }}>Highlights:</strong> {room.amenities}
                        </div>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                          <button 
                            style={{ 
                              flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', 
                              fontSize: '0.8rem', fontWeight: '600', backgroundColor: '#1a1816', border: '1px solid rgba(255,255,255,0.15)', 
                              color: '#fff', borderRadius: '8px', cursor: 'pointer' 
                            }} 
                            onClick={() => handleOpenRoomForm(room)}
                          >
                            <Edit2 size={12} />
                            <span>Edit Package</span>
                          </button>
                          <button 
                            style={{ 
                              flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', 
                              fontSize: '0.8rem', fontWeight: '600', backgroundColor: 'transparent', border: '1px solid rgba(255,71,87,0.3)', 
                              color: '#ff4757', borderRadius: '8px', cursor: 'pointer' 
                            }} 
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DINING (DINING) */}
            {activeTab === 'dining' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#fff' }}>
                    Dining Options
                  </h3>
                  <button 
                    style={{ 
                      backgroundColor: '#d4af37', border: 'none', color: '#000', padding: '0.6rem 1.2rem', 
                      borderRadius: '30px', fontWeight: '600', fontSize: '0.8rem', display: 'flex', alignItems: 'center', 
                      gap: '0.4rem', cursor: 'pointer', transition: 'opacity 0.2s' 
                    }} 
                    onClick={() => handleOpenRoomForm(null, 'DINING')}
                    onMouseEnter={(e) => e.target.style.opacity = 0.9}
                    onMouseLeave={(e) => e.target.style.opacity = 1}
                  >
                    <Plus size={14} />
                    <span>Add Dining Option</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.8rem' }}>
                  {rooms.filter(r => r.type === 'DINING').map(room => (
                    <div key={room.id} style={{ 
                      backgroundColor: '#141311', border: '1px solid rgba(255,255,255,0.06)', 
                      borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' 
                    }}>
                      <div style={{ height: '190px', position: 'relative', overflow: 'hidden' }}>
                        <img 
                          src={room.imageUrl.startsWith('/raw-images/') ? `${API_BASE.replace('/api', '')}${room.imageUrl}` : room.imageUrl} 
                          alt={room.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.85)', padding: '0.4rem 0.8rem', borderRadius: '30px', border: '1px solid #d4af37', fontSize: '0.8rem', color: '#d4af37', fontWeight: '700' }}>
                          LKR {room.price.toLocaleString()}
                        </div>
                      </div>
                      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 0.4rem 0', color: '#ffffff' }}>{room.name}</h4>
                        <p style={{ fontSize: '0.88rem', color: '#bcbbba', lineHeight: '1.6', margin: '0 0 1.2rem 0', flex: 1 }}>
                          {room.description}
                        </p>
                        <div style={{ fontSize: '0.8rem', color: '#bcbbba', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.8rem', marginBottom: '1.2rem' }}>
                          <strong style={{ color: '#fff' }}>Details:</strong> {room.amenities}
                        </div>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                          <button 
                            style={{ 
                              flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', 
                              fontSize: '0.8rem', fontWeight: '600', backgroundColor: '#1a1816', border: '1px solid rgba(255,255,255,0.15)', 
                              color: '#fff', borderRadius: '8px', cursor: 'pointer' 
                            }} 
                            onClick={() => handleOpenRoomForm(room)}
                          >
                            <Edit2 size={12} />
                            <span>Edit Dining</span>
                          </button>
                          <button 
                            style={{ 
                              flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', 
                              fontSize: '0.8rem', fontWeight: '600', backgroundColor: 'transparent', border: '1px solid rgba(255,71,87,0.3)', 
                              color: '#ff4757', borderRadius: '8px', cursor: 'pointer' 
                            }} 
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GUEST REVIEWS */}
            {activeTab === 'reviews' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#fff' }}>
                    Guest Testimonials & Reviews
                  </h3>
                  <button 
                    style={{ 
                      backgroundColor: '#d4af37', border: 'none', color: '#000', padding: '0.6rem 1.2rem', 
                      borderRadius: '30px', fontWeight: '600', fontSize: '0.8rem', display: 'flex', alignItems: 'center', 
                      gap: '0.4rem', cursor: 'pointer', transition: 'opacity 0.2s' 
                    }} 
                    onClick={() => handleOpenReviewForm()}
                    onMouseEnter={(e) => e.target.style.opacity = 0.9}
                    onMouseLeave={(e) => e.target.style.opacity = 1}
                  >
                    <Plus size={14} />
                    <span>Add Guest Review</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {reviews.map(rev => (
                    <div key={rev.id} style={{ 
                      padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', backgroundColor: '#141311', 
                      gap: '2rem', flexWrap: 'wrap' 
                    }}>
                      <div style={{ flex: 1, minWidth: '280px' }}>
                        <div style={{ display: 'flex', gap: '0.1rem', color: '#d4af37', marginBottom: '0.6rem' }}>
                          {Array(rev.rating || 5).fill(0).map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" />
                          ))}
                        </div>
                        <p style={{ fontStyle: 'italic', fontSize: '0.92rem', color: '#ffffff', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
                          “{rev.quote}”
                        </p>
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#fff' }}>{rev.author}</strong>
                          <span style={{ fontSize: '0.8rem', color: '#bcbbba', marginLeft: '0.5rem' }}>
                            ({rev.role} — {rev.date})
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button 
                          style={{ 
                            padding: '0.4rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', 
                            fontSize: '0.8rem', fontWeight: '600', backgroundColor: '#1a1816', border: '1px solid rgba(255,255,255,0.15)', 
                            color: '#fff', borderRadius: '8px', cursor: 'pointer' 
                          }} 
                          onClick={() => handleOpenReviewForm(rev)}
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>
                        <button 
                          style={{ 
                            padding: '0.4rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', 
                            fontSize: '0.8rem', fontWeight: '600', backgroundColor: 'transparent', border: '1px solid rgba(255,71,87,0.3)', 
                            color: '#ff4757', borderRadius: '8px', cursor: 'pointer' 
                          }} 
                          onClick={() => handleDeleteReview(rev.id)}
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAGE COPY EDITOR TAB */}
            {activeTab === 'pages' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, color: '#fff' }}>
                    Website Page Content Copy Editor
                  </h3>
                </div>

                {/* Sub tabs to choose which page copy to edit */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', backgroundColor: '#141311', padding: '0.4rem', borderRadius: '10px', display: 'inline-flex' }}>
                  {[
                    { id: 'home', label: 'Home Page' },
                    { id: 'about', label: 'About Page' },
                    { id: 'spa', label: 'Spa Gateway' },
                    { id: 'rooftop', label: 'Rooftop Bar' }
                  ].map(pTab => (
                    <button
                      key={pTab.id}
                      type="button"
                      onClick={() => setActivePageTab(pTab.id)}
                      style={{
                        padding: '0.5rem 1.2rem', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', border: 'none', borderRadius: '8px',
                        backgroundColor: activePageTab === pTab.id ? '#d4af37' : 'transparent',
                        color: activePageTab === pTab.id ? '#000' : 'rgba(255,255,255,0.7)',
                        transition: 'all 0.2s ease', outline: 'none'
                      }}
                    >
                      {pTab.label}
                    </button>
                  ))}
                </div>

                {/* EDIT FORM CONTAINER */}
                <form onSubmit={handleSavePageContent} style={{ 
                  backgroundColor: '#141311', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '2rem',
                  display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px'
                }}>
                  
                  {activePageTab === 'home' && (
                    <>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Hero Banner Title (Slide 1)</label>
                        <input 
                          type="text" 
                          required
                          value={pageForm.homeHeroTitle || ''}
                          onChange={(e) => setPageForm({ ...pageForm, homeHeroTitle: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Hero Banner Subtitle (Slide 1)</label>
                        <input 
                          type="text" 
                          required
                          value={pageForm.homeHeroSubtitle || ''}
                          onChange={(e) => setPageForm({ ...pageForm, homeHeroSubtitle: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                          }}
                        />
                      </div>
                      
                      <PageImageSelector 
                        label="Hero Background Image (Slide 1)" 
                        value={pageForm.homeHeroImage || ''} 
                        onChange={(val) => setPageForm({ ...pageForm, homeHeroImage: val })} 
                        rawImages={rawImages} 
                        API_BASE={API_BASE} 
                        isLive={isLive} 
                      />

                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Cinematic Greeting Welcome Title</label>
                        <input 
                          type="text" 
                          required
                          value={pageForm.homeWelcomeTitle || ''}
                          onChange={(e) => setPageForm({ ...pageForm, homeWelcomeTitle: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Cinematic Greeting Welcome Copy</label>
                        <textarea 
                          required
                          rows="4"
                          value={pageForm.homeWelcomeBody || ''}
                          onChange={(e) => setPageForm({ ...pageForm, homeWelcomeBody: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none', resize: 'vertical'
                          }}
                        />
                      </div>

                      <PageImageSelector 
                        label="Welcome Section Background Image" 
                        value={pageForm.homeWelcomeImage || ''} 
                        onChange={(val) => setPageForm({ ...pageForm, homeWelcomeImage: val })} 
                        rawImages={rawImages} 
                        API_BASE={API_BASE} 
                        isLive={isLive} 
                      />
                    </>
                  )}

                  {activePageTab === 'about' && (
                    <>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Hero Banner Title</label>
                        <input 
                          type="text" 
                          required
                          value={pageForm.aboutHeroTitle || ''}
                          onChange={(e) => setPageForm({ ...pageForm, aboutHeroTitle: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Hero Banner Description Subtitle</label>
                        <input 
                          type="text" 
                          required
                          value={pageForm.aboutHeroSubtitle || ''}
                          onChange={(e) => setPageForm({ ...pageForm, aboutHeroSubtitle: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                          }}
                        />
                      </div>

                      <PageImageSelector 
                        label="Hero Background Image" 
                        value={pageForm.aboutHeroImage || ''} 
                        onChange={(val) => setPageForm({ ...pageForm, aboutHeroImage: val })} 
                        rawImages={rawImages} 
                        API_BASE={API_BASE} 
                        isLive={isLive} 
                      />

                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Sanctuary Philosophy Story Narrative (Separate paragraphs with double newlines)</label>
                        <textarea 
                          required
                          rows="6"
                          value={pageForm.aboutStoryText || ''}
                          onChange={(e) => setPageForm({ ...pageForm, aboutStoryText: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none', resize: 'vertical'
                          }}
                        />
                      </div>

                      {/* Stats grid inputs */}
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                        <h4 style={{ color: '#d4af37', margin: '0 0 1rem 0', fontSize: '1rem' }}>Stats Cards Copy</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                          <div>
                            <label style={{ fontSize: '0.72rem', color: '#bcbbba', display: 'block', marginBottom: '0.3rem' }}>Heritage Card Value</label>
                            <input 
                              type="text" 
                              value={pageForm.aboutStatHeritageVal || ''}
                              onChange={(e) => setPageForm({ ...pageForm, aboutStatHeritageVal: e.target.value })}
                              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', backgroundColor: '#262421', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', color: '#bcbbba', display: 'block', marginBottom: '0.3rem' }}>Heritage Card Subtext</label>
                            <input 
                              type="text" 
                              value={pageForm.aboutStatHeritageDesc || ''}
                              onChange={(e) => setPageForm({ ...pageForm, aboutStatHeritageDesc: e.target.value })}
                              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', backgroundColor: '#262421', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                          <div>
                            <label style={{ fontSize: '0.72rem', color: '#bcbbba', display: 'block', marginBottom: '0.3rem' }}>Nature Card Value</label>
                            <input 
                              type="text" 
                              value={pageForm.aboutStatNatureVal || ''}
                              onChange={(e) => setPageForm({ ...pageForm, aboutStatNatureVal: e.target.value })}
                              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', backgroundColor: '#262421', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', color: '#bcbbba', display: 'block', marginBottom: '0.3rem' }}>Nature Card Subtext</label>
                            <input 
                              type="text" 
                              value={pageForm.aboutStatNatureDesc || ''}
                              onChange={(e) => setPageForm({ ...pageForm, aboutStatNatureDesc: e.target.value })}
                              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', backgroundColor: '#262421', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ fontSize: '0.72rem', color: '#bcbbba', display: 'block', marginBottom: '0.3rem' }}>Hosting Card Value</label>
                            <input 
                              type="text" 
                              value={pageForm.aboutStatWellnessVal || ''}
                              onChange={(e) => setPageForm({ ...pageForm, aboutStatWellnessVal: e.target.value })}
                              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', backgroundColor: '#262421', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', color: '#bcbbba', display: 'block', marginBottom: '0.3rem' }}>Hosting Card Subtext</label>
                            <input 
                              type="text" 
                              value={pageForm.aboutStatWellnessDesc || ''}
                              onChange={(e) => setPageForm({ ...pageForm, aboutStatWellnessDesc: e.target.value })}
                              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', backgroundColor: '#262421', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activePageTab === 'spa' && (
                    <>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Ayur Spa Gateway Title</label>
                        <input 
                          type="text" 
                          required
                          value={pageForm.spaGatewayTitle || ''}
                          onChange={(e) => setPageForm({ ...pageForm, spaGatewayTitle: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Ayur Spa Gateway Description Copy</label>
                        <textarea 
                          required
                          rows="4"
                          value={pageForm.spaGatewayDescription || ''}
                          onChange={(e) => setPageForm({ ...pageForm, spaGatewayDescription: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none', resize: 'vertical'
                          }}
                        />
                      </div>

                      <PageImageSelector 
                        label="Sanctuary Logo Medallion Image" 
                        value={pageForm.spaLogoImage || ''} 
                        onChange={(val) => setPageForm({ ...pageForm, spaLogoImage: val })} 
                        rawImages={rawImages} 
                        API_BASE={API_BASE} 
                        isLive={isLive} 
                      />

                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>WhatsApp Redirect URL Link</label>
                        <input 
                          type="text" 
                          required
                          value={pageForm.spaWhatsappLink || ''}
                          onChange={(e) => setPageForm({ ...pageForm, spaWhatsappLink: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>External Sanctuary Portal Website Link</label>
                        <input 
                          type="text" 
                          required
                          value={pageForm.spaExternalLink || ''}
                          onChange={(e) => setPageForm({ ...pageForm, spaExternalLink: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                          }}
                        />
                      </div>
                    </>
                  )}

                  {activePageTab === 'rooftop' && (
                    <>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Aura Lounge Hero Title</label>
                        <input 
                          type="text" 
                          required
                          value={pageForm.rooftopHeroTitle || ''}
                          onChange={(e) => setPageForm({ ...pageForm, rooftopHeroTitle: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Aura Lounge Hero Subtitle</label>
                        <input 
                          type="text" 
                          required
                          value={pageForm.rooftopHeroSubtitle || ''}
                          onChange={(e) => setPageForm({ ...pageForm, rooftopHeroSubtitle: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                          }}
                        />
                      </div>

                      <PageImageSelector 
                        label="Hero Background Image" 
                        value={pageForm.rooftopHeroImage || ''} 
                        onChange={(val) => setPageForm({ ...pageForm, rooftopHeroImage: val })} 
                        rawImages={rawImages} 
                        API_BASE={API_BASE} 
                        isLive={isLive} 
                      />

                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Description Copy</label>
                        <textarea 
                          required
                          rows="4"
                          value={pageForm.rooftopDescription || ''}
                          onChange={(e) => setPageForm({ ...pageForm, rooftopDescription: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none', resize: 'vertical'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Lounge Hours</label>
                        <input 
                          type="text" 
                          required
                          value={pageForm.rooftopTimings || ''}
                          onChange={(e) => setPageForm({ ...pageForm, rooftopTimings: e.target.value })}
                          style={{
                            width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                            backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                          }}
                        />
                      </div>

                      <PageImageSelector 
                        label="Lounge Intro Side Image" 
                        value={pageForm.rooftopIntroImage || ''} 
                        onChange={(val) => setPageForm({ ...pageForm, rooftopIntroImage: val })} 
                        rawImages={rawImages} 
                        API_BASE={API_BASE} 
                        isLive={isLive} 
                      />
                    </>
                  )}

                  <button 
                    type="submit" 
                    style={{ 
                      alignSelf: 'flex-start', padding: '0.8rem 2.5rem', backgroundColor: '#d4af37', border: 'none', 
                      color: '#000', borderRadius: '30px', fontWeight: '750', cursor: 'pointer', fontSize: '0.88rem' 
                    }}
                  >
                    Save Page Copy Changes
                  </button>
                </form>
              </div>
            )}

          </>
        )}

      </div>

      {/* =============================================================
          MODAL 1: ADD/EDIT ACCOMMODATION, DAYOUT, DINING FORM
          ============================================================= */}
      {showRoomModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          backgroundColor: 'rgba(10, 9, 8, 0.85)', backdropFilter: 'blur(8px)', zIndex: 99999, 
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '2rem 1rem'
        }}>
          <div style={{
            maxWidth: '560px', width: '100%', padding: '2rem', backgroundColor: '#161513', 
            border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            position: 'relative', margin: '2rem auto'
          }}>
            <button 
              onClick={() => setShowRoomModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#d4af37', margin: '0 0 1.5rem 0' }}>
              {roomForm.id ? 'Edit Content Details' : `Create New ${roomForm.type}`}
            </h3>

            <form onSubmit={handleSaveRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Category */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Category</label>
                  <select 
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                    disabled={!!roomForm.id}
                    style={{
                      width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                      backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                    }}
                  >
                    <option value="STAY">STAY (Chamber)</option>
                    <option value="DAYOUT">DAYOUT (Package)</option>
                    <option value="DINING">DINING (Gastronomy)</option>
                  </select>
                </div>

                {/* Title / Name */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Title / Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Cardamom Hill Chalet"
                    value={roomForm.name}
                    onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                    style={{
                      width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                      backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Price */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Price (LKR)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 45000"
                    value={roomForm.price}
                    onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })}
                    style={{
                      width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                      backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                    }}
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Capacity (Guests)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 2"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                    style={{
                      width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                      backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.75rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Description Copy</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Detail the package or room offering..."
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  style={{
                    width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                    backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              {/* Amenities / Features */}
              <div>
                <label style={{ fontSize: '0.75rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Amenities / Features (Comma separated list)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mountain View, King Bed, Jacuzzi, Free Wi-Fi"
                  value={roomForm.amenities}
                  onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                  style={{
                    width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                    backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                  }}
                />
              </div>

              {/* Background Photograph Picker */}
              <div>
                <label style={{ fontSize: '0.75rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem', fontWeight: '600', letterSpacing: '0.05em' }}>
                  Background Photograph
                </label>
                
                {/* Segmented Selector */}
                <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.8rem' }}>
                  {[
                    { id: 'select', label: 'Camera Roll' },
                    { id: 'upload', label: 'Upload Local File' },
                    { id: 'custom', label: 'Custom Path / URL' }
                  ].map(source => (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() => setImageSource(source.id)}
                      style={{
                        flex: 1, padding: '0.5rem', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', border: 'none',
                        backgroundColor: imageSource === source.id ? '#d4af37' : '#1a1917',
                        color: imageSource === source.id ? '#000' : 'rgba(255,255,255,0.6)',
                        transition: 'all 0.2s ease', outline: 'none'
                      }}
                    >
                      {source.label}
                    </button>
                  ))}
                </div>

                {/* Dropdown for Camera Roll */}
                {imageSource === 'select' && (
                  <div>
                    {rawImages.length > 0 ? (
                      <select 
                        value={roomForm.imageUrl.startsWith('/raw-images/') ? roomForm.imageUrl.replace('/raw-images/', '') : ''}
                        onChange={(e) => {
                          const file = e.target.value;
                          if (file) {
                            setRoomForm({ ...roomForm, imageUrl: `/raw-images/${file}` });
                          }
                        }}
                        style={{
                          width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                          backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                        }}
                      >
                        <option value="">-- Choose Camera Photo --</option>
                        {rawImages.map((img) => (
                          <option key={img} value={img}>{img}</option>
                        ))}
                      </select>
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', padding: '0.5rem 0' }}>Raw images folder offline. Please upload or type custom path.</div>
                    )}
                  </div>
                )}

                {/* Upload File Input */}
                {imageSource === 'upload' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{
                      border: '2px dashed rgba(212, 175, 55, 0.3)', borderRadius: '8px', padding: '1.2rem', textAlign: 'center',
                      backgroundColor: 'rgba(255,255,255,0.01)', position: 'relative', cursor: 'pointer'
                    }}>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleUploadImage}
                        disabled={uploading}
                        style={{
                          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer'
                        }}
                      />
                      {uploading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#d4af37', fontSize: '0.82rem' }}>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Uploading file to server...</span>
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: '#bcbbba' }}>
                          <span style={{ color: '#d4af37', fontWeight: '600' }}>Choose image file</span> or drag & drop here
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Custom URL Input */}
                {imageSource === 'custom' && (
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. /images/dining_dinner.jpg or http://..."
                    value={roomForm.imageUrl}
                    onChange={(e) => setRoomForm({ ...roomForm, imageUrl: e.target.value })}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                      backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                    }}
                  />
                )}

                {/* Selected/Preview path display */}
                {roomForm.imageUrl && (
                  <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ color: '#d4af37', fontWeight: '600' }}>Selected:</span> {roomForm.imageUrl}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  style={{ 
                    flex: 1, padding: '0.75rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', 
                    color: '#fff', borderRadius: '30px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' 
                  }}
                  onClick={() => setShowRoomModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ 
                    flex: 1, padding: '0.75rem', backgroundColor: '#d4af37', border: 'none', 
                    color: '#000', borderRadius: '30px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' 
                  }}
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =============================================================
          MODAL 2: ADD/EDIT REVIEWS FORM
          ============================================================= */}
      {showReviewModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
          backgroundColor: 'rgba(10, 9, 8, 0.85)', backdropFilter: 'blur(8px)', zIndex: 99999, 
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '2rem 1rem'
        }}>
          <div style={{
            maxWidth: '560px', width: '100%', padding: '2rem', backgroundColor: '#161513', 
            border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            position: 'relative', margin: '2rem auto'
          }}>
            <button 
              onClick={() => setShowReviewModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#d4af37', margin: '0 0 1.5rem 0' }}>
              {reviewForm.id ? 'Edit Guest Review' : 'Create Custom Guest Review'}
            </h3>

            <form onSubmit={handleSaveReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
              
              {/* Author */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Guest Author Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  value={reviewForm.author}
                  onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                    backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                  }}
                />
              </div>

              {/* Quote */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Quote / Review Text</label>
                <textarea 
                  required
                  rows="4"
                  placeholder="What did they say about their stay?"
                  value={reviewForm.quote}
                  onChange={(e) => setReviewForm({ ...reviewForm, quote: e.target.value })}
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                    backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Rating */}
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Rating (Stars)</label>
                  <select 
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                      backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                    }}
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★ (4 Stars)</option>
                    <option value={3}>★★★ (3 Stars)</option>
                    <option value={2}>★★ (2 Stars)</option>
                    <option value={1}>★ (1 Star)</option>
                  </select>
                </div>

                {/* Source */}
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Review Source</label>
                  <select 
                    value={reviewForm.source}
                    onChange={(e) => setReviewForm({ ...reviewForm, source: e.target.value })}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                      backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                    }}
                  >
                    <option value="Google">Google Reviews</option>
                    <option value="Booking.com">Booking.com Reviews</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Date */}
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Date (e.g. July 2026)</label>
                  <input 
                    type="text"
                    placeholder="e.g. July 2026"
                    value={reviewForm.date}
                    onChange={(e) => setReviewForm({ ...reviewForm, date: e.target.value })}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                      backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                    }}
                  />
                </div>

                {/* Role */}
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bcbbba', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.05em' }}>Guest Subtitle Badge</label>
                  <input 
                    type="text"
                    placeholder="e.g. Verified Guest via Google"
                    value={reviewForm.role}
                    onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', 
                      backgroundColor: '#262421', color: '#fff', fontSize: '0.88rem', outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  style={{ 
                    flex: 1, padding: '0.75rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', 
                    color: '#fff', borderRadius: '30px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' 
                  }}
                  onClick={() => setShowReviewModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ 
                    flex: 1, padding: '0.75rem', backgroundColor: '#d4af37', border: 'none', 
                    color: '#000', borderRadius: '30px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' 
                  }}
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
