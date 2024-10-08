const express =require('express');
const mongoose = require('mongoose');
const User=require('./models/User');
const cors=require('cors');
const bcrypt = require('bcryptjs');
const app=express();
const jwt=require('jsonwebtoken');

const salt=bcrypt.genSaltSync(10);
const secret='asdjkhsadwey732sad';

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://soropdorelcristian:RU7FqchhtdUnGvDY@cluster0.ynoaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register',async (req,res)=>{
    const {username,password}=req.body;
    try{
        const userDoc=await User.create({
            username,
            password:bcrypt.hashSync(password,salt),
            })
       // res.cookie('').(userDoc);
    }
    catch(e)
    {
        res.status(400).json(e);
    }
    
   
});

app.post('/login',async (req,res)=>{
    const{username,password} =req.body;
    const userDoc= await User.findOne({username})
    const passOk=bcrypt.compareSync(password, userDoc.password);
    if(passOk)
    {
        //logged in
       
       jwt.sign({username,id:userDoc._id},secret,{},(err,token)=>{
            if(err)throw err;
            res.json(token);
       });
       
        //res.json();

    }
    else{
        //not loggedin
        res.status(400).json('wrong credentials');
    }
});

app.listen(4000);

//mongodb+srv://soropdorelcristian:<RU7FqchhtdUnGvDY>@cluster0.ynoaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//soropdorelcristian
//RU7FqchhtdUnGvDY