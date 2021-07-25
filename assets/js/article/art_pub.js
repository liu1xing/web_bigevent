$(function () {
    var layer = layui.layer
    var form = layui.form

    initCate()
    // 初始化富文本编辑器
    initEditor()
    //定义加载文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                //调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //一定要调用form的render()方法
                form.render()

            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //监听coverfile的change事件
    $('#coverFile').on('change', function (e) {
        // 1. 拿到用户选择的文件
        var files = e.target.files
        //判读用户是否选择文件
        if (files.length === 0) {
            return
        }
        //2.根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])

        //3.先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    //定义文章的发布状态
    var art_state = '已发布'
    //为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = "草稿"
    })

    //为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        //阻止表单默认行为
        e.preventDefault();

        //基于form表单创建一个FormData对象
        var fd = new FormData($(this)[0])
        //将文章的发布状态追击到FormData对象中
        fd.append('state', art_state);
        /* fd.forEach(function (v, k) {
            console.log(k, v);
        }) */
        //4将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //5 将文件对象存储到fd中
                fd.append('cover_img', blob)
                //6 发起ajax数据请求
                publishArticle(fd)
            })

    })


    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //如果向服务器提交的是formData格式的数据
            //必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                layer.msg('发布文章成功')
                //发布文章成功后跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }


})