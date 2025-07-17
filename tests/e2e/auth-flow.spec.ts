import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/auth\/login/);
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });

  test('should allow user to sign up', async ({ page }) => {
    await page.goto('/auth/signup');
    
    await expect(page.locator('h1')).toContainText('Create Account');
    
    // Fill out signup form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form (this would normally create a user)
    await page.click('button[type="submit"]');
    
    // Should show loading state
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('should allow user to navigate to forgot password', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.click('text=Forgot password?');
    await expect(page).toHaveURL(/.*\/auth\/forgot-password/);
    await expect(page.locator('h1')).toContainText('Reset Password');
  });

  test('should validate form inputs', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('input:invalid')).toHaveCount(2);
  });
});