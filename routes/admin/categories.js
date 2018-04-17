//Created by: Edem Dumenu
//Date: 4/13/2018
//Description: This page handles routes for categories

const express = require('express');
const router = express.Router();  //Creating a router for our endpoints
const Category = require('../../models/Category');   //Importing the category schema to be used
const faker = require('faker');


router.all('/*',(req, res, next)=>{ //**Overriding default home page** Handling all routes after the admin in the header
    req.app.locals.layout = 'admin';   //Changing the default layout to admin
    next();    //Next is used ot execute this function and then move to other routes
});

//Get request to obtain categories
router.get('/', (req, res)=>{
    //Using the find function to retrieving all the categories from the database
    Category.find({}).then(categories=>{
        //Display the admin post page with the values from the post database
        //The first posts is an array that is going to contain all the posts
        res.render('admin/categories/index', {categories: categories});
    })

    // res.render('admin/categories/index');
});

//Post request to obtain categories
router.post('/create', (req, res)=>{

    const newCategory = new Category({
        name: req.body.name
    });
    newCategory.save().then(category=>{
        req.flash('success_message', `${category.name} was successfully created!`);
        res.redirect('/admin/categories')
    }).catch(error=>{
        console.log('Category could not be saved! ' + error);
    });

    // res.render('admin/categories/index');
});

router.get('/edit/:id', (req, res)=>{
    Category.findOne({_id: req.params.id}).then(category=>{
        res.render('admin/categories/edit', {category: category});
    });
});

router.put('/edit/:id', (req, res)=>{
    Category.findOne({_id: req.params.id}).then(category=>{
        category.name = req.body.name;
        category.save().then(savedCategory=>{
            req.flash('success_message', `${savedCategory.name} was successfully updated!`);
            res.redirect('/admin/categories');
        });
    });
});

router.delete('/:name/:id', (req, res)=>{
    Category.remove({_id: req.params.id}).then(result=>{
        req.flash('success_message', `${req.params.name} was successfully deleted!`);
        res.redirect('/admin/categories');
    });
});

module.exports = router;