import {
  GET_ONLINE_USERS,
  LISTEN_INCOMING_CALL,
  LISTEN_MY_SOCKET_ID,
  RESET_INCOMING_CALL,
  SOCKET_CONNECT,
} from "../constants/socketConstants";

export const socketReducer = (state = {}, action) => {
  switch (action.type) {
    case SOCKET_CONNECT:
      return { ...state, socket: action.payload };
    case GET_ONLINE_USERS:
      return { ...state, onlineUsers: action.payload };
    case LISTEN_INCOMING_CALL:
      return { ...state, call: action.payload };
    case LISTEN_MY_SOCKET_ID:
      return { ...state, mySocketId: action.payload };
    case RESET_INCOMING_CALL:
      return { ...state, call: {} };
    default:
      return state;
  }
};

// export const socketReducer = (state = {}, action) => {
//   switch (action.type) {
//     case SOCKET_CONNECT:
//       return { ...state, socket: action.payload };
//     case EMIT_USER_JOINED:
//       return { ...state, user: action.payload };
//     case EMIT_CALL_USER:
//       return {
//         ...state,
//         callOffered: action.payload,
//       };
//     case LISTEN_ME:
//       return { ...state, mySocketId: action.payload };
//     case LISTEN_NEW_USER:
//       return { ...state, onlineUsers: action.payload };
//     case LISTEN_CALL_USER:
//       return {
//         ...state,
//         call: {
//           isReceivingCall: true,
//           offer: action.payload.offer,
//           caller: {
//             socketId: action.payload.from.socketId,
//             name: action.payload.from.name,
//           },
//         },
//       };
//     case LISTEN_CALL_ACCEPTED:
//       return { ...state, answer: action.payload.answer };
//     case LISTEN_NEW_ICE_CANDIDATE:
//       return {
//         ...state,
//         candidate: action.payload.candidate,
//       };
//     default:
//       return state;
//   }
// };
