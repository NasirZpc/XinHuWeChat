const app = getApp()

Page({
    data:{
        commentid:'',
        commentDetail:'',
    },
    onLoad(option) {
        this.setData({
            commentid : option.commentid,
        })
        this.commentDetailFunc()
    },
    commentDetailFunc(){
        wx.showLoading({
            title: '玩命加载中',
        })
        //评论列表
        wx.request({
            url: app.baseUrl + '/index.php/Api/Product/getcommentdetail',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                commentid: this.data.commentid,
                token: app.globalData.token,
            },
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        commentDetail : res.data.data
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
})
