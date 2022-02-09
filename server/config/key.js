//환경에 따른 환경 변수 지정
if(process.env.NODE_ENV === 'production'){  //배포(deploy) 이후 환경
  module.exports = require('./prod');
} else {  //Local 환경
  module.exports = require('./dev')
}