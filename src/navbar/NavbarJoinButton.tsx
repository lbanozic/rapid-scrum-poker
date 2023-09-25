import { GoZap } from "react-icons/go";
import NavbarButton from "./NavbarButton";

/**
 * A component for navbar join button.
 */
export default function NavbarJoinButton(props: {
  /** Gets called on navbar join button click. */
  onClick: () => void;
}) {
  return (
    <NavbarButton
      label="Join the game"
      icon={<GoZap />}
      onClick={props.onClick}
    />
  );
}
