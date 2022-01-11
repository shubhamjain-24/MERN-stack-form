const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const res = require('express/lib/response');


const employeeSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true
    },
    age:{
        type:Number,
    },
    password:{
        type:String,
        required:true,
    },
    confirmpassword:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]

})
// Tokens
employeeSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const token  = jwt.sign({_id:this._id.toString()},"mynameisshubhamjainyoutuber")
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        res.send(`the error is ${error}`)
    }
}
// Hashing
employeeSchema.pre("save",async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword = await bcrypt.hash(this.confirmpassword,10);
        
    }
    next();
})

// Creating collection

const Register = new mongoose.model("Register",employeeSchema);
module.exports= Register;