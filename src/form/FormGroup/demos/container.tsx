import { Button, Card, Input } from 'antd';
import React from 'react';
import { Form, FormGroup, useForm } from 'voyagejs';

function GroupContainer() {
  const [form] = useForm();

  return (
    <Form
      form={form}
      onValuesChange={(_, values) => {
        console.log('values', values);
      }}
    >
      <FormGroup
        container={<Card title="分组容器" extra={<Button>按钮</Button>} />}
        name="group1"
        items={[
          {
            name: 'a',
            label: 'a',
            children: <Input style={{ width: '100%' }} />,
          },
        ]}
      />
    </Form>
  );
}

export default GroupContainer;
