import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
} from "../constants/loginConstants";

export const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { loading: true };
    case LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case LOGIN_FAILURE:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
