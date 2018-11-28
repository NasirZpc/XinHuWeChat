const app = getApp()

Page({
    data: {
        userInfo: '',
    },
    onLoad(option) {
        
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
            //确认授权
            this.setData({
                userInfo: e.detail.userInfo
            })
            app.userLogin(e)
        }
    },
})
