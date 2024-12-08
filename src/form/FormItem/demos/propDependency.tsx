import { Input } from 'antd';
import React from 'react';
import { Form, FormItem, useForm } from 'voyagejs';

function PropDependency() {
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
              mode: `$deps[0] ? 'disabled' : 'edit'`,
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
            dependencies: ['b'],
            result: {
              mode: `$deps[0] ? 'disabled' : 'edit'`,
              value: `$deps[0]`,
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
            dependencies: ['b', 'c'],
            result: {
              mode: `$deps[0] && $deps[1] ? 'disabled' : 'edit'`,
            },
          },
        ]}
      >
        <Input data-testid="inputD" />
      </FormItem>
    </Form>
  );
}

export default PropDependency;
