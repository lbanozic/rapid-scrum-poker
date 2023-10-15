import { Button, Center, useToast } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
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
  // initialize the toast
  const toast = useToast();

  // initialize initial start info timeout state
  const [initialStartInfoTimeoutId, setInitialStartInfoTimeoutId] = useState<
    number | null
  >(null);

  /**
   * Generates new game id and calls the game started prop function
   */
  function navigateToNewGame() {
    // generate 10-character id value, for example: h1ZAD2wld9
    const gameId = nanoid(10);

    // call game started prop function if it exists
    props.onGameStarted && props.onGameStarted(gameId);

    // after 5 seconds, inform user that initial game start may take a while by showing toast message
    const timeoutId = window.setTimeout(() => {
      toast({
        title: "Warming Things Up...",
        description:
          "Our servers are getting ready to start your game. This initial start might take up to 30 seconds. Thanks for your patience!",
        status: "info",
        duration: 9000,
        isClosable: true,
      });
    }, 5000);

    // set timeout id so it can be cleared
    setInitialStartInfoTimeoutId(timeoutId);
  }

  // clear initial start info timeout when the component unmounts so the toast message isn't shown when the game starts before timeout
  useEffect(() => {
    return () => {
      if (initialStartInfoTimeoutId) {
        window.clearTimeout(initialStartInfoTimeoutId);
      }
    };
  }, [initialStartInfoTimeoutId]);

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
