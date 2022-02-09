import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action'

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  }

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  }

  const onSubmitHandler = (event) => {
    event.preventDefault(); //페이지 refresh 방지
    
    if(Password !== ConfirmPassword){
      return alert("비밀번호 확인은 같아야 합니다.")
    }

    let body = {
      email : Email,
      name : Name,
      password : Password
    }

    //registerUser라는 action
    dispatch(registerUser(body))
    .then(res =>{
      if(res.payload.success){
        navigate('/');
      } else{
        alert("Error");
        console.log(res.payload.error);
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
        <input type="email" value={Email} onChange={onEmailHandler} autoComplete="off"/>
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} autoComplete="off"/>
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} autoComplete="off"/>
        <label>Confirm Password</label>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} autoComplete="off"/>
        <br />
        <button>회원가입</button>
      </form>
    </div>
  )
}

export default RegisterPage
