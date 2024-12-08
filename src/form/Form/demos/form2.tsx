import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { sleep } from 'radash';
import React, { useRef } from 'react';
import { ButtonAction, DEFAULT_PLUGINS, FieldMode, Form, IconAction, QueryActions, observer } from 'voyagejs';

const { useForm } = Form;

function Demo() {
  const [form] = useForm();

  const memoValues = useRef<any>();

  return (
    <div>
      <Form
        form={form}
        labelCol={{ style: { width: 100 } }}
        mode={FieldMode.DISABLED}
        remoteValues={async () => {
          await sleep(1000);
          memoValues.current = {
            bdId: 2,
            list: [
              { name: '2-2', postId: 123, id: 1 },
              { name: '2-2', postId: 123, id: 2 },
            ],
          };
          return memoValues.current;
        }}
      >
        <Form.Group
          items={[
            {
              name: 'bdId',
              label: '选择标段',
              fieldType: 'select',
              remoteOptions: async () => {
                await sleep(1000);
                return [
                  { label: '1', value: 1 },
                  { label: '2', value: 2 },
                  { label: '3', value: 3 },
                ];
              },
            },
          ]}
        />
        <Form.List name="list" reactions={[{ dependencies: ['bdId'], result: { value: [] } }]}>
          {(fields, { add, remove }) => {
            const element = fields.map((item, idx) => {
              const { key, name } = item;

              return (
                <div key={key} style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Form.Group<any, typeof DEFAULT_PLUGINS>
                      name={['group', name]}
                      prefixName={name}
                      rowProps={{ gutter: 8 }}
                      items={[
                        {
                          name: ['name'],
                          span: 12,
                          style: { marginBottom: 0 },
                          fieldType: 'select',
                          dependencies: ['bdId'],
                          remoteOptions: async ([bdId]) => {
                            if (!bdId) return [];
                            await sleep(1000);
                            return [
                              { label: `标段1-${bdId}`, value: `1-${bdId}` },
                              { label: `标段2-${bdId}`, value: `2-${bdId}` },
                              { label: `标段3-${bdId}`, value: `3-${bdId}` },
                            ];
                          },
                          // reactions: [{ dependencies: ['bdId'], result: { value: undefined } }],
                          fieldProps: {
                            placeholder: '请选择啥啊？',
                          },
                        },
                        {
                          name: ['postId'],
                          span: 12,
                          style: { marginBottom: 0 },
                          fieldType: 'input',
                          // reactions: [
                          //   {
                          //     dependencies: [['bdId']],
                          //     result: {
                          //       value: undefined,
                          //     },
                          //   },
                          // ],
                        },
                      ]}
                    />
                  </div>
                  <IconAction
                    {...{
                      icon: <DeleteOutlined />,
                      style: { paddingLeft: 8, lineHeight: '32px' },
                      render: form.mode === FieldMode.EDIT,
                      onClick: () => {
                        if (form.mode === FieldMode.DISABLED) return;
                        remove(idx);
                      },
                    }}
                  />
                </div>
              );
            });

            return (
              <div>
                {element}
                <ButtonAction
                  type="dashed"
                  block
                  render={form.mode === FieldMode.EDIT}
                  icon={<PlusOutlined />}
                  onClick={() => {
                    add();
                  }}
                >
                  添加
                </ButtonAction>
              </div>
            );
          }}
        </Form.List>
        <QueryActions
          style={{ marginTop: 16 }}
          items={[
            {
              children: '查看',
              onClick: () => {
                console.log(form);
                console.log(form.values);
              },
            },
            {
              children: '编辑',
              render: form.mode !== FieldMode.EDIT,
              onClick: () => {
                console.log('编辑');
                form.mode = FieldMode.EDIT;
              },
            },
            {
              children: '保存',
              type: 'primary',
              render: form.mode === FieldMode.EDIT,
              onClick: async () => {
                await form.validateFields();
                console.log('保存');
                const values = form.getFieldsValue(true);
                console.log(values);
                form.mode = FieldMode.DISABLED;
                memoValues.current = form.values;
              },
            },
            {
              children: '取消',
              render: form.mode === FieldMode.EDIT,
              onClick: () => {
                console.log('取消');
                form.mode = FieldMode.DISABLED;
                form.values = memoValues.current;
              },
            },
          ]}
        />
      </Form>
    </div>
  );
}

export default observer(Demo);
