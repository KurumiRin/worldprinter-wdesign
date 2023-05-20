import { MantineTheme, getSize } from '@worldprint/wdesign-styles';

const NEGATIVE_VALUES = ['-xs', '-sm', '-md', '-lg', '-xl'];

export function getSpacingValue(size: string | number, theme: MantineTheme) {
  if (NEGATIVE_VALUES.includes(size as string)) {
    return `calc(${getSize({
      size: (size as string).replace('-', ''),
      sizes: theme.spacing,
    })} * -1)`;
  }

  return getSize({ size, sizes: theme.spacing });
}
