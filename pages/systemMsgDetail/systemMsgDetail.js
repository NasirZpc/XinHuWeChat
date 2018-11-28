const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        msgDetail:'',
    },
    onLoad(option) {
        var that = this
        //获取消息详情
        wx.request({
            url: app.baseUrl + 'index.php/Api/User/messagedetail',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                token:app.globalData.token,
                id:option.id,
            },
            success: (res) => {
                if (res.data.status == 1) {
                    WxParse.wxParse('article', 'html', res.data.data.content, that,5)
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
})
