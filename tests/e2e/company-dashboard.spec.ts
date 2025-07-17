import { test, expect } from '@playwright/test';

test.describe('Company Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: {
          id: '1',
          email: 'company@test.com',
          user_metadata: { role: 'company' }
        }
      }));
    });
    
    await page.goto('/dashboard');
  });

  test('should display company dashboard correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('text=Welcome to your company dashboard')).toBeVisible();
    
    // Should show company-specific stats
    await expect(page.locator('text=Active Campaigns')).toBeVisible();
    await expect(page.locator('text=Digital Twins')).toBeVisible();
    await expect(page.locator('text=Connected Agents')).toBeVisible();
  });

  test('should navigate to digital twins page', async ({ page }) => {
    await page.click('text=Digital Twins');
    await expect(page).toHaveURL(/.*\/company\/digital-twins/);
    await expect(page.locator('h1')).toContainText('Digital Twins');
  });

  test('should navigate to campaigns page', async ({ page }) => {
    await page.click('text=Campaigns');
    await expect(page).toHaveURL(/.*\/company\/campaigns/);
    await expect(page.locator('h1')).toContainText('Campaigns');
  });

  test('should open digital twin creation modal', async ({ page }) => {
    await page.goto('/company/digital-twins');
    
    await page.click('text=Begin AI Training');
    
    // Modal should open
    await expect(page.locator('text=Create Digital Twin')).toBeVisible();
    await expect(page.locator('input[placeholder*="Brand Ambassador"]')).toBeVisible();
  });

  test('should create a new campaign', async ({ page }) => {
    await page.goto('/company/campaigns');
    
    await page.click('text=New Campaign');
    
    // Fill out campaign form
    await page.fill('input[placeholder*="Summer Product Launch"]', 'Test Campaign');
    await page.fill('input[placeholder="5000"]', '10000');
    await page.fill('textarea[placeholder*="campaign goals"]', 'Test campaign description');
    
    await page.click('text=Create Campaign');
    
    // Should show success state or loading
    await expect(page.locator('button:has-text("Create Campaign")')).toBeDisabled();
  });

  test('should toggle dark mode', async ({ page }) => {
    // Click theme toggle
    await page.click('[aria-label="Toggle theme"]');
    
    // Should add dark class to html
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});