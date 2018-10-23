const app = getApp()

Page({
    data:{
        shopid:'',
        storeDetail:'',
        isActive:0,
    },
    onLoad(option) {
        this.setData({
            shopid:option.shopid
        })
        this.storeDetailFunc()
    },
    storeDetailFunc(){
        wx.showLoading({
            title: '玩命加载中',
        })
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
            isActive:id
        });
    }
})
