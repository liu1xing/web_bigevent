$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + 'm' + '-' + d + '' + hh + ':' + mm + ':' + ss


    }
    //定义补0函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    //定义一个查询的参数对象,将来请求数据的时候,需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,//页码值,默认请求第一页的数据
        pagesize: 2,//每页显示几条数据,默认2条
        cate_id: '',//文章分类的 id
        state: '',//文章的发布状态
    }
    initTable()
    initCate()

    //获取文章列表
    function initTable() {

        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                //使用模板引擎渲染数据
                //console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)

            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                //调用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                //通过layui重新渲染所有列表的ui结构
                form.render();
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数对象q中对应属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新筛选条件重新渲染表格数据
        initTable()

    })


    //定义渲染分页的方法
    function renderPage(total) {
        //console.log(total);
        laypage.render({
            elem: 'pageBox',    //注意，这里的 test1 是 ID，不用加 # 号
            count: total,  //数据总数，从服务端得到
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换的时候触发jump回调
            //触发jump回调有两种方式
            //1 点击切换页码触发
            //2 只要调用laypage.render()就会触发,会陷入死循环
            jump: function (obj, first) {
                //可以通过first的值来判断通过哪种方式触发的jump
                //first值为true证明是方式2触发,否则就是方式1触发的

                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                q.pagenum = obj.curr;

                //把最新的条目数赋值到q这个查询对象的pagesize属性中
                q.pagesize = obj.limit
                //根据最新的q获取对应的数据列表，并渲染表格
                //initTable()
                // console.log(first);
                if (!first) {
                    initTable()
                }
            }
        })

        //通过代理形式,为删除按钮绑定点击事件处理函数
        $('tbody').on('click', '.btn-delete', function () {
            var len = $('.btn-delete').length;

            //获取文章的id
            var id = $(this).attr('data-id')
            //询问用户是否要删除
            layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
                //do something
                $.ajax({
                    method: 'DELETE',
                    url: '/my/article/info' + "?id=" + id,
                    success: function (res) {
                        layer.msg('删除文章成功!')
                        //当数据删除完成后需要判断当前页是否还有剩余数据,没有数据后则让页码值-1在调用initTable()方法
                        if (len === 1) {
                            //如果len的值为1证明删完之后页面就没有任何数据了
                            //页码值最小是1
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                        }
                        initTable()

                    }
                })
                layer.close(index);
            });
        })
    }



})