import { IconButton, Link, Tooltip, WrapItem } from "@chakra-ui/react";
import React from "react";

/**
 * A component for button with common styles and props used in navbar.
 */
export default function NavbarButton(props: {
  /** A tooltip label text that shows on navbar button hover. */
  label: string;

  /** Icon shown in the navbar button. */
  icon: React.ReactElement;

  /** An external link which opens in new tab on navbar button click. */
  link?: string;

  /** Gets called on navbar button click. */
  onClick?: () => void;
}) {
  return (
    <WrapItem>
      <Tooltip label={props.label} closeOnClick={false}>
        {props.link ? (
          <Link href={props.link} isExternal>
            <IconButton aria-label={props.label} size="lg" icon={props.icon} />
          </Link>
        ) : (
          <IconButton
            aria-label={props.label}
            size="lg"
            icon={props.icon}
            onClick={props.onClick}
          />
        )}
      </Tooltip>
    </WrapItem>
  );
}
