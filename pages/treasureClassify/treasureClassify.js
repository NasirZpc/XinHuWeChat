const app = getApp()
Page({
    data:{
        shopid:'',
        treasureClassify:[],
        state:'-2',
    },
    onLoad(option) {
        this.setData({
            shopid:option.shopid
        })
        this.treasureClassifyFunc()
    },
    treasureClassifyFunc(){
        wx.showLoading({
            title: '玩命加载中',
        })
        //店铺列表
        wx.request({
            url: app.baseUrl + 'index.php/Shop/shopcat',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                shopid:this.data.shopid
            },
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        treasureClassify: res.data.data
                    })
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
    //跳转到商品分类列表
    goProLists(e){
        this.setData({
            state: e.currentTarget.dataset.shopcatid,
        })
        wx.navigateTo({
           url: "../proLists/proLists?shopid="+this.data.shopid+"&shopcatid="+e.currentTarget.dataset.shopcatid
        });
    }
})
