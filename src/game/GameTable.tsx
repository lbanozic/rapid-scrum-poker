import { Flex } from "@chakra-ui/react";
import { TableCard } from "../types/TableCard";
import GameTableCard from "./GameTableCard";

/**
 * A component for game table cards container.
 */
export default function GameTable(props: {
  /** A list of cards currently in the game to show on the table. */
  gameTableCards: TableCard[];
}) {
  return (
    <Flex
      justifyContent="center"
      flexWrap="wrap"
      gap="2rem"
      alignItems="center"
      flex="1"
    >
      {/* show game table card for each card on the table */}
      {props.gameTableCards.map((gameTableCard) => (
        <GameTableCard
          key={gameTableCard.playerId}
          playerId={gameTableCard.playerId}
          playerName={gameTableCard.playerName}
          value={gameTableCard.value ?? undefined}
          isSelected={gameTableCard.isSelected}
          isRevealed={gameTableCard.isRevealed}
        />
      ))}
    </Flex>
  );
}
