const { User } = require("../models/User");

let auth = (req, res, next) => {
  let token = req.cookies.x_auth;

  //현재 쿠키에 저장된 토큰으로부터 사용자 _id를 찾아내고 전달.
  User.findByToken(token, (err, user)=>{
    if(err) throw err;
    if(!user.length) return res.json({ isAuth: false, error: true})

    //여기에서 req에 token과 user를 넣어주면, 다음 단계에 req 정보에서 가져다 쓸 수 있다.
    req.token = token;
    req.user = user;
    next();
  })

}

module.exports = {auth}