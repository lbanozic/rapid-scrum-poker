import React from "react";
import { BiExit } from "react-icons/bi";
import NavbarButton from "./NavbarButton";

/**
 * A component for navbar leave game button.
 */
export default function NavbarLeaveGameButton(props: {
  /** Gets called on navbar leave game button click. */
  onClick: () => void;
}) {
  return (
    <NavbarButton
      label="Leave game"
      icon={<BiExit />}
      onClick={props.onClick}
    />
  );
}
