//app.js
var common = require("common/common.js")
App({
    onLaunch: function() {
        common.userLogin()
    },
    globalData: {
        userInfo: null
    },
    isNull:function( str ){
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    },
    //baseUrl
    baseUrl:"https://api.xinhushangcheng.com/"
})
