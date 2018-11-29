const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        msgDetail:'',
    },
    onLoad(option) {
        //获取消息详情
        app.wxRequest({
            method:'POST',
            url:'index.php/Api/User/messagedetail',
            data:{
                token:app.globalData.token,
                id:option.id,
            }
        },res=>{
            WxParse.wxParse('article', 'html', res.data.data.content, this,5)
        });
    },
})
