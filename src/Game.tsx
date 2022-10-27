import { Center, Spinner, VStack } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import GameActions from "./GameActions";
import GamePlayerHands from "./GamePlayerHands";
import GameShare from "./GameShare";
import GameTable from "./GameTable";
import { LocalStorageKey } from "./LocalStorageKey";
import NewPlayerModal from "./NewPlayerModal";
import { PlayingCard } from "./PlayingCard";
import { SocketContext } from "./SocketContext";
import { SocketEvent } from "./SocketEvent";
import { TableCard } from "./TableCard";

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

  /**
   * Gets called when all data required for a player to join the game is loaded.
   *
   * @param gameId id of the current game player wants to join
   */
  onGameLoad: (gameId: string) => void;

  /**
   * Gets called when new player can join the game.
   *
   * @param playerName name of the player to join the game
   */
  onGameJoin: (playerName: string) => void;

  /**
   * Gets called when player selects a card.
   *
   * @param playerName name of the player who selected the card
   * @param selectedCardValue value of the card that has been selected, for example: "1", "2", "5", or "8"
   */
  onCardSelected: (playerName: string, selectedCardValue: string) => void;
}) {
  // get current player's name from the local storage
  const playerName = localStorage.getItem(LocalStorageKey.PlayerName);

  // set game creator flag to true if there is created game id key in local storage, set false otherwise
  const isGameCreator = !!localStorage.getItem(LocalStorageKey.CreatedGameId);

  // set game id from the params in the URL
  const params = useParams();
  const gameId = params.gameId;

  // initialize new player modal open flag state and set it to true if the player's name doesn't exist,
  // which will then open the modal and prompt the player to type in the name
  const [isNewPlayerModalOpen, setIsNewPlayerModalOpen] = useState(!playerName);

  // initialize socket from context
  const { socket } = useContext(SocketContext);

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
    if (playerName) {
      props.onCardSelected(playerName, selectedCardValue);
    }
  }

  /**
   * Closes the new player modal, sets the player's name to local storage and calls game join function prop.
   *
   * @param playerName name of the player to join the game
   */
  function joinGame(playerName: string) {
    setIsNewPlayerModalOpen(false);

    // update player name key in local storage with the player's changed name
    localStorage.setItem(LocalStorageKey.PlayerName, playerName);

    props.onGameJoin(playerName);
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

  /**
   * Returns a list of player names that are in the game.
   *
   * @returns a list of player names in an array of strings
   */
  function getPlayerNames() {
    return props.gameTableCards?.map((card) => card.playerName);
  }

  return (
    <>
      <Center height="90vh">
        {/* if the game is still loading, show loading spinner indicator so users know that the game checking is still in progress,
        otherwise, show the game */}
        {props.isGameCheckingInProgress ? (
          <Spinner />
        ) : (
          <VStack spacing={12}>
            {/* show the game share button to the game creator if game has no players */}
            {isGameCreator && props.gameTableCards?.length === 0 && (
              <GameShare />
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
            {/* show player's cards in the hand if player is not game creator and cards are not currently revealed
            (to prevent the player from changing the card value after the cards have been revealed on the table) */}
            {!isGameCreator && !areCardsRevealed() && (
              <GamePlayerHands
                playingCards={props.playingCards}
                onCardSelected={updatePlayingCards}
              />
            )}
          </VStack>
        )}
      </Center>
      {/* render new player modal if current player is not game creator and game is not loading */}
      {!props.isGameCheckingInProgress && !isGameCreator && (
        <NewPlayerModal
          isOpen={isNewPlayerModalOpen}
          playerNames={getPlayerNames()}
          onFormSubmitted={joinGame}
        />
      )}
    </>
  );
}
