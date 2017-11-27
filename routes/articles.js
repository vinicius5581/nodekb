const express = require('express');
const router = express.Router();

// Models
const Article = require('../models/article');
const User = require('../models/user');

// Add Article View Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_article', {
    title: 'Add Article'
  });
});

// Add Article POST Route
router.post('/add', function(req, res){
  req.checkBody('title', 'Title is required').notEmpty();
  // req.checkBody('author', 'Author is required').notEmpty();
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
    article.author = req.user._id;
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
router.get('/edit/:id', ensureAuthenticated,function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(err){
      console.log(err);
    } else {
      if(article.author != req.user._id){
        req.flash('danger', 'Not Authorized');
        res.redirect('/');
      }
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
  if(!req.user._id) {
    res.status(500).send();
  }
  const query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id) {
      res.status(500).send();
    } else {
      Article.remove(query, function(err){
        if (err) {
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Get Article View Route
router.get('/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    User.findById(article.author, function(err, user) {
      res.render('article', {
        article: article,
        author: user.name
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}


module.exports = router;
