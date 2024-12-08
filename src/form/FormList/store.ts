import type { FormInstance } from 'antd/lib/form';
import type { NamePath } from 'antd/lib/form/interface';
import type { PluginsType } from '../../plugins';
import { BaseStore } from '../Base';
import type { FormStore } from '../Form';
import type { GroupStore } from '../FormGroup/store';
import type { FormListProps } from './FormList';

export class ListStore<Values = any, P extends PluginsType = PluginsType> extends BaseStore<Values, P> {
  /** 表单实例 */
  form: FormInstance<Values>;

  /** 字段名，唯一路径标识 */
  name?: NamePath;

  _props: FormListProps<Values>;

  constructor(
    props: FormListProps<Values, P>,
    form: FormInstance<Values>,
    getFormStore: () => FormStore<Values, P>,
    getGroupStore: () => GroupStore<Values, P>,
  ) {
    super(getFormStore, getGroupStore);
    super.makeObservable();
    this._props = props;
    this.form = form;
    this.updateProps(props);
  }

  updateProps(props: FormListProps<Values>) {
    Object.keys(props).forEach((key) => {
      // @ts-expect-error
      this[key] = props[key];
    });
  }

  set value(val: any) {
    this.form.setFieldValue(this.name, val);
  }

  get value(): any {
    const field = this.form.getFieldValue(this.name);
    return field;
  }
}
