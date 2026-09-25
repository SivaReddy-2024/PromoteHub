const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Deal = require('../models/Deal');
const Coupon = require('../models/Coupon');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const BankOffer = require('../models/BankOffer');
const CashbackOffer = require('../models/CashbackOffer');
const FestivalCampaign = require('../models/FestivalCampaign');
const BlogPost = require('../models/BlogPost');
const logger = require('./logger');

const categoriesData = [
  { name: 'Electronics', slug: 'electronics', icon: 'Laptop', description: 'Laptops, headphones, soundbars, audio systems, and camera deals.', order: 1 },
  { name: 'Fashion', slug: 'fashion', icon: 'Shirt', description: 'Men, women, and kids apparel, footwear, and designer collections.', order: 2 },
  { name: 'Beauty', slug: 'beauty', icon: 'Sparkles', description: 'Skincare, haircare, fragrances, makeup, and organic personal care.', order: 3 },
  { name: 'Grocery', slug: 'grocery', icon: 'ShoppingBag', description: 'Daily staples, organic fruits, veggies, beverages, and gourmet food.', order: 4 },
  { name: 'Food', slug: 'food', icon: 'Utensils', description: 'Restaurant food delivery, gourmet dining, and cafe vouchers.', order: 5 },
  { name: 'Travel', slug: 'travel', icon: 'Plane', description: 'Domestic & international flights, luxury hotels, bus booking, and cab rides.', order: 6 },
  { name: 'Mobiles', slug: 'mobiles', icon: 'Smartphone', description: 'Flagship 5G phones, budget smartphones, mobile chargers, and accessories.', order: 7 },
  { name: 'Home & Kitchen', slug: 'home-kitchen', icon: 'Home', description: 'Cookware, air fryers, furniture, home decor, and smart home gadgets.', order: 8 },
  { name: 'Recharge', slug: 'recharge', icon: 'Zap', description: 'Mobile prepaid recharge, DTH bills, broadband, and fastag recharge.', order: 9 },
  { name: 'Banking', slug: 'banking', icon: 'CreditCard', description: 'Credit card discounts, debit card EMI, net banking rewards, and forex.', order: 10 },
  { name: 'Entertainment', slug: 'entertainment', icon: 'Film', description: 'OTT subscriptions, movie tickets, theme parks, and concert passes.', order: 11 },
  { name: 'Health', slug: 'health', icon: 'HeartPulse', description: 'Lab tests, pharmacies, multivitamin supplements, and fitness gear.', order: 12 },
  { name: 'Education', slug: 'education', icon: 'GraduationCap', description: 'Online certifications, coding bootcamps, test prep, and language courses.', order: 13 },
  { name: 'Automotive', slug: 'automotive', icon: 'Car', description: 'Car accessories, riding gear, tires, car insurance, and bike servicing.', order: 14 },
  { name: 'Software', slug: 'software', icon: 'Code', description: 'Cloud hosting, SaaS productivity tools, antiviruses, and VPN subscriptions.', order: 15 },
  { name: 'Others', slug: 'others', icon: 'Grid', description: 'Gifts, flowers, pet supplies, stationery, and utility services.', order: 16 }
];

const brandsData = [
  {
    name: 'Amazon',
    slug: 'amazon',
    logo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=200&q=80',
    website: 'https://www.amazon.in',
    description: 'India’s largest online marketplace for electronics, fashion, groceries, and daily essentials with lightning-fast delivery.',
    category: 'Electronics',
    activeOffersCount: 42,
    couponCount: 15,
    cashbackRate: 'Up to 6.5%',
    rating: 4.9,
    featured: true
  },
  {
    name: 'Flipkart',
    slug: 'flipkart',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=200&q=80',
    website: 'https://www.flipkart.com',
    description: 'Leading Indian shopping destination known for Big Billion Days, electronic deals, and Flipkart Plus benefits.',
    category: 'Mobiles',
    activeOffersCount: 38,
    couponCount: 12,
    cashbackRate: 'Up to 7%',
    rating: 4.8,
    featured: true
  },
  {
    name: 'Myntra',
    slug: 'myntra',
    logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=200&q=80',
    website: 'https://www.myntra.com',
    description: 'India’s premier fashion and lifestyle platform featuring curated streetwear, designer wear, and beauty brands.',
    category: 'Fashion',
    activeOffersCount: 50,
    couponCount: 22,
    cashbackRate: 'Up to 9%',
    rating: 4.9,
    featured: true
  },
  {
    name: 'Ajio',
    slug: 'ajio',
    logo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=200&q=80',
    website: 'https://www.ajio.com',
    description: 'Reliance Retail’s trendsetting fashion destination offering handcrafted ethnic wear, indie labels, and international apparel.',
    category: 'Fashion',
    activeOffersCount: 28,
    couponCount: 10,
    cashbackRate: 'Up to 8.5%',
    rating: 4.7,
    featured: true
  },
  {
    name: 'Swiggy',
    slug: 'swiggy',
    logo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80',
    website: 'https://www.swiggy.com',
    description: 'On-demand food delivery, Instamart quick commerce, Dineout restaurant reservations, and Genie courier services.',
    category: 'Food',
    activeOffersCount: 34,
    couponCount: 18,
    cashbackRate: 'Flat ₹50',
    rating: 4.8,
    featured: true
  },
  {
    name: 'Zomato',
    slug: 'zomato',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
    website: 'https://www.zomato.com',
    description: 'Find top dining spots, order delicious food with Zomato Gold perks, and enjoy superfast doorstep delivery.',
    category: 'Food',
    activeOffersCount: 26,
    couponCount: 14,
    cashbackRate: 'Flat ₹40',
    rating: 4.7,
    featured: true
  },
  {
    name: 'MakeMyTrip',
    slug: 'makemytrip',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=200&q=80',
    website: 'https://www.makemytrip.com',
    description: 'India’s #1 travel portal for domestic flights, international vacations, 5-star resort stays, and train tickets.',
    category: 'Travel',
    activeOffersCount: 22,
    couponCount: 9,
    cashbackRate: 'Up to ₹800',
    rating: 4.8,
    featured: true
  },
  {
    name: 'Croma',
    slug: 'croma',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80',
    website: 'https://www.croma.com',
    description: 'A Tata Enterprise electronics retailer offering authentic laptops, OLED TVs, air conditioners, and smartphones.',
    category: 'Electronics',
    activeOffersCount: 30,
    couponCount: 11,
    cashbackRate: 'Up to 5%',
    rating: 4.7,
    featured: true
  },
  {
    name: 'Reliance Digital',
    slug: 'reliance-digital',
    logo: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=200&q=80',
    website: 'https://www.reliancedigital.in',
    description: 'Comprehensive tech mega-store with nationwide express delivery and certified installation support.',
    category: 'Electronics',
    activeOffersCount: 25,
    couponCount: 8,
    cashbackRate: 'Up to 4.5%',
    rating: 4.6,
    featured: false
  },
  {
    name: 'Nykaa',
    slug: 'nykaa',
    logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80',
    website: 'https://www.nykaa.com',
    description: 'India’s favorite beauty & wellness destination featuring 100% authentic luxury cosmetics, fragrances, and haircare.',
    category: 'Beauty',
    activeOffersCount: 35,
    couponCount: 16,
    cashbackRate: 'Up to 8%',
    rating: 4.9,
    featured: true
  },
  {
    name: 'Tata CLiQ',
    slug: 'tata-cliq',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=80',
    website: 'https://www.tatacliq.com',
    description: 'Curated luxury lifestyle marketplace by the Tata Group with premium international watches, apparel, and footwear.',
    category: 'Fashion',
    activeOffersCount: 19,
    couponCount: 7,
    cashbackRate: 'Up to 6%',
    rating: 4.7,
    featured: false
  },
  {
    name: 'Samsung',
    slug: 'samsung',
    logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=200&q=80',
    website: 'https://www.samsung.com/in',
    description: 'Official Samsung online store with exclusive student discounts, corporate perks, and exchange bonuses on Galaxy devices.',
    category: 'Mobiles',
    activeOffersCount: 20,
    couponCount: 6,
    cashbackRate: 'Up to 7.5%',
    rating: 4.8,
    featured: true
  }
];

