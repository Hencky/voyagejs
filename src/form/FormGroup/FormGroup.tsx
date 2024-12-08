import { useDeepCompareEffect } from 'ahooks';
import { Row } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { Fragment, cloneElement, useEffect, useMemo } from 'react';
import { Title } from '../../components';
import type { PluginsType } from '../../plugins';
import { parsePlugin } from '../../plugins';
import { FieldMode } from '../Base';
import { useFormContext } from '../Form/context';
import { FormItem } from '../FormItem';
import { toCompareName } from '../utils';
import { FormGroupContext, useFormGroupContext } from './context';
import type { FormGroupProps } from './interface';
import { GroupStore } from './store';

export const FormGroup = observer(<Values, P extends PluginsType = PluginsType>(props: FormGroupProps<Values, P>) => {
  const { name } = props;

  const formStore = useFormContext<Values, P>();
  const groupStore = useFormGroupContext<Values, P>();

  const group = useMemo(() => {
    return formStore!.createGroup(
      name,
      // @ts-expect-error  GroupStore中container、containerProps 类型错误
      new GroupStore<Values, P>(
        props,
        () => formStore,
        () => groupStore,
      ),
    );
  }, []);

  useEffect(() => {
    formStore.addGroup(group.name, group);
    return () => {
      formStore.removeGroup(group.name);
    };
  }, [group.name]);

  useDeepCompareEffect(() => {
    // @ts-expect-error
    group.updateProps(props as FormGroupProps<Values, P>);
  }, [props]);

  const isGroup = (item: any): item is FormGroupProps<Values, P> => {
    return !!item.container || !!item.items;
  };

  const renderFields = (items: FormGroupProps<Values, P>['items']) => {
    return (
      <Fragment>
        {items?.map((item, idx) => {
          const { children } = item;

          if (isGroup(item)) {
            return (
              <FormGroup<Values, P>
                key={toCompareName(item.name as string) || idx}
                {...(item as FormGroupProps<Values, P>)}
              />
            );
          }

          return (
            <FormItem<Values, P> key={toCompareName(item.name as string) || idx} {...item}>
              {children}
            </FormItem>
          );
        })}
      </Fragment>
    );
  };

  // ===== children =====
  const element = group.groupProps.items
    ? renderFields(group.groupProps.items as FormGroupProps<Values, P>['items'])
    : props.children;

  const { element: ele } = parsePlugin(formStore.plugins.container, toJS(group.container), toJS(group.containerProps));

  // ===== 容器  ======
  let container;
  if (group.container) {
    container = ele;
  } else if (group.container === null) {
    container = <div />;
  } else {
    container = <Row {...toJS(group.rowProps)}></Row>;
  }

  if (group.mode === FieldMode.HIDDEN) {
    container = <div style={{ display: 'none' }}></div>;
  }

  if (group.mode === FieldMode.NONE) {
    return null;
  }

  return (
    <FormGroupContext.Provider value={group}>
      {group.title && <Title style={{ marginBottom: 12 }}>{group.title}</Title>}
      {container ? cloneElement(container as any, group.containerProps || {}, element) : element}
    </FormGroupContext.Provider>
  );
});
