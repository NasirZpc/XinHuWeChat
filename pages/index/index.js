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
        app.wxRequest({
            method:'GET',
            url:'index.php/Api/Product/getbanner',
        },res =>{
            this.setData({
                banners:res.data.data.banner
            })
        });
        //获取快速入口
        app.wxRequest({
            method:'GET',
            url:'index.php/Api/Product/gethomeactivity',
        },res => {
            this.setData({
                fastEnterLists: res.data.data
            })
        });

        //获取快速入口2
        app.wxRequest({
            method:'GET',
            url:'index.php/Product/getspecial',
        },res=>{
            this.setData({
                fastEnterLists2: res.data.data.special
            })
        });

        //大家都在买
        app.wxRequest({
            method:'POST',
            url:'index.php/Product/evboybuy',
            data:{
                pagesize: 4,
                p: 1
            }
        },res=>{
            this.setData({
                evboybuyLists: res.data.data
            })
        });

        //店铺推荐
        app.wxRequest({
            method:'POST',
            url:'index.php/Api/Shop/shoplist',
            data:{
                isindex: 1,
                pagesize: 4,
                p: 1
            }
        },res=>{
            this.setData({
                recommendStoreLists: res.data.data
            })
        });
        this.guesslikeFunc()
    },
    guesslikeFunc(){
        //猜你喜欢
        app.wxRequest({
            method:'POST',
            url:'index.php/User/guesslike',
            data:{
                token: app.globalData.token,
                pagesize: 6,
                p: this.data.page
            }
        },res=>{
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
    //跳转到商品分类列表页
    goFastEnter(e){
        if(e.currentTarget.dataset.id == 10){
            wx.navigateTo({
               url: "../proClassLists/proClassLists?type="+e.currentTarget.dataset.id
            });
        }
    },
    goProClassLists(e){
        wx.navigateTo({
           url: "../proClassLists/proClassLists?type="+e.currentTarget.dataset.id
        });
    },
})
