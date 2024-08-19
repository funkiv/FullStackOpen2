import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs(blogs)
      )
    }  
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setNewBlog(prevBlog => ({
      ...prevBlog,
      [name]: value
    }))}

  const handleFormSubmit = async (event) => {
      event.preventDefault()
      const response = await blogService.create(newBlog)
      console.log(response)
      setNewBlog({
        title: '',
        author: '',
        url: ''
      })
    }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
            type='text'
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}/>
          </div>
          <div>
          password
          <input
            type='password'
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}/>
          </div>
          <button type='submit'>Log in</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} is logged in</p>
      <button onClick={handleLogout}>Log out</button>
      <h1>create new</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          title:
          <input
          type="title"
          value={newBlog.title}
          name="title"
          onChange={handleFormChange}/>
        </div>
        <div>
          author:
          <input
          type="author"
          value={newBlog.author}
          name="author"
          onChange={handleFormChange}/>
        </div>
        <div>
          url:
          <input
          type="url"
          value={newBlog.url}
          name="url"
          onChange={handleFormChange}/>
        </div>
        <button type='submit'>Create</button>
      </form>
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App