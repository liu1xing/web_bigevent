$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6之间'
            }
        }

    })

    initUserInfo()

    //初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                //console.log(res);
                //调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }

        })
    }

    //重置表单数据
    $('#btnReset').on('click', function (e) {
        //阻止表单的默认重置行为
        e.preventDefault();
        //调用初始化函数
        initUserInfo()


    })


    //监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: 'PUT',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {

                layer.msg('更新用户信息成功')
                //调用父页面的方法，从新渲染用户头像和信息
                window.parent.getUserInfo()
            }
        })
    })

})