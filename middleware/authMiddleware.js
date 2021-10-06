const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (request, response, next) => {
    const  token = request.cookies.jwt;

    //Check if JWT exists and is verified
    if(token){
        jwt.verify(token, "Secret Code", (err, decodedToken) => {
            if(err){
                console.log(err.message);
                response.redirect('/login');
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }else{
        response.redirect('/login');
    }
}

//Check current user
const checkUser = (request, response, next) => {
    const token = request.cookies.jwt;

    if(token){
        jwt.verify(token, "Secret Code", async (err, decodedToken) => {
            if(err){
                console.log(err.message);
                response.locals.loggedInUser = null;
                next();
            }else{
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                response.locals.loggedInUser = user;
                next();
            }
        })
    }else{
        response.locals.loggedInUser = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };