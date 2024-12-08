import { Divider, Input } from 'antd';
import React, { Fragment, useState } from 'react';
import { Form, FormItem, useForm } from 'voyagejs';

function PropChange(props: any) {
  const [form] = useForm();

  const [label, setLabel] = useState('a');

  return (
    <Fragment>
      <Input onChange={(e) => setLabel(e.target.value)} />
      <Divider />
      <Form
        form={form}
        onValuesChange={(_, values) => {
          console.log('values', values);
        }}
      >
        <FormItem name="a" label={label} data-testid="labelA">
          <Input data-testid="inputA" />
        </FormItem>
        <FormItem name="b" label="b" data-testid="labelB">
          <Input data-testid="inputB" />
        </FormItem>
      </Form>
    </Fragment>
  );
}

export default PropChange;
