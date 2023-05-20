import type { Row } from '@tanstack/react-table';
import { MRT_AggregationFns } from './aggregationFns';
import { MRT_FilterFns } from './filterFns';
import { MRT_SortingFns } from './sortingFns';
import { BoxProps, MantineTheme } from '@worldprint/wdesign-core';
import type {
  MantineReactTableProps,
  MantineShade,
  MRT_Column,
  MRT_ColumnDef,
  MRT_ColumnOrderState,
  MRT_DefinedColumnDef,
  MRT_DisplayColumnIds,
  MRT_FilterOption,
  MRT_GroupingState,
  MRT_Header,
  MRT_Row,
  MRT_TableInstance,
} from '.';

export const getColumnId = <TData extends Record<string, any> = {}>(
  columnDef: MRT_ColumnDef<TData>
): string =>
  columnDef.id ?? columnDef.accessorKey?.toString?.() ?? columnDef.header;

export const getAllLeafColumnDefs = <TData extends Record<string, any> = {}>(
  columns: MRT_ColumnDef<TData>[]
) => {
  const allLeafColumnDefs: MRT_ColumnDef<TData>[] = [];
  const getLeafColumns = (cols: MRT_ColumnDef<TData>[]) => {
    cols.forEach((col) => {
      if (col.columns) {
        getLeafColumns(col.columns);
      } else {
        allLeafColumnDefs.push(col);
      }
    });
  };
  getLeafColumns(columns);
  return allLeafColumnDefs;
};

export const prepareColumns = <TData extends Record<string, any> = {}>({
  aggregationFns,
  columnDefs,
  columnFilterFns,
  defaultDisplayColumn,
  filterFns,
  sortingFns,
}: {
  aggregationFns: typeof MRT_AggregationFns &
    MantineReactTableProps<TData>['aggregationFns'];
  columnDefs: MRT_ColumnDef<TData>[];
  columnFilterFns: { [key: string]: MRT_FilterOption };
  defaultDisplayColumn: Partial<MRT_ColumnDef<TData>>;
  filterFns: typeof MRT_FilterFns & MantineReactTableProps<TData>['filterFns'];
  sortingFns: typeof MRT_SortingFns &
    MantineReactTableProps<TData>['sortingFns'];
}): MRT_DefinedColumnDef<TData>[] =>
  columnDefs.map((columnDef) => {
    //assign columnId
    if (!columnDef.id) columnDef.id = getColumnId(columnDef);
    if (process.env.NODE_ENV !== 'production' && !columnDef.id) {
      console.error(
        'Column definitions must have a valid `accessorKey` or `id` property'
      );
    }

    //assign columnDefType
    if (!columnDef.columnDefType) columnDef.columnDefType = 'data';
    if (columnDef.columns?.length) {
      columnDef.columnDefType = 'group';
      //recursively prepare columns if this is a group column
      columnDef.columns = prepareColumns({
        aggregationFns,
        columnDefs: columnDef.columns,
        columnFilterFns,
        defaultDisplayColumn,
        filterFns,
        sortingFns,
      });
    } else if (columnDef.columnDefType === 'data') {
      //assign aggregationFns if multiple aggregationFns are provided
      if (Array.isArray(columnDef.aggregationFn)) {
        const aggFns = columnDef.aggregationFn as string[];
        columnDef.aggregationFn = (
          columnId: string,
          leafRows: Row<TData>[],
          childRows: Row<TData>[]
        ) =>
          aggFns.map((fn) =>
            aggregationFns[fn]?.(columnId, leafRows, childRows)
          );
      }

      //assign filterFns
      if (Object.keys(filterFns).includes(columnFilterFns[columnDef.id])) {
        columnDef.filterFn =
          filterFns[columnFilterFns[columnDef.id]] ?? filterFns.fuzzy;
        (columnDef as MRT_DefinedColumnDef)._filterFn =
          columnFilterFns[columnDef.id];
      }

      //assign sortingFns
      if (Object.keys(sortingFns).includes(columnDef.sortingFn as string)) {
        // @ts-ignore
        columnDef.sortingFn = sortingFns[columnDef.sortingFn];
      }
    } else if (columnDef.columnDefType === 'display') {
      columnDef = {
        ...(defaultDisplayColumn as MRT_ColumnDef<TData>),
        ...columnDef,
      };
    }
    return columnDef;
  }) as MRT_DefinedColumnDef<TData>[];

