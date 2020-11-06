const express = require('express');
const router = new express.Router();
const User = require("../models/User");

router.post("/users", async (req, res) => {
    const user = new User(req.body);
    //async await
    try {
        await user.save()   //save the user
        res.status(201).send(user);
    }
    catch (e) {
        // res.status(400).send(e);
        res.send(e);
    }

    console.log(user);
    //promises
    // user.save().then(() => {
    //     res.status(201).send(user);
    // }).catch((e) => {
    //     res.status(400);
    //     res.send(e);
    // })
})

router.post("/users/login", async(req,res)=> {
    const email = req.body.email;
    const password = req.body.password;
    try {
        // const user = await User.findByCredentials(req.body.email, req.body.password);
        const user = await User.find({email, password});

        res.send(user);
    } catch(e) {
        // res.status(400).send(e)
        res.send(e)
    }
})

router.get("/users", async(req,res)=> {

    try {
        const users = await User.find({});
        res.send(users);
    }
    catch(e) {
        // res.status(500).send();
        res.send(e);
    }

    // User.find({}).then((users)=> {
    //     res.send(users);
    // }).catch((err)=> {
    //     res.status(500).send()
    // }); //will fetch all users stored in the database. returns a promise

})

router.get("/users/:id", async (req,res)=> {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if(!user) {
            return res.status(404).send();
        }
        res.send(user);
    }
    catch (e) {
        // res.status(500).send()
        res.send(e)
    }

    // User.findById(_id).then((user)=> {
    //    if(!user) {
    //        return res.status(404).send();
    //    }
    //    res.send(user);
    // }).catch((err)=> {
    //     res.status(500).send()
    // }); 

})

//patch is designed for updating existing resources
router.patch("/users/:id", async(req,res)=> {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["email", "name", "password", "age"];
    const isValidOperation = updates.every((update)=> {
        return allowedUpdates.includes(update);
    }) //if I'll return true for every item, every will return true, otherwise, it will return false

    if(!isValidOperation) {
        return res.status(400).send({error: "invalid update"});
    }
    try {
        const user = await User.findById(req.params.id);
        updates.forEach((update)=> {
            user[update] = req.body[update]
        })
        await user.save();
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true});

        if(!user) {
            return res.status(404).send()
        }
        res.send(user);
    }
    catch (e) {
        // res.status(400).send(e);
        res.send(e);
    }
})

//deleting user//
router.delete("/users/:id", async(req,res)=> {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user) {
            return res.status(404).send();
        }
        res.send(user);
    }
    catch(e) {
        // res.status(500).send(e);
        res.send(e);
    }
})


module.exports = router;