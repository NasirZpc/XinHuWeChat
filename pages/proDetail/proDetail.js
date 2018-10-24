const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
    data:{
        proid:'',
        isactivity: '',
        proDetail:'',
        proComment:'',
        guesslikeLists: [],
        page:1,
        isActive:0,
        toView:'view0',
        windowHeight:'',
        noMore:false,
    },
    onLoad(option) {
        wx.showLoading({
            title: '玩命加载中',
        })
        var that = this
        wx.getSystemInfo({
            success: function (res) {
                let clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR;
                that.setData({    
                    windowHeight: calc
                });
            }
        });
        this.setData({
            proid : option.proid,
            isactivity : option.isactivity
        })
        //获取商品详情
        wx.request({
            url: app.baseUrl + '/index.php/Api/Product/getprodetail',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                proid: this.data.proid,
                token:'',
                isactivity:this.data.isactivity,
            },
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        proDetail: res.data.data,
                    })
                    WxParse.wxParse('article', 'html', res.data.data.prodetail.imagetext, that,5)
                    wx.setNavigationBarTitle({
                        title: res.data.data.prodetail.productname
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        duration: 2500,
                        icon: 'none',
                        mask: true
                    })
                }
                // 隐藏加载框
                setTimeout(()=>{
                    wx.hideLoading()
                },500)
            }
        });
        //获取商品评论
        wx.request({
            url: app.baseUrl + '/index.php/Api/Product/getprocomment',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                proid: this.data.proid,
                token:'',
                pagesize:3,
            },
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        proComment: res.data.data,
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
    //跳转到商品评论页
    goProComment(e){
        wx.navigateTo({
           url: "../commentLists/commentLists?proid="+this.data.proid
        });
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
    onReachBottomFunc() {
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
    scrollToViewFn: function (e) {
        var id = e.target.dataset.id;
        this.setData({
            isActive:id,
            toView: 'view' + id
        })
    },
    //监听锚点的改变
    scroll(e) {
        var scrollTop = e.detail.scrollTop;
        this.setData({
            scrollTop:e.detail.scrollTop
        })
    }


    //立即购买
    //加入购物车
})
