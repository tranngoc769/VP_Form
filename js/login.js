$(document).ready(function () {
    console.log('app.js loaded!');
    // Kiểm tra xem đã có JWT token hợp lệ trong localStorage chưa
    var jwtToken = localStorage.getItem('jwt_token');
    if (jwtToken) {
        // Nếu có token, chuyển hướng đến trang chủ
        window.location.href = '/index.html';
    }
    $('#login-form').submit(function (event) {
        event.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        var form = new FormData();
        form.append("username", username);
        form.append("password", password);
        var settings = {
            "url": "https://core.vuongphatvpn.vn/api/auth/login",
            "method": "POST",
            "timeout": 0,
            "headers": {
            },
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };
        $.ajax(settings).done(function (response) {
            try {
                response = JSON.parse(response);
            } catch (error) {
            }
            if (response.success != true) {
                alert('Đăng nhập thất bại');
                return;
            }
            let token = response.data.token;
            console.log(token);
            // set local storage
            localStorage.setItem('jwt_token', token);
            // redirect
            window.location.href = '/index.html';
        }).fail(function (xhr, textStatus, error) {
            console.log(xhr.responseText);
            alert('Đăng nhập thất bại!');
        });
    });
}); 