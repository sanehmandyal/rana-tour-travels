require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const SiteContent = require("../models/SiteContent");
const Review = require("../models/Review");

// ---- REAL business data supplied for this project. Nothing here is invented. ----
const BUSINESS = {
  name: "Rana Tour And Travels",
  tagline: "Explore • Travel • Create Memories",
  phone: "098161 68974",
  whatsapp: "919816168974",
  address: "Balvir Colony, VPO Barnoh, Himachal Pradesh 174303",
  category: "Taxi Service / Tour & Travel Agency",
  rating: 5.0,
  reviewCount: 18,
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rana+Tour+And+Travels+Balvir+Colony+Barnoh+Himachal+Pradesh+174303",
  email: "", // not supplied - left blank, editable in admin
};

const SERVICES = [
  // --- REALISTIC TAXI & CAB FLEET ---
  {
    title: "SUV Taxi — Toyota Innova Crysta & Fortuner",
    description: "Spacious 6+1 & 7+1 seater premium Toyota Innova Crysta and Fortuner SUVs with dual AC and roof luggage carrier. Built for steep Himalayan hairpins and family mountain comfort.",
    image: "/images/services/suv-taxi.jpg",
    badge: "Most Popular SUV",
    category: "cabs",
  },
  {
    title: "Sedan Cab — Maruti Dzire & Toyota Etios",
    description: "Comfortable 4+1 seater air-conditioned Maruti Suzuki Dzire and Toyota Etios sedans with ample boot space. Ideal for Chandigarh/Delhi highway transit and economical local sightseeing.",
    image: "/images/services/sedan-taxi.jpg",
    badge: "Economical & Fast",
    category: "cabs",
  },
  {
    title: "Tempo Traveller — Force 12, 17 & 26 Seater",
    description: "Luxury modified Force Tempo Travellers with pushback Maharaja seats, individual AC vents, LED screen, and overhead luggage rack. Best for family reunions and group yatras.",
    image: "/images/services/minivan-taxi.jpg",
    badge: "Group Travel Leader",
    category: "cabs",
  },
  {
    title: "Luxury VIP Cabs — Audi, BMW & Fortuner Legender",
    description: "High-end chauffeur-driven VIP luxury fleet with white-glove service for destination weddings, VIP dignitaries, corporate delegations, and luxury hill station tours.",
    image: "/images/services/luxury-vehicles.jpg",
    badge: "VIP & Wedding Class",
    category: "cabs",
  },
  {
    title: "Minibus Hire — 27 to 35 Seater Tourist Coach",
    description: "Spacious air-conditioned tourist minibuses and coaches with panoramic mountain windows, PA system, and dedicated large luggage hold for corporate and pilgrim groups.",
    image: "/images/services/minibus-taxi.jpg",
    badge: "Large Group Coach",
    category: "cabs",
  },
  {
    title: "4x4 Mountain Rental — Mahindra Scorpio & Thar",
    description: "Rugged all-terrain 4WD Mahindra Scorpio and Thar vehicles with expert mountain drivers or rental options, engineered to conquer rough passes like Rohtang, Spiti, and Sach Pass.",
    image: "/images/services/car-rental.jpg",
    badge: "4x4 Mountain Tough",
    category: "cabs",
  },
  {
    title: "Airport Taxi & Railway Transfers",
    description: "Punctual 24/7 doorstep pickup and drop linking Chandigarh (IXC), Delhi (DEL), Amritsar (ATQ), and Shimla airports and Kalka/Una railway stations with guaranteed on-time flight arrivals.",
    image: "/images/services/airport-taxi.jpg",
    badge: "24/7 Airport Connect",
    category: "cabs",
  },
  {
    title: "Corporate & Executive Taxi Service",
    description: "Discreet, well-groomed chauffeurs, sanitized corporate sedans, transparent GST billing, and priority dispatch for business executives, delegates, and official meetings.",
    image: "/images/services/corporate-taxi.jpg",
    badge: "GST Invoicing",
    category: "cabs",
  },
  {
    title: "Long Distance & Inter-State Outstation",
    description: "Seamless outstation cab travel connecting Himachal Pradesh with Punjab, Haryana, Delhi NCR, Uttarakhand, Rajasthan, and Jammu & Kashmir with transparent pricing.",
    image: "/images/services/long-distance-taxi.jpg",
    badge: "All-India Permit",
    category: "cabs",
  },

  // --- HIMACHAL SERVICES & TEMPLES ---
  {
    title: "Himachal Nau Devi Darshan Taxi Tour",
    description: "Dedicated spiritual pilgrimage cab covering Himachal's revered Shaktipeeths: Mata Chintpurni, Jwala Ji, Kangra Brajeshwari Devi, Chamunda Devi, Baglamukhi, and Mata Naina Devi in AC Innova or Tempo Traveller.",
    image: "/images/services/himachal-devi-darshan.jpg",
    badge: "Pilgrimage Yatra Cab",
    category: "himachal",
  },
  {
    title: "Manikaran Sahib Pilgrimage Cab Service",
    description: "Comfortable hill cab to historic Gurudwara Sri Manikaran Sahib, famous for natural healing hot sulfur springs, Langar, and scenic riverside drive through Parvati Valley and Kasol.",
    image: "/images/services/manikaran-sahib.jpg",
    badge: "Hot Springs Taxi",
    category: "himachal",
  },
  {
    title: "Baijnath Temple & Kangra Heritage Taxi",
    description: "Visit the iconic 13th-century stone Jyotirlinga Baijnath Temple, Kangra Fort, Chamunda Nandikeshwar Dham, and scenic tea gardens of Palampur in sanitized AC sedans and SUVs.",
    image: "/images/services/baijnath-temple.jpg",
    badge: "Heritage Tour Cab",
    category: "himachal",
  },
  {
    title: "Local Sightseeing Tours across Himachal",
    description: "Curated 1-day and multiday sightseeing cabs covering hidden waterfalls, apple orchards, mountain viewpoints, ancient wooden shrines, and vibrant local handicraft bazaars.",
    image: "/images/services/local-sightseeing.jpg",
    badge: "Sightseeing Taxi",
    category: "himachal",
  },
  {
    title: "Curated Multi-Day Himachal Hill Tour Cabs",
    description: "Bespoke holiday tour cabs across Shimla, Kufri, Kullu, Manali, Rohtang Pass, Dharamshala, Dalhousie, and Spiti Valley with experienced mountain chauffeurs.",
    image: "/images/services/himachal-tours.jpg",
    badge: "Hill Tour Cab",
    category: "himachal",
  },

  // --- TEMPLES OUTSIDE HIMACHAL ---
  {
    title: "Golden Temple & Wagah Border Amritsar Taxi",
    description: "Direct outstation taxi service from Himachal/Chandigarh to Sri Harmandir Sahib (Golden Temple), Jallianwala Bagh, and the high-energy evening Wagah Border ceremony in Punjab.",
    image: "/images/services/golden-temple.jpg",
    badge: "Amritsar Outstation Cab",
    category: "temples",
  },
  {
    title: "Mata Vaishno Devi Katra (Jammu) Taxi Service",
    description: "Comfortable round-trip taxi service directly to Katra base camp for Mata Vaishno Devi Darshan, with flexible return waiting options and Jammu Tawi railway station transfers.",
    image: "/images/services/vaishno-devi.jpg",
    badge: "Katra Yatra Taxi",
    category: "temples",
  },
  {
    title: "Haridwar & Rishikesh Ganga Aarti Taxi Tour",
    description: "Specialized outstation cab to holy Haridwar for evening Har Ki Pauri Ganga Aarti, Mansa Devi ropeway, and spiritual ashrams, Ram Jhula & Laxman Jhula in Rishikesh (Uttarakhand).",
    image: "/images/services/haridwar-rishikesh.jpg",
    badge: "Haridwar Ganga Taxi",
    category: "temples",
  },
  {
    title: "Khatu Shyam Ji & Salasar Balaji Rajasthan Taxi",
    description: "Safe, air-conditioned outstation cabs for sacred Rajasthan darshan of Khatu Shyam Ji, Salasar Balaji Dham, and Jeen Mata with experienced highway chauffeurs.",
    image: "/images/services/khatushyam-salasar.jpg",
    badge: "Rajasthan Yatra Cab",
    category: "temples",
  },
  {
    title: "Ayodhya Ram Mandir & Kashi Vishwanath Taxi",
    description: "Specialized long-distance pilgrimage cab from Himachal and North India for Sri Ram Janmabhoomi Mandir Darshan in Ayodhya, Saryu Ghat Aarti, and Varanasi Kashi Vishwanath.",
    image: "/images/services/ayodhya-darshan.jpg",
    badge: "Ayodhya Yatra Cab",
    category: "temples",
  },
];

