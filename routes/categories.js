var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })

router.get('/show/:category', function(req, res, next) {
    var posts = db.get('posts');

    posts.find({category: req.params.category},{},function(err, posts){
        res.render('index',{
            'title': req.params.category,
            'posts': posts
        });
    });
});


router.get('/add', function(req, res, next) {

  //  var categories = db.get('categories');

    // categories.find({},{}, function(err, categories){
        res.render('addcategory',{
            "title": "Add Category",
       //     "categories": categories

        });
    });



//router.post('/add', multer({ dest: './uploads/'}).single('myimage'), function(req,res,next){

router.post('/add', upload.single('mainimage'), function(req, res, next){
    // Ger form values
    var title    = req.body.title;
    

   /* if(req.files.mainimage){
//     if (req.hasOwnProperty('file')){
            console.log('Uploading files...');
     

        var mainImageOriginalName = req.files.mainimage.originalname;
        var mainImageName         = req.files.mainimage.name;
        var mainImageMime         = req.files.mainimage.mimetype;
        var mainImagePath         = req.files.mainimage.path;
        var mainImageExt          = req.files.mainimage.extension;
        var mainImageSize         = req.files.mainimage.size;
    } else {
        var mainImageName = 'noimage.png';
    }*/
  

    // Form Validation

    req.checkBody('title', 'Title field is required').notEmpty();

    // Check Errors

    var errors = req.validationErrors();

    if(errors){
        res.render('addcategory', {
            "erors": errors,
            "title": title
         });
    } else {
        var categories = db.get('categories');

        // Submit to db
        categories.insert({
            "title": title
            
        }, function(err, category){
            if(err){
                res.send('There was an issue submitting the category');
            } else {
                req.flash('success', 'Category Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});

module.exports = router;



/*
// Form Validation

    req.checkBody('title', 'Title field is required').notEmpty();

    // Check Errors

    var errors = req.validationErrors();

    if(errors){
        res.render('addcategory', {
            "erors": errors,
            "title": title,
        });
    } else {
        var posts = db.get('categories');

        // Submit to db
        categories.insert({
            "title": title
            
        }, function(err, category){
            if(err){
                res.send('There was an issue submitting the category');
            } else {
                req.flash('success', 'Category Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});


module.exports = router;

*/
  /*  // Form Validation
    req.checkBody('title','Title field is fucking required').notEmpty();
    console.log("WTF 3");


    // Check Errors
    
    var errors = req.validationErrors();

    if(errors){
        res.render('addcategory',{
            "errors": errors,
            "title" : title
        });
    } else {
        var categories = db.get('categories');

            // Submit to db
        categories.insert({

            "title": title,
        }, function(err,category){
            if(err){
                res.send('There was an issue submitting the category');
            } else {
                req.flash('success','Category Added');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});

module.exports = router;



/*
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');


router.get('/show/:category', function(req, res, next) {

    var db = req.db;
    var posts = db.get('posts');
    posts.find({category: req.params.category}, {}, function(err, posts){
        res.render('index', {
            "title": req.params.category,
            "posts": posts
        });
    });
});


router.get('/add', function(req, res, next) {

   // var categories = db.get('categories');

     //categories.find({},{}, function(err, categories){
        res.render('addcategory',{
            "title": "Add Category",
       //     "categories": categories
        });
    });



//router.get('/add', function(req, res, next) {
  //  res.render('addcategory', {
    //    "title": "Add Category"
    //});
//});

router.post('/add', function(req, res, next){
  //  router.post('/add', upload.single('mainimage'), function(req, res, next){

    // Ger form values
    var title    = req.body.title;

    // Form Validation

    req.checkBody('title', 'Title field is fuck required').notEmpty();

    // Check Errors

    var errors = req.validationErrors();

    if(errors){
        res.render('addcategory', {
            "errors": errors,
            "title": title
        });
    } else {
        var categories = db.get('categories');

        // Submit to db
        categories.insert({
            "title": title
        }, function(err, category){
            if(err){
                res.send('There was an issue submitting the category');
            } else {
                 req.flash('success', 'Category Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});

module.exports = router;
*/