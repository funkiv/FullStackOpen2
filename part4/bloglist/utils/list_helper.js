const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, currentValue) => acc + currentValue.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let topBlog = blogs.reduce((mostLiked, current) =>
    mostLiked.likes < current.likes ? current : mostLiked,{ likes: 0, })

  return({
    title: topBlog.title,
    author: topBlog.author,
    likes: topBlog.likes
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}