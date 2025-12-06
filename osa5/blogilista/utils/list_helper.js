const dummy = (blogs) => {
  return(1)
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {

  return blogs.reduce((favorite, blog) => {
    if (!favorite || (blog.likes || 0) > (favorite.likes || 0)) {
      return blog
    }
    return favorite
  }, null)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const topAuthor = Object.keys(counts).reduce((max, author) => {
    return counts[author] > counts[max] ? author : max
  })

  return {
    author: topAuthor,
    blogs: counts[topAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc
  }, {})

  const topAuthor = Object.keys(likesCount).reduce((max, author) => {
    return likesCount[author] > likesCount[max] ? author : max
  })

  return {
    author: topAuthor,
    likes: likesCount[topAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}