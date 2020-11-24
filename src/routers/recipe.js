const express = require('express');
const router = new express.Router();
const multer = require("multer");
const sharp = require('sharp');
const ejs = require('ejs'); const path = require("path");
const Recipe = require("../models/Recipe");
const auth = require("../middleware/auth");
const { findOneAndDelete } = require('../models/Recipe');

//add new recipe//
router.post("/recipes", auth, async (req, res) => {
    // const task = new Task(req.body);
    console.log("adding new recipe");
    const recipe = new Recipe({
        ...req.body, //copiyng all the properties from body
        owner: req.user._id
    })

    try {
        await recipe.save();
        res.status(201).send(recipe);
    }
    catch (e) {
        res.status(400).send(e);
    }

    console.log(recipe);

})

//update recipe//
router.patch("/recipes/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["title", "ingredients", "instructions", "image"];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if (!isValidOperation) {
        res.status(400).send(({ error: "Invalid update" }));
    }

    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, owner: req.user._id })

        if (!recipe) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            recipe[update] = req.body[update];
        })
        await recipe.save();

        res.send(recipe);
    }
    catch (e) {
        res.status(400).send(e);
    }
})

//get user's recipes//
router.get("/recipes", auth, async (req, res) => {

    try {
        const recipes = await Recipe.find({ owner: req.user._id });
        res.send(recipes);
    }
    catch (e) {
        res.status(500).send();
    }

})

//get all recipes//
router.get("/allrecipes", async (req, res) => {
    try {
        const recipes = await Recipe.find({});
        res.send(recipes);
    }
    catch (e) {
        res.status(500).send();
    }
})

//display user recipe by id (public route for all users to see recipe)//
router.get("/usersrecipes/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const recipe = await Recipe.findOne({ _id})
        if (!recipe) {
            return res.status(404).send();
        }
        res.send(recipe);
    }
    catch (e) {
        res.status(500).send();
    }

})

//get recipe by id//
router.get("/recipes/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const recipe = await Recipe.findOne({ _id, owner: req.user._id })
        if (!recipe) {
            return res.status(404).send();
        }
        res.send(recipe);
    }
    catch (e) {
        res.status(500).send();
    }

})

//delete recipe//
router.delete("/recipes/:id", auth, async (req, res) => {
    try {
        const recipe = await findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!recipe) {
            return res.status(404).send();
        }
        res.send(recipe);
    }
    catch (e) {
        res.status(500).send(e);
    }
})

//set storage engine//

const storage = multer.diskStorage({
    destination: "/public/uploads/",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

//init upload//

const upload = multer({
    storage: storage
}).single("img");


// routs to upload delete and get recipe image //
router.post('/myrecipes/recipeimage', auth, async (req, res) => {
    const _id = req.params.id; //user id
    const recipe = await Recipe.findOne({ _id, owner: req.user._id })
    
    const buffer = await sharp(req.file.buffer).resize({ width: 500, height: 500 }).png().toBuffer()
    console.log(buffer);
    console.log(req.user);
    // // req.user.avatar = buffer
    // await req.user.save()
    console.log(req.file);
    res.send("test");
    // res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/myrecipes/recipeimage', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send(req.user)
})

router.get('/myrecipes/recipeimage', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})



module.exports = router;


// const express = require('express');
// const router = new express.Router();
// const Recipe = require("../models/Recipe");

// router.post("/recipe", async (req, res) => {
//     const recipe = new Recipe(req.body);
//     //async await
//     try {
//         await recipe.save()   //save the recipe
//         res.status(201).send(user);
//     }
//     catch (e) {
//         res.status(400).send(e);
//     }

//     console.log(recipe);

// })

// //get all recipes//
// router.get("/recipes", async(req,res)=> {
//     try {
//         const recipes = await Recipe.find({});
//         res.send(recipes);
//     }
//     catch(e) {
//         res.status(500).send();
//     }
// })

// //get recipes by title//
// router.get("/recipes/:title", async(req,res)=> {
//     const title = req.params.title;

//     try {
//         const recipes = await Recipe.find({title});
//         res.send(recipes);
//     }
//     catch(e) {
//         res.status(500).send();
//     }
// })


// router.patch("/recipe/:id", async(req,res)=> {
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ["title", "ingredients", "instructions", "video"];
//     const isValidOperation = updates.every((update)=> {
//         return allowedUpdates.includes(update);
//     }) //if I'll return true for every item, every will return true, otherwise, it will return false

//     if(!isValidOperation) {
//         return res.status(400).send({error: "invalid update"});
//     }
//     try {
//         const recipe = await Recipe.findById(req.params.id);
//         updates.forEach((update)=> {
//             recipe[update] = req.body[update]
//         })
//         await recipe.save();
//         // const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true});

//         if(!recipe) {
//             return res.status(404).send()
//         }
//         res.send(recipe);
//     }
//     catch (e) {
//         res.status(400).send(e);
//     }
// })

// //delete recipe//
// router.delete("/recipe/:id", async(req,res)=> {
//     try {
//         const recipe = await Recipe.findByIdAndDelete(req.params.id);

//         if(!recipe) {
//             return res.status(404).send();
//         }
//         res.send(recipe);
//     }
//     catch(e) {
//         res.status(500).send(e);
//     }
// })


// module.exports = router;