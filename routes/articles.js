const express = require('express');
const router = express.Router();
const Article = require('../models/article');

// Add Article View Route
router.get('/add', function(req, res){
  res.render('add_article', {
    title: 'Add Article'
  });
});

// Add Article POST Route
router.post('/add', function(req, res){
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  // Get errors
  const errors = req.validationErrors();

  if (errors) {
    res.render('add_article', {
      title: 'Add Article',
      errors:errors
    });
  } else {
    const article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success', 'Article Added');
          res.redirect('/');
        }
    });
  }
});

// Update Article View Route
router.get('/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(err){
      console.log(err);
    } else {
      res.render('edit_article', {
        title: 'Edit Article',
        article: article
      });
    }
  });
});

// Update Article POST Route
router.post('/edit/:id', function(req, res){
  const article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  const query = {_id:req.params.id}

  Article.update(query, article, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Article Updated')
        res.redirect('/');
      }
  });
});

// Delete Article Route
router.delete('/:id', function(req,res){
  const query = {_id:req.params.id}
  Article.remove(query, function(err){
    if (err) {
      console.log(err);
    }
    res.send('Success');
  })
});

// Get Article View Route
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(err){
      console.log(err);
    } else {
      res.render('article', {
        article: article
      });
    }
  });
});

 module.exports = router;
