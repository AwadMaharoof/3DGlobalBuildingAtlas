import { test } from '@playwright/test';

test.describe('WFS Cache Benchmark', () => {
  test('measure WFS requests for pan pattern A → B → C → A', async ({ page }) => {
    // Track WFS requests via network interception
    let wfsRequestCount = 0;
    const wfsRequests: string[] = [];

    page.on('request', (request) => {
      if (request.url().includes('geoserver') && request.url().includes('GetFeature')) {
        wfsRequestCount++;
        const url = new URL(request.url());
        wfsRequests.push(url.searchParams.get('bbox') || 'no-bbox');
      }
    });

    // Navigate and wait for app to load
    await page.goto('/');
    await page.waitForSelector('canvas', { timeout: 15000 });
    await page.waitForTimeout(2000);

    // Reset counter after initial load
    wfsRequestCount = 0;
    wfsRequests.length = 0;

    const panMap = async (deltaX: number, deltaY: number) => {
      const canvas = page.locator('canvas').first();
      const box = await canvas.boundingBox();
      if (!box) throw new Error('Canvas not found');

      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX + deltaX, centerY + deltaY, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(1500);
    };

    console.log('\n=== WFS Cache Benchmark ===\n');
    console.log('Pattern: A → B → C → A');
    console.log('Starting at Munich center (zoom 15)\n');

    console.log('Step 1: Pan to location B...');
    await panMap(-150, -100);

    console.log('Step 2: Pan to location C...');
    await panMap(250, 200);

    console.log('Step 3: Pan back to location A...');
    await panMap(-100, -100);

    console.log('\n=== Results ===');
    console.log(`Total WFS requests: ${wfsRequestCount}`);
    console.log('Request bboxes:');
    wfsRequests.forEach((bbox, i) => {
      console.log(`  ${i + 1}. ${bbox}`);
    });

    console.log(`\nExpected with no caching: 3 requests`);
    console.log(`Expected with caching: 2 requests (location A cached)`);
    console.log(`\nActual: ${wfsRequestCount} requests`);

    test.info().annotations.push({
      type: 'wfs_request_count',
      description: `${wfsRequestCount}`,
    });
  });

  test('measure WFS requests for repeated visits to same area', async ({ page }) => {
    let wfsRequestCount = 0;

    page.on('request', (request) => {
      if (request.url().includes('geoserver') && request.url().includes('GetFeature')) {
        wfsRequestCount++;
      }
    });

    await page.goto('/');
    await page.waitForSelector('canvas', { timeout: 15000 });
    await page.waitForTimeout(2000);

    // Reset counter after initial load
    wfsRequestCount = 0;

    const panMap = async (deltaX: number, deltaY: number) => {
      const canvas = page.locator('canvas').first();
      const box = await canvas.boundingBox();
      if (!box) throw new Error('Canvas not found');

      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX + deltaX, centerY + deltaY, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(1500);
    };

    console.log('\n=== Repeated Visit Benchmark ===\n');
    console.log('Pattern: Pan right → Pan left (return) × 3 times\n');

    for (let i = 0; i < 3; i++) {
      console.log(`Cycle ${i + 1}: Pan right...`);
      await panMap(-200, 0);
      console.log(`Cycle ${i + 1}: Pan left (return)...`);
      await panMap(200, 0);
    }

    console.log('\n=== Results ===');
    console.log(`Total WFS requests: ${wfsRequestCount}`);
    console.log(`\nExpected with no caching: 6 requests`);
    console.log(`Expected with perfect caching: 2 requests`);
    console.log(`\nActual: ${wfsRequestCount} requests`);

    test.info().annotations.push({
      type: 'wfs_request_count_repeated',
      description: `${wfsRequestCount}`,
    });
  });
});
