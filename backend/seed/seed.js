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
  {
    title: "Airport Taxi & Transfers",
    description: "Punctual pickup and drop connecting Chandigarh, Delhi, and Shimla airports in premium sanitized cabs.",
    image: "/images/services/airport-taxi.jpg",
    badge: "24/7 Available",
  },
  {
    title: "SUV Taxi Service",
    description: "Spacious Toyota Innova Crysta and Fortuners ideal for mountain family travel and rough hill routes.",
    image: "/images/services/suv-taxi.jpg",
    badge: "Most Popular",
  },
  {
    title: "Corporate Taxi Service",
    description: "Dependable, discreet rides with GST invoicing for corporate executive travel and conferences.",
    image: "/images/services/corporate-taxi.jpg",
    badge: "Executive",
  },
  {
    title: "Long Distance & Outstation",
    description: "Smooth outstation travel across Himachal, Punjab, Haryana, Uttarakhand, Delhi NCR and Jammu.",
    image: "/images/services/long-distance-taxi.jpg",
    badge: "Custom Routes",
  },
  {
    title: "Luxury Vehicles",
    description: "High-end chauffeur-driven vehicles for weddings, VIP guests, and special celebrations in the hills.",
    image: "/images/services/luxury-vehicles.jpg",
    badge: "Premium Class",
  },
  {
    title: "Sedan Taxi",
    description: "Comfortable Dzire and Etios sedans for city transit, sightseeing, and economical highway trips.",
    image: "/images/services/sedan-taxi.jpg",
    badge: "Best Value",
  },
  {
    title: "Tempo Traveller & Minivan",
    description: "12 to 17-seater luxury pushback Tempo Travellers for family reunions, college groups, and pilgrim trips.",
    image: "/images/services/minivan-taxi.jpg",
    badge: "Group Friendly",
  },
  {
    title: "Minibus Hire",
    description: "Large tourist coaches and minibuses with air conditioning and ample luggage space for large groups.",
    image: "/images/services/minibus-taxi.jpg",
    badge: "Spacious",
  },
  {
    title: "Car On Rent (Chauffeur & Self)",
    description: "Flexible rental options with verified licensed drivers who master mountain terrain with ease.",
    image: "/images/services/car-rental.jpg",
    badge: "Flexible Hours",
  },
  {
    title: "Local Sightseeing Tours",
    description: "Explore temples, viewpoints, waterfalls, and local markets with drivers who know hidden gems.",
    image: "/images/services/local-sightseeing.jpg",
    badge: "Curated Itinerary",
  },
  {
    title: "Curated Himachal Tours",
    description: "Handcrafted multiday holiday packages across Shimla, Manali, Dharamshala, Dalhousie and Spiti.",
    image: "/images/services/himachal-tours.jpg",
    badge: "Top Rated",
  },
  {
    title: "Group Holiday Packages",
    description: "Complete group logistics including transfers, route planning, hotel recommendations, and stops.",
    image: "/images/services/group-package.jpg",
    badge: "All-Inclusive",
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