const DESTINATIONS = [
  {
    title: "Manali",
    description: "Solang Valley snow adventures, Atal Tunnel, Rohtang Pass, and tranquil pine cedar forests.",
    image: "/images/destinations/manali.jpg",
    badge: "Snow & Adventure",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Manali+Himachal+Pradesh",
  },
  {
    title: "Shimla",
    description: "Colonial Ridge church, bustling Mall Road, pine-fringed Kufri slopes, and panoramic Himalayan vistas.",
    image: "/images/destinations/shimla.jpg",
    badge: "Queen of Hills",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Shimla+The+Ridge+Himachal+Pradesh",
  },
  {
    title: "Dharamshala",
    description: "Sprawling tea gardens, Dhauladhar mountain backdrops, and peaceful Himalayan foothills.",
    image: "/images/destinations/dharamshala.jpg",
    badge: "Tea Gardens & Peaks",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Dharamshala+Kangra+Valley+Himachal+Pradesh",
  },
  {
    title: "Dalhousie & Khajjiar",
    description: "The 'Mini Switzerland of India' featuring rolling alpine meadows surrounded by cedar woods.",
    image: "/images/destinations/dalhousie.jpg",
    badge: "Mini Switzerland",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Khajjiar+Dalhousie+Himachal+Pradesh",
  },
  {
    title: "Kullu Valley",
    description: "Beas River white water rafting, historic wooden temples, shawl weaving, and vibrant festivals.",
    image: "/images/destinations/kullu.jpg",
    badge: "Valley of the Gods",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kullu+Valley+Beas+River+Himachal+Pradesh",
  },
  {
    title: "Kasol & Parvati Valley",
    description: "Crystal-clear rushing mountain rivers, alpine trails, rustic cafés, and serene pine valleys.",
    image: "/images/destinations/kasol.jpg",
    badge: "Riverside Escape",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kasol+Parvati+Valley+Himachal+Pradesh",
  },
  {
    title: "Spiti Valley",
    description: "Centuries-old cliffside Key Monastery, high mountain passes, starry skies, and rugged canyons.",
    image: "/images/destinations/spiti.jpg",
    badge: "High Altitude Wonder",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Key+Monastery+Spiti+Valley+Himachal+Pradesh",
  },
  {
    title: "Kinnaur & Kalpa",
    description: "Breathtaking views of Kinnaur Kailash, blooming apple orchards, and authentic wooden architecture.",
    image: "/images/destinations/kinnaur.jpg",
    badge: "Kailash Views",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kalpa+Kinnaur+Kailash+Himachal+Pradesh",
  },
  {
    title: "Chamba",
    description: "Ancient heritage temples, picturesque Ravi River gorges, and unspoiled hill town charm.",
    image: "/images/destinations/chamba.jpg",
    badge: "Heritage & Culture",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Chamba+Himachal+Pradesh",
  },
  {
    title: "McLeod Ganj",
    description: "Tibetan culture, Dalai Lama Temple Complex, Bhagsunag waterfalls, and serene mountain monasteries.",
    image: "/images/destinations/mcleodganj.jpg",
    badge: "Peace & Serenity",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=McLeod+Ganj+Dharamshala+Himachal+Pradesh",
  },
];

