import React from 'react';
import type { CellBaseProps } from '../../interfaces';

export interface CellSelectProps<RecordType extends object> extends CellBaseProps<RecordType> {
  placeholder?: React.ReactNode;
  options?: {
    text?: string;
    label?: string;
    value: string;
    color?: string;
  }[];
}

export const CellSelect = <RecordType extends object>(props: CellSelectProps<RecordType>) => {
  const { value, options = [] } = props;

  // eslint-disable-next-line eqeqeq
  const { label, text, color, ...rest } = options.find((item) => item.value == value) || {};

  return <div style={{ color }}>{label ?? text ?? value ?? '-'}</div>;
};
