import { Button } from 'antd';
import { sleep } from 'radash';
import React, { Fragment } from 'react';
import { DEFAULT_PLUGINS, Form, FormGroup, useForm } from 'voyagejs';

function CardDemo() {
  const [form] = useForm();

  return (
    <Fragment>
      <Button onClick={() => form.refresh()}>刷新</Button>
      <Form
        form={form}
        onValuesChange={(_, values) => {
          console.log('values', values);
        }}
        remoteValues={async () => {
          await sleep(3000);
          return {
            a: '1',
            b: '2',
            c: '3',
          };
        }}
      >
        <FormGroup<any, typeof DEFAULT_PLUGINS>
          container="card"
          containerProps={{
            title: '卡片面板',
          }}
          items={[
            {
              name: 'a',
              label: 'a',
              component: 'input',
              componentProps: {},
            },
          ]}
        />

        <FormGroup
          container="card"
          containerProps={{
            title: '嵌套卡片',
          }}
          items={[
            {
              name: 'b',
              label: 'b',
              component: 'input',
            },
            {
              name: 'g-1',
              container: 'card',
              containerProps: {
                title: '嵌套卡片-1',
              },
              items: [
                {
                  name: 'c',
                  label: 'c',
                  component: 'input',
                },
              ],
            },
          ]}
        />
      </Form>
    </Fragment>
  );
}

export default CardDemo;
