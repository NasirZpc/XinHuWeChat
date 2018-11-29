const app = getApp()

Page({
    data: {
        items:[],
        page:1,
        noMore:false,
        id:'',
    },
    onLoad() {
        //获取系统消息列表
        this.getSysMsgLists()
    },
    //获取系统消息列表
    getSysMsgLists(){
        wx.showLoading({
            title: '玩命加载中',
        })
        app.wxRequest({
            method:'POST',
            url:'index.php/Api/User/mymessage',
            data:{
                token:app.globalData.token,
                p: this.data.page,
                pagesize: 15,
            }
        },res=>{
            if(res.data.data.length<15){
                this.setData({
                    noMore:true
                })
            }else{
                this.setData({
                    noMore:false
                })
            }
            var _sysMsgLists = this.data.items;
            for (var i = 0; i < res.data.data.length; i++) {
                _sysMsgLists.push(res.data.data[i]);
                _sysMsgLists[i]['isTouchMove'] = false
            }
            console.log(_sysMsgLists)
            this.setData({
                items: _sysMsgLists
            })
            // 隐藏加载框
            setTimeout(()=>{
                wx.hideLoading()
            },500)
        });
    },
    onReachBottom() {
        if(!this.data.noMore){
            // 显示加载图标
            wx.showLoading({
                title: '玩命加载中',
            })
            // 页数+1
            this.data.page = this.data.page + 1;
            setTimeout(()=>{
                this.getSysMsgLists()
            },500)
        }
    },
    //忽略未读消息
    ignoreMsg(){
        app.wxRequest({
            method:'POST',
            url:'index.php/Api/User/neglectmessage',
            data:{
                id:this.data.id,
                token:app.globalData.token,
            }
        },res=>{
            if(!this.data.id){
                this.setData({
                    items:[],
                    page:1
                })
                this.getSysMsgLists()
            }else{
                this.setData({
                    id:''
                })
            }
        });
    },
    //跳转
    goMsgDetail(e){
        wx.navigateTo({
           url: "../systemMsgDetail/systemMsgDetail?id="+e.currentTarget.dataset.id
        });
    },
    touchstart(e) {
        //开始触摸时 重置所有删除
        let data = app.touch._touchstart(e, this.data.items)
        this.setData({
            items: data
        })
    },
    //滑动事件处理
    touchmove(e) {
        let data = app.touch._touchmove(e, this.data.items)
        this.setData({
            items: data
        })
    },
    //删除事件
    del: function(e) {
        wx.showModal({
            title: '提示',
            content: '确认要删除此条信息么？',
            success: res => {
                if (res.confirm) {
                    this.data.items.splice(e.currentTarget.dataset.index, 1)
                    this.setData({
                        items: this.data.items
                    })
                    this.setData({
                        id:e.currentTarget.dataset.id
                    })
                    this.ignoreMsg()
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }
})
