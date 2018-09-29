const app = getApp()

Page({
    data:{
        active:true,
        searchText:'',
        searchHistroyLists:[],
    },
    onLoad() {
        var histroyData = wx.getStorageSync('histroyData') || []
        this.setData({
            searchHistroyLists: histroyData
        })
    },
    onHide(){
        var histroyData = wx.getStorageSync('histroyData') || []
        this.setData({
            searchHistroyLists: histroyData
        })
    },
    searchTab(){
        this.setData({
            active: !this.data.active
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
        var type  = 0;//0 :商品 1:店铺
        if(this.data.active){
            type = 0
        }else{
            type = 1
        }
        this.data.searchHistroyLists.push({searchText:this.data.searchText,searchType:type})
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
        wx.setStorageSync('histroyData', _histroyData)
        wx.navigateTo({
           url: "../searchResult/searchResult?txt="+this.data.searchText + "&type="+type
        });
    },
    delHistroy(){//点击删除搜索历史
        var that = this;
        if(this.data.searchHistroyLists.length){
            wx.showModal({
                title: '提示',
                content: '确定要删除搜索历史？',
                showCancel: true,//是否显示取消按钮
                cancelText:"否",//默认是“取消”
                cancelColor:'#ff5c00',//取消文字的颜色
                confirmText:"是",//默认是“确定”
                confirmColor: '#ff5c00',//确定文字的颜色
                success: function (res) {
                    if (res.confirm) {
                        that.setData({
                            searchHistroyLists : []
                        })
                        wx.clearStorage()
                    }
                },
                fail: function (res) { },//接口调用失败的回调函数
                complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
            })
        }
    },
    goProStoreDetail(e){//点击跳转
        wx.navigateTo({
           url: "../searchResult/searchResult?txt="+e.currentTarget.dataset.txt + "&type="+e.currentTarget.dataset.type
        });
    }
})
