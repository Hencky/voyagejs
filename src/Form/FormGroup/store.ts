import { computed, makeObservable, observable } from 'mobx';
import type { PluginsType } from '../../interfaces';
import { parsePlugin } from '../../plugins';
import { BaseProps, BaseStore } from '../Base';
import type { FormStore } from '../Form/store';
import type { FormGroupProps } from './interface';

interface GroupProps<Values = any, P extends PluginsType = PluginsType> {
  container: FormGroupProps<Values, P>['container'];
  containerProps: FormGroupProps<Values, P>['containerProps'];
}

export class GroupStore<Values = any, P extends PluginsType = PluginsType>
  extends BaseStore<Values, P>
  // Omit<FormGroupProps<Values, P>, 'form'>,
  implements BaseProps<Values>
{
  name?: FormGroupProps<Values, P>['name'];

  items?: FormGroupProps<Values, P>['items'];

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

    Object.keys(props).forEach((key) => {
      // @ts-expect-error
      this[key] = props[key];
    });

    super.makeObservable();
    this.makeObservable();
  }

  makeObservable() {
    makeObservable(this, {
      items: observable.shallow,
      container: observable,
      containerProps: observable.deep,
      containerPlugin: computed,
    });
  }

  get groupProps() {
    return {
      items: this.items,
    };
  }

  // 插件
  get containerPlugin() {
    return parsePlugin(this.getFormStore().plugins.container, this.container);
  }
}
