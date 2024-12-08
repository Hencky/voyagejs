import { useDebounceEffect, useDeepCompareEffect } from 'ahooks';
import { Col, Form } from 'antd';
import type { NamePath } from 'antd/lib/form/interface';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { omit } from 'radash';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import type { PluginsType } from '../../plugins';
import { parsePlugin } from '../../plugins';
import { isNill, toArray } from '../../utils';
import { FieldMode, commonKeys } from '../Base';
import { useFormContext } from '../Form/context';
import { useFormGroupContext } from '../FormGroup';
import { useFormListContext } from '../FormList/context';
import type { FormItemProps } from './interface';
import { FieldStore } from './store';

const { Item, useFormInstance } = Form;

export const FormItem = observer(
  <Values, P extends PluginsType = PluginsType>(props: PropsWithChildren<FormItemProps<Values, P>>) => {
    const { name, children } = props;

    const restProps = omit(props, [
      ...commonKeys,
      'options',
      'optionsPropName',
      'remoteOptions',
      'reactions',
      'fieldType',
      'fieldProps',
    ]);

    const [updateKey, update] = useState({});

    const formStore = useFormContext();
    const groupStore = useFormGroupContext();
    const listStore = useFormListContext();

    const form = useFormInstance();

    const forceUpdate = () => update({});

    const fullName = !isNill(groupStore?.prefixName) ? [...toArray(groupStore.prefixName), ...toArray(name)] : name;
    const fieldName = !isNill(listStore?.name) ? [...toArray(listStore.name), ...toArray(fullName)] : fullName;

    const field = useMemo(() => {
      return formStore.createField(
        fieldName as string,
        // @ts-expect-error
        new FieldStore<Values, P>(
          { ...props, name: fieldName },
          form,
          // @ts-expect-error
          () => formStore,
          () => groupStore,
          forceUpdate,
        ),
      );
    }, []);

    const { remoteOptionsDebounceProps } = field;

    useDebounceEffect(
      () => {
        field.fetchRemoteOptions();
      },
      [updateKey],
      remoteOptionsDebounceProps,
    );

    useEffect(() => {
      // @ts-expect-error
      formStore.addField(fieldName, field);
      return () => {
        formStore.removeField(fieldName);
      };
    }, []);

    // 直接更新props
    useDeepCompareEffect(() => {
      field.updateProps({ ...props, name: fieldName } as FormItemProps<any>);
    }, [props, fieldName]);

    if (field.mode === FieldMode.NONE) {
      return null;
    }

    const enableViewPlugin = field.viewFieldType && field.mode === FieldMode.VIEW;

    let { element: ele, defaultFormItemProps } = parsePlugin(
      formStore.plugins.field,
      // TODO: fieldType支持支持ReactElement格式
      (enableViewPlugin ? field.viewFieldType : field.fieldType) || children,
      {
        ...toJS(enableViewPlugin ? field.viewFieldProps : field.fieldProps),
        ...field.childProps,
      },
      { ...props, value: field.value, field, values: form.getFieldsValue(), form },
    );

    const element = (
      <Item<Values>
        {...omit(defaultFormItemProps, ['optionsPropName'])}
        {...restProps}
        {...field.fieldChildProps}
        name={fullName as NamePath}
      >
        {ele}
      </Item>
    );

    if (field.span === null || groupStore?.container === null) {
      return element;
    }

    return (
      <Col {...toJS(field.colProps)} span={field.span!}>
        {element}
      </Col>
    );
  },
);
