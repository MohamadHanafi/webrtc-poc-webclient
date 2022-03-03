import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { callUser } from "../redux/actions/callActions";

const OnlineUsersList = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);
  // const onlineUsers = {};
  // const mySocketId = null;
  const { onlineUsers, mySocketId } = socket;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (onlineUsers) {
      setUsers(onlineUsers);
    }
    console.log(onlineUsers);
  }, [socket, onlineUsers]);

  return users.length > 0 ? (
    <Table striped bordered hover responsive className="table-sm mt-3">
      <thead>
        <tr>
          <th>Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.socketId}>
            <td>{user.name}</td>
            <td>
              {user.socketId !== mySocketId ? (
                <Button
                  variant="primary"
                  onClick={() => dispatch(callUser(user.socketId))}
                >
                  Call
                </Button>
              ) : (
                <div>connected</div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <div>No users online</div>
  );
};

export default OnlineUsersList;
