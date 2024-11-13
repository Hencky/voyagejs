import { Divider } from 'antd';
import type { FilterDropdownProps as AFilterDropdownProps } from 'antd/lib/table/interface';
import React from 'react';
import { ButtonActions } from '../components';
import { parsePlugin, PluginsType } from '../plugins';
import { pluginStore } from '../utils';
import type { ColumnType } from './interface';
import type { TableStore } from './store';

export interface FilterDropdownProps<RecordType extends object = any> {
  table?: TableStore<RecordType>;
  dataIndex: string;
  fieldType?: string | ((ctx: TableStore<RecordType>) => React.ReactNode);
  fieldProps?: Record<string, any>;
  ctx: AFilterDropdownProps & { column: ColumnType<RecordType> };
}

export const FilterDropdown = <RecordType extends object = any, P extends PluginsType = PluginsType>(
  props: React.PropsWithChildren<FilterDropdownProps<RecordType>>,
) => {
  const { fieldType, fieldProps, ctx, table, dataIndex, children } = props;

  const { clearFilters, close, confirm, filters, selectedKeys, setSelectedKeys, visible } = ctx;

  const plugins = (pluginStore.getPlugins() as P)['field'];

  const { element } = parsePlugin(plugins, fieldType, fieldProps, ctx);

  return (
    <div>
      <div style={{ padding: 8 }}>{children || element}</div>
      <Divider style={{ margin: 0 }} />
      <ButtonActions
        style={{ display: 'flex', justifyContent: 'space-between', padding: 8 }}
        actions={[
          {
            children: '重置',
            size: 'small',
            type: 'link',
            disabled: selectedKeys.length === 0,
            onClick: () => {
              setSelectedKeys([]);
              clearFilters!();
            },
          },
          {
            children: '确定',
            size: 'small',
            type: 'primary',
            onClick: async () => {
              confirm({ closeDropdown: true });
            },
          },
        ]}
      />
    </div>
  );
};
