const express = require('express');
const path = require('path')
const app = express();
const hbs = require('hbs');
const jwt = require('jsonwebtoken');


require("./db/conn")
const Register = require("./models/register");
const bcrypt = require('bcryptjs/dist/bcrypt');

const port = process.env.PORT || 3000

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path)


app.get("/", (req, res) => {
    res.render("index")
})

app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/login", (req, res) => {
    res.render("login")
})

// create a new user in database
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword

            })
             // Generating tokens

             const token = await registerEmployee.generateAuthToken();
             console.log("the token part "+token)
                  // Password hash

           const registered= await registerEmployee.save();
           console.log("the page part"+ registered);
           res.status(201).render("index")
        }
        else {
            res.send("password not matching")
        }
    } catch (error) {
        res.status(400).send(error)
    }
})


// login validation

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password

       const useremail= await Register.findOne({email:email});
       const isMatch = await bcrypt.compare(password, useremail.password)

       const token = await useremail.generateAuthToken();
       console.log("the token part "+token)

       if(isMatch){
           res.status(201).render("index");
       }
       else{
           res.send("invalid credentials")
       }

    } catch (error) {
        res.status(400).send("invalid credentials")
    }
})


app.listen(port, () => {
    console.log(`server is running at port number ${port}`);
})