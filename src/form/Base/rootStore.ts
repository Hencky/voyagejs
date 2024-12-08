import { makeObservable, observable } from 'mobx';
import { BaseProps } from './interface';

export const commonKeys = [
  // 'id',
  // 'className',
  // 'style',
  'bordered',
  'hidden',
  'render',
  'readOnly',
  'colon',
  'mode',
  'colProps',
  'span',
  'labelAlign',
  'labelCol',
  'wrapperCol',
  // 'layout',
  'messageVariables',
  'validateFirst',
  'validateDebounce',
  'validateTrigger',
  'remoteOptionsDebounceProps',
] as const;

export class BaseRootStore<Values = any> implements BaseProps<Values> {
  id: BaseProps<Values>['id'];
  className?: BaseProps<Values>['className'];
  style?: BaseProps<Values>['style'];

  // ===== 状态属性 =====
  bordered?: BaseProps<Values>['bordered'];
  hidden?: BaseProps<Values>['hidden'];
  readOnly?: BaseProps<Values>['readOnly'];
  visible?: BaseProps<Values>['visible'];
  disabled?: BaseProps<Values>['disabled'];
  colon?: BaseProps<Values>['colon'];
  mode?: BaseProps<Values>['mode'];
  colProps?: BaseProps<Values>['colProps'];
  span?: BaseProps<Values>['span'] = 24;
  labelAlign?: BaseProps<Values>['labelAlign'];
  labelCol?: BaseProps<Values>['labelCol'];
  wrapperCol?: BaseProps<Values>['wrapperCol'];
  messageVariables?: BaseProps<Values>['messageVariables'];
  validateFirst?: BaseProps<Values>['validateFirst'];
  validateDebounce?: BaseProps<Values>['validateDebounce'];
  validateTrigger?: BaseProps<Values>['validateTrigger'];
  remoteOptionsDebounceProps?: BaseProps<Values>['remoteOptionsDebounceProps'];

  makeObservable() {
    makeObservable(this, {
      id: observable.ref,
      className: observable.ref,
      style: observable,

      bordered: observable.ref,
      hidden: observable.ref,
      colon: observable.ref,
      mode: observable.ref,

      colProps: observable.deep,
      span: observable.ref,

      labelAlign: observable.ref,
      labelCol: observable,
      wrapperCol: observable,

      messageVariables: observable,
      validateFirst: observable.ref,
      validateDebounce: observable.ref,
      validateTrigger: observable.ref,

      remoteOptionsDebounceProps: observable,
    });
  }
}
