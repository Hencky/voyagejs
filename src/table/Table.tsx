import { useDeepCompareEffect, useUpdate } from 'ahooks';
import { Table as ATable } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { Fragment, forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import type { ModalFormInstance } from '../form';
import { useModalForm } from '../form';
import type { PluginsType } from '../plugins';
import { renderColumns } from './columns';
import type { TableProps } from './interface';
import { TableStore } from './store';

export type TableInstance<RecordType extends object = any, Values = any, P extends PluginsType = PluginsType> = {
  table: TableStore<RecordType>;
  modal: ModalFormInstance<Values, P>;
};

const ITable = <RecordType extends object, P extends PluginsType = PluginsType>(
  props: TableProps<RecordType, P>,
  ref: React.Ref<TableInstance<RecordType, P>>,
) => {
  const forceUpdate = useUpdate();

  // @ts-expect-error
  const table = useMemo(() => new TableStore<RecordType>(props, forceUpdate), []);

  const { rowSelection, requestOnMount, pagination, ...restProps } = props;

  const [modalForm, modalCtx] = useModalForm<P>();

  const { columns } = props;

  useEffect(() => {
    if (requestOnMount === false) return;
    table.refresh();
  }, [requestOnMount]);

  useImperativeHandle(
    ref,
    () => ({
      table,
      modal: modalCtx,
    }),
    [table, modalCtx],
  );

  useDeepCompareEffect(() => {
    // @ts-expect-error
    table.updateProps(props);
  }, [props]);

  // @ts-expect-error
  const finalColumns = renderColumns<RecordType, P>(columns!, { initialFilters: props.initialFilters }, () => ({
    table,
    modal: modalCtx,
  }));

  return (
    <Fragment>
      {modalForm}
      <ATable<RecordType>
        rowKey={'id'}
        bordered={false}
        {...restProps}
        {...toJS(table.tableProps)}
        onChange={table.onTableChange}
        columns={finalColumns}
      />
    </Fragment>
  );
};

export const Table = observer(forwardRef(ITable)) as typeof ITable;
