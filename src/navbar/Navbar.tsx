import { Box, Flex, HStack, Spacer } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SocketContext } from "../SocketContext";
import { LocalStorageKey } from "../types/LocalStorageKey";
import { SocketEvent } from "../types/SocketEvent";
import NavbarGameShareButton from "./NavbarGameShareButton";
import NavbarGitHubRepoButton from "./NavbarGitHubRepoButton";
import NavbarLeaveGameButton from "./NavbarLeaveGameButton";
import NavbarSettingsButton from "./NavbarSettingsButton";
import SettingsModal from "./SettingsModal";

/**
 * A component for navbar with items like: logo, settings button, share button and leave game button.
 */
export default function Navbar(props: {
  /** A list of player names to pass to settings modal component. */
  playerNames: string[];
}) {
  // get the navigate method from React Router used for changing the browser location
  const navigate = useNavigate();

  // get current game id from the browser url
  const currentGameId = window.location.pathname.slice(1);

  // set game creator flag to true if there is created game id key in local storage, set false otherwise
  const isGameCreator = !!localStorage.getItem(LocalStorageKey.CreatedGameId);

  // initialize settings modal open flag state and set it to false
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // initialize socket from context
  const { socket } = useContext(SocketContext);

  /**
   * Sets settings modal opened flag state to true so settings modal can be opened.
   */
  function openSettingsModal() {
    setIsSettingsModalOpen(true);
  }

  /**
   * Sets settings modal opened flag state to false so settings modal can be closed.
   */
  function closeSettingsModal() {
    setIsSettingsModalOpen(false);
  }

  /**
   * Renames the player's name, closes the settings modal, updates the player name property in local storage and emits rename player event.
   *
   * @param changedPlayerName renamed player's name
   */
  function renamePlayer(changedPlayerName: string) {
    closeSettingsModal();

    // get current player's name from the local storage
    const currentPlayerName = localStorage.getItem(LocalStorageKey.PlayerName);

    if (currentPlayerName) {
      // update player name key in local storage with the player's changed name
      localStorage.setItem(LocalStorageKey.PlayerName, changedPlayerName);

      // emit rename player socket event so server can let other players in the game know that this player's name changed
      socket?.emit(
        SocketEvent.RenamePlayer,
        currentGameId,
        currentPlayerName,
        changedPlayerName
      );
    }
  }

  /**
   * Emits leave game event for current player and navigates to home page.
   */
  function leaveGame() {
    // get current player's name from the local storage
    const playerName = localStorage.getItem(LocalStorageKey.PlayerName);

    if (playerName) {
      // emit leave game socket event so server can let other clients in the game know that this player has left the game
      socket?.emit(SocketEvent.LeaveGame, currentGameId, playerName);
    }

    // navigate to home page
    navigate("/");
  }

  return (
    <Flex my={4} mx={12} minHeight="3rem" alignItems="center">
      <Box>
        <Link to="/">
          <img
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="Logo"
            width={250}
          />
        </Link>
      </Box>
      <Spacer />
      {/* show game action buttons if the game exists */}
      {currentGameId && (
        <HStack spacing={6}>
          <NavbarGameShareButton />
          {/* show settings button if current player is not the game creator */}
          {!isGameCreator && (
            <NavbarSettingsButton onClick={openSettingsModal} />
          )}
          <NavbarGitHubRepoButton />
          <NavbarLeaveGameButton onClick={leaveGame} />
        </HStack>
      )}
      {/* render settings modal if current player is not game creator */}
      {!isGameCreator && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          playerNames={props.playerNames}
          onFormSubmitted={renamePlayer}
          onClose={closeSettingsModal}
        />
      )}
    </Flex>
  );
}
