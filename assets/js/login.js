$(function () {
    //点击注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();

    })

    //点击登录账号的链接
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();

    })

    //从layui获取form对象
    var form = layui.form
    var layer = layui.layer;
    //通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            //通过形参拿回的是确认密码框的内容,还需要拿到密码框的内容，进行判断二者是否相等，不相等返回一个提示消息
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }

    })

    // 为注册的表单绑定 submit 事件
    $('.reg-box form').on('submit', function (e) {
        // 1. 阻止表单的默认提交
        e.preventDefault()

        // 2. 发送 Ajax 请求
        $.ajax({
            type: 'POST',
            url: '/api/reg',
            data: $(this).serialize(),
            success: function (res) {
                // 注册成功!
                layer.msg('注册成功,请登录!')
                // 模拟"去登录"的点击行为
                $('#link-login').click()
            }
        })
    })

    // 为登录表单绑定 submit 事件
    $('.login-box form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起 Ajax 的登录请求
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // 登录成功
                layer.msg('登录成功!')
                // 把得到的 token 的值,存储到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到 index.html 页面
                location.href = 'index.html'
            }
        })
    })

})