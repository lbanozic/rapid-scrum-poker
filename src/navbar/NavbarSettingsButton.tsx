import { IoMdSettings } from "react-icons/io";
import NavbarButton from "./NavbarButton";
import { MenuItem } from "@chakra-ui/react";

/**
 * A component for navbar settings button.
 */
export default function NavbarSettingsButton(props: {
  /** Flag which determines if navbar settings button should be rendered as MenuItem component (part of MenuList component). */
  isMenuItem?: boolean;

  /** Gets called on navbar settings button click. */
  onClick: () => void;
}) {
  const settingsIcon = <IoMdSettings />;

  if (props.isMenuItem) {
    return (
      <MenuItem icon={settingsIcon} onClick={props.onClick}>
        Settings
      </MenuItem>
    );
  }

  return (
    <NavbarButton
      label="Open settings"
      icon={settingsIcon}
      onClick={props.onClick}
    />
  );
}
