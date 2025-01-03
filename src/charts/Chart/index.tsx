import { Card, CardProps, Empty, Spin } from 'antd';
import { isEmpty, isFunction } from 'radash';
import React, { useEffect, useRef, useState } from 'react';
import { usePrefixCls } from '../../context';
import { Form, FormItemProps } from '../../form';
import type { PluginsType } from '../../plugins';
import { DEFAULT_CHART_PLUGINS } from './charts';

import './index.less';

const { useForm } = Form;

const isEmptyData = (data: any) => {
  if (isEmpty(data)) return true;
  if (Array.isArray(data) && !data.some((item) => !isEmpty(item))) return true;
  return false;
};

export interface ChartProps<Values, P extends PluginsType = PluginsType> {
  /** 图表标题 */
  title?: string;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 图表高度 */
  height?: number;
  /** 远程数据 */
  remoteData: (params?: any) => Promise<any>;
  /** 外部参数，变化时触发重渲染 */
  params?: any;
  /** 表单项 */
  fields?: FormItemProps<Values, P>[];
  /** 卡片组件配置 */
  cardProps?: Omit<CardProps, 'title' | 'extra'>;
  type?: keyof typeof DEFAULT_CHART_PLUGINS;
  options?: any | ((data: any) => any);

  onElementClick?: (data: any) => void;
}

export const Chart = <Values, P extends PluginsType = PluginsType>(props: ChartProps<Values, P>) => {
  const {
    title,
    height = 400,
    remoteData,
    params,
    fields,
    type,
    options,
    bordered = false,
    cardProps,
    onElementClick,
  } = props;

  const prefixCls = usePrefixCls('chart');

  const [form] = useForm<Values, P>();

  const domRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [data, setRemoteData] = useState<any[]>([]);

  function renderChart(opts: any) {
    if (!domRef.current) return;
    if (chartRef.current) {
      chartRef.current.update(opts);
      return;
    }
    if (!type) return;
    chartRef.current = new DEFAULT_CHART_PLUGINS[type].component(domRef.current, opts);
    chartRef.current.render(domRef.current);

    chartRef.current.off('click');

    // chartRef.current.on('element:click', (e: any) => {
    //   onElementClick?.(e.data.data);
    // });

    chartRef.current.on('click', (e: any) => {
      onElementClick?.(e.data?.data);
    });
  }

  const getOptions = (data?: any): any => {
    if (!type) return {};
    return DEFAULT_CHART_PLUGINS[type].defaultComponentProps({
      data,
      ...(isFunction(options) ? options({ data, values: form.values }) : options),
    });
  };

  function init(params: any) {
    setLoading(true);
    remoteData(params)
      .then((data) => {
        setRemoteData(data);
        renderChart(getOptions(data));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    init({ ...params, ...form.getFieldsValue?.() });
  }, [params]);

  const renderExtra = () => {
    if (!fields?.length) return null;
    return (
      <Form<Values, P>
        layout="inline"
        onValuesChange={(_, values) => {
          init({ ...params, ...values });
        }}
        form={form}
        // @ts-expect-error
        items={[
          {
            container: 'space',
            items: fields.map((field) => ({
              ...field,
              noStyle: true,
              span: null,
            })),
          },
        ]}
      />
    );
  };

  const renderChildren = () => {
    return (
      <Spin spinning={loading}>
        <div
          style={{
            height,
            display: isEmptyData(data) ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Empty description={null} />
        </div>
        <div ref={domRef} style={{ width: '100%', height, display: isEmptyData(data) ? 'none' : 'block' }}></div>
      </Spin>
    );
  };

  return (
    <Card bordered={bordered} {...cardProps} title={title} extra={renderExtra()} className={prefixCls}>
      {renderChildren()}
    </Card>
  );
};
