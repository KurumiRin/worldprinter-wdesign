import React from 'react';
import { createEventHandler } from '@worldprint/wdesign-utils';
import { useComponentDefaultProps } from '@worldprint/wdesign-styles';
import { Popover, PopoverDropdownProps } from '../../Popover';
import { useHoverCardContext } from '../HoverCard.context';

export interface HoverCardDropdownProps extends PopoverDropdownProps {
  /** Dropdown content */
  children?: React.ReactNode;
}

const defaultProps: Partial<HoverCardDropdownProps> = {};

export function HoverCardDropdown(props: HoverCardDropdownProps) {
  const { children, onMouseEnter, onMouseLeave, ...others } = useComponentDefaultProps(
    'HoverCardDropdown',
    defaultProps,
    props
  );

  const ctx = useHoverCardContext();

  const handleMouseEnter = createEventHandler(onMouseEnter, ctx.openDropdown);
  const handleMouseLeave = createEventHandler(onMouseLeave, ctx.closeDropdown);

  return (
    <Popover.Dropdown onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...others}>
      {children}
    </Popover.Dropdown>
  );
}

HoverCardDropdown.displayName = '@worldprint/wdesign-core/HoverCardDropdown';
