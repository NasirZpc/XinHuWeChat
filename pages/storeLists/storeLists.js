const app = getApp()

Page({
    data:{
        page:1,
        storeLists:[],
        noMore:false
    },
    onLoad(option) {
        this.storeListsFunc()
    },
    storeListsFunc(){
        wx.showLoading({
            title: '玩命加载中',
        })
        //店铺列表
        app.wxRequest({
            method:'POST',
            url:'index.php/Api/Shop/shoplist',
            data:{
                isindex: 0,
                pagesize: 6,
                p:this.data.page,
            }
        },res=>{
            if(res.data.data.length<6){
                this.setData({
                    noMore:true
                })
            }else{
                this.setData({
                    noMore:false
                })
            }
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
        });
    },
    //上拉加载
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
                this.storeListsFunc()
            },500)
        }
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
