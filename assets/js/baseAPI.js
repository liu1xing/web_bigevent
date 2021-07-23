$.ajaxPrefilter(function (options) {
    // 统一设置请求根路径
    if (options.url.indexOf('http') === -1) {
        // options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        // options.url = 'http://www.liulongbin.top:3007' + options.url
        options.url = 'http://www.liulongbin.top:3008' + options.url
    }

    // 统一设置有权限接口的 headers 请求头
    const tokenStr = localStorage.getItem('token')
    if (options.url.indexOf('/my/') !== -1 && tokenStr) {
        options.headers = {
            Authorization: tokenStr
        }
    }

    // 监听请求失败时的回调函数
    options.error = function (err) {
        if (err && err.responseJSON && err.responseJSON.message) {
            layer.msg(err.responseJSON.message)
        }
    }

    // 监听请求完成时的回调函数
    options.complete = function (res) {
        if (res && res.status === 401) {
            // 身份认证失败
            // 清空本地存储 & 强制用户跳转到登录页
            localStorage.clear()

            // 每当身份认知失败时，获取到父窗口的 window 对象
            let win = window.parent ? window.parent : window
            // 调用父窗口的 window 对象，强制用户跳转到登录页
            win.location.href = '/login.html'
        }
    }
})