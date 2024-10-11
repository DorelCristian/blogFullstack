const express =require('express');
const mongoose = require('mongoose');
const User=require('./models/User');
const cors=require('cors');
const bcrypt = require('bcryptjs');
const app=express();
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');

const salt=bcrypt.genSaltSync(10);
const secret='asdjkhsadwey732sad';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

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
            res.cookie('token',token).json({
                id:userDoc._id,
                username,
            });
       });
       
        //res.json();

    }
    else{
        //not loggedin
        res.status(400).json('wrong credentials');
    }
});


app.get('/profile',(req,res)=>{
    const {token}=req.cookies;
    jwt.verify(token,secret,{},(err,info)=>{
        if(err)throw err;
        res.json(info);
    });
    //res.json(req.cookies);
});

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
});

app.listen(4000);

//mongodb+srv://soropdorelcristian:<RU7FqchhtdUnGvDY>@cluster0.ynoaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//soropdorelcristian
//RU7FqchhtdUnGvDY