const dealsData = [
  {
    title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)',
    slug: 'samsung-galaxy-s24-ultra-titanium-gray-offer',
    description: 'Get massive price drop on Galaxy S24 Ultra featuring Snapdragon 8 Gen 3, Quad Telephoto camera with 100x Space Zoom, and built-in S-Pen with Galaxy AI.',
    brandName: 'Samsung',
    brandLogo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'samsung',
    category: 'Mobiles',
    discountPercentage: 25,
    originalPrice: 129999,
    dealPrice: 97499,
    savingsAmount: 32500,
    couponCode: 'SAMSUNGPRO',
    cashbackText: 'Flat 5% Extra Cashback',
    merchantUrl: 'https://www.samsung.com/in/smartphones/galaxy-s24-ultra/',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 2 * 60 * 60 * 1000),
    featured: true,
    isHot: true,
    isFlash: false,
    clicks: 842
  },
  {
    title: 'Apple MacBook Air M3 Chip (13.6-inch Liquid Retina, 8GB/256GB)',
    slug: 'apple-macbook-air-m3-midnight-croma-deal',
    description: 'Incredible speed with 8-core CPU, 10-core GPU, up to 18 hours of battery life, MagSafe charging, and 1080p FaceTime HD camera. Includes complimentary laptop sleeve.',
    brandName: 'Croma',
    brandLogo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'croma',
    category: 'Electronics',
    discountPercentage: 22,
    originalPrice: 114900,
    dealPrice: 89622,
    savingsAmount: 25278,
    couponCode: 'CROMAAPPLE',
    cashbackText: 'Up to ₹4,000 HDFC Card Cashback',
    merchantUrl: 'https://www.croma.com',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 1 * 60 * 60 * 1000),
    featured: true,
    isHot: true,
    isFlash: false,
    clicks: 1250
  },
  {
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    slug: 'sony-wh-1000xm5-noise-cancelling-flash-deal',
    description: 'Industry-leading noise cancellation powered by 2 processors and 8 microphones. Magnificent hands-free calling with 4 beamforming microphones and 30-hour battery life.',
    brandName: 'Amazon',
    brandLogo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'amazon',
    category: 'Electronics',
    discountPercentage: 35,
    originalPrice: 34990,
    dealPrice: 22743,
    savingsAmount: 12247,
    couponCode: 'AUDIO35',
    cashbackText: '5% Amazon Pay Balance',
    merchantUrl: 'https://www.amazon.in',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 18 * 60 * 60 * 1000), // Flash countdown
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 30 * 60 * 1000),
    featured: true,
    isHot: true,
    isFlash: true,
    flashStock: 9,
    flashTotalStock: 40,
    clicks: 1980
  },
  {
    title: 'Myntra End of Reason Sale: Flat 60% to 80% OFF on Top Brands',
    slug: 'myntra-eors-flat-60-80-percent-off-apparel',
    description: 'Massive seasonal fashion clearance across Levi’s, Nike, Puma, Tommy Hilfiger, Mango, and Vero Moda. Extra 10% instant off on checkout.',
    brandName: 'Myntra',
    brandLogo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'myntra',
    category: 'Fashion',
    discountPercentage: 70,
    originalPrice: 4999,
    dealPrice: 1499,
    savingsAmount: 3500,
    couponCode: 'MYNTRA70',
    cashbackText: 'Up to 9% Real Cashback',
    merchantUrl: 'https://www.myntra.com',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 4 * 60 * 60 * 1000),
    featured: true,
    isHot: true,
    isFlash: false,
    clicks: 3410
  },
  {
    title: 'Swiggy Gourmet Feast: Flat 50% OFF up to ₹150 + Free Delivery',
    slug: 'swiggy-gourmet-feast-50-percent-discount',
    description: 'Craving biryani, artisan pizza, burgers, or gourmet desserts? Order from curated top-rated dining partners with guaranteed fast delivery.',
    brandName: 'Swiggy',
    brandLogo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'swiggy',
    category: 'Food',
    discountPercentage: 50,
    originalPrice: 600,
    dealPrice: 300,
    savingsAmount: 300,
    couponCode: 'SWIGGY50',
    cashbackText: 'Flat ₹50 PromoteHub Cashback',
    merchantUrl: 'https://www.swiggy.com',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 2 * 60 * 60 * 1000),
    featured: true,
    isHot: false,
    isFlash: false,
    clicks: 1670
  },
  {
    title: 'Goa & Kerala Holiday Packages: Flat ₹4,000 OFF on Domestic Flights & Stays',
    slug: 'makemytrip-domestic-holiday-packages-discount',
    description: 'Book beachfront villas and boutique resorts with free cancellation, breakfast buffet included, and instant flight baggage allowance vouchers.',
    brandName: 'MakeMyTrip',
    brandLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'makemytrip',
    category: 'Travel',
    discountPercentage: 30,
    originalPrice: 24999,
    dealPrice: 17499,
    savingsAmount: 7500,
    couponCode: 'MMTHOLIDAY',
    cashbackText: 'Up to ₹800 Wallet Points',
    merchantUrl: 'https://www.makemytrip.com',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 3 * 60 * 60 * 1000),
    featured: true,
    isHot: false,
    isFlash: false,
    clicks: 890
  },
  {
    title: 'Ajio Mania: Flat 65% OFF on Sneaker & Streetwear Brands',
    slug: 'ajio-mania-flat-65-percent-sneakers-streetwear',
    description: 'Grab authentic high-top sneakers, oversized graphic tees, and jackets from Puma, Adidas, Superdry, and GAP. Extra coupon at checkout.',
    brandName: 'Ajio',
    brandLogo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'ajio',
    category: 'Fashion',
    discountPercentage: 65,
    originalPrice: 3999,
    dealPrice: 1399,
    savingsAmount: 2600,
    couponCode: 'AJIOMANIA',
    cashbackText: '8.5% PromoteHub Bonus',
    merchantUrl: 'https://www.ajio.com',
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 1 * 60 * 60 * 1000),
    featured: false,
    isHot: true,
    isFlash: false,
    clicks: 1420
  },
  {
    title: 'Nykaa Beauty Bonanza: Buy 2 Get 1 FREE on Luxury Skincare',
    slug: 'nykaa-beauty-bonanza-b2g1-skincare-makeup',
    description: 'Pamper your skin with serums, sunscreens, moisturizers, and lipsticks from Clinique, The Ordinary, MAC, and Forest Essentials.',
    brandName: 'Nykaa',
    brandLogo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'nykaa',
    category: 'Beauty',
    discountPercentage: 40,
    originalPrice: 2800,
    dealPrice: 1680,
    savingsAmount: 1120,
    couponCode: 'GLOWB2G1',
    cashbackText: 'Flat 8% Cashback',
    merchantUrl: 'https://www.nykaa.com',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 5 * 60 * 60 * 1000),
    featured: false,
    isHot: false,
    isFlash: false,
    clicks: 980
  },
  {
    title: 'LG 55-inch 4K Smart OLED TV with Dolby Vision Atmos',
    slug: 'lg-55-inch-oled-4k-smart-tv-flipkart-deal',
    description: 'Self-lit pixels with infinite contrast, 120Hz refresh rate for seamless next-gen console gaming, α9 Gen6 AI Processor, and magic remote.',
    brandName: 'Flipkart',
    brandLogo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'flipkart',
    category: 'Electronics',
    discountPercentage: 45,
    originalPrice: 149990,
    dealPrice: 82494,
    savingsAmount: 67496,
    couponCode: 'FLIPKARTTV',
    cashbackText: 'Flat ₹5,000 SBI Card Off',
    merchantUrl: 'https://www.flipkart.com',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 2 * 60 * 60 * 1000),
    featured: true,
    isHot: true,
    isFlash: false,
    clicks: 2100
  },
  {
    title: 'Dyson V12 Detect Slim Cordless Vacuum Cleaner',
    slug: 'dyson-v12-detect-slim-cordless-vacuum-flash',
    description: 'Laser reveals invisible dust, piezo sensor calculates microscopic particle counts, anti-tangle hair screw tool, and 60 minutes run time.',
    brandName: 'Amazon',
    brandLogo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'amazon',
    category: 'Home & Kitchen',
    discountPercentage: 28,
    originalPrice: 55900,
    dealPrice: 40248,
    savingsAmount: 15652,
    couponCode: 'DYSONSAVE',
    cashbackText: '5% Amazon Pay Cashback',
    merchantUrl: 'https://www.amazon.in',
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 14 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 1 * 60 * 60 * 1000),
    featured: false,
    isHot: true,
    isFlash: true,
    flashStock: 4,
    flashTotalStock: 25,
    clicks: 1140
  },
  {
    title: 'Zomato Gold 1-Year Membership: Special 50% Price Slash',
    slug: 'zomato-gold-1-year-membership-discount',
    description: 'Unlimited free delivery on orders above ₹199 from all partner restaurants within 10km, up to 40% VIP dining discounts, and no surge fee.',
    brandName: 'Zomato',
    brandLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'zomato',
    category: 'Food',
    discountPercentage: 50,
    originalPrice: 999,
    dealPrice: 499,
    savingsAmount: 500,
    couponCode: 'GOLDFEST',
    cashbackText: 'Instant ₹40 cashback',
    merchantUrl: 'https://www.zomato.com',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 3 * 60 * 60 * 1000),
    featured: false,
    isHot: false,
    isFlash: false,
    clicks: 760
  },
  {
    title: 'Tata CLiQ Luxury: Designer Handbags & Timepieces 40% OFF',
    slug: 'tata-cliq-luxury-handbags-watches-clearance',
    description: 'Explore authentic Michael Kors, Fossil, Armani Exchange, and Coach with brand certificate and luxury gift packaging.',
    brandName: 'Tata CLiQ',
    brandLogo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'tata-cliq',
    category: 'Fashion',
    discountPercentage: 40,
    originalPrice: 18500,
    dealPrice: 11100,
    savingsAmount: 7400,
    couponCode: 'LUXURY40',
    cashbackText: '6% Extra Cashback',
    merchantUrl: 'https://www.tatacliq.com',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 6 * 60 * 60 * 1000),
    featured: false,
    isHot: false,
    isFlash: false,
    clicks: 650
  },
  {
    title: 'OnePlus 12 5G (Flowy Emerald, 16GB RAM, 512GB Storage)',
    slug: 'oneplus-12-5g-flagship-flipkart-special',
    description: 'Hasselblad 4th Gen Camera for Mobile, 2K 120Hz ProXDR display, Snapdragon 8 Gen 3 chipset, and 100W SUPERVOOC charging brick in box.',
    brandName: 'Flipkart',
    brandLogo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'flipkart',
    category: 'Mobiles',
    discountPercentage: 18,
    originalPrice: 69999,
    dealPrice: 57399,
    savingsAmount: 12600,
    couponCode: 'ONEPLUS12',
    cashbackText: '₹3,000 Exchange Bonus',
    merchantUrl: 'https://www.flipkart.com',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 2 * 60 * 60 * 1000),
    featured: false,
    isHot: false,
    isFlash: false,
    clicks: 1320
  },
  {
    title: 'Airtel & Jio Prepaid Recharge: Flat ₹50 Cashback on 84-Day Plans',
    slug: 'airtel-jio-prepaid-recharge-cashback-voucher',
    description: 'Recharge your daily 2GB/day 5G unlimited calling plans and enjoy complimentary OTT subscription with instant wallet cashback.',
    brandName: 'Amazon',
    brandLogo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'amazon',
    category: 'Recharge',
    discountPercentage: 15,
    originalPrice: 999,
    dealPrice: 849,
    savingsAmount: 150,
    couponCode: 'RECHARGE50',
    cashbackText: 'Instant ₹50 Amazon Pay',
    merchantUrl: 'https://www.amazon.in',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 1 * 60 * 60 * 1000),
    featured: false,
    isHot: false,
    isFlash: false,
    clicks: 910
  },
  {
    title: 'BigBasket Fresh Daily Grocery: Flat 20% OFF on Fruits, Veggies & Staples',
    slug: 'bigbasket-fresh-daily-grocery-20-off',
    description: 'Farm-fresh organic fruits, cold-pressed oils, premium basmati rice, and daily dairy delivered before 7 AM.',
    brandName: 'Amazon',
    brandLogo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'amazon',
    category: 'Grocery',
    discountPercentage: 20,
    originalPrice: 2000,
    dealPrice: 1600,
    savingsAmount: 400,
    couponCode: 'FRESH20',
    cashbackText: 'Extra 5% Cashback',
    merchantUrl: 'https://www.amazon.in',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 4 * 60 * 60 * 1000),
    featured: false,
    isHot: false,
    isFlash: false,
    clicks: 820
  },
  {
    title: 'Apple iPad Air 11-inch (M2 Chip, Wi-Fi 128GB - Space Gray)',
    slug: 'apple-ipad-air-m2-chip-croma-offer',
    description: 'Liquid Retina display with True Tone, landscape 12MP front camera with Center Stage, and Wi-Fi 6E connectivity.',
    brandName: 'Croma',
    brandLogo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'croma',
    category: 'Electronics',
    discountPercentage: 16,
    originalPrice: 59900,
    dealPrice: 50316,
    savingsAmount: 9584,
    couponCode: 'IPADAIR16',
    cashbackText: '₹3,000 HDFC Card Cashback',
    merchantUrl: 'https://www.croma.com',
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 2 * 60 * 60 * 1000),
    featured: false,
    isHot: true,
    isFlash: false,
    clicks: 1450
  },
  {
    title: 'Nike Air Jordan 1 Retro High OG: Exclusive 30% Seasonal Drop',
    slug: 'nike-air-jordan-1-retro-myntra-deal',
    description: 'Iconic sneaker design crafted in genuine full-grain leather with Air-Sole cushioning and signature rubber cupsole traction.',
    brandName: 'Myntra',
    brandLogo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'myntra',
    category: 'Fashion',
    discountPercentage: 30,
    originalPrice: 16995,
    dealPrice: 11896,
    savingsAmount: 5099,
    couponCode: 'JORDAN30',
    cashbackText: 'Up to 9% Real Cashback',
    merchantUrl: 'https://www.myntra.com',
    imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 1 * 60 * 60 * 1000),
    featured: true,
    isHot: true,
    isFlash: false,
    clicks: 2280
  },
  {
    title: 'Philips Air Fryer XXL 7.2L with Rapid Air Technology',
    slug: 'philips-air-fryer-xxl-amazon-flash-deal',
    description: 'Fry with up to 90% less fat. Preset cooking touch screen for chicken, fries, fish, cake, and grilled vegetables.',
    brandName: 'Amazon',
    brandLogo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'amazon',
    category: 'Home & Kitchen',
    discountPercentage: 42,
    originalPrice: 16995,
    dealPrice: 9857,
    savingsAmount: 7138,
    couponCode: 'AIRFRY42',
    cashbackText: '5% Amazon Pay Balance',
    merchantUrl: 'https://www.amazon.in',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 22 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 3 * 60 * 60 * 1000),
    featured: false,
    isHot: true,
    isFlash: true,
    flashStock: 7,
    flashTotalStock: 30,
    clicks: 1290
  },
  {
    title: 'Cult.fit 12-Month Elite Pass: Unlimited Gym & Yoga Classes',
    slug: 'cultfit-12-month-elite-pass-health-offer',
    description: 'Access 500+ premium gyms across India, group fitness classes, Boxing, Zumba, and HRX workouts with pause flexibility.',
    brandName: 'Reliance Digital',
    brandLogo: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'reliance-digital',
    category: 'Health',
    discountPercentage: 55,
    originalPrice: 22000,
    dealPrice: 9900,
    savingsAmount: 12100,
    couponCode: 'FITELITE',
    cashbackText: 'Flat ₹500 Cashback',
    merchantUrl: 'https://www.reliancedigital.in',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 2 * 60 * 60 * 1000),
    featured: false,
    isHot: false,
    isFlash: false,
    clicks: 740
  },
  {
    title: 'Coursera Plus Annual Subscription: 7,000+ Courses & Degrees',
    slug: 'coursera-plus-annual-subscription-education-deal',
    description: 'Learn in-demand skills from Google, IBM, Meta, and top universities with unlimited certificates and hands-on projects.',
    brandName: 'Amazon',
    brandLogo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'amazon',
    category: 'Education',
    discountPercentage: 35,
    originalPrice: 32000,
    dealPrice: 20800,
    savingsAmount: 11200,
    couponCode: 'LEARN35',
    cashbackText: 'Instant Certification Pass',
    merchantUrl: 'https://www.amazon.in',
    imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80',
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: 'active',
    verified: true,
    lastVerified: new Date(Date.now() - 5 * 60 * 60 * 1000),
    featured: false,
    isHot: false,
    isFlash: false,
    clicks: 580
  }
];

