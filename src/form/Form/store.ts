import type { FormInstance } from 'antd/lib/form';
import type { NamePath } from 'antd/lib/form/interface';
import { configure, makeObservable, observable, runInAction } from 'mobx';
import { isEmpty, isEqual, isFunction, isPromise, isString, pick, uid } from 'radash';
import type { PluginsType } from '../../plugins';
import { DEFAULT_PLUGINS, pluginStore } from '../../plugins';
import { filterUndefinedProps } from '../../utils';
import { BaseProps, BaseRootStore } from '../Base';
import type { GroupStore } from '../FormGroup/store';
import type { FieldStore, ReactionResultFunctionType, ReactionResultType } from '../FormItem';
import { ListStore } from '../FormList';
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

export class FormStore<Values = any, P extends PluginsType = PluginsType>
  extends BaseRootStore<Values>
  implements Omit<FormProps<Values, P>, 'form'>, BaseProps<Values>
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
  spinProps?: FormProps<Values, P>['spinProps'];
  /** 获取表单值 */
  remoteValues?: () => Promise<any>;

  // ===== 内置 =====
  autoComplete?: FormProps<Values, P>['autoComplete'];
  /** 设置表单组件禁用，仅对 antd 组件有效 */
  disabled?: FormProps<Values, P>['disabled'];
  /** 设置 Form 渲染元素，为 false 则不创建 DOM 节点 */
  component?: FormProps<Values, P>['component'];
  /** 通过状态管理（如 redux）控制表单字段，如非强需求不推荐使用 */
  fields?: FormProps<Values, P>['fields'];
  /** 当 Form.Item 有 hasFeedback 属性时可以自定义图标 5.9.0 */
  // feedbackIcons?: FormProps['feedbackIcons'];
  /** 表单默认值，只有初始化以及重置时生效 */
  initialValues?: FormProps<Values, P>['initialValues'];
  /** label 标签的文本换行方式 */
  labelWrap?: FormProps<Values, P>['labelWrap'];
  /** 表单名称，会作为表单字段 id 前缀使用 */
  name?: FormProps<Values, P>['name'];
  /** 当字段被删除时保留字段值。你可以通过 getFieldsValue(true) 来获取保留字段值 */
  preserve?: FormProps<Values, P>['preserve'];
  /** 必选样式，可以切换为必选或者可选展示样式。此为 Form 配置，Form.Item 无法单独配置 */
  requiredMark?: FormProps<Values, P>['requiredMark'];
  /** 提交失败自动滚动到第一个错误字段 */
  scrollToFirstError?: FormProps<Values, P>['scrollToFirstError'];
  /** 设置字段组件的尺寸（仅限 antd 组件） */
  size?: FormProps<Values, P>['size'];
  /** 验证提示模板 */
  validateMessages?: FormProps<Values, P>['validateMessages'];
  /** 字段更新时触发回调事件 */
  onFieldsChange?: FormProps<Values, P>['onFieldsChange'];
  /** 提交表单且数据验证成功后回调事件 */
  onFinish?: FormProps<Values, P>['onFinish'];
  /** 提交表单且数据验证失败后回调事件 */
  onFinishFailed?: FormProps<Values, P>['onFinishFailed'];
  /** 字段值更新时触发回调事件 */
  onValuesChange?: FormProps<Values, P>['onValuesChange'];
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

  // ===== 弹框内使用 =====
  resetStore = () => {
    this.store = {};
  };

  modalOpenStatus: boolean = false;

  inModal: boolean = false;

  // ===== 表单联动控制 =====
  /** 是否开启loading状态，如果有子容器，loading状态由子容器控制 */
  enableLoading: boolean = true;

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

  createGroup(name: NamePath, group: GroupStore<Values>) {
    if (name) {
      this.addField(name, group as unknown as FieldStore);
    } else {
      const groupName = uid(10);
      this.addField(groupName as any, group as unknown as FieldStore);
    }
    return group;
  }

  addGroup(name: NamePath, group: GroupStore<Values>) {
    if (!name) return;
    this.addField(name, group as unknown as any);
  }

  addList(name: NamePath, list: ListStore<Values>) {
    if (!name) return;
    this.addField(name, list as unknown as any);
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

    if (!field) return;

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

    delete this.store[this.getName(name)];
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

  triggerReactions(value: Values, ignoreValueChange = false) {
    if (this.inModal && this.modalOpenStatus === false) return;
    runInAction(() => {
      this.triggerChange(this.effects, value, (config, changeName) => {
        const changeValue = this.getField(changeName)?.value;
        this.reactionResults(config, changeValue, changeName, ignoreValueChange);
      });
    });
  }

  reactionResults(config: InnerDependencyType, changeValue: any, changeName: NamePath, ignoreValueChange = false) {
    const { result, dependencies, name: effectName } = config;
    if (!result) return;

    if (isFunction(result)) {
      result({
        ...(!dependencies?.length ? { self: this.getField(changeName), selfValue: changeValue } : {}),
        deps: dependencies ? dependencies.map((depName) => this.getField(depName)) : [],
        depValues: dependencies ? dependencies.map((depName) => this.getField(depName).value) : [],
        values: this.values,
        target: this.getField(effectName),
      });
      return;
    }

    // @ts-expect-error
    Object.keys(result).forEach((key: keyof typeof result) => {
      let resultValue;

      const depValues = dependencies ? dependencies.map((depName) => this.getField(depName).value) : [];

      const triggerResultChange = (data: any) => {
        // @ts-expect-error
        this.getField(effectName)[key] = data;

        // 循环触发 a -> b -> c
        if ((key as string) === 'value') {
          this.triggerReactions({ [effectName]: data } as Values);
        }
      };

      if (isFunction(result![key])) {
        resultValue = (result![key] as ReactionResultFunctionType<any>)({
          ...(!dependencies?.length ? { self: this.getField(changeName), selfValue: changeValue } : {}),
          depValues,
          values: this.values,
          deps: dependencies ? dependencies.map((depName) => this.getField(depName)) : [],
        });
        if (isPromise(resultValue)) {
          resultValue.then((data: any) => {
            triggerResultChange(data);
          });
          return;
        }
      } else if (isString(result![key])) {
        {
          resultValue = new Function('$root', `with($root) { return (${result![key]}); }`)({
            $self: changeValue,
            $deps: depValues,
            $values: this.values,
          });
        }
      } else {
        resultValue = result![key];
      }

      // 获取initialValue和remoteValues时，不触发值联动
      if (ignoreValueChange && (key as string) === 'value') return;

      triggerResultChange(resultValue);
    });
  }

  /** 根据initialValues和remoteValues初始化联动结果 */
  initReactionResult() {
    if (this.inModal && this.modalOpenStatus === false) return;
    Object.keys(this.effects).forEach((effectName) => {
      const changeValue = this.getField(effectName)?.value;
      this.effects[effectName].forEach((config) => {
        this.reactionResults(config, changeValue, effectName, true);
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

  updateProps(props: FormProps<Values, P>) {
    Object.keys(props).forEach((key) => {
      if (key === 'form') return;
      if (key === 'name') return;
      // @ts-expect-error
      this[key] = props[key];
    });
  }

  init(props: FormProps<Values, P>) {
    this.updateProps(props);

    this.initReactionResult();

    this.refresh();
  }

  destroy() {
    this.store = {};
    this.deps = {};
    this.effects = {};
  }

  refresh() {
    if (this.remoteValues) {
      this.loading = true;
      this.remoteValues()
        .then((values) => {
          this.form?.setFieldsValue(values);
          this.initReactionResult();
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
      this.form!.resetFields();
    } else {
      this.form!.setFieldsValue(vals!);
    }
  }

  getName(name: NamePath) {
    return toCompareName(name);
  }

  // ===== 插件专栏 =====
  pluginStore: P;

  registerPlugins = () => {
    // if (!this.pluginStore) return;
    pluginStore.registerPlugins(Object.assign({}, this.pluginStore, DEFAULT_PLUGINS));
  };

  get plugins(): P {
    return pluginStore.getPlugins() as P;
  }

  // ===== 获取属性 =====

  get formProps() {
    return filterUndefinedProps(
      pick(this, [
        'autoComplete',
        'colon',
        'disabled',
        'component',
        'fields',
        // 'feedbackIcons',
        // 'initialValues',
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
      ]),
    );
  }

  get formInstance() {
    return this.form;
  }
}
