import { Button, Input } from 'antd';
import React, { useRef } from 'react';
import { DEFAULT_PLUGINS, Table, TableInstance, type FormProps } from 'voyagejs';
import { remoteDataSource } from './config';

const TableFilterDemo = () => {
  const ref = useRef<TableInstance>(null);

  const items: FormProps['items'] = [
    // {
    //   name: 'senderName',
    //   label: '发送人',
    //   children: <Input />,
    // },
    {
      name: 'recipientName',
      label: '接收人',
      children: <Input />,
    },
  ];

  return (
    <div>
      <Table<any, typeof DEFAULT_PLUGINS>
        initialFilters={{
          id: '123',
          recipientName: ['Lily'],
        }}
        columns={[
          {
            key: 'id',
            title: 'ID',
            render: 'index',
          },
          {
            key: 'senderName',
            title: '发送人',
            tooltip: '提示',
          },
          {
            key: 'recipientName',
            title: '接收人',
          },
          {
            key: 'time',
            title: '时间',
          },
          {
            key: 'custom',
            title: '自定义',
            render: 'holder',
          },
          {
            key: 'status',
            title: '状态',
            filters: [
              { text: '调度中', value: 'dispatching', color: 'blue' },
              { text: '成功', value: 'success', color: 'green' },
              { text: '警告', value: 'warning', color: 'red' },
            ],
            // options: [
            //   { label: '调度中', value: 'dispatching', color: 'blue' },
            //   { label: '成功', value: 'success', color: 'green' },
            //   { label: '警告', value: 'warning', color: 'red' },
            // ],
            render: 'tag',
          },
          {
            key: 'operator',
            render: (ctx) => {
              return (
                <Button
                  type="text"
                  size="small"
                  onClick={() => {
                    console.log('record', ctx.record);
                    ctx.modal.open({
                      title: '编辑',
                      width: 800,
                      initialValues: ctx.record,
                      items,
                    });
                  }}
                >
                  编辑
                </Button>
              );
            },
          },
        ]}
        remoteDataSource={remoteDataSource}
        ref={ref}
      />
    </div>
  );
};

export default TableFilterDemo;
