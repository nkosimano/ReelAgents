import { test, expect } from '@playwright/test';

test.describe('Agent Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock agent authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: {
          id: '2',
          email: 'agent@test.com',
          user_metadata: { role: 'agent' }
        }
      }));
    });
    
    await page.goto('/dashboard');
  });

  test('should display agent dashboard correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('text=Welcome to your agent dashboard')).toBeVisible();
    
    // Should show agent-specific stats
    await expect(page.locator('text=Available Campaigns')).toBeVisible();
    await expect(page.locator('text=Active Projects')).toBeVisible();
    await expect(page.locator('text=Earnings This Month')).toBeVisible();
  });

  test('should navigate to profile page', async ({ page }) => {
    await page.click('text=My Profile');
    await expect(page).toHaveURL(/.*\/agent\/profile/);
    await expect(page.locator('h1')).toContainText('Agent Profile');
  });

  test('should navigate to campaigns page', async ({ page }) => {
    await page.click('text=Available Campaigns');
    await expect(page).toHaveURL(/.*\/agent\/campaigns/);
    await expect(page.locator('h1')).toContainText('Available Campaigns');
  });

  test('should navigate to earnings page', async ({ page }) => {
    await page.click('text=My Earnings');
    await expect(page).toHaveURL(/.*\/agent\/earnings/);
    await expect(page.locator('h1')).toContainText('Earnings');
  });

  test('should filter available campaigns', async ({ page }) => {
    await page.goto('/agent/campaigns');
    
    // Use filter dropdown
    await page.selectOption('select >> nth=0', 'Social Media Marketing');
    
    // Should filter campaigns (mock data would be filtered)
    await expect(page.locator('text=Social Media Marketing')).toBeVisible();
  });

  test('should apply to a campaign', async ({ page }) => {
    await page.goto('/agent/campaigns');
    
    // Click apply button on first campaign
    await page.click('button:has-text("Apply Now") >> nth=0');
    
    // Should show application confirmation or modal
    await expect(page.locator('button:has-text("Apply Now") >> nth=0')).toBeDisabled();
  });
});