---
title: 表单项
order: 2
nav:
  title: 表单
  order: 1
  second:
    title: Form.Item
    order: 2
---

# Form.Item

## 实例 getField

1. 通过 `form.getField(namePath)` 获取 Form.Item 实例`field`操作 Form.Item
2. 可以通过`field.propName = propValue`方式更改属性

<code src="./instance.tsx" ></code>

## 数据源 options

1. 支持`options`属性和`remoteOptions`方法透传数据源给表单控件，以及`optionsPropName`更改子节点数据源的属性
2. 依赖字段`dependencies`变化时，会触发`remoteOptions`请求，在`remoteOptions`方法的参数中，可以拿到依赖字段的值

<code src="./options.tsx" ></code>

## 插件模式

1. 支持`component="pluginName"`使用插件，`componentProps`透传插件属性

<code src="./pluginsdemo.tsx" ></code>

## 其他

<code src="./empty.tsx" debug >空 Item 标记</code>
<code src="./destroy.tsx" debug >销毁</code>
<code src="./propchange.tsx" >属性变化</code>
