import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Spacer,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { SocketContext } from "../SocketContext";
import { LocalStorageKey } from "../types/LocalStorageKey";
import { SocketEvent } from "../types/SocketEvent";
import NavbarGameShareButton from "./NavbarGameShareButton";
import NavbarGitHubRepoButton from "./NavbarGitHubRepoButton";
import NavbarJoinButton from "./NavbarJoinButton";
import NavbarLeaveGameButton from "./NavbarLeaveGameButton";
import NavbarSettingsButton from "./NavbarSettingsButton";
import SettingsModal from "./SettingsModal";

/**
 * A component for navbar with items like: logo, settings button, share button and leave game button.
 */
export default function Navbar(props: {
  /** A list of player ids to check if player is already in the game. */
  playerIds: string[];

  /**
   * Gets called on navbar join button click.
   */
  onJoinButtonClick: () => void;
}) {
  // get the navigate method from React Router used for changing the browser location
  const navigate = useNavigate();

  // get current game id from the browser url
  const currentGameId = window.location.pathname.slice(1);

  // get current player's id from the local storage
  const playerId = localStorage.getItem(LocalStorageKey.PlayerId);

  // initialize settings modal open flag state and set it to false
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // initialize socket from context
  const { socket } = useContext(SocketContext);

  const isPlayerAlreadyInGame = playerId && props.playerIds?.includes(playerId);

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
        playerId,
        currentPlayerName,
        changedPlayerName
      );
    }
  }

  /**
   * Emits leave game event for current player and navigates to home page.
   */
  function leaveGame() {
    if (playerId) {
      // emit leave game socket event so server can let other clients in the game know that this player has left the game
      socket?.emit(SocketEvent.LeaveGame, currentGameId, playerId);
    }

    // navigate to home page
    navigate("/");
  }

  // check if screen is mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  // set game options
  const menuItems = (
    <>
      <NavbarGameShareButton isMenuItem={isMobile} />
      {/* show settings button if current player exists */}
      {playerId && (
        <NavbarSettingsButton
          isMenuItem={isMobile}
          onClick={openSettingsModal}
        />
      )}
      {/* show join game button if current player doesn't exist or current player exists, but is not in the game */}
      {!isPlayerAlreadyInGame && (
        <NavbarJoinButton
          isMenuItem={isMobile}
          onClick={props.onJoinButtonClick}
        />
      )}
      <NavbarGitHubRepoButton isMenuItem={isMobile} />
      <NavbarLeaveGameButton isMenuItem={isMobile} onClick={leaveGame} />
    </>
  );

  // set logo image based on dark or light theme
  const { colorMode } = useColorMode();
  const logoImageSrc = `${process.env.PUBLIC_URL}/${
    colorMode === "light" ? "logo.png" : "logo-dark-theme.png"
  }`;

  return (
    <Flex my={4} mx={[2, 2, 4, 4]} minHeight="3rem" alignItems="center">
      <Box>
        <Link to="/">
          <Image src={logoImageSrc} alt="Logo" maxWidth={250} />
        </Link>
      </Box>
      <Spacer />
      {/* show game options if the game exists */}
      {currentGameId &&
        (isMobile ? (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<GiHamburgerMenu />}
              variant="outline"
              aria-label="Options"
            />
            <MenuList>{menuItems}</MenuList>
          </Menu>
        ) : (
          <HStack spacing={6}>{menuItems}</HStack>
        ))}
      {/* render settings modal if current player exists */}
      {playerId && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onFormSubmitted={renamePlayer}
          onClose={closeSettingsModal}
        />
      )}
    </Flex>
  );
}
