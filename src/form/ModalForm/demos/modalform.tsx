import { Button, Input, Select, Space } from 'antd';
import React, { memo, useEffect } from 'react';
import { DefaultPluginsType, FormGroup, useModalForm } from 'voyagejs';

const SaveModal = memo(() => {
  useEffect(() => {
    console.log('modalForm刷新');
  }, []);

  return (
    <FormGroup
      span={24}
      items={[
        {
          name: 'a1',
          label: 'a1',
          children: <Input />,
          reactions: [
            {
              effects: ['a2'],
              result: {
                value: `$self + 'xxx'`,
              },
            },
          ],
        },
        { name: 'a2', label: 'a2', children: <Input />, rules: [{ required: true, message: 'a2必填' }] },
        {
          name: 'a3',
          label: 'a3',
          children: <Select />,
          fieldProps: { style: { width: '100%' } },
          remoteOptions: async () => {
            console.log('remoteOptions');
            return Promise.resolve([
              { label: 'a', value: 'a' },
              { label: 'b', value: 'b' },
            ]);
          },
        },
      ]}
    />
  );
});

const ModalForm = () => {
  const [modalForm, { open: openModalForm, close: closeModalForm }] = useModalForm<any, DefaultPluginsType>();
  const [modalForm2, { open: openModalForm2, close: closeModalForm2 }] = useModalForm();

  return (
    <div>
      {modalForm}
      {modalForm2}

      <Space>
        <Button
          onClick={() =>
            openModalForm({
              title: '弹框表单',
              width: 700,
              children: <SaveModal />,
              onCancel: () => {
                console.log('onCancel');
              },
              onOk: (e, ctx) => {
                console.log('onOk', e, ctx);
                closeModalForm();
              },
            })
          }
        >
          打开弹框表单
        </Button>

        <Button
          onClick={() =>
            openModalForm({
              title: '弹框表单',
              width: 700,
              children: <SaveModal />,
              onCancel: () => {
                console.log('onCancel');
              },
              onOk: (e, ctx) => {
                console.log('onOk', e, ctx);
                // closeModalForm();

                openModalForm2({
                  title: '弹框表单2',
                  width: 600,
                  children: <SaveModal />,
                  onCancel: () => {
                    console.log('onCancel');
                  },
                  onOk: (e, ctx) => {
                    console.log('onOk', e, ctx);
                    closeModalForm2();
                    closeModalForm();
                  },
                });
              },
            })
          }
        >
          二次弹框表单
        </Button>
      </Space>
    </div>
  );
};

export default ModalForm;
