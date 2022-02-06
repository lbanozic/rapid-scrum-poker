import { Box, Center } from "@chakra-ui/react";
import React from "react";
import { PlayingCard } from "./PlayingCard";

export default function GamePlayingCard(
  props: PlayingCard & {
    onCardSelected: (selectedCardValue: string) => void;
  }
) {
  let cardBackgroundColor = "white";
  let cardBorderWidth = "0.5rem";
  let cardBorderStyle = "solid";
  let cardBorderColor = "gray.400";
  let cardBorderColorHover = "gray.300";
  let cardBoxShadow = undefined;
  let cardTransform = undefined;
  const transformUp = "translateY(-0.4rem)";

  if (props.isSelected) {
    cardBorderColor = "yellow.400";
    cardBorderColorHover = "yellow.300";
    cardBoxShadow = "lg";
    cardTransform = transformUp;
  }

  function playingCardSelected() {
    props.onCardSelected(props.value);
  }

  return (
    <Box
      backgroundColor={cardBackgroundColor}
      borderWidth={cardBorderWidth}
      borderStyle={cardBorderStyle}
      borderColor={cardBorderColor}
      width="6rem"
      height="10rem"
      borderRadius="2xl"
      boxShadow={cardBoxShadow}
      transform={cardTransform}
      _hover={{
        boxShadow: "lg",
        transition: "0.1s",
        cursor: "pointer",
        transform: transformUp,
        borderColor: cardBorderColorHover,
      }}
      onClick={playingCardSelected}
    >
      <Center width="100%" height="100%">
        <Box fontWeight="bold" fontSize="2xl">
          {props.value}
        </Box>
      </Center>
    </Box>
  );
}
