import { Flex } from "@chakra-ui/react";
import React from "react";
import { GoEye } from "react-icons/go";
import { MdRestartAlt } from "react-icons/md";
import GameActionButton from "./GameActionButton";

export default function GameActions(props: {
  isRevealCardsButtonEnabled: boolean;
  onGameRestart: () => void;
  onCardsReveal: () => void;
}) {
  return (
    <Flex justifyContent="space-evenly" flexWrap="wrap">
      <GameActionButton
        icon={<MdRestartAlt />}
        text="Restart game"
        onClick={props.onGameRestart}
      />
      {props.isRevealCardsButtonEnabled && (
        <GameActionButton
          icon={<GoEye />}
          text="Reveal cards"
          isPrimary
          onClick={props.onCardsReveal}
        />
      )}
    </Flex>
  );
}
