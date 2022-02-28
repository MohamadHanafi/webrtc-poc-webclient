import { users } from "../../data/users";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
} from "../constants/loginConstants";

export const loginRequest = (email, password) => async (dispatch) => {
  dispatch({
    type: LOGIN_REQUEST,
  });

  const user = users.find((user) => user.email === email);

  if (user && user.password === password) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: user,
    });
  } else {
    dispatch({
      type: LOGIN_FAILURE,
      payload: "Invalid credentials",
    });
  }
};
