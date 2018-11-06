
function userLogin() {
    wx.checkSession({
        success: function() {
            console.log("处于登录态");
        },
        fail: function() {
            console.log("需要重新登录");
            onLogin()
        }
    })
}

function onLogin() {
    wx.login({
        success: function(res) {
            console.log(res)
            if (res.code) {
                //发起网络请求
                wx.request({
                    url: 'https://testapi.xinhushangcheng.com/index.php/Api/User/sp_wx_useid',
                    data: {
                        code: res.code
                    },
                    success: function(res) {
                        console.log(res)
                        const self = this

                        // if (逻辑成功) {
                        //     //获取到用户凭证 存儲 3rd_session
                        //     var json = JSON.parse(res.data.Data)
                        //
                        //     wx.setStorage({
                        //         key: "third_Session",
                        //         data: json.third_Session
                        //     })
                        //     getUserInfo()
                        // } else {
                        //
                        // }
                    },
                    fail: function(res) {

                    }
                })
            }
        },
        fail: function(res) {

        }
    })

}

function getUserInfo() {
    wx.getUserInfo({
        success: function(res) {
            var userInfo = res.userInfo
            userInfoSetInSQL(userInfo)
        },
        fail: function() {
            userAccess()
        }
    })
}

function userInfoSetInSQL(userInfo) {
    wx.getStorage({
        key: 'third_Session',
        success: function(res) {
            wx.request({
                url: 'Our Server ApiUrl',
                data: {
                    third_Session: res.data,
                    nickName: userInfo.nickName,
                    avatarUrl: userInfo.avatarUrl,
                    gender: userInfo.gender,
                    province: userInfo.province,
                    city: userInfo.city,
                    country: userInfo.country
                },
                success: function(res) {
                    if (逻辑成功) {
                        //SQL更新用户数据成功
                    } else {
                        //SQL更新用户数据失败
                    }
                }
            })
        }
    })
}
module.exports = {
    userLogin : userLogin
}
