const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const { title, author, url, likes } = request.body
    const user = request.user
    if (!user) {
        return response.status(400).json({ error: 'userId missing or not valid' })
    }
    if (!title || !url) {
        return response.status(400).json({ error: 'title or url missing' });
    }
    const blog = new Blog({ title, author, url, likes, user })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const { id } = request.params
    const blog = await Blog.findById(id)
    const user = request.user
    if (!user) {
        return response.status(400).json({ error: 'userId missing or not valid' })
    }
    if ( blog.user.toString() === user.id.toString() ) {
        const deletedBlog = await Blog.findByIdAndDelete(id)
        if (!deletedBlog) {
            return response.status(404).json({ error: 'blog not found' })
        }
        const index = user.blogs.findIndex(blog => blog._id === id)
        if (index !== -1) {
            index.splice(index, 1)
        }
        await user.save()
        return response.status(204).end()
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const { id } = request.params
    const { title, author, url, likes } = request.body
    const blog = await Blog.findById(id)
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }
    if (title !== undefined) blog.title = title
    if (author !== undefined) blog.author = author
    if (url !== undefined) blog.url = url
    if (likes !== undefined) blog.likes = likes
    const updatedBlog = await blog.save()
    response.status(200).json(updatedBlog)
})

module.exports = blogsRouter