import React from 'react';
import { TableInstance } from 'voyagejs/table';

export type PluginType = {
  [key: string]: {
    component: React.ComponentType<any> | any;
    defaultComponentProps?: any;
    defaultFormItemProps?: any;
    defaultFilterProps?: (ctx?: any) => any;
  };
};

export type PluginsType = {
  container: PluginType;
  field: PluginType;
  action: PluginType;
  cell: PluginType;
};

export type PluginPropsType<
  P extends PluginsType,
  T extends keyof PluginsType,
  CN extends keyof PluginsType[T],
> = P[T][CN]['component'] extends React.ComponentType<infer E> ? E : never;

export interface FieldBaseProps {
  /** 禁用态 */
  readOnly?: boolean;
  'data-voyagejs-filter'?: any;
}

export interface CellBaseProps<RecordType extends object = any> extends TableInstance<RecordType> {
  record: RecordType;
  index: number;
  value: any;
}
