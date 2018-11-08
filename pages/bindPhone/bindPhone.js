const app = getApp()
var interval = null //倒计时函数
Page({
    data: {
        session_key: "",
        openid:'',
        unionid:'',
        phone: '',//手机号
        code: '',//验证码
        password: '',//密码
        invitationCode:'',//邀请码
        accesstoken:'',
        isShow: false,
        time: '获取验证码', //倒计时
        currentTime:60
    },
    onLoad(option) {
        this.setData({
            session_key: option.session_key,
            openid     : option.openid
        })
        console.log(option)
    },
    //输入手机号
    inputPhoneFunc(e) {
        this.setData({
            phone: e.detail.value
        })
    },
    getCode(options) {
        var that = this;
        var currentTime = that.data.currentTime
        interval = setInterval(function() {
            currentTime--;
            that.setData({
                time: currentTime + '秒'
            })
            if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                    time: '重新发送',
                    currentTime: 60,
                    disabled: false
                })
            }
        }, 1000)
    },
    //获取验证码
    getVerificationCode() {
        var vcerify = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (!this.data.phone) {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        if (!vcerify.test(this.data.phone)) {
            wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        this.getCode();
        this.setData({
            disabled:true
        })
        //获取验证码
        wx.request({
            url: app.baseUrl + '/index.php/Api/Sms/sendmsg',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                phone: this.data.phone,
                type: '1',
            },
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        isShow: true,
                        accesstoken : res.data.accesstoken
                    })
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
    inputCodeFunc(e) {
        this.setData({
            code: e.detail.value
        })
    },
    //输入密码
    inputPasswordFunce(e){
        this.setData({
            code: e.detail.value
        })
    },
    //输入邀请码
    inputInvitationFunc(e){
        this.setData({
            InvitationCode: e.detail.value
        })
    },
    //绑定手机号
    bindFunc() {
        var vcerify = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (!this.data.phone) {
            wx.showToast({
                title: '请输入手机号',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        if (!vcerify.test(this.data.phone)) {
            wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        if (!this.data.code) {
            wx.showToast({
                title: '请输入验证码',
                icon: 'none',
                duration: 2500
            })
            return false
        }
        if(this.data.isShow){
            if(!this.data.password){
                wx.showToast({
                    title: '请输入密码',
                    icon: 'none',
                    duration: 2500
                })
                return false
            }
            //绑定手机号
            wx.request({
                url: app.baseUrl + '/index.php/Api/User/oauthband',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    from: 'wechat',
                    phone : this.data.phone,
                    openid : this.data.openid,
                    unionid:this.data.unionid,
                    password:this.data.password,
                    smscode:this.data.code,
                    accesstoken : this.data.accesstoken,
                    invitationcode : this.data.invitationCode
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
        }else{
            wx.showToast({
                title: '请获取验证码',
                icon: 'none',
                duration: 2500
            })
        }
    },
})
