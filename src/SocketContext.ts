import React from "react";
import { Socket } from "socket.io-client";

/**
 * A type for socket context values.
 */
type SocketContextValues = {
  /** A socket.io socket object. */
  socket: Socket | undefined;

  /**
   * Sets the given socket object to socket context.
   *
   * @param socket socket.io socket object to be set as socket context value
   */
  setSocket: (socket: Socket) => void;
};

/**
 * Create socket context so socket can be used throughout the application from any component.
 */
export const SocketContext = React.createContext<SocketContextValues>({
  socket: undefined,
  setSocket: () => {},
});
