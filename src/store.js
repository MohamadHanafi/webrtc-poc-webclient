import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { loginReducer } from "./redux/reducers/loginReducer";
import { socketReducer } from "./redux/reducers/socketReducer";
import { callReducer } from "./redux/reducers/callReducer";

const reducer = combineReducers({
  login: loginReducer,
  socket: socketReducer,
  call: callReducer,
});

const middleware = [thunk];

const initialState = {};

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
