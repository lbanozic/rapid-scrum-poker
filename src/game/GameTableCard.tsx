import { Badge, Box, Center, VStack } from "@chakra-ui/react";
import { TableCard } from "../types/TableCard";

/**
 * A component for showing the card on the table.
 */
export default function GameTableCard(props: TableCard) {
  let cardBackgroundColor = "gray.400";
  let cardBorderWidth: string[] | undefined = undefined;
  let cardBorderStyle: string | undefined = undefined;
  let cardBorderColor: string | undefined = undefined;
  let playerBadgeColorScheme: string | undefined = undefined;

  // set different card styles if the card is revealed or selected
  if (props.isRevealed) {
    cardBackgroundColor = "white";
    cardBorderWidth = ["0.3rem", "0.375rem", "0.45rem", "0.5rem"];
    cardBorderStyle = "solid";
    cardBorderColor = "yellow.400";
    playerBadgeColorScheme = "yellow";
  } else if (props.isSelected) {
    cardBackgroundColor = "yellow.400";
    playerBadgeColorScheme = "yellow";
  }

  return (
    <Box margin="1vh">
      <VStack>
        <Box
          backgroundColor={cardBackgroundColor}
          borderWidth={cardBorderWidth}
          borderStyle={cardBorderStyle}
          borderColor={cardBorderColor}
          width={["2.25rem", "3rem", "3.75rem", "4.5rem"]}
          height={["3.75rem", "5rem", "6.25rem", "7.5rem"]}
          borderRadius={["md", "md", "lg", "lg"]}
        >
          {/* show card value if card value exists and card is revealed */}
          {props.value && props.isRevealed && (
            <Center width="100%" height="100%">
              <Box fontWeight="bold" fontSize={["md", "lg", "xl", "2xl"]}>
                {props.value}
              </Box>
            </Center>
          )}
        </Box>
        <Badge colorScheme={playerBadgeColorScheme} textTransform="initial">
          {props.playerName}
        </Badge>
      </VStack>
    </Box>
  );
}
