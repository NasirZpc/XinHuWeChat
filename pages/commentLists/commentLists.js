const app = getApp()

Page({
    data:{
        commentLists: [],
        type:'',
        good:0,
        medium:0,
        picnums:0,
        chaseratings:0,
        bad:0,
        page:1,
        isActive:0,
        noMore:false
    },
    onLoad(option) {
        this.setData({
            proid : option.proid,
        })
        this.commentListsFunc()
    },
    commentListsFunc(){
        wx.showLoading({
            title: '玩命加载中',
        })
        //评论列表
        wx.request({
            url: app.baseUrl + '/index.php/Api/Product/getprocomment',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                proid: this.data.proid,
                token: '',
                pagesize: 6,
                p: this.data.page,
                type:this.data.type
            },
            success: (res) => {
                if (res.data.status == 1) {
                    if(res.data.data.procomment.length<6){
                        this.setData({
                            noMore:true
                        })
                    }else{
                        this.setData({
                            noMore:false
                        })
                    }
                    var _commentLists = this.data.commentLists;
                    for (var i = 0; i < res.data.data.procomment.length; i++) {
                        _commentLists.push(res.data.data.procomment[i]);
                    }
                    this.setData({
                        commentLists: _commentLists,
                        good:res.data.data.good,
                        medium:res.data.data.medium,
                        picnums:res.data.data.picnums,
                        chaseratings:res.data.data.chaseratings,
                        bad:res.data.data.bad
                    })
                    // 隐藏加载框
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
                this.commentListsFunc()
            },500)
        }
    },
    commentTypeTab(e){
        var id = e.target.dataset.id;
        this.setData({
            isActive:id,
            type:id,
            page:1,
            commentLists:[]
        });
        this.commentListsFunc()
    },
    //点赞
    commentLikeFunc(e){
        if(e.currentTarget.dataset.islike == 0){//未点赞
            wx.request({//点赞
                url: app.baseUrl + '/index.php/Api/Product/addcommentlikes',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                data: {
                    token:"",
                    commentid:e.currentTarget.dataset.id
                },
                success: (res) => {
                    if (res.data.status == 1) {
                        this.onLoad()
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
        }else{//已点赞
            wx.request({//取消点赞
                url: app.baseUrl + '/index.php/Api/Product/delcommentlikes',
                method: "POST",
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                data: {
                    token:"",
                    commentid:e.currentTarget.dataset.id
                },
                success: (res) => {
                    if (res.data.status == 1) {
                        this.onLoad()
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
        }

    },
    //跳转到评论详情页
    goCommentDetail(e){
        wx.navigateTo({
           url: "../commentDetail/commentDetail?commentid="+e.currentTarget.dataset.id
        });
    },
})
