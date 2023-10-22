import { Box, Center } from "@chakra-ui/react";
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
  let cardBackgroundColor = "white";
  let cardBorderWidth = "0.5rem";
  let cardBorderStyle = "solid";
  let cardBorderColor = "gray.400";
  let cardBorderColorHover = "gray.300";
  let cardBoxShadow = undefined;
  let cardTransform = undefined;
  const transformUp = "translateY(-1rem)";

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

  const cardContainerTransform = `translateY(-${props.playingCard.translateYRems}rem) rotate(${props.playingCard.rotateDegrees}deg)`;

  return (
    <Box width="4rem" transform={cardContainerTransform}>
      <Box
        position="relative"
        backgroundColor={cardBackgroundColor}
        borderWidth={cardBorderWidth}
        borderStyle={cardBorderStyle}
        borderColor={cardBorderColor}
        width="6rem"
        height="10rem"
        borderRadius="2xl"
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
          <Box fontWeight="bold" fontSize="2xl">
            {props.playingCard.value}
          </Box>
        </Center>
      </Box>
    </Box>
  );
}
