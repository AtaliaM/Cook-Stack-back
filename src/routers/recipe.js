const express = require('express');
const router = new express.Router();
const Recipe = require("../models/Recipe");
const auth = require("../middleware/auth");
const { findOneAndDelete } = require('../models/Recipe');


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

router.patch("/recipes/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "complete"];
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


router.get("/recipes", auth, async (req, res) => {

    try {
        const recipes = await Recipe.find({ owner: req.user._id });
        res.send(recipes);
    }
    catch (e) {
        res.status(500).send();
    }

})

//get all recipes
router.get("/allrecipes", async (req, res) => {
    try {
        const recipes = await Recipe.find({});
        res.send(recipes);
    }
    catch (e) {
        res.status(500).send();
    }
})


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