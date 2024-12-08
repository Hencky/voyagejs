import { Button, Input, Space } from 'antd';
import { toJS } from 'mobx';
import React, { useRef } from 'react';
import { Table, TableInstance, type FormProps } from 'voyagejs';
import { columns, remoteDataSource } from './config';

const TableDemo = () => {
  const ref = useRef<TableInstance>(null);

  const items: FormProps['items'] = [
    {
      name: 'senderName',
      label: '发送人',
      children: <Input />,
    },
    {
      name: 'recipientName',
      label: '接收人',
      children: <Input />,
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Button onClick={() => ref.current!.table.refresh()}>刷新表格</Button>
        <Button onClick={() => ref.current!.table.refresh({ a: 1 })}>刷新表格带参数</Button>
        <Button onClick={() => ref.current!.table.reset()}>重置到初始状态</Button>
        <Button onClick={() => (ref.current!.table.dataSource = [{ id: 333 }])}>设置数据源</Button>
        <Button onClick={() => (ref.current!.table.loading = !ref.current!.table.loading)}>切换loading</Button>
        <Button onClick={() => (ref.current!.table.pagination = { current: 2, pageSize: 20, total: 200 })}>
          设置分页
        </Button>
        <Button onClick={() => console.log(toJS(ref.current!.table.selectedRows))}>获取选中行</Button>
        <Button onClick={() => console.log(toJS(ref.current!.table.selectedRowKeys))}>获取选中行keys</Button>
        <Button
          onClick={() => {
            ref.current!.table.selectedRows = [{ id: '1' }];
          }}
        >
          设置选中行(通过rows)
        </Button>
        <Button
          onClick={() => {
            ref.current!.table.selectedRowKeys = ['1', '2'];
          }}
        >
          设置选中行(通过rowKeys)
        </Button>
        <Button onClick={() => (ref.current!.table.selectedRows = [])}>清空选中行</Button>
      </Space>

      <Space style={{ display: 'flex', marginBottom: 16 }}>
        <Button
          onClick={() => {
            ref.current!.modal.open({
              title: '弹框',
              items,
              onOk: () => {
                console.log('ok', ref.current?.table.selectedRowKeys);
                ref.current!.modal.close();
              },
            });
          }}
        >
          打开弹窗
        </Button>
      </Space>

      <Table
        columns={[
          ...columns,
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
        rowSelection={true}
      />
    </div>
  );
};

export default TableDemo;
