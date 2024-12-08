/**
 * title: 空Form.Item标签
 * description: 空Form.Item标签不报错
 */
import { Empty } from 'antd';
import React from 'react';
import { Form, FormItem, useForm } from 'voyagejs';

const EmptyItem = () => {
  const [form] = useForm();
  return (
    <Form form={form}>
      {/* 空Item不报错 */}
      <FormItem shouldUpdate></FormItem>

      <Empty description={null} />
    </Form>
  );
};

export default EmptyItem;
