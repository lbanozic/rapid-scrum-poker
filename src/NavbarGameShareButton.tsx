import React, { useState } from "react";
import { IoMdShare } from "react-icons/io";
import NavbarButton from "./NavbarButton";

/**
 * A component for navbar game share button.
 */
export default function NavbarGameShareButton() {
  const shareGameLinkDefaultText = "Copy game link";
  const shareGameLinkCopiedText = "Link copied! ✓";

  // initialize the share link button text state and set it to "Copy game link"
  const [shareGameLinkButtonText, setShareGameLinkButtonText] = useState(
    shareGameLinkDefaultText
  );

  /**
   * Copies current value of browser URL to clipboard and sets share link button text.
   */
  function copyGameLink() {
    // if user still sees the link copied button text, exit the function
    if (shareGameLinkButtonText === shareGameLinkCopiedText) {
      return;
    }

    // copy current browser URL to clipboard
    navigator.clipboard.writeText(window.location.href);

    // set share game link button text state to copied so user can see that link has been copied
    setShareGameLinkButtonText(shareGameLinkCopiedText);

    // after 2 seconds, reset share game link text to the default value
    setTimeout(() => {
      setShareGameLinkButtonText(shareGameLinkDefaultText);
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
