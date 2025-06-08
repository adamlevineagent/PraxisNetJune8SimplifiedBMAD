import { test, expect } from '@playwright/test';

// Test the landing page
test('landing page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Check page title
  await expect(page).toHaveTitle(/Praxis Network/);
  
  // Check main heading
  const heading = page.locator('h2:has-text("Your AI Advocate")');
  await expect(heading).toBeVisible();
  
  // Check email signup form
  const emailInput = page.locator('input[type="email"]');
  await expect(emailInput).toBeVisible();
  
  const submitButton = page.locator('button:has-text("Get Started")');
  await expect(submitButton).toBeVisible();
});

// Test user registration
test('user registration flow', async ({ page }) => {
  await page.goto('http://localhost:3000/register');
  
  // Fill registration form
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'Password123!');
  await page.fill('input[name="handle"]', 'test_user');
  await page.selectOption('select[name="disclosureLevel"]', 'OPEN');
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Check if redirected to onboarding
  await expect(page).toHaveURL(/onboard/);
});

// Test user login
test('user login flow', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  // Fill login form
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'Password123!');
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Check if redirected to profile
  await expect(page).toHaveURL(/profile/);
});

// Test onboarding chat
test('onboarding chat interaction', async ({ page }) => {
  // Login first
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  
  // Navigate to onboarding
  await page.goto('http://localhost:3000/onboard');
  
  // Check if chat interface is visible
  const chatInput = page.locator('.chat-input input');
  await expect(chatInput).toBeVisible();
  
  // Send a message
  await chatInput.fill('I am a builder who creates web applications');
  await page.click('button:has-text("Send")');
  
  // Check for response
  const response = page.locator('.message:not(.user-message)').last();
  await expect(response).toBeVisible({ timeout: 10000 });
});

// Test user profile
test('user profile displays correctly', async ({ page }) => {
  // Login first
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  
  // Navigate to profile
  await page.goto('http://localhost:3000/profile');
  
  // Check if profile elements are visible
  const profileHeading = page.locator('h2:has-text("Welcome")');
  await expect(profileHeading).toBeVisible();
  
  // Check tabs
  const opportunitiesTab = page.locator('button:has-text("Opportunities")');
  await expect(opportunitiesTab).toBeVisible();
  
  const profileTab = page.locator('button:has-text("My Profile")');
  await expect(profileTab).toBeVisible();
  
  // Click on profile tab
  await profileTab.click();
  
  // Check if position matrix is visible
  const positionMatrix = page.locator('h3:has-text("Position Matrix")');
  await expect(positionMatrix).toBeVisible();
});

// Test admin login
test('admin login flow', async ({ page }) => {
  await page.goto('http://localhost:3000/admin/login');
  
  // Fill login form
  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'AdminPass123!');
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Check if redirected to admin dashboard
  await expect(page).toHaveURL(/admin\/dashboard/);
});

// Test admin dashboard
test('admin dashboard displays correctly', async ({ page }) => {
  // Login first
  await page.goto('http://localhost:3000/admin/login');
  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'AdminPass123!');
  await page.click('button[type="submit"]');
  
  // Check if dashboard elements are visible
  const dashboardHeading = page.locator('h2:has-text("Admin Dashboard")');
  await expect(dashboardHeading).toBeVisible();
  
  // Check tabs
  const approvalsTab = page.locator('button:has-text("User Approvals")');
  await expect(approvalsTab).toBeVisible();
  
  const conversationsTab = page.locator('button:has-text("Conversation Audit")');
  await expect(conversationsTab).toBeVisible();
  
  const configTab = page.locator('button:has-text("System Config")');
  await expect(configTab).toBeVisible();
  
  // Click on config tab
  await configTab.click();
  
  // Check if system config is visible
  const configHeading = page.locator('h3:has-text("AI Models")');
  await expect(configHeading).toBeVisible();
});

// Test API endpoints
test('API endpoints return correct responses', async ({ request }) => {
  // Login to get token
  const loginResponse = await request.post('http://localhost:3001/api/auth/login', {
    data: {
      email: 'test@example.com',
      password: 'Password123!',
    },
  });
  
  expect(loginResponse.ok()).toBeTruthy();
  const loginData = await loginResponse.json();
  const token = loginData.access_token;
  
  // Test profile endpoint
  const profileResponse = await request.get('http://localhost:3001/api/users/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  expect(profileResponse.ok()).toBeTruthy();
  const profileData = await profileResponse.json();
  expect(profileData).toHaveProperty('handle', 'test_user');
  
  // Test opportunities endpoint
  const opportunitiesResponse = await request.get('http://localhost:3001/api/users/opportunities', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  expect(opportunitiesResponse.ok()).toBeTruthy();
  const opportunitiesData = await opportunitiesResponse.json();
  expect(Array.isArray(opportunitiesData)).toBeTruthy();
});
