const User = require('../models/User');
const jwt = require("jsonwebtoken");


//Error handler
const handleErrors = (error) => {
    let errors = {email: '', password: ''};

    //Duplicate entries
    if(error.code === 11000){
        errors.email = 'That Email is already taken!';
        console.log(errors.email);
        return errors;
    }

    //Incorrect Email
    if(error.message === "Incorrect email!"){
        errors.email = "That email is not registered or incorrect!";
    }

    //Incorrect Password
    if(error.message === 'Incorrect password!'){
        errors.password = "That Password is incorrect!";
    }

    //Validation errors
    if(error.message.includes("user validation failed")){
        Object.values(error.errors).forEach((properties) => {
            errors[properties.path] = properties.message;
        });
    }

    if(errors.email !== '')
        console.log(errors.email);
    if(errors.password !== '')
        console.log(errors.password);
    
    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, 'Secret Code', {
        expiresIn: maxAge * 1000
    });
}

exports.home = (request, response) => {
    console.log("Rendered Home page!");
    response.render('home');
}

exports.smoothies = (request, response) => {
    console.log("Rendered Recipe page!");
    response.render('smoothies')
}

exports.signup_get = (request, response) => {
    console.log("Rendered Sign up page!");
    response.render('signup');
}

exports.signup_post = async (request, response) => {
    console.log("New user trying to sign up");
    const {email, password} = request.body;
    console.log("Email: ",email, "Password: ", password);
    try {
        const user = await User.create({email, password});
        
        const token = createToken(user._id);

        response.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000});

        console.log("Signup successful!");
        
        response.status(201).json({ user: user._id });
    } catch (error) {
        console.log("Signup failed...");
        const errors = handleErrors(error);
        response.status(400).json({ errors });
    } 
}

exports.login_get = (request, response) => {
    console.log("Rendered Login page!");
    response.render('login');
}

exports.login_post = async (request, response) => {
    const { email, password } = request.body;

    console.log(email + " is trying to login!");
    
    try{
        const user = await User.login(email, password);
        
        const token = createToken(user._id);
        
        response.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});

        console.log(email + " successfully logged in!");
        
        response.status(200).json({ user: user._id });

    } catch (error) {
        console.log("Login Failed!");
        
        const errors = handleErrors(error);
        
        response.status(400).json({ errors })
    }
}

exports.logout_get = (request, response) => {
    response.cookie('jwt', '', { maxAge: 1 });
    response.redirect('/');
}