export const reorderColumn = <TData extends Record<string, any> = {}>(
  draggedColumn: MRT_Column<TData>,
  targetColumn: MRT_Column<TData>,
  columnOrder: MRT_ColumnOrderState
): MRT_ColumnOrderState => {
  if (draggedColumn.getCanPin()) {
    draggedColumn.pin(targetColumn.getIsPinned());
  }
  columnOrder.splice(
    columnOrder.indexOf(targetColumn.id),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumn.id), 1)[0]
  );
  return [...columnOrder];
};

export const showExpandColumn = <TData extends Record<string, any> = {}>(
  props: MantineReactTableProps<TData>,
  grouping?: MRT_GroupingState
) =>
  !!(
    props.enableExpanding ||
    (props.enableGrouping && (grouping === undefined || grouping?.length)) ||
    props.renderDetailPanel
  );

export const getLeadingDisplayColumnIds = <
  TData extends Record<string, any> = {}
>(
  props: MantineReactTableProps<TData>
) =>
  [
    (props.enableRowDragging || props.enableRowOrdering) && 'mrt-row-drag',
    props.positionActionsColumn === 'first' &&
      (props.enableRowActions ||
        (props.enableEditing &&
          ['row', 'modal'].includes(props.editingMode ?? ''))) &&
      'mrt-row-actions',
    props.positionExpandColumn === 'first' &&
      showExpandColumn(props) &&
      'mrt-row-expand',
    props.enableRowSelection && 'mrt-row-select',
    props.enableRowNumbers && 'mrt-row-numbers',
  ].filter(Boolean) as MRT_DisplayColumnIds[];

export const getTrailingDisplayColumnIds = <
  TData extends Record<string, any> = {}
>(
  props: MantineReactTableProps<TData>
) =>
  [
    props.positionActionsColumn === 'last' &&
      (props.enableRowActions ||
        (props.enableEditing &&
          ['row', 'modal'].includes(props.editingMode ?? ''))) &&
      'mrt-row-actions',
    props.positionExpandColumn === 'last' &&
      showExpandColumn(props) &&
      'mrt-row-expand',
  ].filter(Boolean) as MRT_DisplayColumnIds[];

export const getDefaultColumnOrderIds = <
  TData extends Record<string, any> = {}
>(
  props: MantineReactTableProps<TData>
) => {
  const leadingDisplayCols: string[] = getLeadingDisplayColumnIds(props);
  const trailingDisplayCols: string[] = getTrailingDisplayColumnIds(props);
  const allLeafColumnDefs = getAllLeafColumnDefs(props.columns)
    .map((columnDef) => getColumnId(columnDef))
    .filter(
      (columnId) =>
        !leadingDisplayCols.includes(columnId) &&
        !trailingDisplayCols.includes(columnId)
    );
  return [...leadingDisplayCols, ...allLeafColumnDefs, ...trailingDisplayCols];
};

export const getDefaultColumnFilterFn = <
  TData extends Record<string, any> = {}
>(
  columnDef: MRT_ColumnDef<TData>
): MRT_FilterOption => {
  if (columnDef.filterVariant === 'multi-select') return 'arrIncludesSome';
  if (columnDef.filterVariant === 'range') return 'betweenInclusive';
  if (
    columnDef.filterVariant === 'select' ||
    columnDef.filterVariant === 'checkbox'
  )
    return 'equals';
  return 'fuzzy';
};

export const getIsFirstColumn = (
  column: MRT_Column,
  table: MRT_TableInstance
) => {
  return table.getVisibleLeafColumns()[0].id === column.id;
};

export const getIsLastColumn = (
  column: MRT_Column,
  table: MRT_TableInstance
) => {
  const columns = table.getVisibleLeafColumns();
  return columns[columns.length - 1].id === column.id;
};

export const getIsLastLeftPinnedColumn = (
  table: MRT_TableInstance,
  column: MRT_Column
) => {
  return (
    column.getIsPinned() === 'left' &&
    table.getLeftLeafHeaders().length - 1 === column.getPinnedIndex()
  );
};

export const getIsFirstRightPinnedColumn = (column: MRT_Column) => {
  return column.getIsPinned() === 'right' && column.getPinnedIndex() === 0;
};

export const getTotalRight = (table: MRT_TableInstance, column: MRT_Column) => {
  return (
    (table.getRightLeafHeaders().length - 1 - column.getPinnedIndex()) * 200
  );
};

