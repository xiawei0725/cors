# nodejs 原生实现跨域及文件上传

日常开发，跨域是普遍存在的一个问题。但是绝大多数的程序员在遇到这类问题的时候并不明原理，上来就是百度一下然后完事。

## 跨域

- 为什么会有跨域
  说到跨域，就必须要说说浏览器的同源策略了，浏览器出于安全考虑不允许不符合同源策略规则的行为发生。所谓同源策略即：

  1、协议相同

  2、域名相同

  3、端口相同

  三者缺一即非同源。非同源情况下 浏览器主要做了如下限制：

  1、无法读取 cookie

  2、默认无法发送 ajax

  这也是本文正要解决的问题。

- 手把手解决跨域
  - 搭建跨域环境

    为了模拟跨域我用`node`搭建了一个跨域的环境。代码仓库在这里。
    github地址：

    这里先说明一下`jsonp`

  - JSONP

  jsonp实际上利用了`script`标签的能够引入其他域名上的一个地址来实现的。其基本原理就是需要服务的返回一端函数执行的代码，并将需要通信的数据作为参数给到函数

  1、服务端代码

  ```javascript
    res.end(`
        jsonp({ name: 'jsonp' })
    `)
  ```

  2、客户端代码

  ```javascript

    <script>
        function jsonp(data) {
            document.querySelector(".content-server").innerHTML = JSON.stringify(data) ;
        }
    </script>
    <script src="http://localhost:3000/jsonp?callback=jsonp"></script>
  ```

- CORS
    标准的跨域解决方案,解决的第一步就是需要服务端告诉浏览器我允许我认可的域名进行跨域通信；
    
    - 简单请求

    ```javascript
    res.setHeader("Access-Control-Allow-Origin", "客户端域名或者*")
    ```
    
    这种情况只使用于相当简单的跨域请求，一般来说其标准是：

    method必须是：
    GET  、 POST 、 HEAD 

    允许人为设置的header信息也有限制。其中我们一般会设置`Content-Type`,其值必须是：

    text/plain、
    multipart/form-data、
    application/x-www-form-urlencoded

    - 复杂请求

    通常前后端分离的项目，一般来说会采用`json`的形式进行数据通信：
    一般会将 `Content-Type`设置称为`application/json`,另外有时候经常会这`header`里面携带一些`cookie`或者安全凭证`token`等。并且通常来说在`restfull api`规范里面我们可能需要用到除`get`或`post`之外的一些`method`(例如 `PUT`)这中情况下一般服务端需要做如下配置：

    ```javascript
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,DELETE")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,token")
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    ```
    对于`cookie`如果客户端想要把其在传输过程中携带过来也需要做一些配置：

    通常是这样：
    ```js
    withCredentials = true
    ```

    我用的axios,所以我的配置是：
    ```js
    axios.defaults.withCredentials = true;
    ```
    
    跨域相关的东西基本上有这些就能满足日常开发了，实际上还会有一些`iframe`的项目，我这里就不做模拟了。

## 文件上传

    文件上传既可以通过form表单上传也可以通过formdata上传。

- 服务端代码

```javascript

if (url === '/upload_form' && method === 'POST') {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        // todo 保存
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ fields, files }, null, 2));
    });
    return;
}


```
- 客户端代码
```html
<section id="form_upload">
  <h3>文件上传 表单提交</h3>
  <form
    action="http://localhost:3000/upload_form"
    method="POST"
    enctype="multipart/form-data"
  >
    <input type="text" name="username" placeholder="请输入用户名" />
    <input type="file" name="file" id="file" />
    <button type="submit">submit</button>
  </form>


  <h3>文件上传 formdata提交</h3>
  <form onsubmit="return false"
  >
    <input type="text" class="form_uname" placeholder="请输入用户名" />
    <input type="file" class="form_file" name="file"  />
    <button type="button" id="submit_btn">submit</button>
  </form>
</section>
```
- js 部分
```javascript
  var formdataBtn = document.getElementById('submit_btn');
  formdataBtn.addEventListener('click',function(){
    var formdata = new FormData();
    var uname = document.querySelector('.form_uname')
    var file = document.querySelector('.form_file')
    formdata.append('uname',uname.value);
    formdata.append('file',file.files[0]);
    console.log(file.files[0]);
    axios.post('/upload_form',formdata).then(res=>{
      console.log(res);
    }).catch(err=>{
      console.log(err);
    })
  })
```
    
## 参考
[跨源资源共享（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)

[CORS通信](https://javascript.ruanyifeng.com/bom/cors.html)