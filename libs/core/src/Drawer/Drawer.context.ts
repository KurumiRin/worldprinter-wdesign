import { createSafeContext } from '@worldprint/wdesign-utils';

export type ScrollAreaComponent = React.FC<any>;

interface DrawerContext {
  scrollAreaComponent: ScrollAreaComponent;
}

export const [DrawerProvider, useDrawerContext] = createSafeContext<DrawerContext>(
  'Drawer component was not found in tree'
);
