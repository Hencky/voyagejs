import { useDeepCompareEffect } from 'ahooks';
import { Form as AForm } from 'antd';
import type { FormListProps as AFormListProps } from 'antd/lib/form/FormList';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo } from 'react';
import { Title } from '../../components';
import type { PluginsType } from '../../plugins';
import { toArray } from '../../utils';
import { FieldMode } from '../Base';
import { useFormContext } from '../Form';
import { useFormGroupContext } from '../FormGroup';
import type { ReactionType } from '../FormItem';
import { FormListContext, useFormListContext } from './context';
import { ListStore } from './store';

const { List } = AForm;

export interface FormListProps<Values = any, P extends PluginsType = PluginsType> extends AFormListProps {
  reactions?: ReactionType[];
  title?: string;
}

export const FormList = observer(
  <Values extends any = any, P extends PluginsType = PluginsType>(props: FormListProps<Values, P>) => {
    const { name } = props;

    const listCtx = useFormListContext();
    const formStore = useFormContext<Values, P>();
    const groupStore = useFormGroupContext<Values, P>();

    const realName = listCtx.name ? [...toArray(listCtx.name), ...toArray(name)] : name;

    const listStore = useMemo(() => {
      return new ListStore<Values, P>(
        { ...props, name: realName },
        formStore.form,
        () => formStore,
        () => groupStore,
      );
    }, []);

    const contextValue = useMemo(() => {
      return {
        name: realName,
      };
    }, [realName]);

    useEffect(() => {
      // @ts-expect-error
      formStore.addList(realName, listStore);
    }, [realName]);

    useDeepCompareEffect(() => {
      listStore.updateProps(props);
    }, [props]);

    if (listStore.mode === FieldMode.NONE) {
      return null;
    }

    return (
      <FormListContext.Provider value={contextValue}>
        {props.title && <Title style={{ marginBottom: 12 }}>{props.title}</Title>}
        <div style={{ display: listStore.mode === FieldMode.HIDDEN ? 'none' : 'block' }}>
          <List {...props} />
        </div>
      </FormListContext.Provider>
    );
  },
);
