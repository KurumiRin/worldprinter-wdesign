import React from 'react';
import { NativeSelect } from '@worldprint/wdesign-core';
import { upperFirst } from '@worldprint/wdesign-hooks';

interface SelectControlProps {
  value: string;
  label: string;
  capitalize: boolean;
  onChange(value: string): void;
  data: { label: string; value: string }[];
}

export function SelectControl({
  value,
  label,
  onChange,
  data,
  capitalize: capitalizeItems = true,
  ...others
}: SelectControlProps) {
  return (
    <NativeSelect
      data={data.map((item) => ({
        value: item.value,
        label: capitalizeItems ? upperFirst(item.label) : item.label,
      }))}
      value={value}
      label={upperFirst(label)}
      onChange={(event) => onChange(event.currentTarget.value)}
      {...others}
    />
  );
}

SelectControl.initialValue = '';
