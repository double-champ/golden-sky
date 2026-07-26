const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Prisma Client
let prisma;
let useDatabase = false;

try {
  prisma = new PrismaClient();
  useDatabase = true;
  console.log("Prisma client initialized successfully.");
} catch (err) {
  console.warn("Could not initialize Prisma client. Falling back to In-Memory DB Mode.");
  useDatabase = false;
}

// In-Memory Database Fallback Store
let inMemoryBookings = [
  {
    id: "RES-001",
    type: "STAY",
    guestName: "Aruni Perera",
    guestEmail: "aruni@example.com",
    guestPhone: "+94 77 123 4567",
    targetDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    durationDays: 3,
    guestsCount: 2,
    roomOrPackageName: "Standard Room 01",
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
    roomOrPackageName: "Royal Lotus Relaxation Therapy",
    specialRequests: "Prefers female therapist.",
    status: "CONFIRMED",
    createdAt: new Date().toISOString()
  }
];

let inMemoryRooms = [
  {
    id: "r1",
    name: "Standard Room 01",
    type: "STAY",
    description: "A quiet mountain retreat with views of the Hanthana range. Features a private jacuzzi, organic Ceylon tea bar, and a scenic mountainside balcony.",
    price: 10000,
    capacity: 2,
    amenities: "Mountain View, Jacuzzi, Private balcony, Tea Bar, Wi-Fi, King Bed",
    imageUrl: "/images/20260418_064528_1.jpg"
  },
  {
    id: "r2",
    name: "Deluxe Triple Room 01",
    type: "STAY",
    description: "A private standalone villa with glass walls overlooking the sunset. Features a private butler and an outdoor infinity deck.",
    price: 14000,
    capacity: 3,
    amenities: "Mountain View, Glass Walls, Mini Bar, Private Butler, Sun Deck, Air Conditioning",
    imageUrl: "/images/20260418_072549_1.jpg"
  },
  {
    id: "r3",
    name: "Standard Room 02",
    type: "STAY",
    description: "A dedicated wellness suite for rejuvenation. Features custom aromatherapy, a private soaking tub, and spaces for yoga and stretching.",
    price: 10000,
    capacity: 2,
    amenities: "Mountain View, Soaking Tub, Aroma Diffuser, Organic Bedding, Yoga Mat, Balcony, Wi-Fi",
    imageUrl: "/images/20260418_102057_1.jpg"
  },
  {
    id: "r4",
    name: "Deluxe Family Suite",
    type: "STAY",
    description: "Our signature Haritha family suite featuring a private stargazing deck, a glass floor, and a dedicated butler team.",
    price: 17000,
    capacity: 3,
    amenities: "City View, Glass Floor, Private Stargazing Deck, Panoramic View, 24/7 Butler, Wine Cellar, Airport Transfer",
    imageUrl: "/images/20260418_114222_1.jpg"
  },
  {
    id: "r5",
    name: "Standard Room 03",
    type: "STAY",
    description: "A cozy cabin nestled in the pine woods, featuring a stone fireplace, open-sky rain shower, and a private patio.",
    price: 10000,
    capacity: 2,
    amenities: "Mountain View, Pine Forest View, Outdoor Shower, Fireplace, King Bed, Private Patio, Wi-Fi",
    imageUrl: "/images/20260418_063038_1.jpg"
  },
  {
    id: "r6",
    name: "Deluxe Double Room 01",
    type: "STAY",
    description: "A unique water villa suspended over a spring lotus pond. Features glass floor view panels and private sun decks.",
    price: 12000,
    capacity: 2,
    amenities: "City View, Glass Bottom, Spring Pond View, King Bed, Sun loungers, Coffee Machine, Organic toiletries",
    imageUrl: "/images/20260418_064654_1.jpg"
  },
  {
    id: "r7",
    name: "Deluxe Double Room 02",
    type: "STAY",
    description: "A beautiful east-facing suite designed to catch the Kandy sunrise. Equipped with telescopes and private viewing decks.",
    price: 12000,
    capacity: 2,
    amenities: "City View, Sunrise View, Telescope, Outdoor Tea Deck, King Bed, Mini bar, Wi-Fi",
    imageUrl: "/images/20260418_065800_1.jpg"
  },
  {
    id: "r8",
    name: "Deluxe Triple Room 02",
    type: "STAY",
    description: "A spacious 2-bedroom mountainside estate with a private heated hot tub, fireplace lounge, and personal butler.",
    price: 14000,
    capacity: 3,
    amenities: "Mountain View, 2 Bedrooms, Private Butler, Luxury Hot Tub, Full Kitchen, Private Terrace, Cardamom tea bar",
    imageUrl: "/images/20260418_113827_1.jpg"
  },
  {
    id: "r9",
    name: "Deluxe Triple Room 03",
    type: "STAY",
    description: "A quiet chalet surrounded by wild cardamom fields, featuring a wood-fired hot tub and scenic valley views.",
    price: 14000,
    capacity: 3,
    amenities: "Mountain View, Aromatherapy room, Cardamom fields view, King Bed, Fireplace, Rainshower, Organic bedding",
    imageUrl: "/images/20260418_062826_1.jpg"
  },
  {
    id: "r10",
    name: "Standard Room 04",
    type: "STAY",
    description: "An eco-friendly bamboo loft with cozy hand-woven hammocks, natural breeze cooling, and panoramic forest views.",
    price: 10000,
    capacity: 2,
    amenities: "City View, Eco Loft, Bamboo structures, Hammock, Natural Breeze, Wi-Fi, King Bed",
    imageUrl: "/images/20260418_065313_1.jpg"
  },
  {
    id: "r11",
    name: "Standard Room 05",
    type: "STAY",
    description: "A peaceful soundproof studio space complete with premium aromatherapy and organic cotton yoga mats.",
    price: 10000,
    capacity: 2,
    amenities: "Mountain View, Yoga Studio, Soundproof walls, Yoga mats, Organic tea bar, Wi-Fi",
    imageUrl: "/images/20260418_111748_1.jpg"
  },
  {
    id: "r12",
    name: "Deluxe Triple Room 04",
    type: "STAY",
    description: "A suite decorated in royal Kandyan style, featuring antique clawfoot tubs, private viewing decks, and elite butler service.",
    price: 14000,
    capacity: 3,
    amenities: "City View, Royal Kandyan decor, Antique tub, Private terrace, Cardamom tea bar, Butler service",
    imageUrl: "/images/20260418_063431_2.jpg"
  },
  {
    id: "do1",
    name: "Hanthana Escape Dayout",
    type: "DAYOUT",
    description: "A classic day outing package featuring a mountain lunch buffet and access to our scenic viewpoints.",
    price: 6500,
    capacity: 10,
    amenities: "Welcome drink, Organic Buffet Lunch, Ceylon High tea, Wi-Fi",
    imageUrl: "/images/dining_escape.jpg"
  },
  {
    id: "do2",
    name: "Golden Wellness Dayout",
    type: "DAYOUT",
    description: "A wellness day package combining healthy lunches, herbal steam baths, and priority spa lounge access.",
    price: 12500,
    capacity: 6,
    amenities: "Detox elixir, 3-course spa lunch, Steam bath (30 min), Yoga lawn, 15% Spa discount",
    imageUrl: "/images/dining_wellness.jpg"
  },
  {
    id: "do3",
    name: "Royal Heritage Dayout",
    type: "DAYOUT",
    description: "An active day package including a guided mountain trek, tea factory tour, and traditional high tea.",
    price: 9500,
    capacity: 8,
    amenities: "Guided mountain trek, Tea factory visit, Historic high tea, Buffet Lunch",
    imageUrl: "/images/dining_heritage.jpg"
  },
  {
    id: "s1",
    name: "Royal Lotus Relaxation Therapy",
    type: "SPA",
    description: "A head-to-toe warm oil massage using organic local lotus oil and deep tissue pressure techniques.",
    price: 18000,
    capacity: 1,
    amenities: "Pure lotus oil, Deep tissue massage, Warm copper head wash, Hibiscus tea",
    imageUrl: "/images/spa_therapy_1.jpg"
  },
  {
    id: "s2",
    name: "Kandy Spiced Herbal Glow",
    type: "SPA",
    description: "A rejuvenating body scrub using wild cardamom, cinnamon, and organic clay to refresh the skin.",
    price: 15000,
    capacity: 1,
    amenities: "Cardamom & cinnamon scrub, Volcanic clay wrap, Herbal steam box, Lemongrass oil",
    imageUrl: "/images/spa_therapy_2.jpg"
  },
  {
    id: "s3",
    name: "Hanthana Herbal Wellness Massage",
    type: "SPA",
    description: "A private restorative treatment using warm herbal compresses and organic botanical oils.",
    price: 10000,
    capacity: 1,
    amenities: "Herbal compresses, Organic local oils, Forest audio atmosphere, Relaxation coach",
    imageUrl: "/images/spa_therapy_3.jpg"
  },
  {
    id: "s4",
    name: "Hanthana Peak Sunrise Yoga",
    type: "SPA",
    description: "A guided sunrise Hatha yoga and breathwork session on our panoramic outdoor deck, surrounded by the misty peaks.",
    price: 6000,
    capacity: 10,
    amenities: "Sunrise session, Guided Hatha yoga, Organic herbal tea, Premium mats & blocks provided",
    imageUrl: "/images/spa_yoga.jpg"
  },
  {
    id: "dn1",
    name: "Curated 5-Course Dinner",
    type: "DINING",
    description: "A fine-dining experience featuring Kandyan heritage spices and organic local ingredients.",
    price: 9500,
    capacity: 2,
    amenities: "5-Course fine dining, Organic harvest, Valley sunset views, Sommelier pairing",
    imageUrl: "/images/dining_dinner.jpg"
  },
  {
    id: "dn2",
    name: "Hanthana Sunset High Tea",
    type: "DINING",
    description: "A selection of sweet and savory pastries served alongside single-estate organic tea.",
    price: 4500,
    capacity: 2,
    amenities: "Sweet & savory platters, Organic Hanthana tea, Valley sunset, Live flute music",
    imageUrl: "/images/dining_hightea.jpg"
  },
  {
    id: "dn3",
    name: "Aura Rooftop Fire-pit Dining",
    type: "DINING",
    description: "A private starlit dining experience around copper fire pits with custom mixology pairings.",
    price: 15000,
    capacity: 4,
    amenities: "Private fire-pit table, Mixology pairings, Private chef service, Starlit skies",
    imageUrl: "/images/dining_rooftop.jpg"
  },
];

