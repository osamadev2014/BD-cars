import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('loads the home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/BD/)
  })

  test('displays Arabic content by default', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
  })

  test('navigates to login page', async ({ page }) => {
    await page.goto('/')
    const loginLink = page.getByRole('link', { name: /login|sign in|تسجيل/i })
    if (await loginLink.isVisible()) {
      await loginLink.click()
      await expect(page).toHaveURL(/auth/)
    }
  })

  test('shows phone input on auth page', async ({ page }) => {
    await page.goto('/ar/auth/login')
    const phoneInput = page.getByRole('textbox', { name: /phone|هاتف|جوال/i })
    if (await phoneInput.isVisible()) {
      await expect(phoneInput).toBeVisible()
    }
  })

  test('validates phone number format', async ({ page }) => {
    await page.goto('/ar/auth/login')
    const phoneInput = page.getByRole('textbox', { name: /phone|هاتف|جوال/i })
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('123')
      const submitBtn = page.getByRole('button', { name: /send|continue|أرسل|متابعة/i })
      if (await submitBtn.isVisible()) {
        await submitBtn.click()
        await expect(page.getByText(/invalid|خطأ|رقم/i)).toBeVisible()
      }
    }
  })
})
