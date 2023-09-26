/**
 * A type for storing all state data for a player that is part of the card game.
 */
export type CardGamePlayer = {
  /** Value that identifies the card game player. For example, YkNtaQX2zl. */
  id: string;

  /** Name of the card game player. For example, "John". */
  name: string;

  /** Value of the player's card. For example: "3", "5", "8", or "13". */
  cardValue: string;

  /** Flag which determines if player's card is selected. */
  isCardSelected: boolean;
};
