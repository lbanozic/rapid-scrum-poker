/**
 * A type for all values associated with a card that player has in hands.
 */
export type PlayingCard = {
  /** Selected card value, for example: "3", "5", "8", or "13". */
  value: string;

  /** Flag which determines if player selected the card. */
  isSelected?: boolean;
};
