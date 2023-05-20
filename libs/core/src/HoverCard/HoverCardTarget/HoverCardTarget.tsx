import React, { cloneElement, forwardRef } from 'react';
import { isElement, createEventHandler } from '@worldprint/wdesign-utils';
import { useComponentDefaultProps } from '@worldprint/wdesign-styles';
import { Popover, PopoverTargetProps } from '../../Popover';
import { useHoverCardContext } from '../HoverCard.context';
import { HOVER_CARD_ERRORS } from '../HoverCard.errors';

export interface HoverCardTargetProps extends PopoverTargetProps {}

const defaultProps: Partial<HoverCardTargetProps> = {
  refProp: 'ref',
};

export const HoverCardTarget = forwardRef<HTMLElement, HoverCardTargetProps>(
  (props, ref) => {
    const { children, refProp, ...others } = useComponentDefaultProps(
      'HoverCardTarget',
      defaultProps,
      props
    );

    if (!isElement(children)) {
      throw new Error(HOVER_CARD_ERRORS.children);
    }

    const ctx = useHoverCardContext();
    const onMouseEnter = createEventHandler(
      children.props.onMouseEnter,
      ctx.openDropdown
    );
    const onMouseLeave = createEventHandler(
      children.props.onMouseLeave,
      ctx.closeDropdown
    );

    return (
      <Popover.Target refProp={refProp} ref={ref} {...others}>
        {cloneElement(children as React.ReactElement, {
          onMouseEnter,
          onMouseLeave,
        })}
      </Popover.Target>
    );
  }
);

HoverCardTarget.displayName = '@worldprint/wdesign-core/HoverCardTarget';
