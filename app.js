App({
    onLaunch: function() {

    },
    globalData: {
        userInfo: wx.getStorageSync("userInfo") || '',
        session_key : wx.getStorageSync("session_key") || ''
    },
    isNull: function(str) {
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    },
    //授权登录并监测登录状态
    userLogin(e) {
        var that = this;
        wx.setStorageSync("userInfo",e.detail.userInfo)//存储个人信息
        var isLogin = wx.getStorageSync('session_key');
        if(isLogin){
            wx.checkSession({
                success() {
                    console.log("处于登录态");
                },
                fail() {
                    console.log("需要重新登录");
                    wx.removeStorageSync('session_key')
                    that.onLogin(e)
                }
            })
        }else{
            that.onLogin(e)
        }
    },
    onLogin(e) {
        var that = this
        wx.login({
            success(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: that.baseUrl + '/index.php/Api/User/sp_wx_useid',
                        data: {
                            code: res.code
                        },
                        success(res) {
                            // wx.setStorageSync(
                            //     "session_key",
                            //     res.data.session_key
                            // )
                            var _res = res.data.session_key
                            //第三方登录
                            wx.request({
                                url: that.baseUrl + '/index.php/Api/User/oauthuser',
                                method: "POST",
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                    from: 'wechat',
                                    name: e.detail.userInfo.nickName,
                                    avatar: e.detail.userInfo.avatarUrl,
                                    openid: res.data.openid,
                                    unionid: res.data.unionid || '',
                                },
                                success: (res) => {
                                    if (res.data.status == 1) {
                                        wx.navigateTo({ //绑定手机号
                                            url: "../bindPhone/bindPhone?session_key="+_res
                                        });
                                    }
                                }
                            });
                        },
                        fail(res) {
                            console.log("失败")
                            console.log(res)
                        }
                    })
                }
            },
            fail(res) {

            }
        })

    },
    //baseUrl
    baseUrl: "https://testapi.xinhushangcheng.com/"
})
