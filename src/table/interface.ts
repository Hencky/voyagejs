import { TooltipProps } from 'antd';
import type { ColumnType as AColumnType, TableProps as ATableProps } from 'antd/lib/table';
import type {
  FilterDropdownProps as AFilterDropdownProps,
  SorterResult,
  TableRowSelection,
} from 'antd/lib/table/interface';
import type { ReactElement } from 'react';
import type { ModalFormInstance } from '../form';
import type { PluginPropsType, PluginsType } from '../plugins';

/**
 * 额外的初始请求参数，注意：参数变化时，表格不会刷新
 * @default {}
 */
export type ExtraRequestParams = Record<string, unknown>;

/**
 * 排序配置
 */
export type SorterParams<RecordType = any> = SorterResult<RecordType> | SorterResult<RecordType>[];

/**
 * 过滤配置
 */
export type FilterParams = Record<string, unknown>;

/**
 * 分页配置
 */
export type Pagination = {
  /** 当前页 */
  current?: number;
  /** 分页大小 */
  pageSize?: number;
  /** 总条数 */
  total: number;
};

export type BaseRequestParams = Pick<Pagination, 'current' | 'pageSize'>;

export type RequestParams<RecordType = any> = BaseRequestParams &
  ExtraRequestParams &
  FilterParams & {
    sorter?: SorterParams<RecordType>;
  };

export type RequestResult<RecordType = any> = {
  /** 数据源 **/
  data: RecordType[];
  /** 当前页 **/
  current: number;
  /** 数据总条数 **/
  total: number;
  /** 分页大小 **/
  pageSize: number;
};

export type ColumnType<RecordType, P extends PluginsType = PluginsType> = (
  | {
      render?:
        | ((ctx: {
            value: RecordType;
            index: number;
            table: any;
            record: RecordType;
            modal: ModalFormInstance<any, PluginsType>;
          }) => ReactElement)
        | string;
    }
  | {
      [PN in keyof P['cell']]: {
        render?: PN;
        /** TODO: 透传给插件的参数 */
        renderProps?: any;
      };
    }[keyof P['cell']]
) & {
  key?: string;
  /** 列显示状态，为false时隐藏列 */
  visible?: boolean;
  children?: ColumnType<RecordType>[];
  tooltip?: string | TooltipProps;
  required?: boolean;
  /** TODO: 数据源，透传筛选框和render插件 */
  options?: { label: string; value: string }[];
} & {
    [PN in keyof P['field']]: {
      filterFieldType?: PN | ((ctx: AFilterDropdownProps) => React.ReactNode);
      filterFieldProps?: PluginPropsType<P, 'field', PN extends string ? PN : never>;
    } & Omit<AColumnType<RecordType>, 'render' | 'key'>;
  }[keyof P['field']];

export interface TableProps<RecordType = any, P extends PluginsType = PluginsType>
  extends Omit<ATableProps<RecordType>, 'loading' | 'rowSelection' | 'columns'> {
  /** 远程数据源 */
  remoteDataSource?: (params: RequestParams) => Promise<RequestResult<RecordType>>;
  /** 选中行配置 */
  rowSelection?: true | TableRowSelection<RecordType>;
  /** 初始是否发起一次请求，默认发起请求 */
  requestOnMount?: boolean;
  /** 列配置 */
  columns?: ColumnType<RecordType, P>[];
  /** 初始化请求参数 */
  initialParams?: any;
  /** 初始化筛选参数 */
  initialFilters?: FilterParams;
}
