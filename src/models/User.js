const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({ //we are defining a schema and passing it to User so we can take advantage of middleware
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        // unique : true, //makes sure that users will register with unique email address
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
    }})

    // userSchema.statics.findByCredentials = async (email,password) => {
    //     const user = await User.findOne({email});

    //     if(!user) {
    //         throw new Error ("unable to login");
    //     }

    //     const isMatched = await bcrypt.compare(password,user.password);

    //     if (!isMatched) {
    //         throw new Error ("unable to login");
    //     }

    //     return user;
    // }

    // //hash the plain text password before saving//
    // userSchema.pre("save", async function(next) {
    //     const user = this;

    //     if(user.isModified("password")) { //will be true when the user first created or if the user updated his password
    //         user.password = await bcrypt.hash(user.password, 8);
    //     }


    //     next() //calling next when we are done
    // })

//defining a model
const User = mongoose.model('User', userSchema 
)

module.exports = User