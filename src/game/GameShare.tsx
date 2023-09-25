import { Button, HStack, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import { GoZap } from "react-icons/go";

/**
 * A component for game share button.
 */
export default function GameShare(props: {
  /**
   * Gets called on join button click.
   */
  onJoinButtonClick: () => void;
}) {
  const gameLinkDefaultText = "Copy game link";
  const gameLinkCopiedText = "Link copied!";

  const gameLink = window.location.href;

  // initialize the game link button text state and set it to "Copy game link"
  const [gameLinkButtonText, setGameLinkButtonText] =
    useState(gameLinkDefaultText);

  // initialize the game link button icon state and set it to the copy icon
  const [gameLinkButtonIcon, setGameLinkButtonIcon] =
    useState<React.ReactElement>(<MdContentCopy />);

  /**
   * Selects the game link text in readonly input field so user can more easily copy the game link.
   *
   * @param event game link element click event
   */
  function selectLinkText(event: React.SyntheticEvent<HTMLInputElement>) {
    event.currentTarget.select();
  }

  /**
   * Copies current value of browser URL to clipboard and sets game link button text and icon.
   */
  function copyGameLink() {
    // if user still sees the link copied button text, exit the function
    if (gameLinkButtonText === gameLinkCopiedText) {
      return;
    }

    // copy current browser URL to clipboard
    navigator.clipboard.writeText(gameLink);

    // set game link button text state to copied so user can see that link has been copied
    setGameLinkButtonText(gameLinkCopiedText);

    // set game link button icon state to checkmark so user can see that link has been copied
    setGameLinkButtonIcon(<IoMdCheckmark />);

    // after 2 seconds, reset game link text and icon to the default value
    setTimeout(() => {
      setGameLinkButtonText(gameLinkDefaultText);
      setGameLinkButtonIcon(<MdContentCopy />);
    }, 2000);
  }

  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        Invite players by sharing the link below:
      </Text>
      <HStack>
        <Input
          size="lg"
          width="25rem"
          padding="1.65rem"
          borderRadius="16"
          variant="filled"
          isReadOnly
          value={gameLink}
          onClick={selectLinkText}
        />
        <Button
          size="lg"
          width="14rem"
          margin="4"
          padding="7"
          fontSize="xl"
          borderRadius="16"
          colorScheme="yellow"
          rightIcon={gameLinkButtonIcon}
          onClick={copyGameLink}
        >
          {gameLinkButtonText}
        </Button>
      </HStack>
      <HStack>
        <Text fontSize="xl" fontWeight="bold">
          Or join the game:
        </Text>
        <Button
          size="lg"
          margin="3"
          padding="7"
          fontSize="xl"
          borderRadius="16"
          colorScheme="yellow"
          rightIcon={<GoZap />}
          onClick={props.onJoinButtonClick}
        >
          Join
        </Button>
      </HStack>
    </>
  );
}
