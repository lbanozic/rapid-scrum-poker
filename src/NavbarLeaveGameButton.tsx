import React from "react";
import { BiExit } from "react-icons/bi";
import { useNavigate } from "react-router";
import NavbarButton from "./NavbarButton";

export default function NavbarLeaveGameButton() {
  const navigate = useNavigate();

  function leaveGame() {
    navigate("/");
  }

  return (
    <NavbarButton label="Leave game" icon={<BiExit />} onClick={leaveGame} />
  );
}
