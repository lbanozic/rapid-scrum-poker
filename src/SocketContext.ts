import React from "react";
import { Socket } from "socket.io-client";

type SocketContextValues = {
  socket: Socket | undefined;
  setSocket: (socket: Socket) => void;
};

export const SocketContext = React.createContext<SocketContextValues>({
  socket: undefined,
  setSocket: () => {},
});
