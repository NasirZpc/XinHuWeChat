const app = getApp()

Page({
    data:{
        guesslikeLists: [],
        page:1,
        noMore:false
    },
    onLoad(option) {
        this.guesslikeFunc()
    },
    guesslikeFunc(){
        wx.showLoading({
            title: '玩命加载中',
        })
        //猜你喜欢
        wx.request({
            url: app.baseUrl + 'index.php/User/guesslike',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                token: '',
                pagesize: 6,
                p: this.data.page
            },
            success: (res) => {
                if (res.data.status == 1) {
                    if(res.data.data.guesslist.length<6){
                        this.setData({
                            noMore:true
                        })
                    }else{
                        this.setData({
                            noMore:false
                        })
                    }
                    var _guesslikeLists = this.data.guesslikeLists;
                    for (var i = 0; i < res.data.data.guesslist.length; i++) {
                        _guesslikeLists.push(res.data.data.guesslist[i]);
                    }
                    this.setData({
                        guesslikeLists: _guesslikeLists
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
    /**
     * 页面上拉触底事件的处理函数
     */
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
                this.guesslikeFunc()
            },500)
        }
    },
    //跳转到商品详情页
    goProDetail(e){
        wx.navigateTo({
           url: "../proDetail/proDetail?proid="+e.currentTarget.dataset.id + '&isactivity=0'
        });
    },
})
