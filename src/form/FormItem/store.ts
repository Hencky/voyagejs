import type { FormInstance } from 'antd/lib/form';
import type { FormItemProps as AFormItemProps } from 'antd/lib/form/FormItem';
import type { NamePath } from 'antd/lib/form/interface';
import { makeObservable, observable, runInAction } from 'mobx';
import type { PluginsType } from '../../plugins';
import { parsePlugin } from '../../plugins';
import { filterUndefinedProps } from '../../utils';
import { BaseProps, BaseStore, FieldMode } from '../Base';
import type { FormStore } from '../Form';
import type { GroupStore } from '../FormGroup/store';
import type { FormItemProps, ReactionType } from './interface';

export class FieldStore<Values = any, P extends PluginsType = PluginsType>
  extends BaseStore<Values>
  implements Omit<FormItemProps, 'validateStatus'>, BaseProps<Values>
{
  /** 表单实例 */
  form: FormInstance<Values>;
  /** 字段名，唯一路径标识 */
  name?: NamePath;
  /** 表单loading状态 */
  optionsLoading?: boolean;
  /** 数据源 */
  options?: any[];
  /** 数据源属性名 */
  optionsPropName: string = 'options';
  /** 远程数据源 */
  remoteOptions?: (depValues?: any[]) => Promise<any[] | undefined>;
  /** 强制刷新 */
  forceUpdate: () => void;

  /** 主动关联 */
  reactions?: ReactionType[];
  /** 获取formstore */
  // @ts-expect-error
  getFormStore: () => FormStore<Values, P>;
  /** 获取groupstore */
  // @ts-expect-error
  getGroupStore: () => GroupStore<Values, P>;

  // ===== 内置 =====
  /** 样式 */
  style?: FormItemProps<Values, P>['style'];
  /** id */
  id?: FormItemProps<Values, P>['id'];
  /** 类 */
  className?: FormItemProps<Values, P>['className'];
  /** 设置依赖字段 */
  dependencies?: FormItemProps<Values, P>['dependencies'];
  /** 额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时 */
  extra?: FormItemProps<Values, P>['extra'];
  /** 设置如何将 event 的值转换成字段值 */
  getValueFromEvent?: FormItemProps<Values, P>['getValueFromEvent'];
  /** 为子元素添加额外的属性 (不建议通过 getValueProps 生成动态函数 prop，请直接将其传递给子组件) */
  getValueProps?: FormItemProps<Values, P>['getValueProps'];
  /** 配合 validateStatus 属性使用，展示校验状态图标，建议只配合 Input 组件使用 此外，它还可以通过 Icons 属性获取反馈图标  5.9.0 */
  hasFeedback?: FormItemProps<Values, P>['hasFeedback'];
  /** 提示信息，如不设置，则会根据校验规则自动生成 */
  help?: FormItemProps<Values, P>['help'];
  /** 设置子元素 label htmlFor 属性 */
  htmlFor?: FormItemProps<Values, P>['htmlFor'];
  /** 设置子元素默认值，如果与 Form 的 initialValues 冲突则以 Form 为准 */
  initialValue?: FormItemProps<Values, P>['initialValue'];
  /** label 标签的文本 */
  label?: FormItemProps<Values, P>['label'];
  /** 组件获取值后进行转换，再放入 Form 中。不支持异步 */
  normalize?: FormItemProps<Values, P>['normalize'];
  /** 为 true 时不带样式，作为纯字段控件使用。当自身没有 validateStatus 而父元素存在有 validateStatus 的 Form.Item 会继承父元素的 validateStatus */
  noStyle?: FormItemProps<Values, P>['noStyle'];
  /** 当字段被删除时保留字段值 */
  preserve?: FormItemProps<Values, P>['preserve'];
  /** 必填样式设置。如不设置，则会根据校验规则自动生成 */
  required?: FormItemProps<Values, P>['required'];
  /** 校验规则，设置字段的校验逻辑 */
  rules?: FormItemProps<Values, P>['rules'];
  /** 自定义字段更新逻辑 */
  shouldUpdate?: FormItemProps<Values, P>['shouldUpdate'];
  /** 配置提示信息 */
  tooltip?: FormItemProps<Values, P>['tooltip'];
  /** 设置收集字段值变更的时机 */
  trigger?: FormItemProps<Values, P>['trigger'];
  /** 校验状态，如不设置，则会根据校验规则自动生成，可选：'success' 'warning' 'error' 'validating' */
  // validateStatus: FormItemProps<Values, P>['validateStatus'];
  /** 子节点的值的属性 */
  valuePropName?: FormItemProps<Values, P>['valuePropName'];

  _props?: FormItemProps<Values, P>;

  constructor(
    props: FormItemProps<Values, P>,
    form: FormInstance<Values>,
    getFormStore: () => FormStore<Values, P>,
    getGroupStore: () => GroupStore<Values, P>,
    forceUpdate: () => void,
  ) {
    // @ts-expect-error
    super(getFormStore, getGroupStore);
    // this.mode = props.mode || FieldMode.EDIT;
    this.form = form;
    this.forceUpdate = forceUpdate;
    this.getFormStore = getFormStore;
    this.getGroupStore = getGroupStore;

    this._props = props;

    this.updateProps(props);

    super.makeObservable();
    this.makeObservable();
  }

  makeObservable() {
    makeObservable(this, {
      // validateStatus: observable.ref,
      optionsLoading: observable.ref,
      options: observable.shallow,
      style: observable,
      className: observable.ref,
      rules: observable,
      extra: observable,
      getValueFromEvent: observable,
      hasFeedback: observable,
      help: observable.ref,
      htmlFor: observable.ref,
      label: observable,
      normalize: observable,
      noStyle: observable.ref,
      preserve: observable.ref,
      required: observable.ref,
      shouldUpdate: observable,
      tooltip: observable,
      trigger: observable.ref,
      valuePropName: observable.ref,
      remoteOptions: observable,

      fieldType: observable.ref,
      fieldProps: observable,
    });
  }

  updateProps(props: FormItemProps<Values, P>) {
    Object.keys(props).forEach((key) => {
      // @ts-expect-error
      this[key] = props[key];
    });
  }

  /** 远程数据源 */
  fetchRemoteOptions() {
    if (!this.remoteOptions) return Promise.resolve();
    this.optionsLoading = true;

    const deps = this.dependencies?.map((key) => {
      return this.form.getFieldValue(key);
    });

    return this.remoteOptions(deps)
      .then((data) => {
        runInAction(() => {
          this.options = data;
          this.optionsLoading = false;
        });
      })
      .catch((e) => {
        console.warn(`${this.name} remote options error`, e);
        runInAction(() => {
          this.options = undefined;
          this.optionsLoading = false;
        });
      });
  }

  set value(val: any) {
    this.form.setFieldValue(this.name, val);
  }

  get value(): any {
    const field = this.form.getFieldValue(this.name);
    return field;
  }

  public get childProps() {
    const displayOptions: {
      bordered: BaseProps<Values>['bordered'];
      readOnly: boolean;
      disabled: boolean;
    } = {
      bordered: true,
      readOnly: false,
      disabled: false,
    };

    if (this.mode === FieldMode.VIEW) {
      displayOptions.readOnly = true;
    }

    if (this.mode === FieldMode.DISABLED) {
      displayOptions.disabled = true;
    }

    return filterUndefinedProps({
      [this.optionsPropName]: this.options,
      ...displayOptions,
      loading: this.optionsLoading,
    });
  }

  public get fieldChildProps(): AFormItemProps<Values> {
    return filterUndefinedProps({
      colon: this.colon,
      dependencies: this.dependencies,
      extra: this.extra,
      getValueFromEvent: this.getValueFromEvent,
      hasFeedback: this.hasFeedback,
      help: this.help,
      hidden: this.mode === FieldMode.HIDDEN,
      htmlFor: this.htmlFor,
      initialValue: this.initialValue,
      label: this.label,
      labelAlign: this.labelAlign,
      labelCol: this.labelCol,
      messageVariables: this.messageVariables,
      normalize: this.normalize,
      noStyle: this.noStyle,
      preserve: this.preserve,
      required: this.mode === FieldMode.VIEW ? false : this.required,
      rules: this.rules,
      shouldUpdate: this.shouldUpdate,
      tooltip: this.tooltip,
      trigger: this.trigger,
      validateFirst: this.validateFirst,
      validateTrigger: this.validateTrigger,
      valuePropName: this.valuePropName,
      wrapperCol: this.wrapperCol,
    });
  }

  // ===== 插件 =====
  fieldType?: any;

  fieldProps?: any;

  /** 预览模式渲染 */
  viewFieldType?: FormItemProps<Values, P>['viewFieldType'];
  /** 预览模式渲染属性 */
  viewFieldProps?: FormItemProps<Values, P>['viewFieldProps'];

  get plugin() {
    return parsePlugin(this.getFormStore().plugins.field, this.fieldType);
  }
}
