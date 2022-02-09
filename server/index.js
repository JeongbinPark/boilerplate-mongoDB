const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');
const config = require('./config/key');
const {auth} = require('./middleware/auth');

//mongo DB 연결
const mongoose = require('mongoose');
const { response, application } = require('express');
mongoose.connect(config.mongoURI).then(()=>console.log('MongoDB Connected....'))
  .catch(err=>console.log(err))


//application/x-ww-form-urlencoded 형식 parsing
app.use(bodyParser.urlencoded({extended:true}));
//application/json 형식 parsing
app.use(bodyParser.json());
//cookie에서 사용
app.use(cookieParser());

app.get('/', (req, res) => res.send('Hello world!'));

app.post('/api/users/register',(req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({success: true})
  })

})

app.post('/api/users/login', (req, res)=>{
   User.findOne({email:req.body.email},(err, user)=>{
     if(err) return res.json({err})
     //일치하는 이메일이 없는 경우
     if(!user) return res.json({loginSuccess: false, message:"잘못된 이메일입니다."})
     //비밀번호 비교
     user.comparePassword(req.body.password, (err, isMatch)=>{
       if(err) return res.json({err})
       //비밀번호가 일치하지 않는 경우
       if(!isMatch) return res.json({loginSuccess:false, message:"잘못된 비밀번호입니다."})
       //토큰 생성
       user.generateToken((err, user)=>{
         if(err) return res.status(400).send(err);
         //쿠키에 토큰 저장
         res.cookie("x_auth", user.token)
          .status(200)
          .json({loginSuccess:true, userId:user._id})
       })
     })
     
    })
})

app.get('/api/users/auth', auth, (req, res) => {
  //미들웨어를 통과해 온 것은 Authentication이 True 라는 것. false이면 middleware 단계에서 빠져나감.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0? false : true, //role이 0이면 일반사용자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id},{token:null}, (err, user)=>{
    if(err) return res.json({success:false, err});
    return res.clearCookie("x_auth").status(200).send({success:true});
  })
})

app.get('/api/users/checkLoggedIn', (req, res)=>{
  let token = req.cookies.x_auth;
  User.findByToken(token, (err, user)=>{
    if(err) return res.json({isLoggedIn : false});
    return res.send({isLoggedIn : true, userName: user.name});
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