const PACKAGES = [
  {
    title: "Kullu Manali Snow Delight (5D / 4N)",
    description: "Solang Valley, Atal Tunnel, Hadimba Temple, Manikaran Sahib hot springs, and Beas riverside stay.",
    image: "/images/packages/kullu-manali.jpg",
    badge: "Best Seller",
    price: "Quote On Request",
  },
  {
    title: "Shimla & Manali Golden Circuit (6D / 5N)",
    description: "The complete Himachal classic: Kufri ridge, Mall Road, scenic Beas drive, and Solang adventure.",
    image: "/images/packages/shimla-manali.jpg",
    badge: "Popular Classic",
    price: "Quote On Request",
  },
  {
    title: "Dharamshala & Dalhousie Retreat (5D / 4N)",
    description: "Kangra tea gardens, Dalai Lama Temple, Khajjiar alpine meadow, and colonial Dalhousie strolls.",
    image: "/images/packages/dharamshala-dalhousie.jpg",
    badge: "Nature & Culture",
    price: "Quote On Request",
  },
  {
    title: "Spiti Valley High-Altitude Expedition (8D / 7N)",
    description: "Chandratal Lake, Key Monastery, Kaza, Kibber, and ancient Tibetan villages in the high Himalayas.",
    image: "/images/packages/spiti-adventure.jpg",
    badge: "Adventure Special",
    price: "Quote On Request",
  },
  {
    title: "Kinnaur & Sangla Valley Explorer (6D / 5N)",
    description: "Sangla Valley apple orchards, Chitkul (India's last village), and sunrise over Kinnaur Kailash.",
    image: "/images/packages/kinnaur-kailash.jpg",
    badge: "Offbeat Gem",
    price: "Quote On Request",
  },
  {
    title: "Grand Himachal Panorama (10D / 9N)",
    description: "The ultimate 10-day expedition covering Shimla, Kullu, Manali, Dharamshala, and Dalhousie.",
    image: "/images/packages/himachal-grand.jpg",
    badge: "All-Inclusive Tour",
    price: "Quote On Request",
  },
];

