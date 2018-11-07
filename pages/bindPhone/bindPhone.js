const app = getApp()

Page({
    data: {
        session_key:"",
    },
    onLoad(option){
        this.setData({
            session_key : option.session_key
        })
    },

})
