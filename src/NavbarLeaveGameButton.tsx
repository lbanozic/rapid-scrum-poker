import React from "react";
import { BiExit } from "react-icons/bi";
import NavbarButton from "./NavbarButton";

export default function NavbarLeaveGameButton(props: { onClick: () => void }) {
  return (
    <NavbarButton
      label="Leave game"
      icon={<BiExit />}
      onClick={props.onClick}
    />
  );
}
