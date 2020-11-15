const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Recipe = require("./Recipe");

const userSchema = new mongoose.Schema({ //we are defining a schema and passing it to User so we can take advantage of middleware
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique : true, //makes sure that users will register with unique email address
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) { //validate that people can't enter negative number for their age
            if (value < 0 ) {
                throw new Error ("age must be a positive number")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes("password")) {
                throw new Error("Password cannot contain 'password'");
            }
        }
    },
    tokens: [{ //array of objects
        token: {
            type: String,
            required:true,

        }
    }]
})

//virtual property: a relationship between 2 entities. it is NOT stored in the database. it's only for mongoose - to know the relation between the 2 entities

    userSchema.virtual('recipes', {
        ref: 'Recipe',
        localField: '_id',
        foreignField: 'owner',
    })

    userSchema.methods.toJSON = function(){
        const user = this;
        const userObject = user.toObject(); //gives back raw profile data

        delete userObject.password;
        delete userObject.tokens;

        return userObject;
    }

    userSchema.methods.generateAuthToken = async function () { //instances method
        const user = this;
        const token = jwt.sign({_id: user._id.toString()}, 'thisismycourse');
        //generating tokens and saving them to the database
        user.tokens = user.tokens.concat({token});
        await user.save();

        return token;
    }

    userSchema.statics.findByCredentials = async (email,password) => { //model method
        const user = await User.findOne({email});

        if(!user) {
            throw new Error ("unable to login");
        }

        const isMatched = await bcrypt.compare(password,user.password);

        if (!isMatched) {
            throw new Error ("unable to login");
        }

        return user;
    }

    //hash the plain text password before saving//
    userSchema.pre("save", async function(next) {
        const user = this;

        if(user.isModified("password")) { //will be true when the user first created or if the user updated his password
            user.password = await bcrypt.hash(user.password, 8);
        }


        next() //calling next when we are done
    })

    //delete user recipes when user is removed//
    userSchema.pre("remove", async function(next) {
        const user = this;

       await Recipe.deleteMany({owner: user._id})

        next();
    })

//defining a model
const User = mongoose.model('User', userSchema 
)

module.exports = User