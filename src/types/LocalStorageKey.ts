/**
 * An enum for local storage keys used in the game.
 */
export enum LocalStorageKey {
  /** Current game player's id. */
  PlayerId = "player-id",

  /** Current game player's name. */
  PlayerName = "player-name",

  /** Value that identifies the card game and that was generated after the game creator started the game. For example, 3xbmQlFt0M. */
  CreatedGameId = "created-game-id",
}
