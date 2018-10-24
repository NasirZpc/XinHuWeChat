const app = getApp()

Page({
    data: {
        banners: [],
        fastEnterLists: [],
        fastEnterLists2: [],
        evboybuyLists: [],
        recommendStoreLists: [],
        guesslikeLists: [],
        page:1,
        noMore:false
    },
    onLoad() {
        //获取轮播图
        wx.request({
            url: app.baseUrl + 'index.php/Api/Product/getbanner',
            method: "GET",
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        banners: res.data.data.banner
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
        //获取快速入口
        wx.request({
            url: app.baseUrl + 'index.php/Api/Product/gethomeactivity',
            method: "GET",
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        fastEnterLists: res.data.data
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
        //获取快速入口2
        wx.request({
            url: app.baseUrl + 'index.php/Product/getspecial',
            method: "GET",
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        fastEnterLists2: res.data.data.special
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
        //大家都在买
        wx.request({
            url: app.baseUrl + 'index.php/Product/evboybuy',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                pagesize: 4,
                p: 1
            },
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        evboybuyLists: res.data.data
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
        //店铺推荐
        wx.request({
            url: app.baseUrl + 'index.php/Api/Shop/shoplist',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                isindex: 1,
                pagesize: 4,
                p: 1
            },
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        recommendStoreLists: res.data.data
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
        this.guesslikeFunc()
    },
    guesslikeFunc(){
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
    /*跳转到搜搜索页*/
    goSearchEnter(){
        wx.navigateTo({
           url: "../search/search"
        });
    },
    //跳转到商品详情页
    goProDetail(e){
        wx.navigateTo({
           url: "../proDetail/proDetail?proid="+e.currentTarget.dataset.id + '&isactivity=0'
        });
    },
    //跳转到店铺详情页
    goStoreDetail(e){
        wx.navigateTo({
           url: "../storeDetail/storeDetail?shopid="+e.currentTarget.dataset.id
        });
    },
    goFastEnter(e){
        if(e.currentTarget.dataset.id == 10){
            wx.navigateTo({
               url: "../proClassLists/proClassLists?activityid="+e.currentTarget.dataset.activityid+"&type="+e.currentTarget.dataset.type
            });
        }
    },
    //跳转到商品分类列表页
    goProClassLists(e){
        wx.navigateTo({
           url: "../proClassLists/proClassLists"
        });
    },
})
