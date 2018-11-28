const app = getApp()

Page({
    data: {
        sysMsgLists:[],
        page:1,
        noMore:false
    },
    onLoad() {
        //获取系统消息列表
        this.getSysMsgLists()
    },
    //获取系统消息列表
    getSysMsgLists(){
        wx.showLoading({
            title: '玩命加载中',
        })
        wx.request({
            url: app.baseUrl + 'index.php/Api/User/mymessage',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                token:app.globalData.token,
                p: this.data.page,
                pagesize: 15,
            },
            success: (res) => {
                if (res.data.status == 1) {
                    if(res.data.data.length<15){
                        this.setData({
                            noMore:true
                        })
                    }else{
                        this.setData({
                            noMore:false
                        })
                    }
                    var _sysMsgLists = this.data.sysMsgLists;
                    for (var i = 0; i < res.data.data.length; i++) {
                        _sysMsgLists.push(res.data.data[i]);
                    }
                    this.setData({
                        sysMsgLists: _sysMsgLists
                    })
                    // 隐藏加载框
                    setTimeout(()=>{
                        wx.hideLoading()
                    },500)

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
    onReachBottom() {
        if(!this.data.noMore){
            var that = this;
            // 显示加载图标
            wx.showLoading({
                title: '玩命加载中',
            })
            // 页数+1
            this.data.page = this.data.page + 1;
            setTimeout(()=>{
                this.getSysMsgLists()
            },500)
        }
    },
    //忽略未读消息
    ignoreMsg(){
        wx.request({
            url: app.baseUrl + 'index.php/Api/User/neglectmessage',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                token:app.globalData.token,
            },
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        sysMsgLists:[],
                        page:1
                    })
                    this.getSysMsgLists()
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
    //跳转
    goMsgDetail(e){
        wx.navigateTo({
           url: "../systemMsgDetail/systemMsgDetail?id="+e.currentTarget.dataset.id
        });
    }
})
