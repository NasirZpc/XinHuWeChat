const app = getApp()

Page({
    data: {
        session_key:"",
        phone:'',
        code:'',
    },
    onLoad(option){
        this.setData({
            session_key : option.session_key
        })
    },
    //输入手机号
    inputPhoneFunc(e){
        this.setData({
            phone: e.detail.value
        })
    },
    //获取验证码
    getCode(){
        var vcerify =  /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if(!this.data.phone){
            wx.showToast({
                title: '请输入手机号',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        if(!vcerify.test(this.data.phone)){
            wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        //获取验证码
        wx.request({
            url: app.baseUrl + '/index.php/Api/Sms/sendmsg',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                phone:this.data.phone,
                type:'1',
            },
            success: (res) => {
                if (res.data.status == 1) {
                    console.log(res)
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        duration: 2500,
                        icon: 'none',
                        mask: true
                    })
                }
            }
        });
    },
    //输入验证码
    inputCodeFunc(e){
        this.setData({
            code: e.detail.value
        })
    },
    //绑定手机号
    bindFunc(){
        var vcerify =  /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if(!this.data.phone){
            wx.showToast({
                title: '请输入手机号',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        if(!vcerify.test(this.data.phone)){
            wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        if(!this.data.code){
            wx.showToast({
                title: '请输入验证码',
                icon: 'none',
                duration: 2500
            })
            return false
        }
    },
})