const couponsData = [
  {
    code: 'SAVEBIG50',
    brandName: 'Amazon',
    brandLogo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'amazon',
    title: 'Flat 50% OFF on Echo Smart Speakers & Fire TV Sticks',
    description: 'Apply at cart to enjoy half price on Alexa smart devices with free 3-month Audible subscription.',
    category: 'Electronics',
    discount: '50% OFF',
    minimumPurchase: 1999,
    maximumDiscount: 2500,
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    terms: ['Valid on eligible Echo devices only.', 'One redemption per customer.', 'Prime members get extra ₹100 cashback.'],
    status: 'active',
    verified: true,
    clicks: 1420,
    copies: 890,
    merchantUrl: 'https://www.amazon.in'
  },
  {
    code: 'MYNTRAFIRST',
    brandName: 'Myntra',
    brandLogo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'myntra',
    title: 'Flat ₹400 OFF on First Myntra Order + Free Shipping',
    description: 'Exclusive welcome voucher for new fashion lovers on minimum cart value of ₹1,499.',
    category: 'Fashion',
    discount: '₹400 OFF',
    minimumPurchase: 1499,
    maximumDiscount: 400,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    terms: ['Valid only on first transaction.', 'Cannot be merged with clearance coupons.'],
    status: 'active',
    verified: true,
    clicks: 2890,
    copies: 1920,
    merchantUrl: 'https://www.myntra.com'
  },
  {
    code: 'SWIGGYIT',
    brandName: 'Swiggy',
    brandLogo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'swiggy',
    title: '60% OFF up to ₹120 on Selected Restaurants',
    description: 'Hungry? Get swift lunch and dinner meals with lightning discounts across 10,000+ top eateries.',
    category: 'Food',
    discount: '60% OFF',
    minimumPurchase: 199,
    maximumDiscount: 120,
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    terms: ['Applicable on participating restaurants.', 'Valid twice per week per user.'],
    status: 'active',
    verified: true,
    clicks: 3410,
    copies: 2240,
    merchantUrl: 'https://www.swiggy.com'
  },
  {
    code: 'AJIOFIRST',
    brandName: 'Ajio',
    brandLogo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'ajio',
    title: 'Flat 30% OFF on Cart Value above ₹2,499',
    description: 'Refresh your wardrobe with trending sneakers, oversized shirts, and ethnic kurtas.',
    category: 'Fashion',
    discount: '30% OFF',
    minimumPurchase: 2499,
    maximumDiscount: 1000,
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    terms: ['Excludes select luxury labels.', 'Standard Ajio return policies apply.'],
    status: 'active',
    verified: true,
    clicks: 1670,
    copies: 980,
    merchantUrl: 'https://www.ajio.com'
  },
  {
    code: 'FLIPKART500',
    brandName: 'Flipkart',
    brandLogo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'flipkart',
    title: 'Flat ₹500 OFF on Home Appliances and Geysers',
    description: 'Valid on top brands including IFB, Whirlpool, Bosch, and Havells.',
    category: 'Home & Kitchen',
    discount: '₹500 OFF',
    minimumPurchase: 4999,
    maximumDiscount: 500,
    expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    terms: ['Instant coupon deduction at checkout page.', 'Valid on prepaid transactions.'],
    status: 'active',
    verified: true,
    clicks: 1120,
    copies: 640,
    merchantUrl: 'https://www.flipkart.com'
  },
  {
    code: 'FLYMMT',
    brandName: 'MakeMyTrip',
    brandLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'makemytrip',
    title: 'Flat 12% OFF on Domestic Flight Bookings',
    description: 'Fly across Delhi, Mumbai, Bengaluru, Goa, and Srinagar at unbeatable lowest fares.',
    category: 'Travel',
    discount: '12% OFF',
    minimumPurchase: 3500,
    maximumDiscount: 1500,
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    terms: ['Valid for one-way and round trips.', 'Convenience fee applies as normal.'],
    status: 'active',
    verified: true,
    clicks: 2450,
    copies: 1390,
    merchantUrl: 'https://www.makemytrip.com'
  },
  {
    code: 'NYKAAFLAT',
    brandName: 'Nykaa',
    brandLogo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'nykaa',
    title: 'Flat ₹250 OFF on Order Value Above ₹1,299',
    description: 'Stock up on serums, Korean skincare masks, conditioners, and signature perfumes.',
    category: 'Beauty',
    discount: '₹250 OFF',
    minimumPurchase: 1299,
    maximumDiscount: 250,
    expiryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    terms: ['Valid across all skincare and cosmetic categories.'],
    status: 'active',
    verified: true,
    clicks: 1840,
    copies: 1110,
    merchantUrl: 'https://www.nykaa.com'
  },
  {
    code: 'CROMA1000',
    brandName: 'Croma',
    brandLogo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'croma',
    title: 'Flat ₹1,000 OFF on Laptops and Tablets',
    description: 'Boost your academic or work setup with Lenovo, Asus, HP, and Apple hardware.',
    category: 'Electronics',
    discount: '₹1,000 OFF',
    minimumPurchase: 29999,
    maximumDiscount: 1000,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    terms: ['Valid once per customer account on online purchases.'],
    status: 'active',
    verified: true,
    clicks: 980,
    copies: 530,
    merchantUrl: 'https://www.croma.com'
  },
  {
    code: 'ZOMATO50',
    brandName: 'Zomato',
    brandLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'zomato',
    title: '50% OFF up to ₹100 on Weekend Family Feasts',
    description: 'Celebrate the weekend with mouthwatering sizzlers, kebabs, and ice cream sundaes.',
    category: 'Food',
    discount: '50% OFF',
    minimumPurchase: 249,
    maximumDiscount: 100,
    expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    terms: ['Valid on Saturdays and Sundays only.'],
    status: 'active',
    verified: true,
    clicks: 2190,
    copies: 1470,
    merchantUrl: 'https://www.zomato.com'
  },
  {
    code: 'SAMSUNGEARLY',
    brandName: 'Samsung',
    brandLogo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'samsung',
    title: 'Extra ₹3,000 OFF on Galaxy Tab S9 Series',
    description: 'Dynamic AMOLED 2X tablet with IP68 water resistance and bundled ultra-low-latency S-Pen.',
    category: 'Electronics',
    discount: '₹3,000 OFF',
    minimumPurchase: 45000,
    maximumDiscount: 3000,
    expiryDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    terms: ['Apply code in the promotional promo box before proceeding to gateway.'],
    status: 'active',
    verified: true,
    clicks: 860,
    copies: 420,
    merchantUrl: 'https://www.samsung.com/in'
  },
  {
    code: 'TATACLIQ15',
    brandName: 'Tata CLiQ',
    brandLogo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'tata-cliq',
    title: 'Flat 15% Instant Off on Luxury Footwear & Bags',
    description: 'Indulge in authentic Italian leather shoes, boots, and signature designer shoulder bags.',
    category: 'Fashion',
    discount: '15% OFF',
    minimumPurchase: 3999,
    maximumDiscount: 1500,
    expiryDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    terms: ['Coupon code valid once per active account.'],
    status: 'active',
    verified: true,
    clicks: 720,
    copies: 380,
    merchantUrl: 'https://www.tatacliq.com'
  },
  {
    code: 'GROCERY150',
    brandName: 'Amazon',
    brandLogo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'amazon',
    title: 'Flat ₹150 OFF on Amazon Fresh Monthly Pantry Cart',
    description: 'Stock up your kitchen with spices, cereals, cleaning detergents, and beverages.',
    category: 'Grocery',
    discount: '₹150 OFF',
    minimumPurchase: 999,
    maximumDiscount: 150,
    expiryDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    terms: ['Valid on Amazon Fresh orders only.'],
    status: 'active',
    verified: true,
    clicks: 1330,
    copies: 760,
    merchantUrl: 'https://www.amazon.in'
  },
  {
    code: 'RECHARGE20',
    brandName: 'Amazon',
    brandLogo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'amazon',
    title: 'Flat ₹20 Cashback on Electricity & DTH Bills',
    description: 'Pay utility bills conveniently and receive fast credit to Amazon Pay Balance.',
    category: 'Recharge',
    discount: '₹20 Cashback',
    minimumPurchase: 200,
    maximumDiscount: 20,
    expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    terms: ['Valid once per utility consumer number per month.'],
    status: 'active',
    verified: true,
    clicks: 940,
    copies: 610,
    merchantUrl: 'https://www.amazon.in'
  },
  {
    code: 'MMTHOTEL20',
    brandName: 'MakeMyTrip',
    brandLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'makemytrip',
    title: '20% OFF on Luxury Resorts & Heritage Palaces',
    description: 'Experience regal hospitality in Udaipur, Jaipur, Ooty, and Coorg at discounted rates.',
    category: 'Travel',
    discount: '20% OFF',
    minimumPurchase: 6000,
    maximumDiscount: 3000,
    expiryDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    terms: ['Valid on prepaid hotel room bookings only.'],
    status: 'active',
    verified: true,
    clicks: 1540,
    copies: 880,
    merchantUrl: 'https://www.makemytrip.com'
  },
  {
    code: 'SWIGGYPARTY',
    brandName: 'Swiggy',
    brandLogo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80',
    brandSlug: 'swiggy',
    title: 'Flat ₹300 OFF on Bulk Orders above ₹1,000',
    description: 'Planning an office lunch or house party? Order gourmet platters and save big.',
    category: 'Food',
    discount: '₹300 OFF',
    minimumPurchase: 1000,
    maximumDiscount: 300,
    expiryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    terms: ['Applies automatically when code is typed on orders >= ₹1,000.'],
    status: 'active',
    verified: true,
    clicks: 1890,
    copies: 1120,
    merchantUrl: 'https://www.swiggy.com'
  }
];

