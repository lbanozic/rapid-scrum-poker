import { Box, Center, Flex, Spinner, VStack } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { SocketContext } from "../SocketContext";
import { LocalStorageKey } from "../types/LocalStorageKey";
import { PlayingCard } from "../types/PlayingCard";
import { SocketEvent } from "../types/SocketEvent";
import { TableCard } from "../types/TableCard";
import GameActions from "./GameActions";
import GamePlayerHands from "./GamePlayerHands";
import GameShare from "./GameShare";
import GameTable from "./GameTable";

/**
 * A component for main game features.
 */
export default function Game(props: {
  /** Flag to check if socket client is connected to the server. */
  isConnected: boolean;

  /** Flag to check if game checking is in progress, used to show the loading spinner. */
  isGameCheckingInProgress: boolean;

  /** List of cards currently on the table in the game. */
  gameTableCards: TableCard[];

  /** List of cards which player has in the hand. */
  playingCards: PlayingCard[];

  /** A list of player ids to check if player is already in the game. */
  playerIds: string[];

  /**
   * Gets called when all data required for a player to join the game is loaded.
   *
   * @param gameId id of the current game player wants to join
   */
  onGameLoad: (gameId: string) => void;

  /**
   * Gets called when player selects a card.
   *
   * @param playerId id of the player who selected the card
   * @param selectedCardValue value of the card that has been selected, for example: "1", "2", "5", or "8"
   */
  onCardSelected: (playerId: string, selectedCardValue: string) => void;

  /**
   * Gets called on game share join button click.
   */
  onJoinButtonClick: () => void;
}) {
  // get current player's id from the local storage
  const playerId = localStorage.getItem(LocalStorageKey.PlayerId);

  // set game creator flag to true if there is created game id key in local storage, set false otherwise
  const isGameCreator = !!localStorage.getItem(LocalStorageKey.CreatedGameId);

  // set game id from the params in the URL
  const params = useParams();
  const gameId = params.gameId;

  // initialize socket from context
  const { socket } = useContext(SocketContext);

  const isPlayerAlreadyInGame = playerId && props.playerIds?.includes(playerId);

  // call game load prop function if the game id exists, client is connected, game checking is not in progress and there are cards on the table
  useEffect(() => {
    if (
      !gameId ||
      !props.isConnected ||
      !props.isGameCheckingInProgress ||
      props.gameTableCards?.length > 0
    )
      return;

    props.onGameLoad(gameId);
  }, [gameId, props]);

  /**
   * Calls card selected function prop with the selected card value if the player exists.
   *
   * @param selectedCardValue value of the card that has been selected
   */
  function updatePlayingCards(selectedCardValue: string) {
    if (playerId) {
      props.onCardSelected(playerId, selectedCardValue);
    }
  }

  /**
   * Emits a reveal cards event so server can let other players in the game know that cards have been revealed.
   */
  function revealCards() {
    socket?.emit(SocketEvent.RevealCards, gameId);
  }

  /**
   * Emits a restart game event so server can let other players in the game know that the game has been restarted.
   */
  function restartGame() {
    socket?.emit(SocketEvent.RestartGame, gameId);
  }

  /**
   * Returns true if there is at least one revealed card on the table, false otherwise.
   *
   * @returns true if there are revealed cards of the table, false if not
   */
  function areCardsRevealed() {
    return props.gameTableCards?.some((card) => card.isRevealed);
  }

  return (
    <>
      <Flex justifyContent="center" height="90vh">
        {/* if the game is still loading, show loading spinner indicator so users know that the game checking is still in progress,
        otherwise, show the game */}
        {props.isGameCheckingInProgress ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <VStack alignItems="normal" justifyContent="space-around">
            {/* show the game share part to the game creator if game has no players */}
            {isGameCreator && props.gameTableCards?.length === 0 && (
              <GameShare onJoinButtonClick={props.onJoinButtonClick} />
            )}
            {/* if the game has at least one player, show the game table */}
            {props.gameTableCards?.length > 0 && (
              <GameTable gameTableCards={props.gameTableCards} />
            )}
            {/* if the game has at least one player, show game actions (reveal cards, restart game) to game creator */}
            {isGameCreator && props.gameTableCards?.length > 0 && (
              <GameActions
                isRevealCardsButtonEnabled={!areCardsRevealed()}
                onGameRestart={restartGame}
                onCardsReveal={revealCards}
              />
            )}
            {/* show player's cards in the hand if there is at least one player in the game and cards are not currently revealed
            (to prevent the player from changing the card value after the cards have been revealed on the table) */}
            {playerId &&
              isPlayerAlreadyInGame &&
              props.gameTableCards?.length > 0 &&
              (areCardsRevealed() ? (
                <Box flex="1" />
              ) : (
                <GamePlayerHands
                  playingCards={props.playingCards}
                  onCardSelected={updatePlayingCards}
                />
              ))}
          </VStack>
        )}
      </Flex>
    </>
  );
}
