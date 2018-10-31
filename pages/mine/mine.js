const app = getApp()
var common = require("../../common/common.js")
Page({
    data: {

    },
    onLoad(){
        common.userLogin()
    }
})
