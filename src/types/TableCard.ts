/**
 * A type for all values associated with a card on the table.
 */
export type TableCard = {
  /** Player's id in the game. */
  playerId: string;

  /** Player's name in the game holding the card. */
  playerName: string;

  /** Card value, for example: "3", "5", "8", or "13". */
  value?: string;

  /** Flag which determines if card is revealed on the table. */
  isRevealed?: boolean;

  /** Flag which determines if card is selected on the table. */
  isSelected?: boolean;
};
