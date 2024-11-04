import { Table as ATable } from 'antd';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { Fragment, forwardRef, useImperativeHandle, useMemo } from 'react';
import type { ModalFormInstance } from '../form';
import { useModalForm } from '../form';
import type { PluginsType } from '../plugins';
import type { TableProps } from './interface';
import { TableStore } from './store';
import { renderColumns } from './utils';

export type TableInstance<RecordType = any, Values = any, P extends PluginsType = PluginsType> = {
  table: TableStore;
  modal: ModalFormInstance;
};

const ITable = <RecordType extends object, P extends PluginsType = PluginsType>(
  props: TableProps<RecordType, P>,
  ref: React.Ref<TableInstance<RecordType, P>>,
) => {
  // @ts-expect-error
  const table = useMemo(() => new TableStore<RecordType>(props), [props]);

  const [modalForm, modalCtx] = useModalForm();

  const { columns } = props;

  useImperativeHandle(
    ref,
    () => ({
      table,
      modal: modalCtx,
    }),
    [table, modalCtx],
  );

  return (
    <Fragment>
      {modalForm}
      <ATable<RecordType>
        rowKey={'id'}
        bordered={false}
        onChange={table.onTableChange}
        {...toJS(table.tableProps)}
        // @ts-expect-error
        columns={renderColumns<RecordType>(columns!, { table, modal: modalCtx })}
      />
    </Fragment>
  );
};

export const Table = observer(forwardRef(ITable)) as typeof ITable;
