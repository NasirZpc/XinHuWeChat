const app = getApp()

Page({
    data:{
        page:1,
        storeLists:[]
    },
    onLoad(option) {
        this.storeListsFunc()
    },
    storeListsFunc(){
        wx.showLoading({
            title: '玩命加载中',
        })
        //店铺列表
        wx.request({
            url: app.baseUrl + 'index.php/Api/Shop/shoplist',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                isindex: 0,
                pagesize: 6,
                p:this.data.page,
            },
            success: (res) => {
                if (res.data.status == 1) {
                    var _storeLists = this.data.storeLists;
                    for (var i = 0; i < res.data.data.length; i++) {
                        _storeLists.push(res.data.data[i]);
                    }
                    this.setData({
                        storeLists: _storeLists
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
    //上拉加载
    onReachBottom() {
        var that = this;
        // 显示加载图标
        wx.showLoading({
            title: '玩命加载中',
        })
        // 页数+1
        this.data.page = this.data.page + 1;
        setTimeout(()=>{
            this.storeListsFunc()
        },500)
    },
    //商品详情页
    goProDetail(e){
        wx.navigateTo({
           url: "../proDetail/proDetail?proid="+e.currentTarget.dataset.id + '&isactivity=0'
        });
    },
    //店铺详情
    goStoreDetail(e){
        wx.navigateTo({
           url: "../storeDetail/storeDetail?shopid="+e.currentTarget.dataset.id
        });
    },
})
