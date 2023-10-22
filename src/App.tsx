import { ChakraProvider, theme } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { Socket, io } from "socket.io-client";
import { playingCardsDefault } from "./PlayingCardsDefault";
import { SocketContext } from "./SocketContext";
import Game from "./game/Game";
import GameStarter from "./game/GameStarter";
import NewPlayerModal from "./game/NewPlayerModal";
import Navbar from "./navbar/Navbar";
import { CardGame } from "./types/CardGame";
import { LocalStorageKey } from "./types/LocalStorageKey";
import { PlayingCard } from "./types/PlayingCard";
import { SocketEvent } from "./types/SocketEvent";
import { TableCard } from "./types/TableCard";

/**
 * A main app component.
 */
export const App = () => {
  const isGameCreator = !!localStorage.getItem(LocalStorageKey.CreatedGameId);
  const currentPlayerName = localStorage.getItem(LocalStorageKey.PlayerName);

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

  // initialize new player modal open flag state
  const [isNewPlayerModalOpen, setIsNewPlayerModalOpen] = useState(false);

  // connect to socket server and run it only once
  useEffect(() => {
    setSocket(
      io(
        process.env.REACT_APP_SOCKET_SERVER_URL ||
          "https://rapid-scrum-poker-service.onrender.com"
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
        playerId: player.id,
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
   * Opens new player modal if current player is not set.
   *
   * @param gameId game id used to get the data from server
   */
  function getGame(gameId: string) {
    // open new player modal if current player is not set and player didn't create the game
    if (!currentPlayerName && !isGameCreator) {
      openNewPlayerModal();
    }

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
        const playerId = localStorage.getItem(LocalStorageKey.PlayerId);
        if (playerId) {
          const isPlayerAlreadyInGame = gameTableCards?.some(
            (card) => card.playerId === playerId
          );
          if (!isPlayerAlreadyInGame && !isGameCreator) {
            joinGame();
          }
        }
      }

      // set game checking in progress flag state to false, since game is loaded
      setIsGameCheckingInProgress(false);
    });
  }

  /**
   * Adds new player id and name to local storage, closes new player modal and joins new player to the game.
   *
   * @param newPlayerName new player's name to join the game
   */
  function addNewPlayerToGame(newPlayerName: string) {
    setIsNewPlayerModalOpen(false);

    // generate 10-character id value for new player, for example: Pi0yk32ip2
    const newPlayerId = nanoid(10);

    // set player id key in local storage with new player's id
    localStorage.setItem(LocalStorageKey.PlayerId, newPlayerId);

    // set player name key in local storage with new player's name
    localStorage.setItem(LocalStorageKey.PlayerName, newPlayerName);

    joinGame();
  }

  /**
   * Emits a join game event with current game id and current player's id and name to the server
   * so server can add the player to the game and update the game with the new player.
   *
   * If player's id or name is not set, opens new player modal.
   */
  function joinGame() {
    const playerId = localStorage.getItem(LocalStorageKey.PlayerId);
    const playerName = localStorage.getItem(LocalStorageKey.PlayerName);

    if (playerId && playerName) {
      const currentGameId = getCurrentGameId();

      socket?.emit(SocketEvent.JoinGame, currentGameId, playerId, playerName);

      return;
    }

    openNewPlayerModal();
  }

  /**
   * Updates cards in player's hands state and emits a update player card event
   * so server can update the game with updated cards in player's hands.
   *
   * @param playerId player's id who changed the cards selection in hands
   * @param selectedCardValue updated value of the card
   */
  function updatePlayingCards(playerId: string, selectedCardValue: string) {
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
        playerId,
        updatedPlayingCard.value,
        updatedPlayingCard.isSelected
      );
    }
  }

  /**
   * Returns a list of player's ids currenly in the game.
   *
   * @returns a string array of player's ids
   */
  function getPlayerIds() {
    return gameTableCards?.map((card) => card.playerId);
  }

  /**
   * Sets new player modal opened flag state to true so new player modal can be opened.
   */
  function openNewPlayerModal() {
    setIsNewPlayerModalOpen(true);
  }

  /**
   * Sets new player modal opened flag state to false so new player modal can be closed.
   */
  function closeNewPlayerModal() {
    setIsNewPlayerModalOpen(false);
  }

  return (
    <ChakraProvider theme={theme}>
      <SocketContext.Provider value={{ socket, setSocket }}>
        <Navbar playerIds={getPlayerIds()} onJoinButtonClick={joinGame} />
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
              <>
                <Game
                  isConnected={isConnected}
                  isGameCheckingInProgress={isGameCheckingInProgress}
                  gameTableCards={gameTableCards}
                  playingCards={playingCards}
                  playerIds={getPlayerIds()}
                  onGameLoad={getGame}
                  onCardSelected={updatePlayingCards}
                  onJoinButtonClick={joinGame}
                />
                {/* render new player modal if there is no current player and game is not loading */}
                {!isGameCheckingInProgress && !currentPlayerName && (
                  <NewPlayerModal
                    isOpen={isNewPlayerModalOpen}
                    onFormSubmitted={addNewPlayerToGame}
                    onClose={closeNewPlayerModal}
                  />
                )}
              </>
            }
          />
          <Route path="*" element={<GameStarter />} />
        </Routes>
      </SocketContext.Provider>
    </ChakraProvider>
  );
};
