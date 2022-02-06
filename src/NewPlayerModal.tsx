import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { GoZap } from "react-icons/go";

export default function NewPlayerModal(props: {
  isOpen?: boolean;
  playerNames: string[];
  onNewPlayerNameFormSubmitted: (playerName: string) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (props.isOpen) {
      onOpen();
    } else {
      onClose();
    }
  }, [props.isOpen, onOpen, onClose]);

  const [playerName, setPlayerName] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isPlayerNameEmpty, setIsPlayerNameEmpty] = useState(true);
  const [isPlayerNameTaken, setIsPlayerNameTaken] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  function updatePlayerNameChange(
    event: React.SyntheticEvent<HTMLInputElement>
  ) {
    setPlayerName(event.currentTarget.value);
  }

  function isFormValid() {
    const playerNameTrimmed = playerName.trim();

    if (playerNameTrimmed === "") {
      setFormErrorMessage("Name is required to join");

      setIsPlayerNameEmpty(true);

      return false;
    }

    if (props.playerNames.includes(playerNameTrimmed)) {
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
      props.onNewPlayerNameFormSubmitted(playerNameTrimmed);
    }
  }

  return (
    <Modal
      isCentered
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent borderRadius="24" p={4}>
        <form onSubmit={submitPlayerNameForm}>
          <ModalHeader pt={8}>Enter name you want to use</ModalHeader>
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
              rightIcon={<GoZap />}
            >
              Join
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
