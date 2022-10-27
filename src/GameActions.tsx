import { Flex } from "@chakra-ui/react";
import React from "react";
import { GoEye } from "react-icons/go";
import { MdRestartAlt } from "react-icons/md";
import GameActionButton from "./GameActionButton";

/**
 * A component for restart game and reveal cards actions.
 */
export default function GameActions(props: {
  /** Flag which determines if reveal cards button should be shown. */
  isRevealCardsButtonEnabled: boolean;

  /** Gets called on game restart button click. */
  onGameRestart: () => void;

  /** Gets called on reveal cards button click. */
  onCardsReveal: () => void;
}) {
  return (
    <Flex justifyContent="space-evenly" flexWrap="wrap">
      <GameActionButton
        icon={<MdRestartAlt />}
        text="Restart game"
        onClick={props.onGameRestart}
      />
      {/* show reveal cards button if reveal cards button enabled flag is true */}
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
