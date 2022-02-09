import {
  LOGIN_USER, REGISTER_USER, AUTH_USER
} from '../_actions/types';

const initialState = null;

//previousState, action => nextState
const user_reducer = (state = initialState, action) => { 
  switch(action.type){
    case LOGIN_USER:
      return {...state, loginSuccess: action.payload}; //받은 paylaod를 loginSuccess에 넣어준다.
    case REGISTER_USER:
      return {...state, success: action.payload};
    case AUTH_USER:
      return {...state, userData: action.payload};
      default:
      return state;
  }
}

export default user_reducer;