import { Flex } from "@chakra-ui/react";
import React from "react";
import GameTableCard from "./GameTableCard";
import { TableCard } from "./TableCard";

/**
 * A component for game table cards container.
 */
export default function GameTable(props: {
  /** A list of cards currently in the game to show on the table. */
  gameTableCards: TableCard[];
}) {
  return (
    <Flex justifyContent="space-evenly" flexWrap="wrap" marginBottom="4rem">
      {/* show game table card for each card on the table */}
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
