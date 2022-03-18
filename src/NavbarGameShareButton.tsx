import React, { useState } from "react";
import { IoMdShare } from "react-icons/io";
import NavbarButton from "./NavbarButton";

export default function NavbarGameShareButton() {
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
    <NavbarButton
      label={shareGameLinkButtonText}
      icon={<IoMdShare />}
      onClick={copyGameLink}
    />
  );
}
