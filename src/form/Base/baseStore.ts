import { computed, makeObservable, observable } from 'mobx';
import type { PluginsType } from '../../plugins';
import { FormStore } from '../Form';
import { GroupStore } from '../FormGroup/store';
import { BaseProps, FieldMode } from './interface';

export class BaseStore<Values = any, P extends PluginsType = PluginsType> implements BaseProps<Values> {
  commonProps: BaseProps<Values> = {};

  /** 获取form */
  getFormStore: () => FormStore<Values, P>;
  /** 获取group */
  getGroupStore: () => GroupStore<Values, P>;

  constructor(getFormStore: () => FormStore<Values, P>, getGroupStore: () => GroupStore<Values, P>) {
    this.getFormStore = getFormStore;
    this.getGroupStore = getGroupStore;
  }

  get _parent(): BaseProps<Values> {
    return this.getGroupStore() ?? this.getFormStore() ?? {};
  }

  private getVal<K extends keyof BaseProps<Values>>(key: K): BaseProps<Values>[K] {
    return this.commonProps[key] === undefined ? this._parent[key] : this.commonProps[key];
  }

  private setVal<K extends keyof BaseProps<Values>>(key: K, val: BaseProps<Values>[K]) {
    this.commonProps[key] = val;
  }

  set bordered(val) {
    this.setVal('bordered', val);
  }
  get bordered() {
    return this.getVal('bordered');
  }
  set render(val) {
    this.mode = !val ? FieldMode.NONE : undefined;
  }
  get render() {
    return this.mode !== FieldMode.NONE;
  }
  set hidden(val) {
    this.mode = val ? FieldMode.HIDDEN : undefined;
  }
  get hidden() {
    return this.mode === FieldMode.HIDDEN;
  }
  set readOnly(val) {
    this.mode = val ? FieldMode.VIEW : undefined;
  }
  get readOnly() {
    return this.mode === FieldMode.VIEW;
  }
  set disabled(val) {
    this.mode = val ? FieldMode.DISABLED : undefined;
  }
  get disabled() {
    return this.mode === FieldMode.DISABLED;
  }
  set colon(val) {
    this.setVal('colon', val);
  }
  get colon() {
    return this.getVal('colon');
  }
  set mode(val) {
    this.setVal('mode', val);
  }
  get mode() {
    return this.getVal('mode');
  }
  set colProps(val) {
    this.setVal('colProps', val);
  }
  get colProps() {
    return this.getVal('colProps') || {};
  }
  set span(val) {
    this.setVal('span', val);
  }
  get span() {
    return this.getVal('span');
  }
  set labelAlign(val) {
    this.setVal('labelAlign', val);
  }
  get labelAlign() {
    return this.getVal('labelAlign');
  }
  set labelCol(val) {
    this.setVal('labelCol', val);
  }
  get labelCol() {
    return this.getVal('labelCol');
  }
  set wrapperCol(val) {
    this.setVal('wrapperCol', val);
  }
  get wrapperCol() {
    return this.getVal('wrapperCol');
  }
  set messageVariables(val) {
    this.setVal('messageVariables', val);
  }
  get messageVariables() {
    return this.getVal('messageVariables');
  }
  set validateFirst(val) {
    this.setVal('validateFirst', val);
  }
  get validateFirst() {
    return this.getVal('validateFirst');
  }
  set validateDebounce(val) {
    this.setVal('validateDebounce', val);
  }
  get validateDebounce() {
    return this.getVal('validateDebounce');
  }
  set validateTrigger(val) {
    this.setVal('validateTrigger', val);
  }
  get validateTrigger() {
    return this.getVal('validateTrigger');
  }
  set remoteOptionsDebounceProps(val) {
    this.setVal('remoteOptionsDebounceProps', val);
  }
  get remoteOptionsDebounceProps() {
    return this.getVal('remoteOptionsDebounceProps');
  }

  makeObservable() {
    makeObservable(this, {
      _parent: computed,
      commonProps: observable.deep,
      bordered: computed,
      hidden: computed,
      colon: computed,
      mode: computed,
      colProps: computed,
      span: computed,
      labelAlign: computed,
      labelCol: computed,
      wrapperCol: computed,
      messageVariables: computed,
      validateFirst: computed,
      validateDebounce: computed,
      validateTrigger: computed,
      remoteOptionsDebounceProps: computed,
    });
  }
}
