import { Button, Col, Row, Space, notification } from 'antd';
import { sleep } from 'radash';
import React, { useState } from 'react';
import { Chart, DefaultPluginsType } from 'voyagejs';

const Demo = () => {
  const [params, setParams] = useState({ a: 1 });

  return (
    <Space direction="vertical" style={{ background: '#f6f7f9', padding: 20, display: 'flex' }}>
      <Button onClick={() => setParams({ a: params.a + 1 })}>外部参数变化</Button>
      <Row>
        <Col span={12}>
          <Chart<any, DefaultPluginsType>
            title="基础图表"
            params={params}
            type="pie"
            options={{
              angleField: 'value',
              colorField: 'type',
            }}
            fields={[
              {
                name: 'name1',
                initialValue: '1',
                fieldType: 'radio.group',
                fieldProps: {
                  optionType: 'button',
                  options: [
                    { label: '1', value: '1' },
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                  ],
                },
                style: { marginBottom: 0 },
              },
            ]}
            remoteData={async (params) => {
              notification.info({
                message: JSON.stringify(params, null, 2),
              });
              await sleep(2000);
              return Promise.resolve([
                { type: '分类一', value: 27 },
                { type: '分类二', value: 25 },
                { type: '分类三', value: 18 },
                { type: '分类四', value: 15 },
                { type: '分类五', value: 10 },
                { type: '其他', value: 5 },
              ]);
            }}
          />
        </Col>

        <Col span={12}>
          <Chart<any, DefaultPluginsType>
            title="基础图表"
            params={params}
            type="dualAxes"
            options={{
              xField: 'time',
              yField: ['value', 'count'],
              slider: {},
              limitInPlot: false,
              padding: [20, 20, 50, 20],
              meta: {
                time: { sync: false },
              },
              yAxis: [
                {
                  title: {
                    text: '数量',
                    position: 'end',
                    autoRotate: false,
                    spacing: -20,
                    rotation: Math.PI / 2,
                  },
                  label: {
                    formatter: (v: number) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
                  },
                },
                {
                  title: {
                    text: '百分比',
                    position: 'end',
                    spacing: -26,
                    autoRotate: false,
                    rotation: Math.PI / 2,
                  },
                  label: {
                    formatter: (v: number) => `${v}%`,
                  },
                },
              ],
            }}
            remoteData={async (params) => {
              notification.info({
                message: JSON.stringify(params, null, 2),
              });
              await sleep(2000);

              const uvBillData = [
                { time: '2019-03', value: 350, type: 'uv' },
                { time: '2019-04', value: 900, type: 'uv' },
                { time: '2019-05', value: 300, type: 'uv' },
                { time: '2019-06', value: 450, type: 'uv' },
                { time: '2019-07', value: 470, type: 'uv' },
                { time: '2019-03', value: 220, type: 'bill' },
                { time: '2019-04', value: 300, type: 'bill' },
                { time: '2019-05', value: 250, type: 'bill' },
                { time: '2019-06', value: 220, type: 'bill' },
                { time: '2019-07', value: 362, type: 'bill' },
              ];

              const transformData = [
                { time: '2019-03', count: 800 },
                { time: '2019-04', count: 600 },
                { time: '2019-05', count: 400 },
                { time: '2019-06', count: 380 },
                { time: '2019-07', count: 220 },
              ];
              return Promise.resolve([uvBillData, transformData]);
            }}
          />
        </Col>

        <Col span={12}>
          <Chart<any, DefaultPluginsType>
            title="基础图表"
            params={params}
            type="column"
            options={{
              xField: 'year',
              yField: 'value',
              // 堆叠柱状图
              isStack: true,
              // 分组柱状图
              // isGroup: true,
              seriesField: 'type',
            }}
            remoteData={async (params) => {
              notification.info({
                message: JSON.stringify(params, null, 2),
              });
              await sleep(2000);

              const data = [
                {
                  year: '1991',
                  value: 3,
                  type: 'Lon',
                },
                {
                  year: '1992',
                  value: 4,
                  type: 'Lon',
                },
                {
                  year: '1993',
                  value: 3.5,
                  type: 'Lon',
                },
                {
                  year: '1994',
                  value: 5,
                  type: 'Lon',
                },
                {
                  year: '1995',
                  value: 4.9,
                  type: 'Lon',
                },
                {
                  year: '1996',
                  value: 6,
                  type: 'Lon',
                },
                {
                  year: '1997',
                  value: 7,
                  type: 'Lon',
                },
                {
                  year: '1998',
                  value: 9,
                  type: 'Lon',
                },
                {
                  year: '1999',
                  value: 13,
                  type: 'Lon',
                },
                {
                  year: '1991',
                  value: 3,
                  type: 'Bor',
                },
                {
                  year: '1992',
                  value: 4,
                  type: 'Bor',
                },
                {
                  year: '1993',
                  value: 3.5,
                  type: 'Bor',
                },
                {
                  year: '1994',
                  value: 5,
                  type: 'Bor',
                },
                {
                  year: '1995',
                  value: 4.9,
                  type: 'Bor',
                },
                {
                  year: '1996',
                  value: 6,
                  type: 'Bor',
                },
                {
                  year: '1997',
                  value: 7,
                  type: 'Bor',
                },
                {
                  year: '1998',
                  value: 9,
                  type: 'Bor',
                },
                {
                  year: '1999',
                  value: 13,
                  type: 'Bor',
                },
              ];

              return data;
            }}
          />
        </Col>

        <Col span={12}>
          <Chart<any, DefaultPluginsType>
            title="基础图表"
            params={params}
            type="bidirectionalBar"
            options={{
              interactions: [{ type: 'active-region' }],
              yField: ['2016年耕地总面积', '2016年转基因种植面积'],
              tooltip: {
                shared: true,
                showMarkers: false,
              },
              xField: 'country',
            }}
            remoteData={async (params) => {
              notification.info({
                message: JSON.stringify(params, null, 2),
              });
              await sleep(2000);

              const data = [
                { country: '乌拉圭', '2016年耕地总面积': 13.4, '2016年转基因种植面积': 12.3 },
                { country: '巴拉圭', '2016年耕地总面积': 14.4, '2016年转基因种植面积': 6.3 },
                { country: '南非', '2016年耕地总面积': 18.4, '2016年转基因种植面积': 8.3 },
                { country: '巴基斯坦', '2016年耕地总面积': 34.4, '2016年转基因种植面积': 13.8 },
                { country: '阿根廷', '2016年耕地总面积': 44.4, '2016年转基因种植面积': 19.5 },
                { country: '巴西', '2016年耕地总面积': 24.4, '2016年转基因种植面积': 18.8 },
                { country: '加拿大', '2016年耕地总面积': 54.4, '2016年转基因种植面积': 24.7 },
                { country: '中国', '2016年耕地总面积': 104.4, '2016年转基因种植面积': 5.3 },
                { country: '美国', '2016年耕地总面积': 165.2, '2016年转基因种植面积': 72.9 },
              ];

              return data;
            }}
          />
        </Col>
      </Row>
    </Space>
  );
};

export default Demo;
