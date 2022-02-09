import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {auth} from '../_actions/user_action';

const Auth = (SpecificComponent, option, adminRouter = null) =>{
  //option
  //null -> 아무나 출입가능
  //true -> 로그인한 유저만 출입 가능한 페이지 
  //false -> 로그인한 유저는 출입 불가능한 페이지

  function AuthenticationCheck(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      dispatch(auth())
      .then(res=>{
        console.log(res)
        if(!res.payload.isAuth){  //로그인 전 상태
          if(option){  //로그인 전 & 로그인한 유저용 페이지 접속
            navigate('/login');
          }
        } else {  //로그인 한 상태
          if(adminRouter && !res.payload.isAdmin){ //관리자용 라우트 접근 & 관리자가 아닌 경우
            navigate('/');
          } else {
            if(!option){  //로그인 후 & 비로그인용 페이지 접속
              navigate('/')
            }
          }
        }
      })
      .catch(err=>console.log(err));
    }, [])

    return (<SpecificComponent />)
  }

  return <AuthenticationCheck />
}

export default Auth;