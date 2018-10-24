const app = getApp()

Page({
    data:{
        shopid:'',
        shopcatid:'',
        page:1,
        sort:'1',
        proLists:[],
        productname:'',
        noMore:false
    },
    onLoad(option) {
        this.setData({
            shopid:option.shopid,
            shopcatid:option.shopcatid,
        })
        if(option.txt){
            this.setData({
                productname:option.txt
            })
        }
        this.proListsFunc()
    },
    proListsFunc(){
        wx.showLoading({
            title: '玩命加载中',
        })
        //宝贝列表
        wx.request({
            url: app.baseUrl + '/index.php/Product/shoppro',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                shopid:this.data.shopid,
                sort:this.data.sort,
                productname:this.data.productname,
                pagesize: 6,
                p: this.data.page,
                shopcatid:this.data.shopcatid
            },
            success: (res) => {
                if (res.data.status == 1) {
                    if(res.data.data.length<6){
                        this.setData({
                            noMore:true
                        })
                    }else{
                        this.setData({
                            noMore:false
                        })
                    }
                    var _proLists = this.data.proLists;
                    for (var i = 0; i < res.data.data.length; i++) {
                        _proLists.push(res.data.data[i]);
                    }
                    this.setData({
                        proLists: _proLists
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
                this.proListsFunc()
            },500)
        }
    },
    sortFunc(e){
        this.setData({
            curActive : e.currentTarget.dataset.type,
            page : 1,
            proLists : [],
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
        this.proListsFunc();
    },
    //跳转到商品搜索页
    goProSearch(e){
        wx.redirectTo({
           url: "../proSearch/proSearch?shopid="+this.data.shopid +"&shopcatid="+this.data.shopcatid
        });
    },
})
