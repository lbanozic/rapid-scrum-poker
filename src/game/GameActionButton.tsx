import { Button } from "@chakra-ui/react";
import React from "react";

/**
 * A component for button with common styles and props used in game actions.
 */
export default function GameActionButton(props: {
  /** Icon shown on the right side of the button. */
  icon: React.ReactElement;

  /** Text inside the game action button. */
  text: string;

  /** Flag which determines if button should have primary yellow styling. Default is false. */
  isPrimary?: boolean;

  /** Gets called on game action button click. */
  onClick: () => void;
}) {
  return (
    <Button
      size="lg"
      margin="4"
      padding="7"
      fontSize="xl"
      borderRadius="16"
      minWidth="initial"
      rightIcon={props.icon}
      colorScheme={props.isPrimary ? "yellow" : undefined}
      onClick={props.onClick}
    >
      {props.text}
    </Button>
  );
}
