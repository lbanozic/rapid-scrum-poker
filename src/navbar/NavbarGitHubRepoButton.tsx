import { GoMarkGithub } from "react-icons/go";
import NavbarButton from "./NavbarButton";
import { MenuItem } from "@chakra-ui/react";

/**
 * A component for open GitHub repo button.
 */
export default function NavbarGitHubRepoButton(props: {
  /** Flag which determines if navbar GitHub button should be rendered as MenuItem component (part of MenuList component). */
  isMenuItem?: boolean;
}) {
  const githubIcon = <GoMarkGithub />;
  const githubLink = "https://github.com/lbanozic/rapid-scrum-poker";
  const githubLinkText = "Open GitHub repo";

  if (props.isMenuItem) {
    return (
      <MenuItem
        icon={githubIcon}
        as="a"
        href={githubLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        {githubLinkText}
      </MenuItem>
    );
  }

  return (
    <NavbarButton label={githubLinkText} icon={githubIcon} link={githubLink} />
  );
}
