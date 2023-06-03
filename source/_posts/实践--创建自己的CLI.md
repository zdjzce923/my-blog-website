---
title: 实践--创建自己的 CLI
date: 2023-05-27 12:44:20
tags:
  - JavaScript
  - CLI
  - 实践
categories:
  - [实践]
---

所谓项目模板，必然是一个可以作为标杆的项目，我们可以从日常用到的经典项目看出，一个成熟的项目必然支持本地启动打包、支持热更新、支持预发规则和代码风格检查，支持比较流行的语言框架（比如 less，scss 等），更完善点还会支持单元测试。

前端脚手架架构图：
![avatar]('https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/24/1710d1748ce55aeb~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp')

### 了解如何发布 npm 包

首先需要有个 npm 账号。进入项目：
1. 初始化。执行 npm init 将其初始化为 npm 包，生成 package.json 文件。
2. 登录。 npm login
3. 发布。 npm publish
  
发布的过程中需要注意源，用的哪个源就推到哪个源:
`nrm ls`

### 准备脚手架项目

#### 1. 初始化项目
```bash
mkdir test-cli && cd test-cli
npm init // 初始化项目
```

2. 修改 package.json
```json
{
  "name": "text-cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "compile": "babel src -d dist",
    "watch": "npm run compile -- --watch"
  },
  "bin": {
    "text-cli": "./dist/index.js"
  },
  "author": "zdj",
  "license": "ISC"
}

```

可以看到 package.json 中的 **bin** 参数中添加了命令，这个命令存放着用户的自定义命令。**比如我们使用 npm 全局安装了包，其实 npm 帮我们为 bin 配置的文件创建一个全局软连接，所以在命令行就可以直接执行**。scripts 指定可执行命令，实时编译脚本，让 node 能够识别执行。

接着新建 `.babelrc` 配置文件，支持 ES6 预发转译，并且安装搭建脚手架需要的依赖：
- babel-cli/babel-env：语法转换工具
- commander：命令行工具，有了它我们就可以读取命令行命令，知道用户想要做什么了
- inquirer： 交互式命令行工具，给用户提供一个漂亮的界面和提出问题流的方式
- download-git-repo：下载远程模板工具，负责下载远程仓库的模板项目
- chalk：颜色插件，用来修改命令行输出样式，通过颜色区分 info、error 日志，清晰直观
- ora：用于显示加载中的效果，类似于前端页面的 loading 效果，像下载模板这种耗时的操作，有了 - loading 效果可以提示用户正在进行中，请耐心等待
- log-symbols：日志彩色符号，用来显示√ 或 × 等的图标


完整的目录结构：
![avatar]('https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/24/1710d174c0923990~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp')

使用 npm link 即可将 bin 下的命令软连接到全局直接使用。

#### 2. 项目启动
可执行文件的行首一定要加入 `#!/usr/bin/env node` 这行代码可以告诉系统该脚本由 node 来执行。
`bin/cmd`

在 src/main.js 中添加测试代码
```js
console.log('hello world')
```
接着运行 npm run watch 这样修改代码就可以实时更新了。

#### 3. 处理命令行
command 方法设置命令的名字、description 方法是设置命令的描述、alias 方法设置命令简称、options 设置命令需要的参数。commander 更详细的文档可以去 commander.js 官网查看。

#### 4. 代码编写

遇到的问题：在阅读文章时添加了相关的依赖，但有个问题是，文章里的依赖是 babel/cli 和 babel/preset-env。在编译的过程中是会出问题的，因为一些依赖的版本很高，是 ESM 模块，但打包后用的是 CJS，两边并不兼容。。。所以要升级成 @babel/cli 和 @babel/preset-env 并且配置下默认为 ESM

创建 create.js 读取 promptList.json 中的配置让用户选择。