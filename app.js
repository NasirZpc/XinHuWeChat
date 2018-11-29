import touch from './utils/touch.js'
App({
    onLaunch: function() {

    },
    globalData: {
        userInfo: wx.getStorageSync("userInfo") || '',
        token: wx.getStorageSync("token") || '',
    },

    touch: new touch(),

    isNull: function(str) {
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    },
    
    //授权登录并监测登录状态
    userLogin(e) {
        var that = this;
        wx.setStorageSync("userInfo",e.detail.userInfo)//存储个人信息
        this.globalData.userInfo = e.detail.userInfo
        wx.checkSession({
            success() {
                console.log("处于登录态");
                if(!this.globalData.userInfo){
                    that.onLogin(e)
                }
            },
            fail() {
                console.log("需要重新登录");
                wx.removeStorageSync('userInfo')
                that.onLogin(e)
            }
        })
    },
    onLogin(e,hasUrl) {
        var that = this
        wx.login({
            success(res) {
                if (res.code) {
                    //发起网络请求获取openid和session_key
                    wx.request({
                        url: that.baseUrl + '/index.php/Api/User/sp_wx_useid',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                            code: res.code
                        },
                        success(res) {
                            // var _session_key = res.data.session_key
                            // var _openid = res.data.openid
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
                                        if(res.data.data.mobile){//已绑定手机号
                                            that.globalData.userInfo = res.data.data
                                            that.globalData.userInfo.avatarUrl = res.data.data.avatar
                                            that.globalData.userInfo.nickName = res.data.data.user_nicename
                                            that.globalData.token = res.data.data.token
                                            wx.setStorageSync('userInfo', that.globalData.userInfo)
                                            wx.setStorageSync('token', that.globalData.userInfo.token)
                                            if(hasUrl){
                                                wx.navigateBack({
                                                    delta: 2
                                                })
                                            }
                                        }else{
                                            wx.navigateTo({ //未绑定手机号
                                                url: "../bindPhone/bindPhone?session_key="+_session_key+"&openid="+_openid
                                            });
                                        }
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
            fail(res) {}
        })
    },
    //请求的共用方法
    wxRequest(config,callBack){
        if(config.method == "GET"){
            wx.request({
                url: this.baseUrl + config.url,
                method: "GET",
                success: (res) => {
                    if (res.data.status == 1) {
                        callBack(res)
                        setTimeout(()=>{
                            wx.hideLoading()
                        },500)
                    } else {
                        setTimeout(()=>{
                            wx.hideLoading()
                        },500)
                        wx.showToast({
                            title: res.data.Message,
                            duration: 2500,
                            icon: 'none',
                            mask: true
                        })
                    }
                }
            });
        }else if(config.method=="POST"){
            wx.request({
                url: this.baseUrl + config.url,
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: config.data,
                success: (res) => {
                    if (res.data.status == 1) {
                        callBack(res)
                    } else {
                        wx.showToast({
                            title: res.data.Message,
                            duration: 2500,
                            icon: 'none',
                            mask: true
                        })
                    }
                    setTimeout(()=>{
                        wx.hideLoading()
                    },500)
                }
            });
        }
    },
    //baseUrl
    baseUrl: "https://testapi.xinhushangcheng.com/"
})
