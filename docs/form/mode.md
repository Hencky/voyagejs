---
group: 表单
order: 5
demo:
  cols: 2
---

# 表单状态

支持 5 种表单状态:

编辑、预览、禁用、隐藏、不渲染

`import  { FieldMode } from 'voyagejs';`

<code src="./form-mode.tsx" >控制整个表单状态</code>
<code src="./mode-group.tsx" >控制表单组状态</code>
<code src="./mode-item.tsx" >控制表单项状态</code>

表单状态支持在`Form`、`Form.Group`、`Form.Item`、`Form.List`属性上配置，表单控件生效状态为最靠近该控件`Form.Item`层级上的配置

| 表单状态             | 描述                                                                                                                                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FieldMode.EDIT`     | 控件输入形态，**默认状态**                                                                                                                                                                                      |
| `FieldMode.VIEW`     | 预览模式`Form.Item`会传递`readOnly`属性给表单控件；<br> 定义开发的表单控件中，根据这一属性，适配`Form`预览模式; <br>预览模式下，`Form.Item`的`viewFieldType`属性会优先于`fieldType`、`children`属性渲染表单控件 |
| `FieldMode.DISABLED` | 禁用模式下，`Form.Item`会传递`disabled`属性给表单控件                                                                                                                                                           |
| `FieldMode.HIDDEN`   | 隐藏表单项、表单组、表单列表，隐藏的表单控件依旧会被表单校验                                                                                                                                                    |
| `FieldMode.NONE`     | 不渲染表单项、表单组、表单列表的 DOM 结构                                                                                                                                                                       |

## 另一种方式控制

| 属性       | 描述                                                        |
| ---------- | ----------------------------------------------------------- |
| `hidden`   | 隐藏表单，同`mode`设置为`FieldMode.HIDDEN`                  |
| `readOnly` | 只读，同`mode`设置为`FieldMode.VIEW`                        |
| `disabled` | 禁用表单，同`mode`设置为`FieldMode.DISABLED`                |
| `render`   | 设置为`false`,不渲染表单项， 同`mode`设置为`FieldMode.NONE` |

<code src="./mode-simple-item.tsx" >表单项状态</code>
<code src="./mode-simple-group.tsx" >表单组状态</code>

## FAQ

TODO:
