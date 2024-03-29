import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Switch,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { FaSave } from "react-icons/fa";
import { LocalStorageKey } from "../types/LocalStorageKey";

/**
 * A component for settings modal.
 */
export default function SettingsModal(props: {
  /** Flag to check if settings modal is opened. */
  isOpen?: boolean;

  /**
   * Gets called when the settings form is valid and gets submitted.
   *
   * @param playerName name of the player to submit the form with
   */
  onFormSubmitted: (playerName: string) => void;

  /** Gets called on settings modal close. */
  onClose: () => void;
}) {
  // initialize open flag and open/close modal functions from chakra useDisclosure hook
  const { isOpen, onOpen, onClose } = useDisclosure();

  // open the modal if the open flag prop is true, close it otherwise
  useEffect(() => {
    if (props.isOpen) {
      onOpen();
    } else {
      onClose();
    }
  }, [props.isOpen, onOpen, onClose]);

  // get current player's name from the local storage
  const currentPlayerName =
    localStorage.getItem(LocalStorageKey.PlayerName) ?? "";

  // initialize player name state with current player name
  const [playerName, setPlayerName] = useState(currentPlayerName);

  // initialize form submitted flag state with false
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // initialize player name empty flag state with true
  const [isPlayerNameEmpty, setIsPlayerNameEmpty] = useState(true);

  // initialize form error message state with empty string
  const [formErrorMessage, setFormErrorMessage] = useState("");

  // initialize focus ref used to set initial focus on the player name input field in the modal
  const initialFocusRef = useRef(null);

  /**
   * Sets player name state to the updated value from input event.
   *
   * @param event player name input change event with updated value
   */
  function updatePlayerName(event: React.SyntheticEvent<HTMLInputElement>) {
    setPlayerName(event.currentTarget.value);
  }

  /**
   * Sets the form error messages and returns true if form is valid, false otherwise.
   *
   * @returns true if the settings form is valid, false if it's not valid
   */
  function isFormValid() {
    const playerNameTrimmed = playerName.trim();

    // if player name is empty, set validation message and return false
    if (playerNameTrimmed === "") {
      setFormErrorMessage("Name is required");

      setIsPlayerNameEmpty(true);

      return false;
    }

    // form valid, reset validation flags to false
    setIsPlayerNameEmpty(false);

    return true;
  }

  /**
   * Submits player name (settings) form and calls the form submitted prop function if the form is valid.
   *
   * @param event form element submit event
   */
  function submitPlayerNameForm(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsFormSubmitted(true);

    const playerNameTrimmed = playerName.trim();

    if (isFormValid() && playerNameTrimmed) {
      props.onFormSubmitted(playerNameTrimmed);
    }
  }

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Modal
      isCentered
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={props.onClose}
      initialFocusRef={initialFocusRef}
    >
      <ModalOverlay />
      <ModalContent borderRadius="24" p={4} m={4}>
        <form onSubmit={submitPlayerNameForm}>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              mt={6}
              // form is invalid if the player's name is empty
              isInvalid={isFormSubmitted && isPlayerNameEmpty}
            >
              <FormLabel>Player name</FormLabel>
              <Input
                size="lg"
                padding="1.65rem"
                borderRadius="16"
                value={playerName}
                ref={initialFocusRef}
                onChange={updatePlayerName}
              />
              <FormErrorMessage marginLeft="1.8rem">
                {formErrorMessage}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={6} display="flex" alignItems="center">
              <FormLabel htmlFor="color-mode-switch" mb={0}>
                Dark mode:
              </FormLabel>
              <Switch
                id="color-mode-switch"
                size="lg"
                isChecked={colorMode === "dark"}
                onChange={toggleColorMode}
              />
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