const GALLERY = [
  { image: "/images/gallery/gallery-1.jpg", title: "Scenic Himalayan Mountain Highway" },
  { image: "/images/gallery/gallery-2.jpg", title: "Premium SUV Taxi in Himachal Hills" },
  { image: "/images/gallery/gallery-3.jpg", title: "Snow-Capped Peaks at Manali & Rohtang" },
  { image: "/images/gallery/gallery-4.jpg", title: "Historic Ridge & Mall Road, Shimla" },
  { image: "/images/gallery/gallery-5.jpg", title: "Khajjiar - Mini Switzerland of India" },
  { image: "/images/gallery/gallery-6.jpg", title: "Key Monastery Perched in Spiti Valley" },
  { image: "/images/gallery/gallery-7.jpg", title: "Tempo Traveller Tourist Group Fleet" },
  { image: "/images/gallery/gallery-8.jpg", title: "Dharamshala Tea Gardens & Dhauladhar" },
  { image: "/images/gallery/gallery-9.jpg", title: "Executive Airport & Outstation Taxi" },
  { image: "/images/gallery/gallery-10.jpg", title: "Turquoise Waters of Parvati River" },
  { image: "/images/gallery/gallery-11.jpg", title: "Apple Blossom Season in Kinnaur Valley" },
  { image: "/images/gallery/gallery-12.jpg", title: "Golden Sunset over Himachal Mountain Valleys" },
];

const WHY_US = [
  {
    title: "Reliable & Punctual Service",
    description: "Prompt pickups, real-time coordination, and courteous drivers you can always depend on.",
    image: "/images/services/airport-taxi.jpg",
    badge: "Always On Time",
  },
  {
    title: "Modern & Sanitized Fleet",
    description: "A wide selection of well-maintained Sedans, Innova Crysta SUVs, and Tempo Travellers.",
    image: "/images/services/suv-taxi.jpg",
    badge: "Spotless Clean",
  },
  {
    title: "Experienced Hill Drivers",
    description: "Verified chauffeurs with deep experience navigating mountain hairpin bends and snow terrain safely.",
    image: "/images/banners/services-banner.jpg",
    badge: "Mountain Experts",
  },
  {
    title: "Transparent & Honest Pricing",
    description: "Clear itineraries with no hidden charges, surprise tolls, or unexpected detours.",
    image: "/images/banners/contact-banner.jpg",
    badge: "Zero Hidden Costs",
  },
  {
    title: "Personalized Tour Planning",
    description: "Flexible, tailor-made travel plans designed around your family's pace and preferences.",
    image: "/images/destinations/dalhousie.jpg",
    badge: "Tailored For You",
  },
  {
    title: "Local Himachal Expertise",
    description: "Headquartered in Barnoh, Himachal Pradesh, offering authentic local recommendations.",
    image: "/images/destinations/kinnaur.jpg",
    badge: "Born in Himachal",
  },
];

