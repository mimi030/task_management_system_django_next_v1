/**
 * Here is a start for testing frontend.
 */

import { test, expect } from '@playwright/test';

test.describe('main navigation', () => {
    test.beforeEach(async ({ page }) => {
        // Go to the starting url before each test.
        await page.goto('http://localhost:3000');
    });

    test('should display the correct title',async ({ page }) => {
        // Check if the page has correct title
        await expect(page).toHaveTitle(/Task Management System/);
    })

    test('should navigate to the correct URL on load', async ({ page }) => {
        // Assertions use the expect API.
        await expect(page).toHaveURL('http://localhost:3000');
    });

    test('should navigate to the account registration page', async ({ page }) => {
        await page.goto('http://localhost:3000/auth/register', { waitUntil: 'networkidle' });
        await expect(page).toHaveURL('http://localhost:3000/auth/register');
    });

    test('should navigate to the forgot password page', async ({ page }) => {
        await page.goto('http://localhost:3000/auth/password/reset-password', { waitUntil: 'networkidle' });
        await expect(page).toHaveURL('http://localhost:3000/auth/password/reset-password');
    });
});