// Verify database connection and seed if using DB
async function checkDbConnection() {
  if (useDatabase) {
    try {
      // Test query
      await prisma.$connect();
      console.log("Connected to MySQL database via Prisma.");
      
      // Clean up deprecated renamed rooms
      const currentNames = inMemoryRooms.map(r => r.name);
      await prisma.room.deleteMany({
        where: {
          name: {
            notIn: currentNames
          }
        }
      });
      
      // Auto-seed rooms if any are missing
      let seededCount = 0;
      for (const room of inMemoryRooms) {
        const existingRoom = await prisma.room.findFirst({
          where: { name: room.name }
        });
        
        if (!existingRoom) {
          await prisma.room.create({
            data: {
              name: room.name,
              type: room.type,
              description: room.description,
              price: room.price,
              capacity: room.capacity,
              amenities: room.amenities,
              imageUrl: room.imageUrl
            }
          });
          seededCount++;
        } else {
          // Keep database synchronized with updated inMemoryRooms content
          await prisma.room.update({
            where: { id: existingRoom.id },
            data: {
              description: room.description,
              price: room.price,
              capacity: room.capacity,
              amenities: room.amenities,
              imageUrl: room.imageUrl
            }
          });
        }
      }
      if (seededCount > 0) {
        console.log(`Seeded ${seededCount} new rooms and packages successfully.`);
      } else {
        console.log("All rooms and packages are already seeded.");
      }
    } catch (err) {
      console.error("MySQL Connection Error:", err.message);
      console.warn("Falling back to In-Memory DB mode because database is unreachable.");
      useDatabase = false;
    }
  }
}

