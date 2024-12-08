import type { ModalProps as AModalProps } from 'antd';
import type { MouseEvent, ReactElement, ReactNode } from 'react';
import React, { useEffect, useRef } from 'react';
import type { PluginsType } from '../../plugins';
import type { FormOptionProps, FormProps, FormStore } from '../Form';
import { Form } from '../Form';
import type { FormGroupProps } from '../FormGroup';
import type { ModalProps } from './useModal';
import { useModal } from './useModal';

const { useForm, Group: FormGroup } = Form;

export type ExcludeModalType = 'onOk' | 'onCancel' | 'modalProps' | 'children' | 'confirmLoading';

export interface ModalFormContext<Values = any, P extends PluginsType = PluginsType> {
  form: FormStore<Values, P>;
  isOpen: boolean;
  values: Values;
  close: () => void;
}

export interface ModalFormInstance<Values = any, P extends PluginsType = PluginsType>
  extends ModalFormContext<Values, P> {
  open: (props: ModalFormProps<Values, P>) => void;
}

export interface ModalFormProps<Values = any, P extends PluginsType = PluginsType>
  extends Omit<ModalProps, ExcludeModalType> {
  /** 点击确定回调 */
  onOk?: (e: MouseEvent<HTMLElement>, ctx: ModalFormContext<Values, P>) => void;
  /** 点击遮罩层或右上角叉或取消按钮的回调 */
  onCancel?: (e: MouseEvent<HTMLElement>, ctx: ModalFormContext<Values, P>) => void;
  /** 表单属性 */
  formProps?: Omit<FormProps<Values, P>, 'form' | 'initialValues'>;
  /** 表单组属性 */
  formGroupProps?: Omit<FormGroupProps<Values, P>, 'items'>;
  /** Modal的其他属性 */
  modalProps?: Omit<AModalProps, Exclude<ExcludeModalType, 'confirmLoading'> | 'onOk' | 'onCancel'> & {
    footerRender?: (ctx: ModalFormContext<Values, P>) => ReactNode;
  };

  children?: ReactElement;

  items?: FormProps<Values, P>['items'];
  /** 表单初始值 */
  initialValues?: FormProps<Values, P>['initialValues'];
  /** 远程表单值 */
  remoteValues?: FormProps<Values, P>['remoteValues'];
}

export const useModalForm = <Values, P extends PluginsType = any>(
  props?: FormOptionProps<P>,
): [ReactElement, ModalFormInstance<Values, P>] => {
  const [modal, { open, close, isOpen }] = useModal();

  const [form] = useForm<Values, P>(props);

  const propsRef = useRef<ModalFormProps<Values, P>>();

  const getModalFormContext = () => {
    return {
      form,
      isOpen,
      close,
      values: form.getFieldsValue(),
    };
  };

  const { formProps, remoteValues } = propsRef.current || {};

  useEffect(() => {
    if (!isOpen) return;
    let timer: NodeJS.Timeout;
    timer = setTimeout(() => {
      // 表单打开后，才能渲染表单生成Form.Item实例，触发更新
      form.initReactionResult();
    }, 20);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, form]);

  return [
    // eslint-disable-next-line react/jsx-key
    <Form<Values, P> remoteValues={remoteValues} {...formProps} form={form} _inModal={{ isOpen }}>
      {modal}
    </Form>,
    {
      open: (params: ModalFormProps<Values, P>) => {
        propsRef.current = params;

        const { initialValues, onOk, onCancel, modalProps, formProps, formGroupProps, items, children, ...restParams } =
          params;

        const { footerRender, footer, ...restModalProps } = modalProps || {};

        if (initialValues) {
          form.setFieldsValue(initialValues);
        }

        // ===== footer支持ctx =====
        const renderFooter = () => {
          return footerRender ? footerRender(getModalFormContext()) : footer;
        };

        form.modalOpenStatus = true;

        return open({
          ...restParams,
          ...restModalProps,
          children: items ? (
            // @ts-expect-error
            <FormGroup<Values, P> items={items} {...formGroupProps} key={isOpen.toString()} />
          ) : (
            children
          ),
          modalProps: {
            footer: renderFooter(),
            destroyOnClose: true,
            ...modalProps,
          },
          onCancel: (e) => {
            form.resetFields();
            form.modalOpenStatus = false;
            form.modalOpenStatus = false;
            return onCancel?.(e, getModalFormContext());
          },
          onOk: async (e) => {
            // ===== 增加表单校验逻辑 =====
            await form.validateFields();
            return onOk?.(e, getModalFormContext());
          },
        });
      },
      close,
      isOpen,
      form,
      values: form.getFieldsValue?.(),
    },
  ];
};
