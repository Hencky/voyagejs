---
group: 表单
order: 4
---

# useForm

```jsx | pure
import { Form } from 'voyagejs';

const { useForm } = Form;

const [form] = useForm({ plugins: {} });
```

### APi

### useForm

| 名称      | 类型        | 描述     |
| --------- | ----------- | -------- |
| `plugins` | PluginsType | 插件类型 |

插件类型

```typescript
export type PluginsType = {
  container: PluginType;
  field: PluginType;
  action: PluginType;
  cell: PluginType;
};

export type PluginType = {
  [key: string]: {
    component: React.ComponentType<any> | any;
    defaultComponentProps?: any;
    defaultFormItemProps?: any;
    defaultFilterProps?: (ctx?: any) => any;
  };
};
```

### form

> `form`也就是`formStore`

#### 属性

| 属性名称 | 类型 | 描述                                                                                     |
| -------- | ---- | ---------------------------------------------------------------------------------------- |
| `values` | any  | 通过`form.values`直接获取表单值。<br> 也可以通过`form.values = newValue`方式设置表单值。 |

也可以获得所有共有属性值；或通过`form.propName = propValue`方式更新值并触发表单更新。
<embed src="./_base.md"></embed>

#### 方法

`form`拥有 [antd FormInstance](https://4x.ant.design/components/form-cn/#FormInstance) 的全部方法，并扩展了一下方法：

| 方法名称   | 类型                            | 描述                           |
| ---------- | ------------------------------- | ------------------------------ |
| `refresh`  | () => void                      | 重新请求远程表单值，刷新表单。 |
| `getField` | (name: string) => FieldInstance | 获取表单项实例                 |
