import { ChakraProvider, theme } from "@chakra-ui/react";
import * as React from "react";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { io, Socket } from "socket.io-client";
import Game from "./Game";
import GameStarter from "./GameStarter";
import { LocalStorageKey } from "./LocalStorageKey";
import Navbar from "./Navbar";
import { PlayingCard } from "./PlayingCard";
import { playingCardsDefault } from "./PlayingCardsDefault";
import { SocketContext } from "./SocketContext";
import { SocketEvent } from "./SocketEvent";
import { TableCard } from "./TableCard";

type CardGamePlayer = {
  name: string;
  cardValue: string;
  isCardSelected: boolean;
};

type CardGame = {
  id: string;
  areCardsRevealed: boolean;
  players: CardGamePlayer[];
};

export const App = () => {
  const navigate = useNavigate();
  const currentGameId = window.location.pathname.slice(1);

  const [socket, setSocket] = useState<Socket>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isGameCheckingInProgress, setIsGameCheckingInProgress] =
    useState<boolean>(true);
  const [gameTableCards, setGameTableCards] = useState<TableCard[]>([]);
  const [playingCards, setPlayingCards] =
    useState<PlayingCard[]>(playingCardsDefault);

  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(SocketEvent.Connect, () => {
      setIsConnected(true);
    });

    socket.on(SocketEvent.UpdateGame, (game: CardGame) => {
      if (currentGameId === game.id) {
        const gameTableCards: TableCard[] = getGameTableCards(game);

        setGameTableCards(gameTableCards);
      }
    });

    socket.on(SocketEvent.RestartPlayingCards, (gameId) => {
      if (currentGameId === gameId) {
        setPlayingCards(playingCardsDefault);
      }
    });
  }, [socket, currentGameId]);

  function getGameTableCards(game: CardGame) {
    return (
      game.players?.map((player) => ({
        playerName: player.name,
        value: player.cardValue,
        isSelected: player.isCardSelected,
        isRevealed: !!(game.areCardsRevealed && player.isCardSelected),
      })) ?? []
    );
  }

  function startGame(gameId: string) {
    socket?.emit(SocketEvent.StartGame, gameId, () => {
      const playerName = localStorage.getItem(LocalStorageKey.PlayerName);

      if (playerName) {
        localStorage.removeItem(LocalStorageKey.PlayerName);
      }

      localStorage.setItem(LocalStorageKey.CreatedGameId, gameId);

      setGameTableCards([]);

      navigate(`/${gameId}`);
    });
  }

  function getGame(gameId: string) {
    socket?.emit(SocketEvent.GetGame, gameId, (game: CardGame) => {
      if (!game) {
        navigate("/");
      } else {
        const createdGameId = localStorage.getItem(
          LocalStorageKey.CreatedGameId
        );

        if (createdGameId && createdGameId !== gameId) {
          localStorage.removeItem(LocalStorageKey.CreatedGameId);
        }

        const gameTableCards: TableCard[] = getGameTableCards(game);

        if (gameTableCards?.length > 0) {
          setGameTableCards(gameTableCards);
        }

        const playerName = localStorage.getItem(LocalStorageKey.PlayerName);

        if (playerName) {
          const isPlayerAlreadyInGame = gameTableCards?.some(
            (card) => card.playerName === playerName
          );

          if (!isPlayerAlreadyInGame) {
            joinGame(playerName);
          }
        }
      }

      setIsGameCheckingInProgress(false);
    });
  }

  function joinGame(playerName: string) {
    socket?.emit(SocketEvent.JoinGame, currentGameId, playerName);
  }

  function updatePlayingCards(playerName: string, selectedCardValue: string) {
    const playingCardsAfterToggle = playingCards.map((card) => ({
      ...card,
      isSelected: card.value === selectedCardValue ? !card.isSelected : false,
    }));

    const updatedPlayingCard = playingCardsAfterToggle.find(
      (card) => card.value === selectedCardValue
    );

    if (updatedPlayingCard) {
      setPlayingCards(playingCardsAfterToggle);

      socket?.emit(
        SocketEvent.UpdatePlayerCard,
        currentGameId,
        playerName,
        updatedPlayingCard.value,
        updatedPlayingCard.isSelected
      );
    }
  }

  function getPlayerNames() {
    return gameTableCards?.map((card) => card.playerName);
  }

  return (
    <ChakraProvider theme={theme}>
      <SocketContext.Provider value={{ socket, setSocket }}>
        <Navbar playerNames={getPlayerNames()} />
        <Routes>
          <Route path="/" element={<GameStarter onGameStarted={startGame} />} />
          <Route
            path="/:gameId"
            element={
              <Game
                isConnected={isConnected}
                isGameCheckingInProgress={isGameCheckingInProgress}
                gameTableCards={gameTableCards}
                playingCards={playingCards}
                onGameLoad={getGame}
                onGameJoin={joinGame}
                onCardSelected={updatePlayingCards}
              />
            }
          />
          <Route path="*" element={<GameStarter />} />
        </Routes>
      </SocketContext.Provider>
    </ChakraProvider>
  );
};
