import type { NamePath } from 'antd/es/form/interface';
import type { FormItemProps as AFormItemProps } from 'antd/lib/form/FormItem';
import type { PluginPropsType, PluginsType } from '../../plugins';
import type { BaseProps } from '../Base';
import { FieldStore } from './store';

export type ReactionResultKeyType = keyof Omit<FormItemProps, 'reactions' | 'dependencies'> & 'value';

export type ReactionResultFunctionPropsType = {
  /** 当前变化的表单 */
  self?: FieldStore;
  /** 当前变化的表单值 */
  selfValue?: any;
  /** 目标表单实例 */
  target?: FieldStore;
  /** 依赖的表单 */
  deps: FieldStore[];
  /** 依赖的表单值 */
  depValues: any[];
  /** 所有表单值 */
  values: any;
};

export type ReactionResultFunctionType<Key extends keyof FormItemProps> = (
  target: ReactionResultFunctionPropsType,
) => FormItemProps[Key];

export type ReactionResultType<Key extends keyof FormItemProps> = ReactionResultFunctionType<Key> | string;

export type FormItemProps<Values = any, P extends PluginsType = PluginsType> = Omit<
  AFormItemProps<Values>,
  keyof BaseProps
> &
  BaseProps & {
    /** 数据源类型 */
    options?: any[];
    /** 数据源属性名 */
    optionsPropName?: string;
    /** 远程数据源 */
    remoteOptions?: (depValues?: any[]) => Promise<any[] | undefined>;
    /** 联动关系 */
    reactions?: ReactionType[];
    /** 预览模式渲染 */
    viewFieldType?: any;
    /** 预览模式渲染属性 */
    viewFieldProps?: any;
  } & {
    [CN in keyof P['field']]: {
      /** 插件名称 */
      fieldType?: CN;
      /** 插件属性 */
      fieldProps?: PluginPropsType<P, 'field', CN extends string ? CN : never>;
    };
  }[keyof P['field']];

export type ReactionType =
  | {
      /** 被动关联 */
      dependencies: NamePath[];
      effects?: never;
      result: {
        [Key in ReactionResultKeyType]: ReactionResultType<Key>;
      };
    }
  | {
      /** 主动关联 */
      effects: NamePath[];
      dependencies?: never;
      result: {
        [Key in ReactionResultKeyType]: ReactionResultType<Key>;
      };
    }
  | {
      /** 事件联动 */
      effects: NamePath[];
      dependencies?: never;
      result: (props: ReactionResultFunctionPropsType) => void;
    };
