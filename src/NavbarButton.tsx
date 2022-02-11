import { IconButton, Tooltip, WrapItem } from "@chakra-ui/react";
import React from "react";

export default function NavbarButton(props: {
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
}) {
  return (
    <WrapItem>
      <Tooltip label={props.label} closeOnClick={false}>
        <IconButton
          aria-label={props.label}
          size="lg"
          icon={props.icon}
          onClick={props.onClick}
        />
      </Tooltip>
    </WrapItem>
  );
}
