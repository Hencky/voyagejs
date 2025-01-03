import { DatePicker as ADatePicker } from 'antd';
import type { DatePickerProps as ADatePickerProps } from 'antd/lib/date-picker';
import moment, { type Moment } from 'moment';
import React from 'react';
import { Text } from '../../../components';
import type { FieldBaseProps } from '../../interfaces';

export type DatePickerProps = Omit<ADatePickerProps, 'value' | 'onChange'> &
  FieldBaseProps & {
    /** 根据format格式化值处理，默认true，可设置为utc获取时间戳格式值 */
    valueFormat?: 'utc' | boolean;
    value?: any;
    /** 根据showTime区分TimePicker，ADatePickerProps里没有这个类型 */
    showTime?: boolean;

    onChange?: (value: DatePickerProps['value']) => void;
  };

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  const { onChange, value, valueFormat = true, format, readOnly, ...restProps } = props;

  const onFormatChange: ADatePickerProps['onChange'] = (time) => {
    let finalTime: DatePickerProps['value'] = time;

    if (valueFormat === 'utc') {
      finalTime = time?.valueOf();
    } else if (valueFormat) {
      finalTime = time?.format(format as string);
    }

    onChange?.(finalTime);
  };

  if (readOnly) {
    return <Text>{value ?? '-'}</Text>;
  }

  let finalValue = value;
  if (value) {
    finalValue = moment(value, valueFormat === true ? !!format : undefined);
  }

  // @ts-expect-error
  return <ADatePicker picker="date" {...restProps} onChange={onFormatChange} value={finalValue as Moment} />;
};
