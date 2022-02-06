import { Flex } from "@chakra-ui/react";
import React from "react";
import GameTableCard from "./GameTableCard";
import { TableCard } from "./TableCard";

export default function GameTable(props: { gameTableCards: TableCard[] }) {
  return (
    <Flex justifyContent="space-evenly" flexWrap="wrap" marginBottom="4rem">
      {props.gameTableCards.map((gameTableCard) => (
        <GameTableCard
          key={gameTableCard.playerName}
          playerName={gameTableCard.playerName}
          value={gameTableCard.value ?? undefined}
          isSelected={gameTableCard.isSelected}
          isRevealed={gameTableCard.isRevealed}
        />
      ))}
    </Flex>
  );
}