// Routes
// 1. GET ALL ROOMS
app.get('/api/rooms', async (req, res) => {
  if (useDatabase) {
    try {
      const dbRooms = await prisma.room.findMany();
      return res.json(dbRooms);
    } catch (err) {
      console.error("Database query failed, returning mock rooms:", err.message);
    }
  }
  return res.json(inMemoryRooms);
});

const OFFERS_FILE = path.join(__dirname, 'offers.json');

// Helper to load offers
function loadOffers() {
  try {
    if (fs.existsSync(OFFERS_FILE)) {
      return JSON.parse(fs.readFileSync(OFFERS_FILE, 'utf8'));
    }
  } catch (e) {
    console.warn("Could not read offers.json, falling back to default offers.");
  }
  return [
    {
      id: "offer-misty-retreat",
      title: "Misty Hanthana Retreat",
      badge: "Limited Stay Offer",
      discount: "20% OFF ALL SUITES",
      description: "Enjoy 20% off when you book for 3+ nights. Includes complimentary Hanthana Sunset High Tea.",
      type: "STAY",
      packageName: "Standard Room 01",
      cta: "Book Stay"
    },
    {
      id: "offer-spa-glow",
      title: "Ayurveda Wellness Glow",
      badge: "Spa Special",
      discount: "FREE HERBAL SCRUB",
      description: "Book any Signature Ritual wellness therapy and receive a complimentary cardamon scrub add-on.",
      type: "SPA",
      packageName: "Royal Lotus Relaxation Therapy",
      cta: "Book Spa"
    },
    {
      id: "offer-dayout-group",
      title: "Heritage Corporate Dayout",
      badge: "Group Package Discount",
      discount: "10% OFF ON 5+ GUESTS",
      description: "Plan your team retreat with us. Get 10% off on Royal Heritage dayouts when booking for 5 or more guests.",
      type: "DAYOUT",
      packageName: "Royal Heritage Dayout",
      cta: "Book Dayout"
    }
  ];
}

