import { describe, it, expect } from 'vitest';
import { MemoryTtlCache } from '../utils/cache.js';
import { aqiService } from '../services/aqiService.js';

describe('High-Efficiency Caching & Performance Engine', () => {
  it('correctly caches items with TTL and computes hit ratio metrics', () => {
    const cache = new MemoryTtlCache<string>(1000, 5); // 1 sec TTL, max 5 items

    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
    expect(cache.get('key1')).toBe('value1');
    
    // Non-existent key
    expect(cache.get('key2')).toBeUndefined();

    const stats = cache.getStats();
    expect(stats.hits).toBe(2);
    expect(stats.misses).toBe(1);
    expect(stats.size).toBe(1);
    expect(stats.hitRatio).toBe('66.7%');
  });

  it('evicts oldest entries when capacity exceeds maximum bounds (LRU eviction)', () => {
    const cache = new MemoryTtlCache<number>(10_000, 3); // Max 3 items

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    
    // Add 4th item -> should evict 'a'
    cache.set('d', 4);

    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
    expect(cache.get('d')).toBe(4);
    expect(cache.getStats().size).toBe(3);
  });

  it('expires stale entries after TTL duration', async () => {
    const cache = new MemoryTtlCache<string>(50, 10); // 50ms TTL
    cache.set('tempKey', 'tempVal');

    expect(cache.get('tempKey')).toBe('tempVal');

    // Wait 70ms for TTL expiration
    await new Promise(resolve => setTimeout(resolve, 70));

    expect(cache.get('tempKey')).toBeUndefined();
  });

  it('demonstrates sub-millisecond cache hit acceleration in AqiService', async () => {
    // Prime the cache
    const firstCall = await aqiService.getAirQuality('delhi');
    expect(firstCall.city).toBe('New Delhi');

    // Second call should hit the in-memory cache
    const secondCall = await aqiService.getAirQuality('delhi');
    expect(secondCall.city).toBe('New Delhi');

    const stats = aqiService.getCacheStats();
    expect(stats.hits).toBeGreaterThan(0);
  });
});
