const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const logger = require('./logger');

const sampleCampaigns = [
  {
    title: 'CloudScale Pro: Annual Dev Subscription 40% Off',
    description: 'Scale your microservices and Kubernetes deployments effortlessly with automated load balancing, global edge CDN, and 99.99% uptime guarantee. Activate developer perks today.',
    promotionalContent: 'COUPON CODE: DEVSCALE40\nRedeem at cloudscale.io/checkout. Valid for all new team and enterprise tier subscriptions throughout Q3.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    category: 'Technology',
    targetAudience: 'DevOps Engineers, CTOs, and Full-Stack Developers',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    budget: 15000
  },
  {
    title: 'Aura Minimalist Mechanical Keyboards — Flash Drop',
    description: 'Aircraft-grade anodized aluminum body, custom hot-swappable switches, sound dampening silicon pads, and multi-device Bluetooth connectivity.',
    promotionalContent: 'PROMO CODE: AURATACTILE\nIncludes free coiled aviator cable and custom PBT keycap set on orders over $120. Limited to first 500 orders.',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
    category: 'E-commerce',
    targetAudience: 'Hardware Enthusiasts, Remote Programmers, and Gamers',
    startDate: new Date(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: 'active',
    budget: 7500
  },
  {
    title: 'PulseFit Smart Health Band: Buy One Get One 50% Off',
    description: 'Continuous biometric heart-rate variability, sleep architecture monitoring, VO2 max estimation, and 14-day battery life with water resistance up to 50 meters.',
    promotionalContent: 'VOUCHER: PULSEBOGO50\nAdd any 2 PulseFit bands to cart and apply coupon at checkout. Free worldwide express shipping included.',
    imageUrl: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=1200&q=80',
    category: 'Healthcare',
    targetAudience: 'Athletes, Fitness Enthusiasts, and Health-Conscious Professionals',
    startDate: new Date(),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    status: 'active',
    budget: 12000
  },
  {
    title: 'FinEdge Wealth Intelligence: 3 Months Free Advisory',
    description: 'AI-assisted portfolio rebalancing, tax-loss harvesting, and multi-asset retirement tracking built for discerning modern investors.',
    promotionalContent: 'OFFER: FINEDGEFREE3M\nSign up with code at finedgewealth.com/promo. No credit card required for initial onboarding.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    category: 'Finance',
    targetAudience: 'Young Professionals, Tech Workers, and Private Investors',
    startDate: new Date(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    status: 'active',
    budget: 20000
  },
  {
    title: 'Artisan Roast Society: Speciality Single-Origin Discovery Box',
    description: 'Direct trade beans sourced ethically from high-altitude estates in Ethiopia, Colombia, and Guatemala. Roasted within 48 hours of dispatch.',
    promotionalContent: 'DISCOUNT: COFFEELOVER25\n25% off first 3 recurring subscription deliveries plus a complimentary barista pouring jug.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    category: 'Food & Beverage',
    targetAudience: 'Coffee Connoisseurs and Specialty Foodies',
    startDate: new Date(),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: 'active',
    budget: 5000
  },
  {
    title: 'Nordic Wool Knitwear Winter Pre-Season Launch',
    description: '100% sustainable Merino wool sweaters, cardigans, and beanies crafted using circular zero-waste knitting techniques.',
    promotionalContent: 'EARLY ACCESS: NORDICWINTER\nEnjoy 20% early-bird discount on all pre-orders before October 15th.',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80',
    category: 'Fashion',
    targetAudience: 'Eco-conscious shoppers, outdoor adventurers, and urban professionals',
    startDate: new Date(),
    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    status: 'active',
    budget: 9000
  }
];

async function seed() {
  try {
    logger.info('Connecting to MongoDB Atlas for sample data seeding...');
    await mongoose.connect(process.env.MONGODB_URI);

    // Create demo promoter account if not already created
    const demoEmail = 'alex.morgan@promotehub.com';
    let demoUser = await User.findOne({ email: demoEmail });

    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Morgan',
        email: demoEmail,
        password: 'Password123!',
        company: 'Vanguard Growth Marketing',
        bio: 'Senior Growth & Product Marketing Lead with 8+ years scaling high-converting B2B and consumer promotional campaigns.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      });
      logger.info(`Created demo user: ${demoUser.email} (Password: Password123!)`);
    } else {
      logger.info(`Demo user already exists: ${demoUser.email}`);
    }

    // Check existing campaigns
    const existingCount = await Campaign.countDocuments({ user: demoUser._id });
    if (existingCount === 0) {
      const campaignsToInsert = sampleCampaigns.map((camp) => ({
        ...camp,
        user: demoUser._id
      }));
      await Campaign.insertMany(campaignsToInsert);
      logger.info(`Successfully seeded ${campaignsToInsert.length} rich sample campaigns!`);
    } else {
      logger.info(`Database already contains ${existingCount} campaigns for demo user.`);
    }

    logger.info('Seed process completed successfully.');
  } catch (err) {
    logger.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
