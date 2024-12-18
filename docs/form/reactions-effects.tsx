/**
 * title: 主动联动
 * description: a 变化控制 b 状态，联动效果配置在 a 上
 */
import React from 'react';
import { DefaultPluginsType, Form } from 'voyagejs';

const { useForm, Item } = Form;

const Demo = () => {
  const [form] = useForm();
  return (
    <Form<any, DefaultPluginsType>
      form={form}
      items={[
        {
          name: 'a',
          label: 'a',
          fieldType: 'input',
          reactions: [
            {
              effects: ['b'],
              result: {
                value: `$self ? $self === '1' ? '1' : '2' : ''`,
                required: `$self === '1'`,
              },
            },
          ],
        },
        {
          name: 'b',
          label: 'b',
          fieldType: 'input',
          reactions: [
            {
              effects: ['c'],
              result: {
                value: `$self ? $self === '1' ? '1' : '2' : ''`,
                required: `$self === '1'`,
              },
            },
          ],
        },
        {
          name: 'c',
          label: 'c',
          fieldType: 'input',
          reactions: [
            {
              effects: ['d'],
              result: {
                value: `$self ? $self === '1' ? '1' : '2' : ''`,
                required: `$self === '1'`,
              },
            },
          ],
        },
        {
          name: 'd',
          label: 'd',
          fieldType: 'input',
        },
      ]}
    />
  );
};

export default Demo;
