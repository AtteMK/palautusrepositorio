const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const { test, beforeEach, after, describe } = require('node:test')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token = null

const initialBlogs = [
    {
    title: "First blog",
    author: "Alice",
    url: "http://example.com/1",
    likes: 5
    },
    {
    title: "Second blog",
    author: "Bob",
    url: "http://example.com/2",
    likes: 10
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const testUser = {
        username: "testuser",
        name: "Test User",
        password: "password123"
    }

    await api.post('/api/users').send(testUser)

    const login = await api
        .post('/api/login')
        .send({ username: "testuser", password: "password123" })

    token = login.body.token

    const user = await User.findOne({ username: "testuser" })

    const blogsWithUser = initialBlogs.map(blog => ({ ...blog, user: user._id }))
    await Blog.insertMany(blogsWithUser)
})

after(async () => {
    await mongoose.connection.close();
})

describe('GET /api/blogs', () => {
    test('of returns blogs as JSON', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.length, initialBlogs.length, 'Incorrect number of blogs returned')
    })

    test('of blog entries contain an id field instead of _id', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]
        assert(blog.id, 'id field is missing')
        assert(!blog._id, '_id field should not exist')
    })
})

describe('POST /api/blogs', () => {
    test('of adds a new blog', async () => {
        const newBlog = {
            title: "New blog",
            author: "Jorlie Joplin",
            url: "http://somerandomurl.com/new_blog",
            likes: 7
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const blogsAtEnd = await Blog.find({}).lean()
        assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1, 'Blog count did not increase by 1')

        const titles = blogsAtEnd.map(blog => blog.title)
        assert(titles.includes(newBlog.title), 'New blog was not added correctly')
        const addedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
        assert.strictEqual(addedBlog.author, newBlog.author)
        assert.strictEqual(addedBlog.url, newBlog.url)
        assert.strictEqual(addedBlog.likes, newBlog.likes)
    })

    test('of without likes value gets default value 0', async () => {
        const newBlog = {
            title: "Blog without likes",
            author: "Jorlie Joplin",
            url: "http://somerandomurl.com/new_blog"
        }
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const addedBlog = await Blog.findById(response.body.id).lean()

        assert.ok(addedBlog.likes === 0, 'Likes field did not default to 0')
    })

    test('of without title returns 400', async () => {
        const blogWithoutTitle = {
            author: "Eve",
            url: "http://example.com/no-title",
            likes: 3
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blogWithoutTitle)
            .expect(400)
        assert.ok(response.status === 400, 'Expected status 400 for missing title')
    })

    test('of without url returns 400', async () => {
        const blogWithoutUrl = {
            title: "Blog without url",
            author: "Eve",
            likes: 3
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blogWithoutUrl)
            .expect(400)
        assert.ok(response.status === 400, 'Expected status 400 for missing url')
    })
})

describe('DELETE /api/blogs/:id', () => {
    test('of removes a blog', async () => {
        const blogsAtStart = await Blog.find({}).lean()
        assert.ok(blogsAtStart.length > 0, 'No blogs available to delete')

        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await Blog.find({}).lean()
        assert.strictEqual(blogsAtEnd.length,blogsAtStart.length - 1,'Blog count did not decrease by 1')

        const ids = blogsAtEnd.map(blog => blog._id.toString())
        assert.ok(!ids.includes(blogToDelete._id.toString()), 'Deleted blog still exists')
    })
})

describe('PUT /api/blogs/:id', () => {
    test('of updates a blog', async () => {
        const blogsAtStart = await Blog.find({}).lean()
        assert.ok(blogsAtStart.length > 0, 'No blogs available to update')

        const blogToUpdate = blogsAtStart[0]

        const updateData = {
            title: "Updated Title",
            author: "Updated Author",
            url: "http://updated-url.com",
            likes: 42
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate._id}`)
            .send(updateData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const updatedBlog = response.body
        assert.strictEqual(updatedBlog.title, updateData.title, 'Title not updated')
        assert.strictEqual(updatedBlog.author, updateData.author, 'Author not updated')
        assert.strictEqual(updatedBlog.url, updateData.url, 'URL not updated')
        assert.strictEqual(updatedBlog.likes, updateData.likes, 'Likes not updated')

        const blogInDb = await Blog.findById(blogToUpdate._id).lean()
        assert.strictEqual(blogInDb.title, updateData.title, 'DB title not updated')
        assert.strictEqual(blogInDb.author, updateData.author, 'DB author not updated')
        assert.strictEqual(blogInDb.url, updateData.url, 'DB URL not updated')
        assert.strictEqual(blogInDb.likes, updateData.likes, 'DB likes not updated')
    })
})