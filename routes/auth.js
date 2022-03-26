const express = require('express')
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');

const generateToken = require('../config/authToken')
const {protect} = require('../middleware/fetchuser')
//Route 1 create user 
router.post('/register',[

    body('username','Enter a valid name').isLength({ min: 5 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Pawword must be atleast 5 layers').isLength({ min: 5 }),
],async (req, res)=>{

  const {username,email,password} = req.body;

//If thier is a bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array() });
    }
   //check whether user with same email exist 
   

    try {
   const userExists = await User.findOne({email:email}) 
   if(userExists ){
     return res.status(400).json({error : "Sorry user with this email exists"})
   }

   const salt = await bcrypt.genSalt(10);
   const HashPassword = await bcrypt.hash(password,salt)

   //create new user
 const  newUser= new User({
        username,
        email,
        password:HashPassword              
})
      const user = await newUser.save();
      res.status(200).json({
          user,
          token : generateToken(username.id)
      });
  } 
  catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured")
  }
})

//Route 2 authenticat user

router.post('/login',[
  body('username','Enter a valid username').isLength({ min: 5 }),
  body('password','Pawword must be atleast 5 layers').isLength({ min: 5 })
],async (req, res)=>{

  const errors = validationResult(req);
  const {username,password} = req.body;
  
  const user = await User.findOne({username});
  if(!user){
 
    return res.status(400).json({error:"Please enter correct credentails"})
  }

  console.log(user);
  const validate = await bcrypt.compare(password,user.password)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
   
   
    if(validate ){
   
      return res.status(400).json({error:"please enter rightly"})
    }
    const { password, ...others } = user._doc;
    res.status(200).json({others , token : generateToken(username.id)});
  }   catch (error) {

    res.status(500).send("some internal server error")
}
})

//route 3 get user details

router.get('/getuser',protect,async (req, res)=>{

try {
  const username = req.body.username;
  const user = await User.find({username}).select("-password")
  res.status(200).json(user);

} catch (error) {
  console.log(error.message);
  res.status(500).send("some internal server error")
}

})

module.exports =router