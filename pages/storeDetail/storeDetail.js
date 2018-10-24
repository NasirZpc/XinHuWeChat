const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
    data:{
        shopid:'',
        storeDetail:'',
        isActive:0,
        page:1,
        shopProLists:[],
        windowHeight:'',
        isFix : false,
        isFixNav : false,
        isFixSort : false,
        bgOpacity:0,
        sort : 1,
        curActive : 0,
    },
    onLoad(option) {
        this.setData({
            shopid:option.shopid
        })
        var that = this
        wx.getSystemInfo({
            success: function (res) {
                let clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = (clientHeight * rpxR);
                that.setData({    
                    windowHeight: calc
                });
            }
        });
        this.storeDetailFunc()
    },
    storeDetailFunc(){
        wx.showLoading({
            title: '玩命加载中',
        })
        var that = this
        //店铺列表
        wx.request({
            url: app.baseUrl + '/index.php/Api/Shop/getshop',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                token:"",
                shopid:this.data.shopid
            },
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        storeDetail: res.data.data
                    })
                    wx.setNavigationBarTitle({
                        title: res.data.data.shopname
                    })
                    WxParse.wxParse('article', 'html', res.data.data.shopcontent, that,5)
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
    //商铺内商品列表
    shopProFunc(){
        wx.showLoading({
            title: '玩命加载中',
        })
        wx.request({
            url: app.baseUrl + '/index.php/Product/shoppro',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                shopid:this.data.shopid,
                sort:this.data.sort,
                pagesize: 6,
                p: this.data.page,
                shopcatid:'',
            },
            success: (res) => {
                if (res.data.status == 1) {
                    var _shopProLists = this.data.shopProLists;
                    for (var i = 0; i < res.data.data.length; i++) {
                        _shopProLists.push(res.data.data[i]);
                    }
                    this.setData({
                        shopProLists: _shopProLists
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
    onReachBottomFunc() {
        if(this.data.isActive == 1){
            var that = this;
            // 显示加载图标
            wx.showLoading({
                title: '玩命加载中',
            })
            // 页数+1
            this.data.page = this.data.page + 1;
            setTimeout(()=>{
                this.shopProFunc()
            },500)
        }
    },
    sortFunc(e){
        this.setData({
            curActive : e.currentTarget.dataset.type,
            page : 1,
            shopProLists : [],
        })
        if(this.data.curActive == 0){
            this.setData({
                sort : 1,
            })
        }else if(this.data.curActive == 1){
            this.setData({
                sort : 2,
            })
        }else if(this.data.curActive == 2){
            this.setData({
                sort : 3,
            })
        }else if(this.data.curActive == 3){
            if(this.data.sort == 5){
                this.setData({
                    sort : 4,
                })
            }else{
                this.setData({
                    sort : 5,
                })
            }
        }
        this.shopProFunc();
    },
    //商品详情页
    goProDetail(e){
        wx.navigateTo({
           url: "../proDetail/proDetail?proid="+e.currentTarget.dataset.id + '&isactivity=0'
        });
    },
    //商品详情页内容切换
    storeNavFunc(e){
        var id = e.target.dataset.id;
        this.setData({
            isActive:id,
            // isFixSort:false,
        });
        if(id == 1){
            if(this.data.shopProLists.length == 0){
                wx.showLoading({
                    title: '玩命加载中',
                })
                this.shopProFunc()
            }
        }
    },
    //监听滚动条
    scroll(e) {
        var scrollTop = e.detail.scrollTop;
        console.log(scrollTop)
        if(scrollTop>10){
            this.setData({
                isFix:true,
                bgOpacity:scrollTop/60
            })
        }else{
            this.setData({
                isFix:false,
                bgOpacity:scrollTop/60
            })
        }
        if(scrollTop>72){
            this.setData({
                isFixNav:true,
            })
            if(this.data.isActive == 1){
                this.setData({
                    isFixSort:true,
                })
            }
        }else{
            this.setData({
                isFixNav:false,
            })
            if(this.data.isActive == 1){
                this.setData({
                    isFixSort:false,
                })
            }
        }
    }
})
