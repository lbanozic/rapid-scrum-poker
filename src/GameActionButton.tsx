import { Button } from "@chakra-ui/react";
import React from "react";

export default function GameActionButton(props: {
  icon: React.ReactElement;
  text: string;
  isPrimary?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      size="lg"
      margin="4"
      padding="7"
      fontSize="xl"
      borderRadius="16"
      rightIcon={props.icon}
      colorScheme={props.isPrimary ? "yellow" : undefined}
      onClick={props.onClick}
    >
      {props.text}
    </Button>
  );
}
