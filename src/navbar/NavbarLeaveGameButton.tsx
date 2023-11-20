import React from "react";
import { BiExit } from "react-icons/bi";
import NavbarButton from "./NavbarButton";
import { MenuItem } from "@chakra-ui/react";

/**
 * A component for navbar leave game button.
 */
export default function NavbarLeaveGameButton(props: {
  /** Flag which determines if navbar leave game button should be rendered as MenuItem component (part of MenuList component). */
  isMenuItem?: boolean;

  /** Gets called on navbar leave game button click. */
  onClick: () => void;
}) {
  const leaveIcon = <BiExit />;

  if (props.isMenuItem) {
    return (
      <MenuItem icon={leaveIcon} onClick={props.onClick}>
        Leave Game
      </MenuItem>
    );
  }

  return (
    <NavbarButton label="Leave game" icon={leaveIcon} onClick={props.onClick} />
  );
}
