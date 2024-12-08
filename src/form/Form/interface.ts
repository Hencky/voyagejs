import type { SpinProps } from 'antd';
import type { FormProps as AFormProps } from 'antd/lib/form';
import type { PluginsType } from '../../plugins';
import type { BaseProps, BaseRootStore } from '../Base';
import { FormGroupProps } from '../FormGroup';
import type { FormStore } from './store';

export interface FormProps<Values = any, P extends PluginsType = PluginsType>
  extends Omit<AFormProps<Values>, 'form' | keyof BaseRootStore<Values>>,
    BaseProps {
  /** 表单实例 */
  form: FormStore<Values, P>;
  /** 表单项 */
  items?: FormGroupProps<Values, P>['items'];
  /** 远程表单值 */
  remoteValues?: () => Promise<Values>;
  /** Spin属性 */
  spinProps?: Omit<SpinProps, 'spinning'>;
  /** Form内置FormGroup属性 */
  formGroupProps?: FormGroupProps<Values, P>;

  // 内部使用
  _inModal?: { isOpen: boolean };
}

export type FormOptionProps<P extends PluginsType = PluginsType> = {
  plugins?: P;
};
