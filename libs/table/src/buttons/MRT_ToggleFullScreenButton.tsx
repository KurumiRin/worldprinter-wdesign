import React from 'react';
import { ActionIcon, ActionIconProps, Tooltip } from '@mantine/core';
import type { HTMLPropsRef, MRT_TableInstance } from '..';

interface Props<TData extends Record<string, any> = {}>
  extends ActionIconProps,
    HTMLPropsRef<HTMLButtonElement> {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToggleFullScreenButton = <
  TData extends Record<string, any> = {},
>({
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: {
      icons: { IconMinimize, IconMaximize },
      localization,
    },
    setIsFullScreen,
  } = table;
  const { isFullScreen } = getState();

  const handleToggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Tooltip
      withinPortal
      withArrow
      label={rest?.title ?? localization.toggleFullScreen}
    >
      <ActionIcon
        aria-label={localization.showHideFilters}
        onClick={handleToggleFullScreen}
        size="lg"
        {...rest}
        title={undefined}
      >
        {isFullScreen ? <IconMinimize /> : <IconMaximize />}
      </ActionIcon>
    </Tooltip>
  );
};
