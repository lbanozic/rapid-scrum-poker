import { Box, Flex, HStack, Spacer } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LocalStorageKey } from "./LocalStorageKey";
import NavbarGameShareButton from "./NavbarGameShareButton";
import NavbarLeaveGameButton from "./NavbarLeaveGameButton";
import NavbarSettingsButton from "./NavbarSettingsButton";
import SettingsModal from "./SettingsModal";
import { SocketContext } from "./SocketContext";
import { SocketEvent } from "./SocketEvent";

export default function Navbar(props: { playerNames: string[] }) {
  const navigate = useNavigate();

  const currentGameId = window.location.pathname.slice(1);

  const isGameCreator = !!localStorage.getItem(LocalStorageKey.CreatedGameId);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const { socket } = useContext(SocketContext);

  function openSettingsModal() {
    setIsSettingsModalOpen(true);
  }

  function closeSettingsModal() {
    setIsSettingsModalOpen(false);
  }

  function renamePlayer(changedPlayerName: string) {
    closeSettingsModal();

    const currentPlayerName = localStorage.getItem(LocalStorageKey.PlayerName);

    if (currentPlayerName) {
      localStorage.setItem(LocalStorageKey.PlayerName, changedPlayerName);

      socket?.emit(
        SocketEvent.RenamePlayer,
        currentGameId,
        currentPlayerName,
        changedPlayerName
      );
    }
  }

  function leaveGame() {
    const playerName = localStorage.getItem(LocalStorageKey.PlayerName);

    if (playerName) {
      socket?.emit(SocketEvent.LeaveGame, currentGameId, playerName);
    }

    navigate("/");
  }

  return (
    <Flex my={4} mx={12} alignItems="center">
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
      {currentGameId && (
        <HStack spacing={6}>
          <NavbarGameShareButton />
          {!isGameCreator && (
            <NavbarSettingsButton onClick={openSettingsModal} />
          )}
          <NavbarLeaveGameButton onClick={leaveGame} />
        </HStack>
      )}
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
