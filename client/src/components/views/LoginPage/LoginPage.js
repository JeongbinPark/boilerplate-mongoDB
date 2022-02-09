import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {loginUser} from '../../../_actions/user_action'


function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }

  const onSubmitHandler = (event) => {
    event.preventDefault(); //페이지 refresh 방지

    let body = {
      email : Email,
      password : Password
    }

    //loginUser라는 action
    dispatch(loginUser(body))
    .then(res =>{
      if(res.payload.loginSuccess){
        navigate('/');
      } else{
        alert(res.payload.message);
      }
    })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <form 
      style={{display: 'flex', flexDirection:'column'}}
      onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler}/>
        <br />
        <button>Login</button>
      </form>
    </div>
  )
}

export default LoginPage
