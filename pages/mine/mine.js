const app = getApp()
Page({
    data: {
        isLogin : false,
        userInfo:'',
    },
    onLoad() {
        if(app.globalData.session_key){
            this.setData({
                isLogin : true,
                userInfo:app.globalData.userInfo
            })
        }
    },
    onGotUserInfo: function(e) {
        if(e.detail.errMsg != "getUserInfo:ok"){
            //取消授权
        }else{
            //确认授权
            app.userLogin(e)
            this.setData({
                isLogin : true,
                userInfo:app.globalData.userInfo
            })
        }
        console.log(app.globalData.session_key)
    },
})