const FAQS = [
  { title: "How do I book a taxi or a tour?", description: "Submit an enquiry from any page on the site, or call/WhatsApp us directly. Our team will confirm availability and share a quote." },
  { title: "Do you accept online payment?", description: "Not at this time. All bookings are confirmed manually after our team contacts you with a quote." },
  { title: "Which areas do you serve?", description: "We operate out of Barnoh, Himachal Pradesh, and can arrange local, outstation, and long-distance trips." },
  { title: "Can you plan a custom multi-day tour?", description: "Yes — use the Custom Trip enquiry form and tell us your dates, destinations and group size." },
  { title: "How quickly will I hear back after an enquiry?", description: "Our team typically reviews and responds to new enquiries the same day." },
];

const HERO = {
  headline: "Explore the Journey. Create the Memory.",
  brandLine: "RANA Tour And Travels",
  subheading:
    "Reliable taxi services, curated tours and personalised travel experiences from Himachal Pradesh and beyond.",
  backgroundImage: "/images/hero-himachal.jpg",
};

const ABOUT = {
  ourStory: "Rana Tour And Travels is based in Balvir Colony, VPO Barnoh, Himachal Pradesh, offering premium taxi and curated tour services to local and visiting travellers.",
  ourApproach: "We focus on dependable service, transparent communication, pristine vehicles and comfortable mountain travel.",
  whyChooseUs: "5.0 Google Rating, local knowledge, modern vehicle fleet, and a straightforward enquiry-to-confirmation process.",
};

const SEED_REVIEWS = [
  { author: "Google User", rating: 5, text: "Good service experience", source: "Google", visible: true, order: 1 },
  { author: "Google User", rating: 5, text: "Excellent experience Rana Tour and Travels. Decent drivers.", source: "Google", visible: true, order: 2 },
  { author: "Google User", rating: 5, text: "Good service, best cab service", source: "Google", visible: true, order: 3 },
];

async function run() {
  await connectDB();

  // --- Admin user ---
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@ranatourandtravels.com").toLowerCase();
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: process.env.ADMIN_NAME || "Rana Admin",
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || "RanaTravels@2026",
      role: "admin",
    });
    console.log(`[seed] Created admin user: ${adminEmail}`);
  } else {
    console.log(`[seed] Admin user already exists: ${adminEmail}`);
  }

  // --- Site content sections ---
  const sections = [
    { key: "settings", label: "Business Settings", data: BUSINESS },
    { key: "hero", label: "Homepage Hero", data: HERO },
    { key: "services", label: "Services", data: { items: SERVICES } },
    { key: "destinations", label: "Destinations", data: { items: DESTINATIONS } },
    { key: "packages", label: "Tour Packages", data: { items: PACKAGES } },
    { key: "whyUs", label: "Why Travel With RANA", data: { items: WHY_US } },
    { key: "faqs", label: "FAQs", data: { items: FAQS } },
    { key: "gallery", label: "Gallery", data: { items: GALLERY } },
    { key: "about", label: "About Page", data: ABOUT },
    { key: "footer", label: "Footer", data: { note: "Explore Himachal Pradesh with Rana Tour And Travels." } },
  ];

  for (const s of sections) {
    await SiteContent.findOneAndUpdate({ key: s.key }, s, { upsert: true, new: true });
  }
  console.log(`[seed] Upserted ${sections.length} site content sections.`);

  // --- Reviews (only if none exist yet, so admin edits aren't overwritten on re-seed) ---
  const reviewCount = await Review.countDocuments({});
  if (reviewCount === 0) {
    await Review.insertMany(SEED_REVIEWS);
    console.log(`[seed] Inserted ${SEED_REVIEWS.length} real Google reviews.`);
  } else {
    console.log("[seed] Reviews already exist, skipping.");
  }

  console.log("[seed] Done.");
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
