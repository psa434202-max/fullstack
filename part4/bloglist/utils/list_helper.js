const dummy = (blogs) => 1

const totalLikes = (blogs) =>
  blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((fav, blog) => blog.likes > fav.likes ? blog : fav)
}

const mostBlogs = (blogs) => {
  const authors = {}
  blogs.forEach(blog => authors[blog.author] = (authors[blog.author] || 0) + 1)

  let maxAuthor = null
  let maxBlogs = 0
  for (const author in authors) {
    if (authors[author] > maxBlogs) {
      maxAuthor = author
      maxBlogs = authors[author]
    }
  }

  return { author: maxAuthor, blogs: maxBlogs }
}

const mostLikes = (blogs) => {
  const authors = {}
  blogs.forEach(blog => authors[blog.author] = (authors[blog.author] || 0) + blog.likes)

  let maxAuthor = null
  let maxLikes = 0
  for (const author in authors) {
    if (authors[author] > maxLikes) {
      maxAuthor = author
      maxLikes = authors[author]
    }
  }

  return { author: maxAuthor, likes: maxLikes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}