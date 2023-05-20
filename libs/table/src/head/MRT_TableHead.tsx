import React from 'react';
import { Box } from '@worldprint/wdesign-core';
import { MRT_TableHeadRow } from './MRT_TableHeadRow';
import type { MRT_TableInstance, MRT_VirtualItem } from '..';

interface Props {
  table: MRT_TableInstance;
  virtualColumns?: MRT_VirtualItem[];
  virtualPaddingLeft?: number;
  virtualPaddingRight?: number;
}

export const MRT_TableHead = ({
  table,
  virtualColumns,
  virtualPaddingLeft,
  virtualPaddingRight,
}: Props) => {
  const {
    getHeaderGroups,
    getState,
    options: { enableStickyHeader, layoutMode, mantineTableHeadProps },
  } = table;
  const { isFullScreen } = getState();

  const tableHeadProps =
    mantineTableHeadProps instanceof Function
      ? mantineTableHeadProps({ table })
      : mantineTableHeadProps;

  const stickyHeader = enableStickyHeader || isFullScreen;

  return (
    <Box
      component="thead"
      {...tableHeadProps}
      sx={(theme) => ({
        display: layoutMode === 'grid' ? 'grid' : 'table-row-group',
        position: stickyHeader && layoutMode === 'grid' ? 'sticky' : 'relative',
        top: stickyHeader ? 0 : undefined,
        zIndex: stickyHeader ? 2 : undefined,
        ...(tableHeadProps?.sx instanceof Function
          ? tableHeadProps?.sx(theme)
          : (tableHeadProps?.sx as any)),
      })}
    >
      {getHeaderGroups().map((headerGroup) => (
        <MRT_TableHeadRow
          headerGroup={headerGroup as any}
          key={headerGroup.id}
          table={table}
          virtualColumns={virtualColumns}
          virtualPaddingLeft={virtualPaddingLeft}
          virtualPaddingRight={virtualPaddingRight}
        />
      ))}
    </Box>
  );
};
