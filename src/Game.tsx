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

export default function Game(props: {
  isConnected: boolean;
  isGameCheckingInProgress: boolean;
  gameTableCards: TableCard[];
  playingCards: PlayingCard[];
  onGameLoad: (gameId: string) => void;
  onGameJoin: (playerName: string) => void;
  onCardSelected: (playerName: string, selectedCardValue: string) => void;
}) {
  const playerName = localStorage.getItem(LocalStorageKey.PlayerName);
  const isGameCreator = !!localStorage.getItem(LocalStorageKey.CreatedGameId);

  const params = useParams();
  const gameId = params.gameId;

  const [isNewPlayerModalOpen, setIsNewPlayerModalOpen] = useState(!playerName);

  const { socket } = useContext(SocketContext);

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

  function updatePlayingCards(selectedCardValue: string) {
    if (playerName) {
      props.onCardSelected(playerName, selectedCardValue);
    }
  }

  function joinGame(playerName: string) {
    setIsNewPlayerModalOpen(false);

    localStorage.setItem(LocalStorageKey.PlayerName, playerName);

    props.onGameJoin(playerName);
  }

  function revealCards() {
    socket?.emit(SocketEvent.RevealCards, gameId);
  }

  function restartGame() {
    socket?.emit(SocketEvent.RestartGame, gameId);
  }

  function areCardsRevealed() {
    return props.gameTableCards?.some((card) => card.isRevealed);
  }

  function getPlayerNames() {
    return props.gameTableCards?.map((card) => card.playerName);
  }

  return (
    <>
      <Center height="90vh">
        {props.isGameCheckingInProgress ? (
          <Spinner />
        ) : (
          <VStack spacing={12}>
            {isGameCreator && props.gameTableCards?.length === 0 && (
              <GameShare />
            )}
            {props.gameTableCards?.length > 0 && (
              <GameTable gameTableCards={props.gameTableCards} />
            )}
            {isGameCreator && props.gameTableCards?.length > 0 && (
              <GameActions
                isRevealCardsButtonEnabled={!areCardsRevealed()}
                onGameRestart={restartGame}
                onCardsReveal={revealCards}
              />
            )}
            {!isGameCreator && !areCardsRevealed() && (
              <GamePlayerHands
                playingCards={props.playingCards}
                onCardSelected={updatePlayingCards}
              />
            )}
          </VStack>
        )}
      </Center>
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
