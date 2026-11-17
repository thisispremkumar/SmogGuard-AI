import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';

describe('SmogGuard AI Backend API Routes', () => {
  it('GET /api/health returns healthy system status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.version).toBe('1.0.0');
  });

  it('GET /api/aqi returns comprehensive air quality and thermal inversion data', async () => {
    const res = await request(app).get('/api/aqi?city=delhi');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.city).toBe('New Delhi');
    expect(res.body.data.thermalInversion).toBeDefined();
    expect(res.body.data.forecastHourly.length).toBe(24);
  });

  it('GET /api/indoor-hacks returns engineering-backed air quality hacks', async () => {
    const res = await request(app).get('/api/indoor-hacks');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.length).toBeGreaterThan(3);
    const crBox = res.body.data.find((h: { id: string }) => h.id === 'corsi-rosenthal-box');
    expect(crBox).toBeDefined();
    expect(crBox.effectivenessPm25).toBeGreaterThanOrEqual(90);
  });

  it('POST /api/impact/calculate returns quantified personal and community impact', async () => {
    const payload = {
      carpoolDaysPerWeek: 3,
      heatingTempDropDegC: 1.5,
      diyFilterActive: true,
      transitShift: false,
    };
    const res = await request(app).post('/api/impact/calculate').send(payload);
    expect(res.status).toBe(200);
    expect(res.body.data.personalImpact.pm25PercentReduction).toBeGreaterThan(40);
    expect(res.body.data.communityImpact.co2AvoidedWeeklyKg).toBeGreaterThan(0);
  });

  it('POST /api/routine/generate creates custom schedule with inversion alerts', async () => {
    const payload = {
      name: 'Sharma Family',
      vulnerableMembers: ['asthmatic', 'infant'],
      commuteMode: 'car_solo',
      heatingType: 'natural_gas',
      cookingFuel: 'gas_stove',
      hasAirPurifier: true,
      locationName: 'New Delhi',
    };
    const res = await request(app).post('/api/routine/generate').send(payload);
    expect(res.status).toBe(200);
    expect(res.body.data.routineSchedule.length).toBeGreaterThanOrEqual(4);
    expect(res.body.data.vulnerableProtectionGuide.length).toBeGreaterThan(0);
  });

  it('POST /api/assistant/chat delivers grounded advice with safety pills', async () => {
    const payload = {
      message: 'My 6-year-old has asthma and the smog is 250 today. What should we do?',
      location: 'New Delhi',
    };
    const res = await request(app).post('/api/assistant/chat').send(payload);
    expect(res.status).toBe(200);
    expect(res.body.data.answer).toBeDefined();
    expect(res.body.data.groundedFacts.length).toBeGreaterThan(0);
    expect(res.body.data.actionPills.length).toBeGreaterThan(0);
  });

  it('POST /api/community/reports accepts valid report and rejects invalid payload', async () => {
    const validReport = {
      neighborhood: 'Maple District',
      type: 'wood_burning_smoke',
      details: 'Dense smoke from wood stove lingering at ground level.',
      severity: 'warning',
    };
    const res = await request(app).post('/api/community/reports').send(validReport);
    expect(res.status).toBe(201);
    expect(res.body.data.neighborhood).toBe('Maple District');

    // Invalid payload test
    const invalidRes = await request(app).post('/api/community/reports').send({
      neighborhood: '',
      type: 'invalid_type',
    });
    expect(invalidRes.status).toBe(400);
    expect(invalidRes.body.status).toBe('fail');
  });
});