const bankOffersData = [
  {
    bankName: 'HDFC Bank',
    bankLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=150&q=80',
    cardType: 'Credit & Debit Card',
    discount: '10% Instant Discount',
    minimumTransaction: 2999,
    maximumDiscount: 1500,
    validity: 'Valid till 31st Oct 2026',
    applicableMerchants: ['Amazon', 'Flipkart', 'Croma', 'Myntra'],
    terms: ['Instant discount applied at final checkout payment gateway.', 'Not applicable on corporate or commercial cards.']
  },
  {
    bankName: 'ICICI Bank',
    bankLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=150&q=80',
    cardType: 'Credit Card',
    discount: 'Flat ₹2,000 Instant Off + No Cost EMI',
    minimumTransaction: 19999,
    maximumDiscount: 2000,
    validity: 'Valid till 15th Nov 2026',
    applicableMerchants: ['Reliance Digital', 'Samsung', 'Croma'],
    terms: ['Valid on 3, 6, and 9-month tenure No-Cost EMI transactions.', 'Valid once per card per month.']
  },
  {
    bankName: 'SBI Card',
    bankLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=150&q=80',
    cardType: 'Credit Card',
    discount: '10% Instant Discount up to ₹1,750',
    minimumTransaction: 5000,
    maximumDiscount: 1750,
    validity: 'Valid during Mega Festival Sales',
    applicableMerchants: ['Amazon', 'Flipkart', 'MakeMyTrip'],
    terms: ['Offer valid on retail credit cards only.', 'Cardholder must register on the merchant app.']
  },
  {
    bankName: 'Axis Bank',
    bankLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=150&q=80',
    cardType: 'Credit & Debit Card',
    discount: 'Flat 15% OFF on Dining & Food Orders',
    minimumTransaction: 599,
    maximumDiscount: 250,
    validity: 'Valid on Wednesdays & Sundays',
    applicableMerchants: ['Swiggy', 'Zomato', 'Dineout'],
    terms: ['Select Axis Bank offer under bank discounts at food checkout.']
  },
  {
    bankName: 'Kotak Mahindra Bank',
    bankLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=150&q=80',
    cardType: 'Credit & Debit Card',
    discount: 'Flat 10% OFF on Fashion & Lifestyle',
    minimumTransaction: 1999,
    maximumDiscount: 750,
    validity: 'Valid till 30th Nov 2026',
    applicableMerchants: ['Ajio', 'Myntra', 'Tata CLiQ'],
    terms: ['Applicable on Kotak League, Royale, and Zen credit cards.']
  },
  {
    bankName: 'American Express',
    bankLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=150&q=80',
    cardType: 'Credit Card',
    discount: '5X Reward Points + Flat ₹2,500 Voucher',
    minimumTransaction: 15000,
    maximumDiscount: 2500,
    validity: 'Valid on Weekend Bookings',
    applicableMerchants: ['MakeMyTrip', 'Taj Hotels', 'Apple India'],
    terms: ['Valid for consumer Amex cards issued in India. Points credited within 45 days.']
  }
];

