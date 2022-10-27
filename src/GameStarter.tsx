import { Button, Center } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import React from "react";
import { GoZap } from "react-icons/go";

/**
 * A component for start new game button.
 */
export default function GameStarter(props: {
  /** Flag to check if starting the game is already in progress. */
  isStartingInProgress?: boolean;

  /**
   * Gets called when start new game button is clicked.
   *
   * @param gameId generated value to identify the game
   */
  onGameStarted?: (gameId: string) => void;
}) {
  /**
   * Generates new game id and calls the game started prop function
   */
  function navigateToNewGame() {
    // generate 10-character id value, for example: h1ZAD2wld9
    const gameId = nanoid(10);

    // call game started prop function if it exists
    props.onGameStarted && props.onGameStarted(gameId);
  }

  return (
    <Center height="90vh">
      <Button
        size="lg"
        padding="12"
        borderRadius="24"
        fontSize="3xl"
        colorScheme="yellow"
        rightIcon={<GoZap />}
        isLoading={props.isStartingInProgress}
        loadingText="Starting game"
        onClick={navigateToNewGame}
      >
        Start new game
      </Button>
    </Center>
  );
}
