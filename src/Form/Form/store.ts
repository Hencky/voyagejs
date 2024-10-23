import type { FormInstance } from 'antd/lib/form';
import type { NamePath } from 'antd/lib/form/interface';
import { configure, makeObservable, observable, runInAction } from 'mobx';
import { isEmpty, isEqual, isFunction, pick } from 'radash';
import { pluginStore } from '../../utils';
import { BaseProps, BaseRootStore } from '../Base';
import type { GroupStore } from '../FormGroup/store';
import type { FieldStore, ReactionResultFunctionType, ReactionResultType } from '../FormItem';
import { isFieldChange, toCompareName } from '../utils';
import type { FormOptionProps, FormProps } from './interface';

configure({
  enforceActions: 'never',
});

export type InnerDependencyType = {
  name: NamePath;
  result?: ReactionResultType<NamePath>;
  dependencies?: NamePath[];
  /** 来源 */
  _source: NamePath;
};

export class FormStore<Values = any, PluginsType = any>
  extends BaseRootStore
  implements Omit<FormProps, 'form'>, BaseProps
{
  private store: Record<NamePath, FieldStore | null> = {};
  /** 表单实例 */
  form = {} as FormInstance<Values>;

  /** 被动关联关系,dependencies关联关系 */
  private deps: Record<NamePath, InnerDependencyType[]> = {};
  /** 关联关系 */
  private effects: Record<NamePath, InnerDependencyType[]> = {};

  /** 表单loading状态 */
  loading: boolean = false;
  /** 表单loading属性配置 */
  spinProps?: FormProps['spinProps'];
  /** 获取表单值 */
  remoteValues?: () => Promise<any>;

  // ===== 内置 =====
  autoComplete?: FormProps['autoComplete'];
  /** 设置表单组件禁用，仅对 antd 组件有效 */
  disabled?: FormProps['disabled'];
  /** 设置 Form 渲染元素，为 false 则不创建 DOM 节点 */
  component?: FormProps['component'];
  /** 通过状态管理（如 redux）控制表单字段，如非强需求不推荐使用 */
  fields?: FormProps['fields'];
  /** 当 Form.Item 有 hasFeedback 属性时可以自定义图标 5.9.0 */
  // feedbackIcons?: FormProps['feedbackIcons'];
  /** 表单默认值，只有初始化以及重置时生效 */
  initialValues?: FormProps['initialValues'];
  /** label 标签的文本换行方式 */
  labelWrap?: FormProps['labelWrap'];
  /** 表单名称，会作为表单字段 id 前缀使用 */
  name?: FormProps['name'];
  /** 当字段被删除时保留字段值。你可以通过 getFieldsValue(true) 来获取保留字段值 */
  preserve?: FormProps['preserve'];
  /** 必选样式，可以切换为必选或者可选展示样式。此为 Form 配置，Form.Item 无法单独配置 */
  requiredMark?: FormProps['requiredMark'];
  /** 提交失败自动滚动到第一个错误字段 */
  scrollToFirstError?: FormProps['scrollToFirstError'];
  /** 设置字段组件的尺寸（仅限 antd 组件） */
  size?: FormProps['size'];
  /** 验证提示模板 */
  validateMessages?: FormProps['validateMessages'];
  /** 字段更新时触发回调事件 */
  onFieldsChange?: FormProps['onFieldsChange'];
  /** 提交表单且数据验证成功后回调事件 */
  onFinish?: FormProps['onFinish'];
  /** 提交表单且数据验证失败后回调事件 */
  onFinishFailed?: FormProps['onFinishFailed'];
  /** 字段值更新时触发回调事件 */
  onValuesChange?: FormProps['onValuesChange'];
  /** 当表单被卸载时清空表单值 5.18.0 */
  // clearOnDestroy?: FormProps['clearOnDestroy'];

  // ===== 表单实例 =====
  scrollToField: FormInstance<Values>['scrollToField'] = this.form!.scrollToField;
  getFieldInstance: FormInstance<Values>['getFieldInstance'] = this.form!.getFieldInstance;
  getFieldValue: FormInstance<Values>['getFieldValue'] = this.form!.getFieldValue;
  getFieldsValue: FormInstance<Values>['getFieldsValue'] = this.form!.getFieldsValue;
  getFieldError: FormInstance<Values>['getFieldError'] = this.form!.getFieldError;
  getFieldsError: FormInstance<Values>['getFieldsError'] = this.form!.getFieldsError;
  getFieldWarning: FormInstance<Values>['getFieldWarning'] = this.form!.getFieldWarning;
  isFieldsTouched: FormInstance<Values>['isFieldsTouched'] = this.form!.isFieldsTouched;
  isFieldTouched: FormInstance<Values>['isFieldTouched'] = this.form!.isFieldTouched;
  isFieldValidating: FormInstance<Values>['isFieldValidating'] = this.form!.isFieldValidating;
  isFieldsValidating: FormInstance<Values>['isFieldsValidating'] = this.form!.isFieldsValidating;
  resetFields: FormInstance<Values>['resetFields'] = this.form!.resetFields;
  setFields: FormInstance<Values>['setFields'] = this.form!.setFields;
  setFieldValue: FormInstance<Values>['setFieldValue'] = this.form!.setFieldValue;
  setFieldsValue: FormInstance<Values>['setFieldsValue'] = this.form!.setFieldsValue;
  submit: FormInstance<Values>['submit'] = this.form!.submit;
  validateFields: FormInstance<Values>['validateFields'] = this.form!.validateFields;

  constructor(props?: FormOptionProps<any>) {
    const { plugins } = props || {};
    super();
    super.makeObservable();
    this.pluginStore = plugins;
    this.makeObservable();
    this.registerPlugins();
  }

  makeObservable() {
    makeObservable(this, {
      loading: observable.ref,
      autoComplete: observable.ref,
      disabled: observable.ref,
      component: observable.ref,
      // feedbackIcons: observable,
      labelWrap: observable.ref,
      name: observable.ref,
      preserve: observable.ref,
      requiredMark: observable,
      scrollToFirstError: observable,
      size: observable.ref,
      validateMessages: observable,
      onFieldsChange: observable,
      onFinish: observable,
      onFinishFailed: observable,
      onValuesChange: observable,
      // clearOnDestroy: observable.ref,
      spinProps: observable,
    });
  }

  private addToMap(map: Record<NamePath, InnerDependencyType[]>, name: NamePath, value: InnerDependencyType) {
    const strName = this.getName(name);
    map[strName] = [...(map[strName] || []), value];
  }

  createField<NameType extends keyof Values>(name: NameType, field: FieldStore<Values[NameType]>) {
    this.addField(name, field);

    return field;
  }

  createGroup<NameType extends keyof Values>(name: NameType, group: GroupStore<Values>) {
    this.addField(name, group as unknown as FieldStore);
    return group;
  }

  addGroup<NameType extends keyof Values>(name: NameType, group: GroupStore<Values>) {
    if (!name) return;
    this.addField(name, group as unknown as any);
  }

  removeGroup(name: NamePath) {
    if (!name) return;
    this.removeField(name);
  }

  getGroup(name: NamePath): GroupStore<Values> {
    return this.getField(name) as unknown as GroupStore<Values>;
  }

  addField<NameType extends keyof Values>(name: NameType, field: FieldStore<Values[NameType]>) {
    if (this.getField(name)) return;

    this.store[this.getName(name)] = field;

    // 构建被动关联关系，用于field依赖的dependencies项值变化时，更新FormItem组件，触发remoteOptions
    field.dependencies?.forEach((depName) => {
      this.addToMap(this.deps, depName, { name, _source: name });
    });

    field.reactions?.forEach((reaction) => {
      const { dependencies, effects, result } = reaction;
      // 构建主动联动关系
      effects?.forEach((target) => {
        this.addToMap(this.effects, name, {
          name: target,
          result: result as ReactionResultType<any>,
          _source: name,
        });
      });

      // 构建被动联动关系成主动关联关系
      dependencies?.forEach((depName) => {
        this.addToMap(this.effects, depName, {
          name: name,
          result: result as ReactionResultType<any>,
          dependencies,
          _source: name,
        });
      });
    });
  }

  removeField(name: NamePath) {
    const field = this.getField(name);

    // 清空dependencies的关联关系
    field.dependencies?.forEach((depName) => {
      this.deps[this.getName(depName)] = this.deps[this.getName(depName)].filter(
        (item) => !isEqual(item._source, name),
      );
    });

    // 清空reactions构造的关联关系
    field.reactions?.forEach(({ dependencies }) => {
      this.effects[this.getName(field.name)] = [];
      dependencies?.forEach((effectName) => {
        this.effects[this.getName(effectName)] = this.effects[this.getName(effectName)].filter(
          (item) => !isEqual(item._source, name),
        );
      });
    });

    this.store[this.getName(name)] = null;
  }

  getField<NameType>(name: NameType): FieldStore<any> {
    return this.store[this.getName(name)]!;
  }

  triggerChange(
    list: Record<string, InnerDependencyType[]>,
    value: Values,
    callback: (config: InnerDependencyType, depName: NamePath) => void,
  ) {
    Object.keys(list).forEach((depName) => {
      if (isFieldChange(value, depName)) {
        list[depName].forEach((item) => callback(item, depName));
      }
    });
  }

  innerValueChange = (value: Values) => {
    // 被动关联触发组件更新
    this.triggerChange(this.deps, value, ({ name: effectName }) => {
      this.getField(effectName).forceUpdate();
    });

    this.triggerReactions(value);
  };

  triggerReactions(value: Values) {
    runInAction(() => {
      this.triggerChange(this.effects, value, ({ name: effectName, result, dependencies }, changeName) => {
        if (!result) return;
        // @ts-expect-error
        Object.keys(result).forEach((key: keyof typeof result) => {
          let resultValue;

          const changeValue = this.getField(changeName).value;
          const depValues = dependencies ? dependencies.map((depName) => this.getField(depName).value) : [];

          if (isFunction(result![key])) {
            resultValue = (result![key] as ReactionResultFunctionType<any>)(changeValue);
          } else {
            resultValue = new Function('$root', `with($root) { return (${result![key]}); }`)({
              $self: changeValue,
              $deps: depValues,
              $values: this.values,
            });
          }

          // @ts-expect-error
          this.getField(effectName)[key] = resultValue;

          // 循环触发 a -> b -> c
          if (key === 'value') {
            this.triggerReactions({ [effectName]: resultValue } as Values);
          }
        });
      });
    });
  }

  setFormInstance(form: FormInstance<Values>) {
    this.form = form;

    Object.keys(form).forEach((key) => {
      // @ts-expect-error
      this[key] = form[key];
    });
  }

  init(props: FormProps) {
    Object.keys(props).forEach((key) => {
      if (key === 'form') return;
      // @ts-expect-error
      this[key] = props[key];
    });

    if (this.remoteValues) {
      this.loading = true;
      this.remoteValues()
        .then((values) => {
          this.form?.setFieldsValue(values);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }

  get values(): Values {
    return this.form!.getFieldsValue();
  }

  set values(vals: Values) {
    if (isEmpty(vals)) {
      console.log('isEmpty');
      this.form!.resetFields();
    } else {
      this.form!.setFieldsValue(vals!);
    }
  }

  getName(name: NamePath) {
    return toCompareName(name);
  }

  // ===== 插件专栏 =====
  pluginStore: PluginsType;

  registerPlugins = () => {
    if (!this.pluginStore) return;
    pluginStore.registerPlugins(this.pluginStore);
  };

  get plugins(): typeof this.pluginStore {
    return pluginStore.getPlugins() as typeof this.pluginStore;
  }

  // ===== 获取属性 =====

  get formProps() {
    return pick(this, [
      'autoComplete',
      'colon',
      'disabled',
      'component',
      'fields',
      // 'feedbackIcons',
      'initialValues',
      'labelAlign',
      'labelWrap',
      'labelCol',
      // 'layout',
      'name',
      'preserve',
      'requiredMark',
      'scrollToFirstError',
      'size',
      'validateMessages',
      'validateTrigger',
      'bordered',
      'wrapperCol',
      'onFieldsChange',
      'onFinish',
      'onFinishFailed',
      // 'clearOnDestroy',
    ]);
  }

  get formInstance() {
    return this.form;
  }
}