const cashbackOffersData = [
  {
    storeName: 'Myntra',
    storeLogo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=200&q=80',
    storeSlug: 'myntra',
    cashbackRate: 'Up to 9.0% Real Cashback',
    maxCashback: 'No Upper Limit',
    category: 'Fashion',
    trackingSpeed: 'Within 24 Hours',
    terms: [
      'Shop through our link in an empty cart.',
      'Cashback tracks automatically in 24 hours.',
      'Confirmed cashback can be directly withdrawn to Bank Account or UPI.'
    ],
    trackingUrl: 'https://www.myntra.com'
  },
  {
    storeName: 'Ajio',
    storeLogo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=200&q=80',
    storeSlug: 'ajio',
    cashbackRate: 'Up to 8.5% Extra Cashback',
    maxCashback: '₹1,500 per order',
    category: 'Fashion',
    trackingSpeed: 'Within 48 Hours',
    terms: ['Do not use ad-blockers during checkout.', 'Valid on all branded streetwear and ethnic apparel.'],
    trackingUrl: 'https://www.ajio.com'
  },
  {
    storeName: 'Croma',
    storeLogo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80',
    storeSlug: 'croma',
    cashbackRate: 'Up to 5.2% Real Cashback',
    maxCashback: 'No Upper Limit',
    category: 'Electronics',
    trackingSpeed: 'Within 24 Hours',
    terms: ['Valid on laptops, televisions, ACs, and home tech.', 'Valid on both prepaid and EMI transactions.'],
    trackingUrl: 'https://www.croma.com'
  },
  {
    storeName: 'Swiggy',
    storeLogo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80',
    storeSlug: 'swiggy',
    cashbackRate: 'Flat ₹50 PromoteHub Cashback',
    maxCashback: '₹50 per order',
    category: 'Food',
    trackingSpeed: 'Instant / 6 Hours',
    terms: ['Applicable on orders above ₹199.', 'Maximum 5 cashback claims per calendar month.'],
    trackingUrl: 'https://www.swiggy.com'
  },
  {
    storeName: 'Samsung',
    storeLogo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=200&q=80',
    storeSlug: 'samsung',
    cashbackRate: 'Up to 7.5% Real Cashback',
    maxCashback: '₹5,000 per order',
    category: 'Mobiles',
    trackingSpeed: 'Within 24 Hours',
    terms: ['Valid on flagship Galaxy phones, smart monitors, and smartwatches.'],
    trackingUrl: 'https://www.samsung.com/in'
  },
  {
    storeName: 'MakeMyTrip',
    storeLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=200&q=80',
    storeSlug: 'makemytrip',
    cashbackRate: 'Flat ₹800 Real Cashback on Hotels',
    maxCashback: '₹800 per booking',
    category: 'Travel',
    trackingSpeed: 'Within 48 Hours',
    terms: ['Applies on hotel reservations with checkout completed.'],
    trackingUrl: 'https://www.makemytrip.com'
  }
];

