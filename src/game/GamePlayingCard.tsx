import { Box, Center, useColorMode } from "@chakra-ui/react";
import { PlayingCard } from "../types/PlayingCard";

/**
 * A component for showing the card in player's hands.
 */
export default function GamePlayingCard(props: {
  /** A card to show in player's hands. */
  playingCard: PlayingCard;

  /**
   * Gets called when player selectes this card.
   *
   * @param selectedCardValue value of selected card, for example: "3", "5", or "8"
   */
  onCardSelected: (selectedCardValue: string) => void;
}) {
  let cardBorderColor = "gray.400";
  let cardBorderColorHover = "gray.300";
  let cardBoxShadow = undefined;
  let cardTransform = undefined;
  const transformUp = "translateY(-1rem)";

  // set card background color based on dark or light theme
  const { colorMode } = useColorMode();
  const cardBackgroundColor = colorMode === "dark" ? "gray.700" : "white";

  // if this card is selected, set selected card styles and lift the card
  if (props.playingCard.isSelected) {
    cardBorderColor = "yellow.400";
    cardBorderColorHover = "yellow.300";
    cardBoxShadow = "lg";
    cardTransform = transformUp;
  }

  /**
   * Calls a on card selected function prop.
   */
  function playingCardSelected() {
    props.onCardSelected(props.playingCard.value);
  }

  return (
    <Box
      width={["1.65rem", "3rem", "3.5rem", "4rem"]}
      transform={[
        `translateY(-${
          props.playingCard.translateYRems
            ? props.playingCard.translateYRems / 2
            : 0
        }rem) rotate(${props.playingCard.rotateDegrees}deg)`,
        `translateY(-${props.playingCard.translateYRems}rem) rotate(${props.playingCard.rotateDegrees}deg)`,
        `translateY(-${props.playingCard.translateYRems}rem) rotate(${props.playingCard.rotateDegrees}deg)`,
        `translateY(-${props.playingCard.translateYRems}rem) rotate(${props.playingCard.rotateDegrees}deg)`,
      ]}
    >
      <Box
        position="relative"
        width={["2.7rem", "4.5rem", "5.25rem", "6rem"]}
        height={["4.5rem", "7.5rem", "8.75rem", "10rem"]}
        backgroundColor={cardBackgroundColor}
        borderWidth={["0.3rem", "0.375rem", "0.45rem", "0.5rem"]}
        borderStyle="solid"
        borderRadius={["lg", "xl", "2xl", "2xl"]}
        borderColor={cardBorderColor}
        boxShadow={cardBoxShadow}
        transform={cardTransform}
        // on hover, change the style and lift the card
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
          <Box fontWeight="bold" fontSize={["md", "lg", "xl", "2xl"]}>
            {props.playingCard.value}
          </Box>
        </Center>
      </Box>
    </Box>
  );
}
