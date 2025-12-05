const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const { title, author, url, likes } = request.body
    if (!title || !url) {
        return response.status(400).json({ error: 'title or url missing' });
    }
    const blog = new Blog({ title, author, url, likes })
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const { id } = request.params
    const deletedBlog = await Blog.findByIdAndDelete(id)
    if (!deletedBlog) {
        return response.status(404).json({ error: 'blog not found' })
    }
    return response.status(204).end()
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