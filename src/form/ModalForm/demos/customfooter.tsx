import { Button, Input, Space } from 'antd';
import React, { memo } from 'react';
import { ButtonActions, FormGroup, useModalForm } from 'voyagejs';

const SaveModal = memo(() => {
  return (
    <FormGroup
      span={24}
      items={[
        {
          name: 'a1',
          label: 'a1',
          children: <Input />,
        },
      ]}
    />
  );
});

const CustomFooter = () => {
  const [modalForm, { open: openModalForm, close: closeModalForm }] = useModalForm();

  return (
    <div>
      {modalForm}

      <Space>
        <Button
          onClick={() =>
            openModalForm({
              title: '弹框表单',
              width: 700,
              children: <SaveModal />,
              modalProps: {
                footerRender: (ctx) => {
                  return (
                    <ButtonActions
                      actions={[
                        {
                          children: '关闭',
                          onClick: () => {
                            console.log('关闭', ctx);
                            ctx.close();
                          },
                        },
                      ]}
                    />
                  );
                },
              },
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
          自定义页脚
        </Button>
      </Space>
    </div>
  );
};

export default CustomFooter;
