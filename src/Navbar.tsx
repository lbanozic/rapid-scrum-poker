import { Box, Flex, HStack, Spacer } from "@chakra-ui/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LocalStorageKey } from "./LocalStorageKey";
import NavbarGameShareButton from "./NavbarGameShareButton";
import NavbarLeaveGameButton from "./NavbarLeaveGameButton";
import NavbarSettingsButton from "./NavbarSettingsButton";
import SettingsModal from "./SettingsModal";

export default function Navbar(props: {
  playerNames: string[];
  onPlayerRename: (changedPlayerName: string) => void;
}) {
  const currentGameId = window.location.pathname.slice(1);
  const isGameCreator = !!localStorage.getItem(LocalStorageKey.CreatedGameId);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  function openSettingsModal() {
    setIsSettingsModalOpen(true);
  }

  function closeSettingsModal() {
    setIsSettingsModalOpen(false);
  }

  function renamePlayer(changedPlayerName: string) {
    closeSettingsModal();

    props.onPlayerRename(changedPlayerName);
  }

  return (
    <Flex my={4} mx={12}>
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
          <NavbarLeaveGameButton />
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
