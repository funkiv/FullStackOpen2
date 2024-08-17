

const totalLikes = (blogs) => {
  return blogs.reduce((acc, currentValue) => acc + currentValue.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let topBlog = blogs.reduce((mostLikes, current) =>
    mostLikes.likes < current.likes ? current : mostLikes,{ likes: 0, })

  return({
    title: topBlog.title,
    author: topBlog.author,
    likes: topBlog.likes
  })
}

const mostBlogs = (blogs) => {
  if (!blogs[0]) {
    return { error: 'no blogs found' }
  }

  let authorCounters = []

  blogs.forEach((blog) => {
    let authorEntry = authorCounters.find(e => e.author === blog.author)

    if(authorEntry) {
      authorEntry.blogs++
    } else {
      authorCounters.push({
        author: blog.author,
        blogs: 1
      })
    }
  })

  //reduces authorCounters array down to the most amount of blogs
  return authorCounters.reduce((mostLikes, current) =>
    mostLikes.blogs < current.blogs ? current : mostLikes)

}

const mostLikes = (blogs) => {
  if (!blogs[0]) {
    return { error: 'no blogs found' }
  }

  let authorCounters = []

  blogs.forEach((blog) => {
    let authorEntry = authorCounters.find(e => e.author === blog.author)

    if(authorEntry) {
      authorEntry.likes = authorEntry.likes + blog.likes
    } else {
      authorCounters.push({
        author: blog.author,
        likes: blog.likes
      })
    }
  })

  //reduces authorCounters array down to the most amount of blogs
  return authorCounters.reduce((mostLikes, current) =>
    mostLikes.likes < current.likes ? current : mostLikes)

}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}