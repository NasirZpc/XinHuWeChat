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
        //排序
        sort : '',
        curActive : 0,
        page:1,
        proLists:[],
        noMore:false,
    },
    onLoad(option) {
        if(option.type ==10){
            this.setData({
                type: ''
            })
        }else{
            this.setData({
                type: option.type
            })
        }

        this.firstClassFunc()
        this.allClassFunc()
        this.proListsFunc()
    },

    //一级分类
    firstClassFunc() {
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
                    if (this.data.type == '') {
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
            current:0,
            type:e.target.dataset.id,
            proLists : [],
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
        this.proListsFunc()
        setTimeout(()=>{
            wx.hideLoading()
        },500)
    },
    //点击二级分类
    clickSecondClass(e){
        wx.showLoading({
            title: '玩命加载中',
        })
        this.setData({
            type:e.target.dataset.id,
            proLists : [],
        })
        this.proListsFunc()
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
    //点击筛选
    sortFunc(e){
        this.setData({
            curActive : e.currentTarget.dataset.type,
            page : 1,
            proLists : [],
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
        this.proListsFunc()
    },
    //商品列表
    proListsFunc(){
        wx.showLoading({
            title: '玩命加载中',
        })
        wx.request({
            url: app.baseUrl + 'index.php/Api/Product/getlist',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                cid:this.data.type,
                sort:this.data.sort,
                pagesize: 6,
                p: this.data.page,
            },
            success: (res) => {
                if (res.data.status == 1) {
                    if(res.data.data.length<6){
                        this.setData({
                            noMore:true
                        })
                    }else{
                        this.setData({
                            noMore:false
                        })
                    }
                    var _shopProLists = this.data.shopProLists;
                    for (var i = 0; i < res.data.data.length; i++) {
                        _shopProLists.push(res.data.data[i]);
                    }
                    this.setData({
                        shopProLists: _shopProLists
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
    //上拉加载
    onReachBottom() {
        if(!this.data.noMore){
            // 显示加载图标
            wx.showLoading({
                title: '玩命加载中',
            })
            // 页数+1
            this.data.page = this.data.page + 1;
            setTimeout(()=>{
                this.proListsFunc()
            },500)
        }
    },
    //商品详情页
    goProDetail(e){
        wx.navigateTo({
           url: "../proDetail/proDetail?proid="+e.currentTarget.dataset.id + '&isactivity=0'
        });
    },
})