export const getCommonCellStyles = ({
  column,
  header,
  isStriped,
  row,
  table,
  tableCellProps,
  theme,
}: {
  column: MRT_Column;
  header?: MRT_Header;
  isStriped?: boolean;
  row?: MRT_Row;
  table: MRT_TableInstance;
  tableCellProps: BoxProps;
  theme: MantineTheme;
}) => {
  const widthStyles = {
    minWidth: `max(calc(var(--${header ? 'header' : 'col'}-${parseCSSVarId(
      header?.id ?? column.id
    )}-size) * 1px), ${column.columnDef.minSize ?? 30}px)`,
    width: `calc(var(--${header ? 'header' : 'col'}-${parseCSSVarId(
      header?.id ?? column.id
    )}-size) * 1px)`,
  };

  return {
    backgroundColor: row
      ? row?.getIsSelected()
        ? theme.fn.rgba(getPrimaryColor(theme), 0.1)
        : column.getIsPinned() && column.columnDef.columnDefType !== 'group'
        ? theme.fn.rgba(
            theme.colorScheme === 'dark'
              ? theme.fn.darken(theme.colors.dark[7], 0.02)
              : theme.white,
            0.97
          )
        : isStriped
        ? 'inherit'
        : theme.colorScheme === 'dark'
        ? theme.fn.lighten(theme.colors.dark[7], 0.02)
        : theme.white
      : 'inherit',
    backgroundClip: 'padding-box',
    boxShadow: getIsLastLeftPinnedColumn(table, column)
      ? `-4px 0 8px -6px ${theme.fn.rgba(theme.black, 0.2)} inset`
      : getIsFirstRightPinnedColumn(column)
      ? `4px 0 8px -6px ${theme.fn.rgba(theme.black, 0.2)} inset`
      : undefined,
    display: table.options.layoutMode === 'grid' ? 'flex' : 'table-cell',
    flex:
      table.options.layoutMode === 'grid'
        ? `var(--${header ? 'header' : 'col'}-${parseCSSVarId(
            header?.id ?? column.id
          )}-size) 0 auto`
        : undefined,
    left:
      column.getIsPinned() === 'left'
        ? `${column.getStart('left')}px`
        : undefined,
    ml:
      table.options.enableColumnVirtualization &&
      column.getIsPinned() === 'left' &&
      column.getPinnedIndex() === 0
        ? `-${
            column.getSize() *
            (table.getState().columnPinning.left?.length ?? 1)
          }px`
        : undefined,
    mr:
      table.options.enableColumnVirtualization &&
      column.getIsPinned() === 'right' &&
      column.getPinnedIndex() === table.getVisibleLeafColumns().length - 1
        ? `-${
            column.getSize() *
            (table.getState().columnPinning.right?.length ?? 1) *
            1.2
          }px`
        : undefined,
    opacity:
      table.getState().draggingColumn?.id === column.id ||
      table.getState().hoveredColumn?.id === column.id
        ? 0.5
        : 1,
    position:
      column.getIsPinned() && column.columnDef.columnDefType !== 'group'
        ? 'sticky'
        : undefined,
    right:
      column.getIsPinned() === 'right'
        ? `${getTotalRight(table, column)}px`
        : undefined,
    transition: table.options.enableColumnVirtualization
      ? 'none'
      : `padding 100ms ease-in-out`,
    ...(!table.options.enableColumnResizing && widthStyles), //let devs pass in width styles if column resizing is disabled
    ...(tableCellProps?.sx instanceof Function
      ? tableCellProps.sx(theme)
      : (tableCellProps?.sx as any)),
    ...(table.options.enableColumnResizing && widthStyles), //don't let devs pass in width styles if column resizing is enabled
  };
};

export const MRT_DefaultColumn = {
  filterVariant: 'text',
  minSize: 40,
  maxSize: 1000,
  size: 180,
} as const;

export const MRT_DefaultDisplayColumn = {
  columnDefType: 'display',
  enableClickToCopy: false,
  enableColumnActions: false,
  enableColumnDragging: false,
  enableColumnFilter: false,
  enableColumnOrdering: false,
  enableEditing: false,
  enableGlobalFilter: false,
  enableGrouping: false,
  enableHiding: false,
  enableResizing: false,
  enableSorting: false,
} as const;

export const getPrimaryShade = (theme: MantineTheme): number =>
  (theme.colorScheme === 'dark'
    ? // @ts-ignore
      theme.primaryShade?.dark ?? theme.primaryShade
    : // @ts-ignore
      theme.primaryShade?.light ?? theme.primaryShade) ?? 7;

export const getPrimaryColor = (
  theme: MantineTheme,
  shade?: MantineShade
): string => theme.colors[theme.primaryColor][shade ?? getPrimaryShade(theme)];

export const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');
