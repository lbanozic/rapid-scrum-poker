import React from "react";
import { IoMdSettings } from "react-icons/io";
import NavbarButton from "./NavbarButton";

/**
 * A component for navbar settings button.
 */
export default function NavbarSettingsButton(props: {
  /** Gets called on navbar settings button click. */
  onClick: () => void;
}) {
  return (
    <NavbarButton
      label="Open settings"
      icon={<IoMdSettings />}
      onClick={props.onClick}
    />
  );
}
