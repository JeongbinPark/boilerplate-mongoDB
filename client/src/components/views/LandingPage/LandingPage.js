import React, {useState, useEffect} from 'react'
import {Link, useLocation} from 'react-router-dom'
import axios from 'axios';

function LandingPage() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [UserName, setUserName] = useState('사용자');

  useEffect(()=>{
    axios.get('/api/users/checkLoggedIn')
    .then(res=>{
      console.log(res);
      if(res.data.isLoggedIn) {
        setIsLoggedIn(true);
        setUserName(res.data.userName);
      }
      else setIsLoggedIn(false);
    })
    .catch(err=>console.log(err));
  },[location])
  
  const onLogoutHandler = () =>{
    axios.get('/api/users/logout')
    .then(res => {
      if(res.data.success) {
        setIsLoggedIn(false);
      }
      else alert(res.data.err);
    })
    .catch(err => console(err));
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
     <h1>시작페이지</h1> 
     {!isLoggedIn && <Link to="/login"><button>로그인</button></Link>}
     {isLoggedIn 
     && <div>
        <div>반갑습니다, {UserName} 님.</div>
        <button onClick={onLogoutHandler}>로그아웃</button>
       </div>}
       <Link to="/register"><button>회원가입</button></Link>
    </div>
  )
}

export default LandingPage
