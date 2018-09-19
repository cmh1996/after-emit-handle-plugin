# after-emit-handle-plugin

一个打包完成后，生成文件信息json，并把打包后的文件发布到指定位置的plugin

# 开始

1. 安装plugin

```console
$ npm install after-emit-handle-plugin --save-dev
```

2. 在webpack.config.js写入
```
const AfterEmitHandlePlugin = require('after-emit-handle-plugin'); 
plugins:[
        new AfterEmitHandlePlugin({
            //生成的json文件的位置
            jsonPath: path.resolve(__dirname,"./dist","info.json"), 
            //传输文件的目标地址
            url:'https://www.xxx.com'   
        })
    ]
```
