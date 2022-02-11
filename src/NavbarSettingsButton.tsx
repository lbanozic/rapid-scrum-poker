import React from "react";
import { IoMdSettings } from "react-icons/io";
import NavbarButton from "./NavbarButton";

export default function NavbarSettingsButton(props: { onClick: () => void }) {
  return (
    <NavbarButton
      label="Open settings"
      icon={<IoMdSettings />}
      onClick={props.onClick}
    />
  );
}
