import { Box } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <Box position="absolute" margin={2}>
      <Link to="/">
        <img
          src={process.env.PUBLIC_URL + "/logo.png"}
          alt="Logo"
          width={175}
        />
      </Link>
    </Box>
  );
}
