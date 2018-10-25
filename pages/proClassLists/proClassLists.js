const app = getApp()

Page({
    data:{
        type:'',//分类
        state:'-1',
        scrollLeft:'',
        firstClassLists : [],
    },
    onLoad(option) {
        this.setData({
            type:option.type
        })
        var _state,
            _scrollLeft;
        if(this.data.type == 10){
            _state = '-1'
            _scrollLeft = '0'
        }else if(this.data.type == 1){
            _state = '8'
            _scrollLeft = '800'
        }else if(this.data.type == 2){
            _state = '4'
            _scrollLeft = '800'
        }else if(this.data.type == 3){
            _state = '7'
            _scrollLeft = '800'
        }else if(this.data.type == 4){
            _state = '9'
            _scrollLeft = '800'
        }
        this.setData({
            state:_state,
            scrollLeft:_scrollLeft
        })
        this.firstClassFunc()
    },
    //一级分类
    firstClassFunc(){
        wx.request({
            url: app.baseUrl + '/index.php/Product/getprocat',
            method: "GET",
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        firstClassLists: res.data.data
                    })
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
    //点击一级分类
    clickFirstClass(e){
        this.setData({
            state: e.target.dataset.index
        })
    },
    //商品详情页
    goProLists(e){
        wx.redirectTo({
           url: "../proLists/proLists?txt="+e.currentTarget.dataset.txt+"&shopid="+this.data.shopid+"&shopcatid="+this.data.shopcatid
        });
    },
})
