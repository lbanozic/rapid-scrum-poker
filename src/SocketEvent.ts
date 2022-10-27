/**
 * An enum for all socket events used in a card game.
 */
export enum SocketEvent {
  /** Event emitted when the client connects. */
  Connect = "connect",

  /** Event for letting the clients know that the game updated. */
  UpdateGame = "updateGame",

  /** Event for letting the clients know that the cards have been reset in the game. */
  RestartPlayingCards = "restartPlayingCards",

  /** Event emitted when the client starts a game. */
  StartGame = "startGame",

  /** Event emitted when the client requests game info. */
  GetGame = "getGame",

  /** Event emitted when the client joins a game. */
  JoinGame = "joinGame",

  /** Event emitted when the client updates player's card info. */
  UpdatePlayerCard = "updatePlayerCard",

  /** Event emitted when the client reveals the cards in a game. */
  RevealCards = "revealCards",

  /** Event emitted when the client restars a game. */
  RestartGame = "restartGame",

  /** Event emitted when the client renames a player. */
  RenamePlayer = "renamePlayer",

  /** Event emitted when the client leaves a game. */
  LeaveGame = "leaveGame",
}
