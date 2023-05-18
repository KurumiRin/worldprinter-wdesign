import React from 'react';
import { ActionIcon, Collapse, Flex, Menu, Text, Tooltip } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import { MRT_FilterRangeFields } from '../inputs/MRT_FilterRangeFields';
import { MRT_FilterTextInput } from '../inputs/MRT_FilterTextInput';
import { MRT_FilterCheckbox } from '../inputs/MRT_FilterCheckbox';
import { MRT_FilterOptionMenu } from '../menus/MRT_FilterOptionMenu';
import type { MRT_Header, MRT_TableInstance } from '..';

interface Props {
  header: MRT_Header;
  table: MRT_TableInstance;
}

export const MRT_TableHeadCellFilterContainer = ({ header, table }: Props) => {
  const {
    getState,
    options: { enableColumnFilterModes, columnFilterModeOptions, localization },
  } = table;
  const { showColumnFilters } = getState();
  const { column } = header;
  const { columnDef } = column;

  const currentFilterOption = columnDef._filterFn;
  const allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions;
  const showChangeModeButton =
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length);

  return (
    <Collapse in={showColumnFilters}>
      <Flex direction="column">
        <Flex align="flex-end">
          {columnDef.filterVariant === 'checkbox' ? (
            <MRT_FilterCheckbox column={column} table={table} />
          ) : columnDef.filterVariant === 'range' ||
            columnDef.filterVariant === 'date-range' ||
            ['between', 'betweenInclusive', 'inNumberRange'].includes(
              columnDef._filterFn,
            ) ? (
            <MRT_FilterRangeFields header={header} table={table} />
          ) : (
            <MRT_FilterTextInput header={header} table={table} />
          )}
          {showChangeModeButton && (
            <Menu withinPortal>
              <Tooltip
                label={localization.changeFilterMode}
                position="bottom-start"
                withArrow
                withinPortal
              >
                <Menu.Target>
                  <ActionIcon
                    aria-label={localization.changeFilterMode}
                    size="md"
                    sx={{ transform: 'translateY(-2px)' }}
                  >
                    <IconFilter />
                  </ActionIcon>
                </Menu.Target>
              </Tooltip>
              <MRT_FilterOptionMenu header={header} table={table} />
            </Menu>
          )}
        </Flex>
        {showChangeModeButton ? (
          <Text
            component="label"
            color="dimmed"
            sx={{ whiteSpace: 'nowrap', marginTop: '4px', fontSize: '10px' }}
          >
            {localization.filterMode.replace(
              '{filterType}',
              // @ts-ignore
              localization[
                `filter${
                  currentFilterOption?.charAt(0)?.toUpperCase() +
                  currentFilterOption?.slice(1)
                }`
              ],
            )}
          </Text>
        ) : null}
      </Flex>
    </Collapse>
  );
};
