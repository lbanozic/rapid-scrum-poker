import { Box, Flex, HStack, Spacer } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import NavBarGameShareButton from "./NavBarGameShareButton";

export default function Navbar() {
  return (
    <Flex my={4} mx={12}>
      <Box>
        <Link to="/">
          <img
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="Logo"
            width={250}
          />
        </Link>
      </Box>
      <Spacer />
      <HStack spacing={6}>
        <NavBarGameShareButton />
      </HStack>
    </Flex>
  );
}
