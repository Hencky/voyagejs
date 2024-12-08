import { makeObservable, observable } from 'mobx';
import { uid } from 'radash';
import type { PluginsType } from '../../plugins';
import { BaseProps, BaseStore } from '../Base';
import type { FormStore } from '../Form/store';
import type { FormGroupProps } from './interface';

export class GroupStore<Values = any, P extends PluginsType = PluginsType>
  extends BaseStore<Values, P>
  // Omit<FormGroupProps<Values, P>, 'form'>,
  implements BaseProps<Values>
{
  prefixName?: FormGroupProps<Values, P>['prefixName'] = [];

  name?: FormGroupProps<Values, P>['name'];

  items?: FormGroupProps<Values, P>['items'];

  title?: FormGroupProps<Values, P>['title'];

  rowProps?: FormGroupProps<Values, P>['rowProps'];

  /** 容器 */
  container?: FormGroupProps<Values, P>['container'];
  /** 容器属性 */
  containerProps?: FormGroupProps<Values, P>['containerProps'];

  constructor(
    props: FormGroupProps<Values, P>,
    getFormStore: () => FormStore<Values, P>,
    getGroupStore: () => GroupStore<Values, P>,
  ) {
    super(getFormStore, getGroupStore);

    this.updateProps(props);

    if (!this.name) {
      this.name = uid(10);
    }

    super.makeObservable();
    this.makeObservable();
  }

  updateProps(props: FormGroupProps<Values, P>) {
    Object.keys(props).forEach((key) => {
      // @ts-expect-error
      this[key] = props[key];
    });
  }

  makeObservable() {
    makeObservable(this, {
      items: observable.shallow,
      container: observable,
      containerProps: observable.deep,
      title: observable.ref,
      name: observable.ref,
      // containerPlugin: computed,
    });
  }

  get groupProps() {
    return {
      items: this.items,
    };
  }
}
