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

/**
 * A type for storing all state data for a player that is part of the card game.
 */
type CardGamePlayer = {
  /** Name of the card game player. For example, "John". */
  name: string;

  /** Value of the player's card. For example: "3", "5", "8", or "13". */
  cardValue: string;

  /** Flag which determines if player's card is selected. */
  isCardSelected: boolean;
};

/**
 * A type for storing all state data for a single game.
 */
type CardGame = {
  /** Value that identifies the card game. For example, tMgpRFo9Fd. */
  id: string;

  /** Flag which determines if all cards are revealed in the game. */
  areCardsRevealed: boolean;

  /** Array which holds all the game's current players. */
  players: CardGamePlayer[];
};

/**
 * A main app component.
 */
export const App = () => {
  // get the navigate method from React Router used for changing the browser location
  const navigate = useNavigate();

  // initialize socket state
  const [socket, setSocket] = useState<Socket>();

  // initialize connected flag state and set it to false
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // initialize game checking in progress flag state and set it to true
  const [isGameCheckingInProgress, setIsGameCheckingInProgress] =
    useState<boolean>(true);

  // initialize table cards state and set it to empty array
  const [gameTableCards, setGameTableCards] = useState<TableCard[]>([]);

  // initialize playing cards state and set it to default values
  const [playingCards, setPlayingCards] =
    useState<PlayingCard[]>(playingCardsDefault);

  // initialize starting game in progress flag state and set it to false
  const [isStartingGameInProgress, setIsStartingGameInProgress] =
    useState<boolean>(false);

  // connect to socket server and run it only once
  useEffect(() => {
    setSocket(
      io(
        process.env.REACT_APP_SOCKET_SERVER_URL ||
          "https://rapid-scrum-poker-service.herokuapp.com"
      )
    );
  }, []);

  useEffect(() => {
    if (!socket) return;

    // on socket connect, set connected flag state to true
    socket.on(SocketEvent.Connect, () => {
      setIsConnected(true);
    });

    // on update game event, update game table cards state with updated card game
    socket.on(SocketEvent.UpdateGame, (game: CardGame) => {
      const currentGameId = getCurrentGameId();

      // if the current game id matches the updated game from server, update the game table cards state
      if (currentGameId === game.id) {
        const gameTableCards: TableCard[] = getGameTableCards(game);
        setGameTableCards(gameTableCards);
      }
    });

    // on restart playing cards event, set the player's cards to default
    socket.on(SocketEvent.RestartPlayingCards, (gameId) => {
      const currentGameId = getCurrentGameId();
      if (currentGameId === gameId) {
        setPlayingCards(playingCardsDefault);
      }
    });
  }, [socket]);

  /**
   * Returns current id of the game from browser's URL.
   *
   * @returns game id string, for example: d4t6OD5TgO
   */
  function getCurrentGameId() {
    return window.location.pathname.slice(1);
  }

  /**
   * Returns the game table cards with mapped and updated data from the card game received from server.
   *
   * @param game card game from server to map the data from
   * @returns an array of updated table cards
   */
  function getGameTableCards(game: CardGame): TableCard[] {
    return (
      game.players?.map((player) => ({
        playerName: player.name,
        value: player.cardValue,
        isSelected: player.isCardSelected,
        isRevealed: !!(game.areCardsRevealed && player.isCardSelected),
      })) ?? []
    );
  }

  /**
   * Emits a start game event with given game id to the server and after server starts the game,
   * sets created game id to local storage and navigates to newly created game.
   *
   * @param gameId newly created game id to send to server and to navigate to
   */
  function startGame(gameId: string) {
    // set starting game in progress flag state to true, so user sees starting game progress indicator
    setIsStartingGameInProgress(true);

    // emit start game event with given game id and provide callback function that server can call after
    // game has been successfully created
    socket?.emit(SocketEvent.StartGame, gameId, () => {
      // set starting game in progress flag state to false, since game has been started
      setIsStartingGameInProgress(false);

      // get current player's name from the local storage
      const playerName = localStorage.getItem(LocalStorageKey.PlayerName);

      // if the player exists, remove it from local storage since game creator is not a player
      if (playerName) {
        localStorage.removeItem(LocalStorageKey.PlayerName);
      }

      // set newly created game id to local storage
      localStorage.setItem(LocalStorageKey.CreatedGameId, gameId);

      // set table cards state to empty array to clear previous state from previous game
      setGameTableCards([]);

      // navigate to newly created game
      navigate(`/${gameId}`);
    });
  }

  /**
   * Emits a get game event with given game id to the server and after server fetches the game,
   * sets the fetched game data.
   *
   * @param gameId game id used to get the data from server
   */
  function getGame(gameId: string) {
    // emit get game event with give game id and provide callback function that server can call after
    // game has been successfully fetched
    socket?.emit(SocketEvent.GetGame, gameId, (game: CardGame) => {
      // if there is no game, navigate back to home page
      if (!game) {
        navigate("/");
      } else {
        // if previously created game id exists, remove it from local storage
        const createdGameId = localStorage.getItem(
          LocalStorageKey.CreatedGameId
        );
        if (createdGameId && createdGameId !== gameId) {
          localStorage.removeItem(LocalStorageKey.CreatedGameId);
        }

        // set table cards with game data fetched from server
        const gameTableCards: TableCard[] = getGameTableCards(game);
        if (gameTableCards?.length > 0) {
          setGameTableCards(gameTableCards);
        }

        // if player is not already in the game, join player to the game
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

      // set game checking in progress flag state to false, since game is loaded
      setIsGameCheckingInProgress(false);
    });
  }

  /**
   * Emits a join game event with current game id and player name to the server
   * so server can add the new player to the game and update the game with the new player.
   *
   * @param playerName new player's name to join the game
   */
  function joinGame(playerName: string) {
    const currentGameId = getCurrentGameId();

    socket?.emit(SocketEvent.JoinGame, currentGameId, playerName);
  }

  /**
   * Updates cards in player's hands state and emits a update player card event
   * so server can update the game with updated cards in player's hands.
   *
   * @param playerName player's name who changed the cards selection in hands
   * @param selectedCardValue updated value of the card
   */
  function updatePlayingCards(playerName: string, selectedCardValue: string) {
    const playingCardsAfterToggle = playingCards.map((card) => ({
      ...card,
      // check if cards was previously selected and update the selected flag
      isSelected: card.value === selectedCardValue ? !card.isSelected : false,
    }));

    // find the updated playing card by it's value
    const updatedPlayingCard = playingCardsAfterToggle.find(
      (card) => card.value === selectedCardValue
    );

    if (updatedPlayingCard) {
      // set the updated player's hands state
      setPlayingCards(playingCardsAfterToggle);

      // emit updated player card event so server can update the game
      const currentGameId = getCurrentGameId();
      socket?.emit(
        SocketEvent.UpdatePlayerCard,
        currentGameId,
        playerName,
        updatedPlayingCard.value,
        updatedPlayingCard.isSelected
      );
    }
  }

  /**
   * Returns a list of player's names currenly in the game.
   *
   * @returns a string array of player's names
   */
  function getPlayerNames() {
    return gameTableCards?.map((card) => card.playerName);
  }

  return (
    <ChakraProvider theme={theme}>
      <SocketContext.Provider value={{ socket, setSocket }}>
        <Navbar playerNames={getPlayerNames()} />
        <Routes>
          <Route
            path="/"
            element={
              <GameStarter
                onGameStarted={startGame}
                isStartingInProgress={isStartingGameInProgress}
              />
            }
          />
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
