var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var multer = require('multer');
var upload = multer({ dest: './public/images' });
var mongoose = require('mongoose');


router.get('/show/:id', function(req, res, next) {

    var posts = db.get('posts');

    posts.findOne(req.params.id, function(err, post){
        res.render('show',{
            "post": post
        });
    });
});


router.get('/add', function(req, res, next) {

    var categories = db.get('categories');

     categories.find({},{}, function(err, categories){
        res.render('addpost',{
            "title": "Add Post",
            "categories": categories
        });
    });
});


//router.post('/add', multer({ dest: './uploads/'}).single('myimage'), function(req,res,next){

router.post('/add', upload.single('mainimage'), function(req, res, next){
    // Ger form values
    var title    = req.body.title;
    var category = req.body.category;
    var body     = req.body.body;
    var author   = req.body.author;
    var date     = new Date();

if(req.file)
{
    console.log('Uploading file');
    var mainimage = req.file.filename;
}
else
{
    console.log('No image provided');
    var mainimage = 'noimage.png';
}
   /* if(req.files.mainimage){
}
}
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
   /* if(req.file){

       // var mainImageOriginalName = req.files.mainimage.originalname;
       // var mainImageName         = req.files.mainimage.name;
       // var mainImageMime         = req.files.mainimage.mimetype;
       // var mainImagePath         = req.files.mainimage.path;
       //var mainImageExt          = req.files.mainimage.extension;
       // var mainImageSize         = req.files.mainimage.size;
        console.log('Uploading files...');
        var mainimage = req.file.filename;


    }
    else{
        var mainimage = 'noimage.png';
    }*/



    // Form Validation

    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body','Body field is required');

    // Check Errors

    var errors = req.validationErrors();

    if(errors){
        res.render('addpost', {
            "erors": errors,
           // "title": title,
           // "body": body
        });
    } else {
        var posts = db.get('posts');

        // Submit to db
        posts.insert({
            "title": title,
            "body": body,
            "category": category,
            "date": date,
            "author": author,
            "mainimage": mainimage
        }, function(err, post){
            if(err){
                res.send('There was an issue submitting the post');
            } else {
                req.flash('success', 'Post Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});


router.post('/addcomment', function(req, res, next) {
  // Get Form Values
  var name = req.body.name;
  var email= req.body.email;
  var body = req.body.body;
  var postid= req.body.postid;
  var commentdate = new Date();

    // Form Validation
    req.checkBody('name','Name field is required').notEmpty();
    req.checkBody('email','Email field is required but never displayed').notEmpty();
    req.checkBody('email','Email is not formatted properly').isEmail();
    req.checkBody('body', 'Body field is required').notEmpty();

    // Check Errors
    var errors = req.validationErrors();

    if(errors){
        var posts = db.get('posts');
        posts.findById(postid, function(err, post){
            res.render('show',{
                "errors": errors,
                "post": post
            });
        });
    } else {
        var comment = {
            "name": name,
            "email": email,
            "body": body,
            "commentdate": commentdate
        }

        var posts = db.get('posts');

        posts.update({
            "_id": postid
        },{
            $push:{
                "comments": comment
            }
        }, function(err, doc){
            if(err){
                throw err;
            } else {
                req.flash('success', 'Comment Added');
                res.location('/posts/show/'+postid);
                res.redirect('/posts/show/'+postid);
            }
        });
    }
});
/*
    req.checkBody('name','Name field is required').notEmpty();
    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('email','Email not valid').isEmail();
    req.checkBody('username','Username field is required').notEmpty();
    req.checkBody('password','Password field is required').notEmpty();
    req.checkBody('password2','Password do not match').equals(req.body.password);

});


router.post('/addcomment', function(req, res, next){
    // Ger form values
    var name          = req.body.name;
    var email         = req.body.email;
    var body          = req.body.body;
    var postid        = req.body.postid;
    var commentdate   = new Date();

    // Form Validation

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not formatted correctly').isEmail();
    req.checkBody('body','Body field is required').notEmpty();

    // Check Errors

    var errors = req.validationErrors();

    if(errors){
        var posts = db.get('posts');
        potsts.findById(postid, function(err, post){
            res.render('show', {
                "erors": errors,
                "post": post
            });
        });

    } else {
        var comment = {
            "name": name,
            "email": email,
            "body": body,
            "commentdate": commentdate
        };

        var posts = db.get('posts');

        posts.update({
            "_id": postid
        },{
            $push:{
                "comments": comment
            }
        }, function(err, doc){
            if(err){
                throw err;
            } else {
                req.flash('success', 'Comment Added');
                res.location('/posts/show/'+postid);
                res.redirect('/posts/show/'+postid);
            }
        });

    }

});

*/
module.exports = router;
