const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { BlogPosts } = require('./models');

const jsonParser = bodyParser.json();
const app = express();

//log the http layer
app.use(morgan('common'));

// prepopulated item in BlogPost
//  Note that to create a new blog post, you need to supply a
//  title, content, an author name, and (optionally) a publication date.
BlogPosts.create('IT', 'Killer clowns hide in sewers', 'Stephen King');
BlogPosts.create('Ten Little Indians', 'President Trump takes a page out of President Jackson\'s playbook!', 'America');

app.get('/blogposts', (req, res) => {
    res.json(BlogPosts.get());
})

app.post('/blogposts', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if (!(field in req.body)){
            const message = `Missing ${field} in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
})

app.put('/:id', jsonParser, (req, res) => {
    const requiredFields = [
        'id', 'title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    if (req.params.id !== req.body.id) {
      const message = (
        `Request path id (${req.params.id}) and request body id `
        `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updating blog post with id \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
      id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
    });
    res.status(204).end();
  });
  

// app.put('/blogposts/:id', jsonParser, (req, res) => {
//     const requiredFields = ['title', 'content', 'author']; 
//     for (let i = 0; i < requiredFields.length; i++){
//         const field = requiredFields[i];
//         if (!(field in req.body)){
//             const message = `Missing ${field} in request body`
//             console.error(message);
//             return res.status(400).send(message);
//         }
//         if (req.params.id !== req.body.id){
//             const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
//             console.error(message);
//             return res.status(400).send(message);
//         }
//         console.log(`Updating blog post item \`${req.params.id}\``);
//         BlogPosts.update({
//           title: req.params.title,
//           content: req.body.content,
//           author: req.body.author
//         });
//         res.status(204).end();
//     }
//     const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
//     res.status(201).json(item);
// })

app.delete('/blogposts/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted shopping list item ${req.params.id}`);
    res.status(204).end();
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
})