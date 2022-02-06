import { HStack } from "@chakra-ui/layout";
import React from "react";
import GamePlayingCard from "./GamePlayingCard";
import { PlayingCard } from "./PlayingCard";

export default function GamePlayerHands(props: {
  playingCards: PlayingCard[];
  onCardSelected: (selectedCardValue: string) => void;
}) {
  function playingCardSelected(selectedCardValue: string) {
    props.onCardSelected(selectedCardValue);
  }

  return (
    <HStack spacing={2} position="fixed" bottom="2rem">
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
