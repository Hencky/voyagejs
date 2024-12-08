import { Input } from 'antd';
import React from 'react';
import { Form, FormItem, useForm } from 'voyagejs';

function PropEffects() {
  const [form] = useForm();

  return (
    <Form
      form={form}
      initialValues={{ a: '1' }}
      onValuesChange={(_, values) => {
        console.log('values', values);
      }}
    >
      <FormItem
        name="a"
        label="a"
        data-testid="labelA"
        reactions={[
          {
            effects: ['b'],
            result: {
              mode(self: string) {
                if (self === '1') {
                  return 'edit';
                }
                return 'disabled';
              },
              required: `$self === '1'`,
            },
          },
          {
            effects: ['c'],
            result: {
              mode: `$self === '1' ? 'edit' : 'disabled'`,
              required: `$self === '1'`,
            },
          },
        ]}
      >
        <Input data-testid="inputA" />
      </FormItem>
      <FormItem name="b" label="b" data-testid="labelB">
        <Input data-testid="inputB" />
      </FormItem>
      <FormItem
        name="c"
        label="c"
        data-testid="labelC"
        reactions={[
          {
            effects: ['d'],
            result: {
              required: `$self === '1'`,
            },
          },
        ]}
      >
        <Input data-testid="inputC" />
      </FormItem>
      <FormItem name="d" label="d" data-testid="labelD">
        <Input data-testid="inputD" />
      </FormItem>
    </Form>
  );
}

export default PropEffects;
