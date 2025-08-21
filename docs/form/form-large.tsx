import React from 'react';
import { DefaultPluginsType, Form } from 'voyagejs';

const { useForm } = Form;

const Demo = () => {
  const [form] = useForm<any, DefaultPluginsType>();

  const items = Array.from({ length: 100 }).map((item, index) => {
    return {
      name: index + 1,
      label: index + 1,
      fieldType: 'inputnumber',
      fieldProps: { style: { width: '100%' } },
      reactions:
        index > 1
          ? []
          : [
              {
                effects: [index + 2, index + 22],
                result: {
                  value: `$self`,
                },
              },
            ],
    };
  });

  return (
    <div>
      <Form<any, DefaultPluginsType> form={form} items={items} />
    </div>
  );
};

export default Demo;
