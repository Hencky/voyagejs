import { Space } from 'antd';
import moment from 'moment';
import React from 'react';
import { TimePicker } from 'voyagejs';

const DatePickerDemo = () => {
  const onChange = (value) => {
    console.log('value', value);
  };

  return (
    <Space direction="vertical">
      <Space>
        <span>默认为TimeString格式</span>
        <TimePicker onChange={onChange} />
      </Space>
      <Space>
        <span>使用moment格式</span>
        <TimePicker valueFormat={false} onChange={onChange} />
      </Space>
      <Space>
        <span>UTC时间格式</span>
        <TimePicker valueFormat={'utc'} onChange={onChange} />
      </Space>
      <Space>
        <span>UTC回显</span>
        <TimePicker valueFormat={'utc'} value={1653446642066} />
      </Space>
      <Space>
        <span>moment回显</span>
        <TimePicker valueFormat={false} value={moment('2022-01-01')} />
      </Space>
      <Space>
        <span>TimeString回显</span>
        <TimePicker valueFormat={true} value={'2022-01-01'} />
      </Space>
    </Space>
  );
};

export default DatePickerDemo;