import type { NamePath } from 'antd/es/form/interface';
import type { RowProps } from 'antd/es/grid';
import React from 'react';
import type { PluginPropsType, PluginsType } from '../../plugins';
import type { BaseProps } from '../Base';
import type { FormItemProps } from '../FormItem';

type FormGroupPropsType<Values = any, P extends PluginsType = PluginsType> = {
  /** 标题 */
  title?: string;
  /** Item名称前缀 */
  prefixName?: NamePath;
  /** 组唯一标识 */
  name?: NamePath;
  /** Row属性 */
  rowProps?: RowProps;
  /** 表单项 */
  items?: (FormItemProps<Values, P> | FormGroupProps<Values, P>)[];
  children?: React.ReactNode;
};

export type FormGroupProps<Values = any, P extends PluginsType = PluginsType> = Pick<
  FormItemProps<Values, P>,
  keyof BaseProps<Values> | 'reactions'
> &
  (
    | (FormGroupPropsType<Values, P> & {
        container: React.ReactElement | null;
        containerProps?: never;
      })
    | ({
        [CN in keyof P['container']]: {
          container?: CN;
          containerProps?: PluginPropsType<P, 'container', CN extends string ? CN : never>;
        };
      }[keyof P['container']] &
        FormGroupPropsType<Values, P>)
  );