let inMemoryOffers = loadOffers();

function saveOffers() {
  try {
    fs.writeFileSync(OFFERS_FILE, JSON.stringify(inMemoryOffers, null, 2), 'utf8');
  } catch (e) {
    console.error("Could not write offers.json:", e.message);
  }
}

// Room Management Routes
app.put('/api/rooms/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, description, price, capacity, amenities, imageUrl } = req.body;
  
  const memIndex = inMemoryRooms.findIndex(r => r.id === id);
  if (memIndex !== -1) {
    inMemoryRooms[memIndex] = {
      ...inMemoryRooms[memIndex],
      name: name || inMemoryRooms[memIndex].name,
      type: type || inMemoryRooms[memIndex].type,
      description: description || inMemoryRooms[memIndex].description,
      price: price !== undefined ? parseFloat(price) : inMemoryRooms[memIndex].price,
      capacity: capacity !== undefined ? parseInt(capacity) : inMemoryRooms[memIndex].capacity,
      amenities: amenities || inMemoryRooms[memIndex].amenities,
      imageUrl: imageUrl || inMemoryRooms[memIndex].imageUrl
    };
  }
  
  if (useDatabase) {
    try {
      const updated = await prisma.room.update({
        where: { id },
        data: {
          name,
          type,
          description,
          price: price !== undefined ? parseFloat(price) : undefined,
          capacity: capacity !== undefined ? parseInt(capacity) : undefined,
          amenities,
          imageUrl
        }
      });
      return res.json({ success: true, room: updated });
    } catch (err) {
      console.error("Database room update failed:", err.message);
    }
  }
  
  if (memIndex !== -1) {
    return res.json({ success: true, room: inMemoryRooms[memIndex] });
  }
  return res.status(404).json({ error: "Room not found" });
});

app.post('/api/rooms', async (req, res) => {
  const { name, type, description, price, capacity, amenities, imageUrl } = req.body;
  const newId = `r-${Date.now()}`;
  const newRoom = {
    id: newId,
    name,
    type,
    description,
    price: parseFloat(price) || 0,
    capacity: parseInt(capacity) || 2,
    amenities: amenities || "",
    imageUrl: imageUrl || ""
  };
  
  inMemoryRooms.push(newRoom);
  
  if (useDatabase) {
    try {
      const dbRoom = await prisma.room.create({
        data: newRoom
      });
      return res.status(201).json({ success: true, room: dbRoom });
    } catch (err) {
      console.error("Database room creation failed:", err.message);
    }
  }
  return res.status(201).json({ success: true, room: newRoom });
});

app.delete('/api/rooms/:id', async (req, res) => {
  const { id } = req.params;
  inMemoryRooms = inMemoryRooms.filter(r => r.id !== id);
  if (useDatabase) {
    try {
      await prisma.room.delete({ where: { id } });
      return res.json({ success: true });
    } catch (err) {
      console.error("Database room delete failed:", err.message);
    }
  }
  return res.json({ success: true });
});

// Offers Management Routes
app.get('/api/offers', (req, res) => {
  res.json(inMemoryOffers);
});

