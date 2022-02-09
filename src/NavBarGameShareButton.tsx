import { IconButton, Tooltip, WrapItem } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoMdShare } from "react-icons/io";

export default function NavBarGameShareButton() {
  const [shareGameLinkButtonText, setShareGameLinkButtonText] =
    useState("Share game link");

  function copyGameLink() {
    if (shareGameLinkButtonText === "Link copied!") {
      return;
    }

    navigator.clipboard.writeText(window.location.href);

    setShareGameLinkButtonText("Link copied! ✓");

    setTimeout(() => {
      setShareGameLinkButtonText("Copy game link");
    }, 2000);
  }

  return (
    <WrapItem>
      <Tooltip
        label={shareGameLinkButtonText}
        openDelay={500}
        closeDelay={500}
        closeOnClick={false}
      >
        <IconButton
          aria-label="Share game link"
          colorScheme="yellow"
          icon={<IoMdShare />}
          onClick={copyGameLink}
        />
      </Tooltip>
    </WrapItem>
  );
}
