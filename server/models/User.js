const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token : {
    type: String
  },
  tokenExp: {
    type: Number
  }
})

userSchema.pre('save', function(next){
  const user = this //스키마 정보 가져오기위함.

  //password가 변경되었을때만 암호화 후 저장.
  if(user.isModified('password')){

    //salt 생성
    bcrypt.genSalt(saltRounds, function(err, salt){
      if(err) return next(err)

      //hash 생성
      bcrypt.hash(user.password, salt, function(err,hash){
        if(err) return next(err)
        user.password = hash
        next()
      })
    })  
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
  bcrypt.compare(plainPassword, this.password, function(err, isMatch){
    if(err) return cb(err);
    cb(null, isMatch);
  })
}

userSchema.methods.generateToken = function(cb){
  const user = this;
  const payload = {_id:user._id.toHexString()};
  let token = jwt.sign(payload, 'secretToken', { expiresIn: '1h' }) //id와 키 값으로 토큰 생성
  user.token = token;
  user.save(function(err, user){
    if(err) return cb(err);
    cb(null, user)
  })
}

userSchema.statics.findByToken = function(token, cb){
  const user = this;
  //토큰을 decode
  jwt.verify(token, 'secretToken', function(err, decoded){ //토큰과 키 값을 알기때문에 id decode 가능.
    if(err) return cb(err);
    //토큰에 포함된 _id 정보와 일치하는 _id가 있는지 확인
    user.findOne({"_id": decoded}, function(err, user){
      if(err) return cb(err);
      cb(null, user);
    })
  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User };