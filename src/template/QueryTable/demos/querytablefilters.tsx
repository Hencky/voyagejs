import { SearchOutlined } from '@ant-design/icons';
import { message, Tag } from 'antd';
import { toJS } from 'mobx';
import React, { useEffect, useRef } from 'react';
import { DEFAULT_PLUGINS, QueryFormInstance, QueryTable } from 'voyagejs';
import { recipientName, remoteDataSource, status } from 'voyagejs/table/demos/config';

const Demo = () => {
  const ref = useRef<QueryFormInstance>();

  useEffect(() => {
    console.log('ref.current?.table.selectedRows.length', ref.current?.table.selectedRows.length);
  }, []);

  return (
    <QueryTable<any, any, typeof DEFAULT_PLUGINS>
      ref={ref}
      remoteDataSource={remoteDataSource}
      rowSelection
      initialValues={{ name: '张三', age: '18' }}
      initialFilters={{ id: '123' }}
      // actions={[]}
      actions={{
        left: [{ actionType: 'text', type: 'title', children: '标题' }],
        right: [
          {
            actionType: 'button',
            children: '新增',
            type: 'primary',
            onClick: (e, ctx) => {
              console.log('新增~', ctx);
              ctx.modal.open({
                title: '新增',
                children: <div>新增</div>,
                onOk: () => {
                  ctx.modal.close();
                  message.success('新增成功');
                  ctx.table.refresh();
                },
              });
            },
          },
          {
            type: 'primary',
            disabled: () => ref.current?.table.selectedRows.length === 0,
            children: '清空选中行',
            onClick: (e, ctx) => {
              console.log('选中行~', toJS(ctx.table.selectedRows));
              ctx.table.selectedRows = [];
              console.log('选中行清空~', toJS(ctx.table.selectedRows));
            },
          },
          (ctx) => {
            const { table } = ctx || {};
            return <Tag color="green">自定义{table?.selectedRows.length}</Tag>;
          },
          {
            actionType: 'dropdown',
            children: <div>更多</div>,
            items: [
              {
                children: '新增',
                type: 'primary',
                onClick: (e, ctx) => {
                  console.log('ctx', ctx.table.selectedRows);
                },
              },
            ],
          },
        ],
      }}
      fields={[
        {
          name: 'name',
          label: '姓名',
          fieldType: 'input',
          fieldProps: {
            allowClear: true,
          },
        },
        {
          name: 'age',
          label: '年龄',
          fieldType: 'input',
        },
      ]}
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
          filterFieldType: 'datepicker',
          filterFieldProps: {
            allowClear: true,
            format: 'YYYY-MM-DD',
            placeholder: '请选择',
          },
        },
        {
          key: 'status',
          title: '状态',
          filters: status.map((i) => ({ text: i, value: i })),
        },
      ]}
    />
  );
};

export default Demo;
