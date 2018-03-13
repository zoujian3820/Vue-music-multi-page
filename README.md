# Vue-music-multi-page
这个demo是用vue-cli来做修改开发的多页面音乐webApp项目

##### 项目构建基本流程

> 全局安装vue-cli，并创建基于webpack的vue-cli项目
```
> cnpm install --g vue-cli
> vue init webpack my-project
> cd my-project
> cnpm install
> npm run dev
```

>> 安装其他一些项目开发需要的依赖库
###### 安装的生产环境依赖库 --save
```
> cnpm install babel-runtime --save
> cnpm install fastclick --save     //main.js引入 fastclick.attach(document.body)
> cnpm install vuex --save
> cnpm install jsonp --save
> cnpm install better-scroll --save
> cnpm install axios --save
> cnpm install vue-lazyload --save
> cnpm install create-keyframe-animation --save
> cnpm install js-base64 --save
> cnpm install lyric-parser --save
```

###### 安装的开发环境依赖库 -dev
```
> cnpm install stylus --save-dev
> cnpm install stylus-loader --save-dev
> cnpm install babel-polyfill --save-dev   //main.js引入 import 'babel-polyfill'
> cnpm install express --save-dev
```


```
> 内容均为上线的真实数据，调用的QQ音乐数据接口
```

> 多页面音乐webApp项目


``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

修改单页应用为多页应用  >>> <br>

npm install glob
var glob = require('glob');

utils.js文件修改如下：
```
在文件底部添加导出 getEntries方法
exports.getEntries = function (globPath) {
  var entries = {}
  /**
   * 读取src目录,并进行路径裁剪
   */
  glob.sync(globPath).forEach(function (entry) {
    /**
     * path.basename 提取出用 ‘/' 隔开的path的最后一部分，除第一个参数外其余是需要过滤的字符串
     * path.extname 获取文件后缀
     */
    // var basename = path.basename(entry, path.extname(entry), 'router.js') // 过滤router.js
    // ***************begin***************
    // 当然， 你也可以加上模块名称, 即输出如下： { module/main: './src/module/index/main.js', module/test: './src/module/test/test.js' }
    // 最终编译输出的文件也在module目录下， 访问路径需要时 localhost:8080/module/index.html
    // slice 从已有的数组中返回选定的元素, -3 倒序选择，即选择最后三个
    var tmp = entry.split('/').splice(-3)
    var moduleName = tmp.slice(1, 2);
    // ***************end***************
    entries[moduleName] = entry
  });
  // console.log(entries);
  // 获取的主入口如下： { main: './src/module/index/main.js', test: './src/module/test/test.js' }
  return entries;
}
```


其次，对webpack.base.conf.js进行改造
```
	删除 ~~entry: {app: './src/main.js'},~~，取而代之如下：

	javascript
	module.exports = {
		···
		 entry: utils.getEntries('./src/page/**/*.js'),
	  ···
	}
```

 最后改造webpack.dev.conf.js和webpack.prod.conf.js
 注释原来的HtmlWebpackPlugin
```
  var pages = utils.getEntries('./src/page/**/*.html')
for(var page in pages) {
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: page + '.html',
    template: pages[page], //模板路径
    inject: true,
    // excludeChunks 允许跳过某些chunks, 而chunks告诉插件要引用entry里面的哪几个入口
    // 如何更好的理解这块呢？举个例子：比如本demo中包含两个模块（index和about），最好的当然是各个模块引入自己所需的js，
    // 而不是每个页面都引入所有的js，你可以把下面这个excludeChunks去掉，然后npm run build，然后看编译出来的index.html和about.html就知道了
    // filter：将数据过滤，然后返回符合要求的数据，Object.keys是获取JSON对象中的每个key
    excludeChunks: Object.keys(pages).filter(item => {
      return (item != page)
    })
  }
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  module.exports.plugins.push(new HtmlWebpackPlugin(conf))
  ```

