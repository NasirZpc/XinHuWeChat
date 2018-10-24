const app = getApp()

Page({
    data:{

    },
    onLoad(option) {
        this.setData({

        })
    },
    //商品详情页
    goProLists(e){
        wx.redirectTo({
           url: "../proLists/proLists?txt="+e.currentTarget.dataset.txt+"&shopid="+this.data.shopid+"&shopcatid="+this.data.shopcatid
        });
    },
})
