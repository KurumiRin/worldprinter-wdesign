import React from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import type { MRT_TableInstance } from '..';

interface Props {
  table: MRT_TableInstance;
}

export const MRT_ExpandAllButton = ({ table }: Props) => {
  const {
    getIsAllRowsExpanded,
    getIsSomeRowsExpanded,
    getCanSomeRowsExpand,
    getState,
    options: {
      icons: { IconChevronsDown },
      localization,
      mantineExpandAllButtonProps,
      renderDetailPanel,
    },
    toggleAllRowsExpanded,
  } = table;
  const { density, isLoading } = getState();

  const actionIconProps =
    mantineExpandAllButtonProps instanceof Function
      ? mantineExpandAllButtonProps({ table })
      : mantineExpandAllButtonProps;

  const isAllRowsExpanded = getIsAllRowsExpanded();

  return (
    <Tooltip
      withinPortal
      withArrow
      openDelay={1000}
      label={
        actionIconProps?.title ?? isAllRowsExpanded
          ? localization.collapseAll
          : localization.expandAll
      }
    >
      <ActionIcon
        aria-label={localization.expandAll}
        disabled={isLoading || (!renderDetailPanel && !getCanSomeRowsExpand())}
        onClick={() => toggleAllRowsExpanded(!isAllRowsExpanded)}
        {...actionIconProps}
        sx={(theme) => ({
          marginLeft:
            density === 'xl'
              ? '-6px'
              : density === 'lg'
              ? '-3px'
              : density === 'md'
              ? '0'
              : density === 'sm'
              ? '3px'
              : '6px',
          '&:disabled': {
            backgroundColor: 'transparent',
            border: 'none',
          },
          ...(actionIconProps?.sx instanceof Function
            ? actionIconProps?.sx(theme)
            : (actionIconProps?.sx as any)),
        })}
        title={undefined}
      >
        {actionIconProps?.children ?? (
          <IconChevronsDown
            style={{
              transform: `rotate(${
                isAllRowsExpanded ? -180 : getIsSomeRowsExpanded() ? -90 : 0
              }deg)`,
              transition: 'transform 100ms',
            }}
          />
        )}
      </ActionIcon>
    </Tooltip>
  );
};