app.post('/api/offers', (req, res) => {
  const { title, badge, discount, description, type, packageName, cta } = req.body;
  if (!title || !discount || !description) {
    return res.status(400).json({ error: "Missing offer details." });
  }
  const newOffer = {
    id: `offer-${Date.now()}`,
    title,
    badge: badge || "Special Promo",
    discount,
    description,
    type: type || "STAY",
    packageName: packageName || "",
    cta: cta || "Learn More"
  };
  inMemoryOffers.push(newOffer);
  saveOffers();
  res.status(201).json({ success: true, offer: newOffer });
});

app.delete('/api/offers/:id', (req, res) => {
  const { id } = req.params;
  inMemoryOffers = inMemoryOffers.filter(o => o.id !== id);
  saveOffers();
  res.json({ success: true });
});

// 2. GET ALL BOOKINGS (ADMIN)
app.get('/api/bookings', async (req, res) => {
  if (useDatabase) {
    try {
      const dbBookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.json(dbBookings);
    } catch (err) {
      console.error("Database query failed, returning mock bookings:", err.message);
    }
  }
  // Sort by date created desc
  const sortedBookings = [...inMemoryBookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return res.json(sortedBookings);
});

// 3. CREATE BOOKING
app.post('/api/bookings', async (req, res) => {
  const { type, guestName, guestEmail, guestPhone, targetDate, durationDays, guestsCount, roomOrPackageName, specialRequests } = req.body;
  
  if (!type || !guestName || !guestEmail || !guestPhone || !targetDate || !guestsCount || !roomOrPackageName) {
    return res.status(400).json({ error: "Missing required booking details." });
  }

  const parsedDate = new Date(targetDate);
  const duration = durationDays ? parseInt(durationDays) : 1;
  const requestedStart = new Date(parsedDate);
  const requestedEnd = new Date(requestedStart);
  requestedEnd.setDate(requestedEnd.getDate() + duration);

  // 1. Fetch existing bookings for checking availability (filtering out CANCELLED)
  let existingBookings = [];
  if (useDatabase) {
    try {
      existingBookings = await prisma.booking.findMany({
        where: {
          roomOrPackageName,
          status: { not: "CANCELLED" }
        }
      });
    } catch (err) {
      console.error("Failed to query database bookings for validation:", err.message);
      existingBookings = inMemoryBookings;
    }
  } else {
    existingBookings = inMemoryBookings;
  }

  // 2. Perform overlap/conflict validation
  const hasConflict = existingBookings.some(b => {
    if (b.roomOrPackageName.toLowerCase() !== roomOrPackageName.toLowerCase()) return false;
    if (b.status === "CANCELLED") return false;

    const existStart = new Date(b.targetDate);
    
    if (type === 'STAY') {
      const existDuration = b.durationDays ? parseInt(b.durationDays) : 1;
      const existEnd = new Date(existStart);
      existEnd.setDate(existEnd.getDate() + existDuration);

      // Overlap check: startA < endB && startB < endA
      return requestedStart < existEnd && existStart < requestedEnd;
    } else {
      // Single day calendar match check
      return requestedStart.toDateString() === existStart.toDateString();
    }
  });

  if (hasConflict) {
    return res.status(409).json({ 
      error: type === 'STAY' 
        ? `The selected room (${roomOrPackageName}) is already booked for the chosen date range.` 
        : `This package (${roomOrPackageName}) is already reserved for the selected date.`
    });
  }

  // Generate customized RES-XXX ID
  let nextId;
  if (useDatabase) {
    try {
      const lastBooking = await prisma.booking.findFirst({
        orderBy: { createdAt: 'desc' }
      });
      let lastNum = 0;
      if (lastBooking && lastBooking.id.startsWith("RES-")) {
        const num = parseInt(lastBooking.id.replace("RES-", ""), 10);
        if (!isNaN(num)) lastNum = num;
      }
      if (lastNum === 0) {
        // Fallback: check count
        const count = await prisma.booking.count();
        lastNum = count;
      }
      nextId = `RES-${String(lastNum + 1).padStart(3, '0')}`;
    } catch (e) {
      nextId = `RES-001`;
    }
  } else {
    let lastNum = 0;
    inMemoryBookings.forEach(b => {
      if (b.id && b.id.startsWith("RES-")) {
        const num = parseInt(b.id.replace("RES-", ""), 10);
        if (!isNaN(num) && num > lastNum) {
          lastNum = num;
        }
      }
    });
    nextId = `RES-${String(lastNum + 1).padStart(3, '0')}`;
  }

  const newBooking = {
    id: nextId,
    type,
    guestName,
    guestEmail,
    guestPhone,
    targetDate: parsedDate,
    durationDays: durationDays ? parseInt(durationDays) : null,
    guestsCount: parseInt(guestsCount),
    roomOrPackageName,
    specialRequests: specialRequests || "",
    status: "PENDING",
    createdAt: new Date()
  };

  if (useDatabase) {
    try {
      const dbBooking = await prisma.booking.create({
        data: newBooking
      });
      return res.status(201).json({ success: true, booking: dbBooking });
    } catch (err) {
      console.error("Database insert failed, adding to in-memory:", err.message);
    }
  }

  // In-Memory save fallback
  const mockBooking = {
    ...newBooking,
    targetDate: parsedDate.toISOString(),
    createdAt: newBooking.createdAt.toISOString()
  };
  inMemoryBookings.push(mockBooking);
  return res.status(201).json({ success: true, booking: mockBooking });
});

// 4. UPDATE BOOKING STATUS (ADMIN)
app.put('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // PENDING, CONFIRMED, CANCELLED

  if (!status) {
    return res.status(400).json({ error: "Status is required." });
  }

  if (useDatabase) {
    try {
      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: { status }
      });
      return res.json({ success: true, booking: updatedBooking });
    } catch (err) {
      console.error("Database update failed:", err.message);
    }
  }

  // In-memory fallback
  const bookingIndex = inMemoryBookings.findIndex(b => b.id === id);
  if (bookingIndex !== -1) {
    inMemoryBookings[bookingIndex].status = status;
    return res.json({ success: true, booking: inMemoryBookings[bookingIndex] });
  }

  return res.status(404).json({ error: "Booking not found." });
});

