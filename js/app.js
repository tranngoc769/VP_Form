$(document).ready(function () {
    // logout-btn

    // Kiểm tra xem đã có JWT token hợp lệ trong localStorage chưa
    var jwtToken = localStorage.getItem('jwt_token');
    if (jwtToken == null || jwtToken == undefined || jwtToken == '') {
        // delete local storage
        localStorage.removeItem('jwt_token');
        // Nếu có token, chuyển hướng đến trang chủ
        window.location.href = '/login.html';
        return;
    }
    function getProfile() {
        var settings = {
            "url": "https://core.vuongphatvpn.vn/api/auth/profile",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "Bearer " + jwtToken,
            },
        };
        return $.ajax(settings)
    }
    function getShop() {

        var st = {
            "url": "https://core.vuongphatvpn.vn/api/shop/detail",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "Bearer " + jwtToken,
            },
        };

        return $.ajax(st)
    }

    function getFund(username) {
        var st = {
            "url": "https://core.vuongphatvpn.vn/api/manager/payment/list?is_self=2&limit=15&page=1&type=fund_shop&username="+username,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": "Bearer " + jwtToken,
            },
        };

        return $.ajax(st)
    }
    $('#logout-btn').click(function (event) {
        event.preventDefault();
        // delete local storage
        localStorage.removeItem('jwt_token');
        // Nếu có token, chuyển hướng đến trang chủ
        window.location.href = '/login.html';
    });
    $('#data-form').submit(function (event) {
        event.preventDefault();

        var usdt = $('#usdt').val();
        var vpn = $('#vpn').val();
        // let alert string
        let alertString = "";
        // check usdt
        alertString = `USDT: ${usdt} \n`;
        alertString += `VPN: ${vpn} \n`;
        alert(alertString);
        // Hiển thị thông báo thành công
    });
    getProfile().done(function (response) {
        try {
            response = JSON.parse(response);
        } catch (error) {

        }
        if (response.success != true) {
            alert('Xác thực thất bại');
            return;
        }
        var username = response.data.username; 
        console.log('username', username);
        let usdt = 0;
        let vpn = 0;
        let user_coin = response.data.user_coin;
        for (let i = 0; i < user_coin.length; i++) {
            if (user_coin[i].symbol == "usdt") {
                usdt = user_coin[i].amount * 1;
            }
            if (user_coin[i].symbol == "vpn") {
                vpn = user_coin[i].amount * 1;
            }
        }
        $('#usdt').val(usdt);
        $('#vpn').val(vpn);
        // get level shop
        getShop().done(function (response) {
            try {
                response = JSON.parse(response);
            } catch (error) {

            }
            if (response.success != true) {
                alert('Lấy thông tin shop thất bại');
                console.log(response);
                return;
            }
            let responseData = response.data;
            let count = 0;
            let row = $('<div>').addClass('row');

            for (var key in responseData) {
                if (responseData.hasOwnProperty(key)) {
                    var label = $('<label>').attr('for', key).text(key + ':');
                    var value = $('<input>').attr({
                        type: 'text',
                        readonly: true,
                        disabled: true,
                        class: 'form-control',
                        id: key,
                        name: key,
                        value: responseData[key]
                    });

                    var formGroup = $('<div>').addClass('form-group col-6').append(label, value);

                    row.append(formGroup);
                    count++;

                    if (count === 2) {
                        $('#shop-form').append(row);
                        row = $('<div>').addClass('row');
                        count = 0;
                    }
                }
            }

            if (count > 0) {
                $('#shop-form').append(row);
            }
        });
        getFund(username).done(function (response) {
            try {
                response = JSON.parse(response);
            } catch (error) {

            }
            if (response.success != true) {
                alert('Lấy thông tin shop thất bại');
                console.log(response);
                return;
            }
            let responseData = response.data;
            let totalAmount = 0;
            for (let i = 0; i < responseData.data.length; i++) {
                let item = responseData.data[i];
                totalAmount += item.amount * 1;
            }
            $('#fund').val(totalAmount);
        });
        
    });

}); 