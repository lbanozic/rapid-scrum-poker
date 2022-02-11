import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { FaSave } from "react-icons/fa";
import { LocalStorageKey } from "./LocalStorageKey";

export default function NewPlayerModal(props: {
  isOpen?: boolean;
  playerNames: string[];
  onFormSubmitted: (playerName: string) => void;
  onClose: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (props.isOpen) {
      onOpen();
    } else {
      onClose();
    }
  }, [props.isOpen, onOpen, onClose]);

  const currentPlayerName =
    localStorage.getItem(LocalStorageKey.PlayerName) ?? "";

  const [playerName, setPlayerName] = useState(currentPlayerName);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isPlayerNameEmpty, setIsPlayerNameEmpty] = useState(true);
  const [isPlayerNameTaken, setIsPlayerNameTaken] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const initialFocusRef = useRef(null);

  function updatePlayerNameChange(
    event: React.SyntheticEvent<HTMLInputElement>
  ) {
    setPlayerName(event.currentTarget.value);
  }

  function isFormValid() {
    const playerNameTrimmed = playerName.trim();

    if (playerNameTrimmed === "") {
      setFormErrorMessage("Name is required");

      setIsPlayerNameEmpty(true);

      return false;
    }

    if (
      props.playerNames.includes(playerNameTrimmed) &&
      playerNameTrimmed !== currentPlayerName
    ) {
      setFormErrorMessage("Player name already taken");

      setIsPlayerNameTaken(true);

      return false;
    }

    setIsPlayerNameEmpty(false);

    setIsPlayerNameTaken(false);

    return true;
  }

  function submitPlayerNameForm(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsFormSubmitted(true);

    const playerNameTrimmed = playerName.trim();

    if (isFormValid() && playerNameTrimmed) {
      props.onFormSubmitted(playerNameTrimmed);
    }
  }

  return (
    <Modal
      isCentered
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={props.onClose}
      initialFocusRef={initialFocusRef}
    >
      <ModalOverlay />
      <ModalContent borderRadius="24" p={4}>
        <form onSubmit={submitPlayerNameForm}>
          <ModalHeader pt={8}>Player name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              isInvalid={
                (isFormSubmitted && isPlayerNameEmpty) || isPlayerNameTaken
              }
            >
              <Input
                size="lg"
                padding="1.65rem"
                borderRadius="16"
                value={playerName}
                ref={initialFocusRef}
                onChange={updatePlayerNameChange}
              />
              <FormErrorMessage marginLeft="1.8rem">
                {formErrorMessage}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              size="lg"
              margin="3"
              padding="7"
              fontSize="xl"
              borderRadius="16"
              colorScheme="yellow"
              rightIcon={<FaSave />}
            >
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
