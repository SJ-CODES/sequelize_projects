const express = require('express')
const app = express()
var session = require('express-session')
const models = require('./models')
const { Op } = require('sequelize')


var bcrypt = require('bcryptjs');
app.use("/css",express.static("css"))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))


const mustacheExpress = require('mustache-express')
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.urlencoded())


app.get('/blogs', (req, res) => {
    models.Blogs.findAll({})
    .then(blogs => {
        res.render('blogs', {blogs: blogs})
    })
})


app.post('/delete-blogs', (req, res) => {

    const BlogsId = req.body.BlogsId 

    models.Blogs.destroy({
        where: {
            id: BlogsId 
        }
    }).then(deletedBlogs => {
        res.redirect('/blogs')
    })
})


app.post('/blogs', (req, res) => {

    const title = req.body.title 
    const body = req.body.body
    const category = req.body.category
    const is_published = req.body.is_published

    let blogs = models.Blogs.build({
        title: title, 
        body: body, 
        category: category,
        is_published: is_published
    })

    blogs.save().then((savedBlogs) => {
        console.log(savedBlogs)
        res.render('blogs')
    })

})




app.listen(3000, () => {
    console.log('Server is running...')
})