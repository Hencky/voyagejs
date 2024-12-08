import { useDeepCompareEffect } from 'ahooks';
import { Form as AForm, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { omit } from 'radash';
import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import type { PluginsType } from '../../plugins';
import { commonKeys } from '../Base';
import { FormGroup } from '../FormGroup';
import { FormContext } from './context';
import type { FormProps } from './interface';

const { useForm: useAForm, ErrorList, Provider } = AForm;

export { ErrorList, Provider, useAForm };

export const Form = observer(
  <Values, P extends PluginsType = PluginsType>(props: PropsWithChildren<FormProps<Values, P>>) => {
    const { children, form: formStore, onValuesChange, spinProps, items, formGroupProps, _inModal } = props;

    const restProps = omit(props, [...commonKeys, 'items', 'remoteValues', 'spinProps', '_inModal']);

    const [aForm] = useAForm();

    formStore.setFormInstance(aForm);
    formStore.inModal = !!_inModal;

    useEffect(() => {
      formStore.init(props);
    }, []);

    useDeepCompareEffect(() => {
      formStore.updateProps(props);
    }, [props]);

    const formContextValue = useMemo(() => {
      return formStore;
    }, [formStore]);

    const renderChildren = () => {
      if (items) {
        // 只作为分组使用，去除Group分组
        return <FormGroup<Values, P> items={items} {...formGroupProps} />;
      }
      return children;
    };

    return (
      <FormContext.Provider value={formContextValue}>
        <Spin spinning={formStore.enableLoading ? formStore.loading : false} {...spinProps}>
          <AForm<Values>
            {...restProps}
            {...formStore.formProps}
            form={aForm}
            onValuesChange={(changeValues, values) => {
              formStore.innerValueChange(changeValues);
              onValuesChange?.(changeValues, values);
            }}
          >
            {renderChildren()}
          </AForm>
        </Spin>
      </FormContext.Provider>
    );
  },
);
