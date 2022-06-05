import { Button, Center } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import React from "react";
import { GoZap } from "react-icons/go";

export default function GameStarter(props: {
  isStartingInProgress?: boolean;
  onGameStarted?: (gameId: string) => void;
}) {
  function navigateToNewGame() {
    const gameId = nanoid(10);

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
