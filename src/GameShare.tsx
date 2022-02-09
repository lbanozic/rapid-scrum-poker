import { Button, HStack, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";

export default function GameShare() {
  const gameLink = window.location.href;

  const [gameLinkButtonText, setGameLinkButtonText] =
    useState("Copy game link");
  const [gameLinkButtonIcon, setGameLinkButtonIcon] =
    useState<React.ReactElement>(<MdContentCopy />);

  function selectLinkText(event: React.SyntheticEvent<HTMLInputElement>) {
    event.currentTarget.select();
  }

  function copyGameLink() {
    if (gameLinkButtonText === "Link copied!") {
      return;
    }

    navigator.clipboard.writeText(gameLink);

    setGameLinkButtonText("Link copied!");
    setGameLinkButtonIcon(<IoMdCheckmark />);

    setTimeout(() => {
      setGameLinkButtonText("Copy game link");
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
    </>
  );
}
