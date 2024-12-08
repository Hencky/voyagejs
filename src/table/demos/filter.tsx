import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, InputNumber } from 'antd';
import React, { useRef } from 'react';
import { DEFAULT_PLUGINS, Table, TableInstance, type FormProps } from 'voyagejs';
import { recipientName, remoteDataSource, status } from './config';

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
      <Button
        danger
        onClick={() => {
          ref.current!.table.filter = {};
          ref.current!.table.refresh();
        }}
      >
        清空筛选
      </Button>
      <Table<any, typeof DEFAULT_PLUGINS>
        initialFilters={{
          id: '123',
          recipientName: ['Lily'],
        }}
        columns={[
          {
            key: 'id',
            title: 'ID',
            sorter: true,
            filterFieldType: 'input',
            filterFieldProps: {
              allowClear: true,
              placeholder: '请输入',
            },
            render: 'holder',
          },
          {
            key: 'senderName',
            title: '发送人',
            tooltip: '提示',
            filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            filterFieldType: 'input',
            filterFieldProps: {
              allowClear: true,
              placeholder: '请选择',
            },
          },
          {
            key: 'recipientName',
            title: '接收人',
            filters: recipientName.map((i) => ({ text: i, value: i })),
          },
          {
            key: 'time',
            title: '时间',
            filterFieldType: 'rangepicker',
            filterFieldProps: {
              allowClear: true,
              format: 'YYYY-MM-DD',
              placeholder: ['开始时间', '结束时间'],
            },
          },
          {
            key: 'custom',
            title: '自定义搜索',
            filterFieldType: (ctx) => {
              return (
                <InputNumber
                  style={{ width: 120 }}
                  onChange={(val) => {
                    ctx.setSelectedKeys([val]);
                  }}
                  value={ctx.selectedKeys?.[0]}
                />
              );
            },
          },
          {
            key: 'status',
            title: '状态',
            filters: status.map((i) => ({ text: i, value: i })),
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
