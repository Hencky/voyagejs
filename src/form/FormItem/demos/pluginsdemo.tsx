import { Divider } from 'antd';
import React from 'react';
import {
  DEFAULT_PLUGINS,
  DefaultPluginsType,
  FieldMode,
  Form,
  FormGroup,
  FormItem,
  DEFAULT_PLUGINS as plugins,
  useForm,
} from 'voyagejs';

function Plugins() {
  const [form] = useForm({ plugins });

  return (
    <Form<any, DefaultPluginsType>
      form={form}
      labelCol={{ style: { width: 50 } }}
      onValuesChange={(_, values) => {
        console.log('values', values);
      }}
      mode={FieldMode.VIEW}
    >
      <FormItem<any, DefaultPluginsType>
        name={'a1'}
        label="a1"
        fieldType="switch"
        fieldProps={{
          checkedChildren: 'aa',
          unCheckedChildren: 'bb',
        }}
      />
      <FormItem<any, typeof DEFAULT_PLUGINS>
        name={'a2'}
        label="a2"
        fieldType="input"
        fieldProps={{
          allowClear: true,
        }}
      />

      <FormItem<any, typeof DEFAULT_PLUGINS>
        name={'b'}
        label="b"
        fieldType="select"
        fieldProps={{ placeholder: '请选择xx' }}
        remoteOptions={async () => {
          return [
            { label: 'a', value: 'a' },
            { label: 'b', value: 'b' },
            { label: 'c', value: 'c' },
          ];
        }}
      />

      <Divider />
      <FormGroup<any, typeof DEFAULT_PLUGINS>
        span={24}
        labelCol={{ style: { width: 60 } }}
        name="group1"
        items={[
          {
            name: 'x1',
            label: 'x1',
            rules: [{ required: true, message: '请输入xx' }],
            fieldType: 'inputnumber',
            fieldProps: {
              placeholder: '请输入xx',
            },
          },
          // {
          //   name: 'x2',
          //   label: 'x2',
          //   fieldType: 'inputnumber',
          //   fieldProps: {
          //     placeholder: '请输入数字',
          //     style: { width: '100%' },
          //   },
          //   reactions: [
          //     {
          //       dependencies: ['a2'],
          //       result: {
          //         value: `$deps[0]`,
          //       },
          //     },
          //   ],
          // },
          {
            name: 'x3',
            label: 'x3',
            fieldType: 'select',
            options: [
              { label: 'a', value: 'a' },
              { label: 'b', value: 'b' },
              { label: 'c', value: 'c' },
            ],
            fieldProps: {
              style: { width: '100%' },
              placeholder: '请选择',
            },
          },
        ]}
      />
    </Form>
  );
}

export default Plugins;
