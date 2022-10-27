import { GoMarkGithub } from "react-icons/go";
import NavbarButton from "./NavbarButton";

/**
 * A component for open GitHub repo button.
 */
export default function NavbarGitHubRepoButton() {
  return (
    <NavbarButton
      label="Open GitHub repo"
      icon={<GoMarkGithub />}
      link="https://github.com/lbanozic/rapid-scrum-poker"
    />
  );
}
