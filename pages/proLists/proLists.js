const app = getApp()
Page({
    data:{
        shopid:'',

    },
    onLoad(option) {
        console.log(option)
        this.setData({
            shopid:option.shopid
        })
    },
    //商品详情页
    goProDetail(e){
        wx.navigateTo({
           url: "../proDetail/proDetail?proid="+e.currentTarget.dataset.id + '&isactivity=0'
        });
    },
})
