/**
 * API Integration and Smoke Test Suite
 * Tests end-to-end functionality against MongoDB Atlas and Express API
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Campaign = require('../src/models/Campaign');

const TEST_PORT = 5099;

async function runTests() {
  console.log('=== STARTING PROMOTEHUB INTEGRATION SMOKE TESTS ===');

  let server;
  try {
    // 1. Connect to DB
    console.log('1. Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB Atlas connected successfully.');

    // 2. Start HTTP server
    server = app.listen(TEST_PORT);
    const baseUrl = `http://localhost:${TEST_PORT}`;
    console.log(`✓ Test server running on ${baseUrl}`);

    // Helper for requests
    const request = async (endpoint, options = {}) => {
      const url = `${baseUrl}${endpoint}`;
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      const data = await res.json();
      return { status: res.status, headers: res.headers, body: data };
    };

    // 3. Test Health Endpoint
    console.log('2. Testing /api/health ...');
    const health = await request('/api/health');
    if (health.status !== 200 || health.body.status !== 'healthy') {
      throw new Error(`Health check failed: ${JSON.stringify(health.body)}`);
    }
    console.log('✓ Health check passed.');

    // Cleanup any lingering test user
    const testEmail = `smoketest_${Date.now()}@example.com`;
    await User.deleteMany({ email: { $regex: /smoketest_/ } });

    // 4. Test Registration
    console.log('3. Testing POST /api/auth/register ...');
    const regRes = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Smoke Tester',
        email: testEmail,
        password: 'Password123!',
        confirmPassword: 'Password123!'
      })
    });

    if (regRes.status !== 201 || !regRes.body.success) {
      throw new Error(`Registration failed: ${JSON.stringify(regRes.body)}`);
    }
    const token = regRes.body.token;
    const userId = regRes.body.data.user.id;
    console.log(`✓ Registration passed. User ID: ${userId}, Token received.`);

    // 5. Test Duplicate Registration Prevention
    console.log('4. Testing Duplicate Email Registration Prevention ...');
    const dupRes = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Smoke Tester',
        email: testEmail,
        password: 'Password123!',
        confirmPassword: 'Password123!'
      })
    });
    if (dupRes.status !== 400 || dupRes.body.success !== false) {
      throw new Error(`Duplicate check failed: Expected 400, got ${dupRes.status}`);
    }
    console.log('✓ Duplicate registration correctly rejected with 400.');

    // 6. Test Login
    console.log('5. Testing POST /api/auth/login ...');
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123!'
      })
    });
    if (loginRes.status !== 200 || !loginRes.body.token) {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
    }
    console.log('✓ Login passed.');

    // 7. Test Protected Route GET /api/auth/me
    console.log('6. Testing GET /api/auth/me with Bearer token ...');
    const meRes = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (meRes.status !== 200 || meRes.body.data.user.email !== testEmail) {
      throw new Error(`Auth /me failed: ${JSON.stringify(meRes.body)}`);
    }
    console.log('✓ Protected route GET /api/auth/me passed.');

    // 8. Test Campaign Creation POST /api/campaigns
    console.log('7. Testing POST /api/campaigns (Create Campaign) ...');
    const startDate = new Date();
    const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const createCampRes = await request('/api/campaigns', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: 'Smoke Test Summer Sale',
        description: 'Exclusive 50% discount across modern tech gadgets during this summer!',
        promotionalContent: 'Use coupon code SUMMER50 at checkout for 50% off.',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
        category: 'Technology',
        targetAudience: 'Software Engineers and Tech Enthusiasts',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: 'active',
        budget: 5000
      })
    });

    if (createCampRes.status !== 201 || !createCampRes.body.data.campaign) {
      throw new Error(`Campaign creation failed: ${JSON.stringify(createCampRes.body)}`);
    }
    const campaignId = createCampRes.body.data.campaign._id;
    console.log(`✓ Campaign created successfully! ID: ${campaignId}`);

    // 9. Test Campaign Detail GET /api/campaigns/:id
    console.log('8. Testing GET /api/campaigns/:id ...');
    const getCampRes = await request(`/api/campaigns/${campaignId}`);
    if (getCampRes.status !== 200 || getCampRes.body.data.campaign.title !== 'Smoke Test Summer Sale') {
      throw new Error(`Campaign fetch failed: ${JSON.stringify(getCampRes.body)}`);
    }
    console.log('✓ Campaign fetch by ID passed.');

    // 10. Test Campaign Public List GET /api/campaigns
    console.log('9. Testing GET /api/campaigns (Public Feed) ...');
    const listRes = await request('/api/campaigns?status=active&category=Technology');
    if (listRes.status !== 200 || !Array.isArray(listRes.body.data.campaigns)) {
      throw new Error(`Campaign list failed: ${JSON.stringify(listRes.body)}`);
    }
    console.log(`✓ Public campaign feed returned ${listRes.body.data.campaigns.length} campaigns.`);

    // 11. Test User Dashboard Stats GET /api/campaigns/user/stats
    console.log('10. Testing GET /api/campaigns/user/stats ...');
    const statsRes = await request('/api/campaigns/user/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (statsRes.status !== 200 || statsRes.body.data.stats.total < 1) {
      throw new Error(`User stats failed: ${JSON.stringify(statsRes.body)}`);
    }
    console.log(`✓ Dashboard stats passed. Active campaigns: ${statsRes.body.data.stats.active}`);

    // 12. Test Campaign Update PUT /api/campaigns/:id
    console.log('11. Testing PUT /api/campaigns/:id (Update Campaign) ...');
    const updateRes = await request(`/api/campaigns/${campaignId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: 'Smoke Test Summer Sale - Updated',
        status: 'paused'
      })
    });
    if (updateRes.status !== 200 || updateRes.body.data.campaign.title !== 'Smoke Test Summer Sale - Updated') {
      throw new Error(`Campaign update failed: ${JSON.stringify(updateRes.body)}`);
    }
    console.log('✓ Campaign updated successfully.');

    // 13. Test Ownership IDOR Protection
    console.log('12. Testing IDOR Security Barrier (Unauthorized Update) ...');
    // Register another user
    const otherUserEmail = `other_${Date.now()}@example.com`;
    const otherUserRes = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Attacker User',
        email: otherUserEmail,
        password: 'Password123!',
        confirmPassword: 'Password123!'
      })
    });
    const otherToken = otherUserRes.body.token;

    // Attacker tries to update the original user's campaign
    const unauthorizedUpdate = await request(`/api/campaigns/${campaignId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${otherToken}` },
      body: JSON.stringify({ title: 'Hacked Title' })
    });

    if (unauthorizedUpdate.status !== 403) {
      throw new Error(`Security Failure! Expected 403 Forbidden on IDOR attempt, got: ${unauthorizedUpdate.status}`);
    }
    console.log('✓ IDOR Protection verified: Unauthorized modification strictly blocked with 403 Forbidden.');

    // 14. Test Campaign Deletion DELETE /api/campaigns/:id
    console.log('13. Testing DELETE /api/campaigns/:id ...');
    const deleteRes = await request(`/api/campaigns/${campaignId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (deleteRes.status !== 200) {
      throw new Error(`Campaign deletion failed: ${JSON.stringify(deleteRes.body)}`);
    }
    console.log('✓ Campaign deleted successfully.');

    // 15. Clean up test users
    await User.deleteMany({ email: { $in: [testEmail, otherUserEmail] } });
    await Campaign.deleteMany({ title: { $regex: /Smoke Test/ } });
    console.log('✓ Test data cleaned up.');

    console.log('\n=============================================');
    console.log('🎉 ALL BACKEND SMOKE TESTS PASSED SUCCESSFULLY!');
    console.log('=============================================\n');

  } catch (err) {
    console.error('❌ TEST SUITE FAILED:', err.message);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
    await mongoose.disconnect();
    process.exit(process.exitCode || 0);
  }
}

runTests();