// 5. GET ANALYTICS (ADMIN)
app.get('/api/analytics', async (req, res) => {
  let bookings = [];
  if (useDatabase) {
    try {
      bookings = await prisma.booking.findMany();
    } catch (err) {
      console.error("Database analytics query failed:", err.message);
      bookings = inMemoryBookings;
    }
  } else {
    bookings = inMemoryBookings;
  }

  // Compute stats
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length;
  const cancelledCount = bookings.filter(b => b.status === 'CANCELLED').length;

  // Revenue estimation
  // Rooms: price * days * count
  // Dayout: 6000 per person
  // Spa: 15000 per treatment
  // Dining: 8000 per booking
  let estimatedRevenue = 0;
  bookings.filter(b => b.status === 'CONFIRMED').forEach(b => {
    if (b.type === 'STAY') {
      const room = inMemoryRooms.find(r => r.name === b.roomOrPackageName);
      const rate = room ? room.price : 50000;
      estimatedRevenue += rate * (b.durationDays || 1);
    } else if (b.type === 'DAYOUT') {
      estimatedRevenue += 6500 * b.guestsCount; // LKR 6,500 per head
    } else if (b.type === 'SPA') {
      estimatedRevenue += 12000 * b.guestsCount; // LKR 12,000 per session
    } else if (b.type === 'DINING') {
      estimatedRevenue += 7000 * b.guestsCount; // LKR 7,000 average spend
    }
  });

  // Category breakdown
  const categories = {
    STAY: bookings.filter(b => b.type === 'STAY').length,
    DAYOUT: bookings.filter(b => b.type === 'DAYOUT').length,
    SPA: bookings.filter(b => b.type === 'SPA').length,
    DINING: bookings.filter(b => b.type === 'DINING').length
  };

  return res.json({
    totalBookings,
    pendingCount,
    confirmedCount,
    cancelledCount,
    estimatedRevenue,
    categories
  });
});

// Serve raw images from Golden Sky Residence folder
const rawImagesDir = 'd:\\Golden Sky Hotel and Wellness\\Golden Sky Residence';

app.use('/raw-images', express.static(rawImagesDir));

app.get('/api/raw-images-list', (req, res) => {
  fs.readdir(rawImagesDir, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const imageFiles = files.filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp';
    });
    res.json(imageFiles);
  });
});

// Start server and check connection
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await checkDbConnection();
});
