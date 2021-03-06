const app = getApp()

Page({
    data:{
        active:true,
        searchText:'',
        sort : '',
        curActive : 0,
        goodsLists : [],//商品列表
        goodsPage:1,//商品列表分页
        storeLists : [],//店铺列表
        storePage:1,//店铺列表分页
        noMorePro:false,
        noMoreStore:false,
    },
    onLoad(option) {
        this.setData({
            searchText : option.txt,
            active : option.type == 0 ? true : false
        })
        if(this.data.active){
            this.goodsListsFunc();
        }else{
            this.storeListsFunc();
        }

    },
    searchTab(){
        this.setData({
            active: !this.data.active
        })
        if(this.data.active){
            if(this.data.goodsLists.length == 0){
                this.goodsListsFunc()
            }
        }else{
            if(this.data.storeLists.length == 0){
                this.storeListsFunc()
            }
        }
    },
    /*跳转到搜搜索页*/
    backSearchEnter(){
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    },
    //点击筛选
    sortFunc(e){
        this.setData({
            curActive : e.currentTarget.dataset.type,
            goodsPage : 1,
            goodsLists : [],
        })
        if(this.data.curActive == 0){
            this.setData({
                sort : '',
            })
        }else if(this.data.curActive == 1){
            if(this.data.sort == 1){
                this.setData({
                    sort : 2,
                })
            }else{
                this.setData({
                    sort : 1,
                })
            }
        }else if(this.data.curActive == 2){
            if(this.data.sort == 3){
                this.setData({
                    sort : 4,
                })
            }else{
                this.setData({
                    sort : 3,
                })
            }
        }else if(this.data.curActive == 3){
            if(this.data.sort == 5){
                this.setData({
                    sort : 6,
                })
            }else{
                this.setData({
                    sort : 5,
                })
            }
        }
        this.goodsListsFunc();
    },
    goodsListsFunc(){
        wx.showLoading({
            title: '玩命加载中',
        })
        app.wxRequest({
            method:'POST',
            url:'index.php/Api/Product/getlist',
            data:{
                productname:this.data.searchText,
                sort:this.data.sort,
                pagesize: 6,
                p: this.data.goodsPage
            }
        },res=>{
            if(res.data.data.prolist.length<6){
                this.setData({
                    noMorePro:true
                })
            }else{
                this.setData({
                    noMorePro:false
                })
            }
            var _goodsLists = this.data.goodsLists;
            for (var i = 0; i < res.data.data.prolist.length; i++) {
                _goodsLists.push(res.data.data.prolist[i]);
            }
            this.setData({
                goodsLists: _goodsLists
            })
            // 隐藏加载框
            setTimeout(()=>{
                wx.hideLoading()
            },500)
        });
    },
    storeListsFunc(){
        wx.showLoading({
            title: '玩命加载中',
        })
        app.wxRequest({
            method:'POST',
            url:'index.php/Api/Shop/searchshop',
            data:{
                shopname:this.data.searchText,
                pagesize:6,
                p:this.data.storePage
            }
        },res=>{
            if(res.data.data.length<6){
                this.setData({
                    noMoreStore:true
                })
            }else{
                this.setData({
                    noMoreStore:false
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
    onReachBottom() {
        if(this.data.active){
            if(!this.data.noMorePro){
                var that = this;
                // 页数+1
                this.data.goodsPage = this.data.goodsPage + 1;
                setTimeout(()=>{
                    this.goodsListsFunc()
                },500)
            }
        }else{
            if(!this.data.noMoreStore){
                var that = this;
                this.data.storePage = this.data.storePage + 1;
                setTimeout(()=>{
                    this.storeListsFunc()
                },500)
            }
        }
    },
    //跳转店铺详情页
    goStoreDetail(){
        console.log('跳转店铺详情页')
    },
    //跳转店商品情页
    goProDetail(e){
        wx.navigateTo({
           url: "../proDetail/proDetail?proid="+e.currentTarget.dataset.id + '&isactivity=0'
        });
    }
})