const festivalCampaignsData = [
  {
    name: 'Diwali Mega Dhamaka Sale',
    slug: 'diwali-mega-dhamaka',
    title: 'Celebrate with Grand Savings & Light Up Your Cart!',
    tag: 'Diwali Special',
    description: 'Biggest festive discounts of the year across Electronics, Gold Coins, Home Appliances, and Festive Ethnic Wear. Enjoy up to 80% OFF plus extra bank card rewards.',
    banner: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=1400&q=80',
    discountUpTo: 'Up to 80% OFF',
    startDate: new Date(),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    participatingBrands: ['Amazon', 'Flipkart', 'Croma', 'Myntra', 'Samsung', 'Nykaa'],
    status: 'active',
    featured: true
  },
  {
    name: 'Great Indian Shopping Festival',
    slug: 'great-indian-festival',
    title: 'Unbeatable Prices on Flagship 5G Smartphones & Laptops',
    tag: 'Blockbuster Sale',
    description: 'Grab no-cost EMI, free exchanges, extended warranties, and instant ₹5,000 card cashback on premier consumer tech.',
    banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80',
    discountUpTo: 'Up to 75% OFF',
    startDate: new Date(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    participatingBrands: ['Amazon', 'Flipkart', 'Samsung', 'Croma', 'Reliance Digital'],
    status: 'active',
    featured: true
  },
  {
    name: 'Dussehra Vijayotsav Offers',
    slug: 'dussehra-vijayotsav-sale',
    title: 'Auspicious Deals on Two-Wheelers, Electronics & Gold',
    tag: 'Festive Offers',
    description: 'Commence new beginnings with blessed deals, zero down payment schemes, and instant festive cashback vouchers.',
    banner: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1400&q=80',
    discountUpTo: 'Up to 60% OFF',
    startDate: new Date(),
    endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    participatingBrands: ['Amazon', 'Tata CLiQ', 'Ajio', 'Flipkart'],
    status: 'active',
    featured: false
  },
  {
    name: 'End of Season Fashion Clearance',
    slug: 'end-of-season-sale',
    title: 'Wardrobe Refresh: Luxury Brands at High Street Prices',
    tag: 'Fashion Clearance',
    description: 'Over 200,000 designer styles marked down. Flat 50% to 70% OFF on apparel, footwear, and travel accessories.',
    banner: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=80',
    discountUpTo: 'Up to 70% OFF',
    startDate: new Date(),
    endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    participatingBrands: ['Myntra', 'Ajio', 'Tata CLiQ', 'Nykaa'],
    status: 'active',
    featured: false
  },
  {
    name: 'Black Friday & Cyber Week India',
    slug: 'black-friday-cyber-week',
    title: 'Global Tech Drops, Software Deals & Hardware Discounter',
    tag: 'Cyber Deals',
    description: 'International SaaS subscriptions, cloud hosting, noise-canceling headphones, and gaming peripherals at all-time low prices.',
    banner: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1400&q=80',
    discountUpTo: 'Up to 85% OFF',
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    participatingBrands: ['Amazon', 'Croma', 'Samsung'],
    status: 'scheduled',
    featured: false
  }
];

const blogPostsData = [
  {
    title: 'Top 10 Proven Tricks to Maximize Savings on Amazon & Flipkart in 2026',
    slug: 'top-10-tricks-maximize-savings-amazon-flipkart-2026',
    excerpt: 'Learn how to combine coupon promo codes, credit card instant discounts, and wallet cashbacks to save up to 45% on every purchase.',
    content: `Shopping online in India has evolved into an art form. While millions of shoppers wait for annual festive sales, experienced bargain hunters know that substantial discounts can be unlocked throughout the year if you follow a few proven strategies.

### 1. Stacking Coupons with Merchant Cashbacks
The secret to ultra-cheap checkouts is offer stacking. Always look for a promotional promo code on PromoteHub before opening your shopping cart. Once you apply the code, ensure you use a partner cashback tracking link so that you get secondary credit credited back to your account.

### 2. Choosing the Right Payment Card
Banks like HDFC, ICICI, and SBI frequently rotate 10% instant discounts. Even if the discount caps at ₹1,500, timing your high-ticket electronics purchases to match bank discount days guarantees immediate savings.

### 3. Add to Cart and Price Track
Add items to your wishlist 3-4 days in advance. Many retailers trigger targeted dynamic discount notifications or exclusive email coupons to nudge cart abandonment.`,
    coverImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    author: { name: 'Priya Sharma', role: 'Chief Savings Strategist' },
    category: 'Shopping Tips',
    readTime: '6 min read',
    tags: ['Amazon', 'Flipkart', 'Savings', 'Deals']
  },
  {
    title: 'How Cashback Works: Step-by-Step Guide to Getting Real Money Back',
    slug: 'how-cashback-works-step-by-step-guide',
    excerpt: 'Ever wondered where cashback money comes from and how you can withdraw it directly to your bank account via UPI? Here is everything you need to know.',
    content: `Cashback platforms are not magic; they are built on affiliate marketing partnerships. When you click an offer on PromoteHub, the retailer pays us a referral commission for directing an engaged shopper. Instead of keeping that commission, we share the lion's share directly back with you!

### Step 1: Empty Your Shopping Cart First
Before clicking our cashback link, ensure your cart on the merchant website is empty. Retailers track affiliate cookies on click, and an already filled cart might attribute the sale to a previous referral.

### Step 2: Avoid Browser Extension Conflicts
Third-party browser extensions like automated price scrapers can overwrite referral tracking cookies. For 100% reliable tracking, keep your browser clean or use our mobile app.

### Step 3: Confirmation and Payout
Once you complete your order, the merchant verifies that the product was delivered and not returned. Within 60-90 days, your cashback switches from "Pending" to "Confirmed", ready for instant UPI withdrawal!`,
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    author: { name: 'Arun Patel', role: 'Fintech Analyst' },
    category: 'Cashback Guides',
    readTime: '5 min read',
    tags: ['Cashback', 'UPI', 'Money Saving']
  },
  {
    title: 'Best Credit Cards in India for Online Shopping and Food Delivery',
    slug: 'best-credit-cards-india-online-shopping-food-delivery',
    excerpt: 'Comprehensive comparison of top cashback credit cards offering flat 5% on Amazon, Flipkart, Swiggy, and Zomato without annual spend conditions.',
    content: `In the modern Indian retail ecosystem, choosing the right credit card is equivalent to having a perpetual discount voucher in your pocket.

### Top Contenders:
- **Cashback SBI Card**: Offers a straight 5% cashback on almost all online spends up to ₹5,000 per billing cycle.
- **Amazon Pay ICICI Card**: Gives unlimited 5% back on Amazon for Prime members with zero annual fee.
- **Axis Bank Airtel / Flipkart Cards**: Excellent for utility bill recharges and quick-commerce food deliveries.

Always ensure you pay your full statement balance on time to avoid interest charges that would outweigh your cashback benefits.`,
    coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
    author: { name: 'Vikram Mehta', role: 'Credit & Cards Editor' },
    category: 'Bank Offers',
    readTime: '7 min read',
    tags: ['Credit Cards', 'HDFC', 'SBI', 'ICICI']
  },
  {
    title: 'Diwali & Festival Sale Shopping Checklist: How to Avoid Fake Discounts',
    slug: 'diwali-festival-sale-shopping-checklist-avoid-fake-discounts',
    excerpt: 'Retailers sometimes inflate original prices right before a mega sale. Here is your tactical checklist to identify verified, genuine price drops.',
    content: `Festival sales are the most exciting shopping period in India, but deceptive pricing tactics can sometimes trap unwary buyers into believing they got a 70% discount when the price was never marked down.

### Checklist for Smart Festival Shopping:
1. **Check the 90-Day Price History**: Use deal tracking tools or PromoteHub verified markers to verify if the deal price is truly an all-time low.
2. **Review Seller Ratings**: On multi-seller marketplaces, prioritize fulfilled-by-merchant or officially branded storefronts.
3. **Verify Warranty Terms**: Ensure electronic products come with brand warranty rather than seller-specific refurbished warranty.
4. **Snag Flash Deals Early**: The deepest price drops are allocated in limited quotas (typically the first 50-100 units). Set reminders for midnight sale launches!`,
    coverImage: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80',
    author: { name: 'Priya Sharma', role: 'Chief Savings Strategist' },
    category: 'Festival Sale Guides',
    readTime: '5 min read',
    tags: ['Diwali', 'Festivals', 'Safety Tips']
  }
];

async function seedDatabase() {
  try {
    logger.info('Connecting to MongoDB Atlas for comprehensive Promotional Hub seeding...');
    await mongoose.connect(process.env.MONGODB_URI);

    // 1. Seed or ensure Demo Admin/User
    let demoUser = await User.findOne({ email: 'alex.morgan@promotehub.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Morgan',
        email: 'alex.morgan@promotehub.com',
        password: 'Password123!',
        role: 'admin',
        company: 'PromoteHub Editorial',
        bio: 'Senior Growth & Product Marketing Lead with 8+ years scaling promotional platforms.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        favorites: { deals: [], coupons: [], brands: [] }
      });
      logger.info('Created demo user/admin: alex.morgan@promotehub.com');
    } else {
      demoUser.role = 'admin';
      await demoUser.save();
    }

    // 2. Categories
    await Category.deleteMany({});
    await Category.insertMany(categoriesData);
    logger.info(`Seeded ${categoriesData.length} categories.`);

    // 3. Brands
    await Brand.deleteMany({});
    await Brand.insertMany(brandsData);
    logger.info(`Seeded ${brandsData.length} brands.`);

    // 4. Deals
    await Deal.deleteMany({});
    const dealsWithUser = dealsData.map((d) => ({
      ...d,
      user: demoUser._id
    }));
    await Deal.insertMany(dealsWithUser);
    logger.info(`Seeded ${dealsData.length} deals.`);

    // 5. Coupons
    await Coupon.deleteMany({});
    const couponsWithUser = couponsData.map((c) => ({
      ...c,
      user: demoUser._id
    }));
    await Coupon.insertMany(couponsWithUser);
    logger.info(`Seeded ${couponsData.length} coupons.`);

    // 6. Bank Offers
    await BankOffer.deleteMany({});
    await BankOffer.insertMany(bankOffersData);
    logger.info(`Seeded ${bankOffersData.length} bank offers.`);

    // 7. Cashback Offers
    await CashbackOffer.deleteMany({});
    await CashbackOffer.insertMany(cashbackOffersData);
    logger.info(`Seeded ${cashbackOffersData.length} cashback offers.`);

    // 8. Festival Campaigns
    await FestivalCampaign.deleteMany({});
    await FestivalCampaign.insertMany(festivalCampaignsData);
    logger.info(`Seeded ${festivalCampaignsData.length} festival campaigns.`);

    // 9. Blog Posts
    await BlogPost.deleteMany({});
    await BlogPost.insertMany(blogPostsData);
    logger.info(`Seeded ${blogPostsData.length} blog posts.`);

    logger.info('Promotional Hub database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    logger.error(`Seeding failure: ${err.message}`, err.stack);
    process.exit(1);
  }
}

seedDatabase();
