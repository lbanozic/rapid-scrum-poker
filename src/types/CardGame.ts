import { CardGamePlayer } from "./CardGamePlayer";

/**
 * A type for storing all state data for a single game.
 */
export type CardGame = {
  /** Value that identifies the card game. For example, tMgpRFo9Fd. */
  id: string;

  /** Flag which determines if all cards are revealed in the game. */
  areCardsRevealed: boolean;

  /** Array which holds all the game's current players. */
  players: CardGamePlayer[];
};
