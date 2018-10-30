const app = getApp()

Page({
    data: {
        type: '', //分类
        state: '-1',
        scrollLeft: 0,
        firstClassLists: [],
        allClassLists: [],
        secondClassLists: [],
        firstClassId: '0',
        current:0,
    },
    onLoad(option) {
        this.setData({
            type: option.type
        })
        this.firstClassFunc()
        this.allClassFunc()

    },

    //一级分类
    firstClassFunc() {
        wx.showLoading({
            title: '玩命加载中',
        })
        wx.request({
            url: app.baseUrl + '/index.php/Product/getprocat',
            method: "GET",
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        firstClassLists: res.data.data
                    })
                    var _state,
                        _scrollLeft;
                    if (this.data.type == 10) {
                        _state = '-1'
                        _scrollLeft = '0'
                    } else if (this.data.type == 1) {
                        _state = '8'
                        _scrollLeft = '1000'
                    } else if (this.data.type == 2) {
                        _state = '4'
                        _scrollLeft = '120'
                    } else if (this.data.type == 3) {
                        _state = '7'
                        _scrollLeft = '800'
                    } else if (this.data.type == 4) {
                        _state = '9'
                        _scrollLeft = '1000'
                    }
                    this.setData({
                        state: _state,
                        scrollLeft: _scrollLeft
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        duration: 2500,
                        icon: 'none',
                        mask: true
                    })
                }
                setTimeout(()=>{
                    wx.hideLoading()
                },500)
            }
        });
    },
    //一二级分类
    allClassFunc() {
        wx.request({
            url: app.baseUrl + '/index.php/Api/Product/assort',
            method: "GET",
            success: (res) => {
                if (res.data.status == 1) {
                    this.setData({
                        allClassLists: res.data.data
                    })
                    var _secondClassLists = []
                    if (this.data.state == -1) { //全部
                        for (var i = 0; i < res.data.data.length; i++) {
                            for (var j = 0; j < res.data.data[i].child.length; j++) {
                                _secondClassLists.push(res.data.data[i].child[j])
                            }
                        }
                    } else {
                        for (var j = 0; j < res.data.data[this.data.state].child.length; j++) {
                            _secondClassLists.push(res.data.data[this.data.state].child[j])
                        }
                    }
                    this.setData({
                        secondClassLists: this.returnAttr(_secondClassLists)
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
    //点击一级分类获取二级分类
    clickFirstClass(e) {
        wx.showLoading({
            title: '玩命加载中',
        })
        this.setData({
            state: e.target.dataset.index,
            firstClassId: e.target.dataset.id,
            current:0
        })
        var _secondClassLists = [];
        for (var i = 0; i < this.data.allClassLists.length; i++) {
            if(this.data.state == -1){
                for (var j = 0; j < this.data.allClassLists[i].child.length; j++) {
                    _secondClassLists.push(this.data.allClassLists[i].child[j])
                }
            }else{
                if (this.data.firstClassId == this.data.allClassLists[i].id) {
                    _secondClassLists = this.data.allClassLists[i].child
                }
            }
        }
        this.setData({
            secondClassLists: this.returnAttr(_secondClassLists)
        })
        setTimeout(()=>{
            wx.hideLoading()
        },500)
    },
    //处理数组
    returnAttr(data){
        let subArrayNum = 8;
        var dataArr = new Array(Math.ceil(data.length / subArrayNum));
        for(let i = 0; i < dataArr.length;i++) {

            dataArr[i] = new Array();
            for(let j = 0; j < subArrayNum; j++) {
                dataArr[i][j] = '';
            }
        }
        for(let i = 0; i < data.length;i++) {
            dataArr[parseInt(i / subArrayNum)][i % subArrayNum] = data[i];
        }
        return dataArr
    },
    //商品详情页
    goProLists(e) {
        wx.redirectTo({
            url: "../proLists/proLists?txt=" + e.currentTarget.dataset.txt + "&shopid=" + this.data.shopid + "&shopcatid=" + this.data.shopcatid
        });
    },
})
