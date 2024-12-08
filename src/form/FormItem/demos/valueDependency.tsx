import { Input } from 'antd';
import React from 'react';
import { Form, FormItem, useForm } from 'voyagejs';

function ValueDependency() {
  const [form] = useForm();

  return (
    <Form
      form={form}
      onValuesChange={(_, values) => {
        console.log('values', values);
      }}
    >
      <FormItem name="a" label="a">
        <Input data-testid="inputA" />
      </FormItem>
      <FormItem
        name="b"
        label="b"
        reactions={[
          {
            dependencies: ['a'],
            result: {
              value: `$deps[0]`,
            },
          },
        ]}
      >
        <Input data-testid="inputB" />
      </FormItem>
      <FormItem
        name="c"
        label="c"
        reactions={[
          {
            dependencies: ['a', 'b'],
            result: {
              value: `$deps[0] && $deps[1] ? $deps[0] + '-' + $deps[1] : ""`,
            },
          },
        ]}
      >
        <Input data-testid="inputC" />
      </FormItem>
      <FormItem
        name="d"
        label="d"
        reactions={[
          {
            dependencies: ['a', 'b'],
            result: {
              value: async (ctx) => {
                console.log(ctx);
                return '123';
              },
            },
          },
        ]}
      >
        <Input data-testid="inputD" />
      </FormItem>
    </Form>
  );
}

export default ValueDependency;
