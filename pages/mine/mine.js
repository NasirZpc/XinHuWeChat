const app = getApp()
Page({
    data: {
        isLogin: false,
        userInfo: '',
    },
    onLoad() {
        //点击授权，未绑定手机号
        if (app.globalData.userInfo) {
            this.setData({
                isLogin: true,
                userInfo:app.globalData.userInfo
            })
        }
    },
    onGotUserInfo(e) {
        if (e.detail.errMsg != "getUserInfo:ok") {
            //取消授权
            wx.showToast({
                title: '拒绝授权将无法体验完整功能，建议打开用户信息授权',
                duration: 2500,
                icon: 'none',
                mask: true
            })
        } else {
            this.setData({
                isLogin: true,
                userInfo:e.detail.userInfo
            })
            app.userLogin(e)
        }
    },
})
