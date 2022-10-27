import { HStack } from "@chakra-ui/react";
import React from "react";
import GamePlayingCard from "./GamePlayingCard";
import { PlayingCard } from "./PlayingCard";

/**
 * A component for player's cards container.
 */
export default function GamePlayerHands(props: {
  /** A list of cards currently in the player's hands. */
  playingCards: PlayingCard[];

  /**
   * Gets called when player selects a card.
   *
   * @param selectedCardValue value of selected card, for example: "3", "5", or "8"
   */
  onCardSelected: (selectedCardValue: string) => void;
}) {
  /**
   * Calls on card selected function prop.
   *
   * @param selectedCardValue value of selected card, for example: "3", "5", or "8"
   */
  function playingCardSelected(selectedCardValue: string) {
    props.onCardSelected(selectedCardValue);
  }

  return (
    <HStack spacing={2} position="fixed" bottom="2rem">
      {/* show game playing card for each card in player's hands */}
      {props.playingCards.map((playingCard) => (
        <GamePlayingCard
          key={playingCard.value}
          value={playingCard.value}
          isSelected={playingCard.isSelected}
          onCardSelected={playingCardSelected}
        />
      ))}
    </HStack>
  );
}
