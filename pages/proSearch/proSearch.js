const app = getApp()

Page({
    data:{
        searchText:'',
        searchHistroyLists:[],
        shopid:'',
        shopcatid:'',
    },
    onLoad(option) {
        var histroyData = wx.getStorageSync('histroyData1') || []
        this.setData({
            searchHistroyLists: histroyData,
            shopid:option.shopid,
            shopcatid:option.shopcatid,
        })
    },
    onHide(){
        var histroyData = wx.getStorageSync('histroyData1') || []
        this.setData({
            searchHistroyLists: histroyData
        })
    },
    inputSearchText(e){
        this.data.searchText = e.detail.value
    },
    searchFunc(){//点击搜索按钮
        if(this.data.searchText  == '' || this.data.searchText  == null || app.isNull(this.data.searchText )){
            wx.showToast({
                title:'请输入搜索内容',
                duration: 2500,
                icon: 'none',
                mask: true
            })
            return false
        }
        this.data.searchHistroyLists.push({searchText:this.data.searchText})
        const _histroyData = []
        if(this.data.searchHistroyLists.length){
            const obj = {}
            for(var i=0;i<this.data.searchHistroyLists.length;i++){
                if(!obj[this.data.searchHistroyLists[i]['searchText']]){
                    _histroyData.push(this.data.searchHistroyLists[i])
                    obj[this.data.searchHistroyLists[i]['searchText']] = true
                }
            }
        }
        wx.setStorageSync('histroyData1', _histroyData)
        wx.navigateTo({
           url: "../proLists/proLists?txt="+this.data.searchText+"&shopid="+this.data.shopid+"&shopcatid="+this.data.shopcatid
        });
    },
    //商品详情页
    goProLists(e){
        wx.navigateTo({
           url: "../proLists/proLists?txt="+e.currentTarget.dataset.txt+"&shopid="+this.data.shopid+"&shopcatid="+this.data.shopcatid
        });
    },
})
