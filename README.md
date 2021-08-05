# 一个灵活、好用、持续维护的uniapp小程序拓展
## 新增Api提示功能
   - 提供uniapp的api接口提示功能
   - 鼠标悬浮在api上面会提示文档
   - 自动提示api的属性
   - 如果已经使用ts或者其他提示工具,可以在设置里面关闭该功能
  ```
   "uniapp-vscode.jsAutoApi": false,
  "uniapp-vscode.jsAutoCompletion": false,
  "uniapp-vscode.jsHover": false,
  ```
## 优化样式类名提示功能
   - 在``class``或者``xxx-class``后空格,可以自动补全设置中定义的全局样式文件
   - 默认已经定义``src/app.scss 和 src/style``两个地址
   ```
  "uniapp-vscode.globalStyleFiles": [
    "./src/app.scss",
    "./src/style",
  ],
  ```
![功能预览](https://github.com/EvStorM/uniapp-vscode/blob/master/resources/images/demo2.gif?raw=true)
## 组件提示功能
   - 提供uniapp和uviewUi的组件提示功能
   - 鼠标悬浮在标签和属性上面会提示文档
   - 自动填充属性的默认值
   - 输入``<``弹出标签补全
   - 在标签上敲``空格``即可弹出属性提示
   - 在标签上敲``@``弹出能绑定的事件
   - 在标签上敲``:``弹出能绑定的属性值(过滤掉方法)
   - 在标签的属性上输入``空格键``弹出该属性的可选值

## 使用
   建议给vue文件的指定``html``类型,可以排除掉``vetur``的代码提示,专注uniapp小程序编写
   ```vue
   <template lang="html">
   </template>
   ```
## 功能预览

代码片段提供,提供组件定义查询,自动补全属性

![功能预览](https://github.com/EvStorM/uniapp-vscode/blob/master/resources/images/demo.gif?raw=true)


## todo

- 因为查询的文档是爬虫爬取的,会有很多错乱情况.接下来主要修复文档问题

## 致谢

感谢以下开源项目：

- [minapp-vscode](https://github.com/wx-minapp/minapp-vscode)

- [w-extension](https://github.com/masterZSH/w-extension)

- [uview-snippet](https://github.com/xiashui1994/uview-snippet)
