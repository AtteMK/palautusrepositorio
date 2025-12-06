import { test, expect, beforeEach, describe } from '@playwright/test'
import { loginWith } from './helper.js'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
  await expect(page.getByText('Log in to application')).toBeVisible()

  await expect(page.getByLabel('username')).toBeVisible()
  await expect(page.getByLabel('password')).toBeVisible()
  await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrongpassword')
      const notification = page.getByText('wrong username or password')
      await expect(notification).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByLabel('title:').fill('Testi blogi')
      await page.getByLabel('author:').fill('Testi Tero')
      await page.getByLabel('url:').fill('random url test')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Testi blogi by: Testi Tero')).toBeVisible()
    })
    describe('When blogs exist', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()

        await page.getByLabel('title:').fill('Testi blogi')
        await page.getByLabel('author:').fill('Testi Tero')
        await page.getByLabel('url:').fill('random url test')

        await page.getByRole('button', { name: 'create' }).click()

        await expect(page.getByText('Testi blogi by: Testi Tero')).toBeVisible()
      })
      test('a blog can be liked', async ({ page }) => {
        const blogContainer = page.locator('div', { hasText: 'Testi blogi by: Testi Tero' }).first()
        const viewButton = blogContainer.getByRole('button', { name: 'view' })
        await viewButton.click()

        const likeButton = blogContainer.getByRole('button', { name: 'like' })
        const likesText = blogContainer.locator('text=Likes:')

        await expect(likesText).toHaveText(/Likes: 0/)

        await likeButton.click()
        await expect(likesText).toHaveText(/Likes: 1/)

        await likeButton.click()
        await expect(likesText).toHaveText(/Likes: 2/)
      })
      test('user who created the blog can delete it', async ({ page }) => {
        const blogContainer = page.locator('div', { hasText: 'Testi blogi by: Testi Tero' }).first()

        await blogContainer.getByRole('button', { name: 'view' }).click()

        page.on('dialog', dialog => dialog.accept())

        await blogContainer.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('Testi blogi by: Testi Tero')).not.toBeVisible()
      })
      test('only the user who added the blog can see the delete button', async ({ page, request }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()

        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Mauno Muukalinen',
            username: 'maunomuu',
            password: 'password123'
          }
        })

        await loginWith(page, 'maunomuu', 'password123')

        const blogContainer = page.locator('div', { hasText: 'Testi blogi by: Testi Tero' }).first()
        await blogContainer.getByRole('button', { name: 'view' }).click()

        const removeButton = blogContainer.getByRole('button', { name: 'remove' })
        await expect(removeButton).not.toBeVisible()
      })
      test('blogs are arranged in order of likes with most liked first', async ({ page }) => {
        const createBlog = async (title, author, url) => {
          await page.getByRole('button', { name: 'create new blog' }).click()
          await page.getByLabel('title:').fill(title)
          await page.getByLabel('author:').fill(author)
          await page.getByLabel('url:').fill(url)
          await page.getByRole('button', { name: 'create' }).click()

          const blogLocator = page.locator(`.blog:has-text("${title} by: ${author}")`)
          await expect(blogLocator).toBeVisible()

          const blogId = await blogLocator.getAttribute('id')
          return blogId
        }

        const blog1Id = await createBlog('Kolmanneksi eniten tykkäyksiä', 'Jaakko Kolmonen', 'kolmas url3.com')
        const blog2Id = await createBlog('Eniten tykkäyksiä', 'Yrjö Ykkönen', 'eka url1.com')
        const blog3Id = await createBlog('Toiseksi eniten tykkäyksiä', 'Kalle Kakkonen', 'toka url2.com')

        const likeBlog = async (blogId, times) => {
          const blogContainer = page.locator(`#${blogId}`)
          await blogContainer.getByRole('button', { name: 'view' }).click()
          const likeButton = blogContainer.getByRole('button', { name: 'like' })

          for (let i = 0; i < times; i++) {
            await likeButton.click()
            await page.waitForTimeout(200)
          }
        }

        await likeBlog(blog3Id, 3) 
        await likeBlog(blog1Id, 1)
        await likeBlog(blog2Id, 6)

        const blogs = page.locator('.blog')
        const blogTexts = await blogs.allTextContents()

        expect(blogTexts[0]).toContain('Eniten tykkäyksiä by: Yrjö Ykkönen')
        expect(blogTexts[1]).toContain('Toiseksi eniten tykkäyksiä by: Kalle Kakkonen')
        expect(blogTexts[2]).toContain('Kolmanneksi eniten tykkäyksiä by: Jaakko Kolmonen')
        expect(blogTexts[3]).toContain('Testi blogi by: Testi Tero')
      })
    })
  })
})