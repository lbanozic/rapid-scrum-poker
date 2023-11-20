import { GoZap } from "react-icons/go";
import NavbarButton from "./NavbarButton";
import { MenuItem } from "@chakra-ui/react";

/**
 * A component for navbar join button.
 */
export default function NavbarJoinButton(props: {
  /** Flag which determines if navbar join button should be rendered as MenuItem component (part of MenuList component). */
  isMenuItem?: boolean;

  /** Gets called on navbar join button click. */
  onClick: () => void;
}) {
  const joinIcon = <GoZap />;

  if (props.isMenuItem) {
    return (
      <MenuItem icon={joinIcon} onClick={props.onClick}>
        Join Game
      </MenuItem>
    );
  }

  return (
    <NavbarButton
      label="Join the game"
      icon={joinIcon}
      onClick={props.onClick}
    />
  );
}
