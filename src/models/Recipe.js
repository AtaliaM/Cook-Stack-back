const mongoose = require('mongoose');
const validator = require('validator');

const RecipeSchema = new mongoose.Schema({ 
    title: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value==="") {
                throw new Error("you must provide title for your recipe");
            }
        }
    },
    ingredients: {
        type: Array,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (value==="") {
                throw new Error("you must provide ingredients");
            }
        }
    },
    instructions: {
        type: String,
        required: true,
        validate(value) { 
            if (value === "" ) {
                throw new Error ("you must provide instrucations for your recipe")
            }
        }
    },
    video: {
        type: String,
        trim: true,
        validate(value) {
            //to add validation of youtube url
            let re = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
            let result = re.test(value);
            if (!result) {
                throw new Error ("youtube link is invalid");
            }
        }
    },
    image: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'   //reference to the user model
    }
})

  

//defining a model
const Recipe = mongoose.model('Recipe', RecipeSchema 
)

module.exports = Recipe;