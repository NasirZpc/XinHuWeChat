const app = getApp()
Page({
    data: {
        isLogin : 1,
        userInfo:'',
    },
    onLoad() {
        console.log(app.globalData.userInfo)
        if(app.globalData.userInfo){
            this.setData({
                isLogin : 2,
                userInfo:app.globalData.userInfo
            })
            //点击授权，未绑定手机号
            if(app.globalData.session_key){
                this.setData({
                    isLogin : 3,
                })
            }
        }
    },
    onGotUserInfo: function(e) {
        console.log(app.globalData.userInfo)
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
    },
})
