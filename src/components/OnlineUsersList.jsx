import React, { useContext, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { SocketContext } from "../context/socketContext";
import { WebRTCContext } from "../context/webRTCContext";

const OnlineUsersList = () => {
  const { callUser } = useContext(WebRTCContext);

  const { onlineUsers, mySocketId } = useContext(SocketContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(onlineUsers);
  }, [onlineUsers]);

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
                  onClick={() => callUser(user.socketId)}
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
