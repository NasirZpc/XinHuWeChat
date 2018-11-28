const app = getApp()

Page({
    data: {
        headerImg:'',
        nickName:'',
        arraySex: ['保密','男','女'],//性别
        indexSex: 0,
        arrayAge:[],
        indexAge: 0,
    },
    onLoad(option) {
        var age = [];
        for(var i=0;i<111;i++){
            age.push(i);
        }
        this.setData({
            headerImg:app.globalData.userInfo.avatarUrl,
            nickName:app.globalData.userInfo.nickName,
            arrayAge:age,
            indexSex:app.globalData.userInfo.sex,
            indexAge:app.globalData.userInfo.age,
        })
    },
    bindIptNickName(e){
        this.setData({
            nickName:e.detail.value
        })
    },
    bindSexChange(e) {
        this.setData({
            indexSex: e.detail.value
        })
    },
    bindAgeChange(e){
        this.setData({
            indexAge: e.detail.value
        })
    },
    updataImg() {
        var that = this;
        wx.chooseImage({
            count:1,
            sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: res => {
                const Images = res.tempFilePaths
                console.log(res)

                this.setData({
                    headerImg: Images,
                });
                wx.showLoading({
                    title: '上传中...',
                    mask:true
                })
                wx.uploadFile({
                    url: app.baseUrl+'index.php/Api/Upload/uploadimg', 
                    filePath: res.tempFilePaths[0],
                    name: 'image',
                    formData: {
                        type: 1,
                        filename:'头像',
                        filepath:res.tempFilePaths[0],
                    },
                    header: {
                        "Content-Type": "multipart/form-data"
                    },
                    success(res){
                        that.setData({
                            headerImg: ''
                        });
                        wx.hideLoading()
                    },
                    fail(err){
                        console.log(err)
                    }
                })
            }
        })
    },
    //预览
    handleImagePreview(e) {
        const idx = e.target.dataset.idx
        const Images = this.data.Images
        wx.previewImage({
            current: Images[idx], //当前预览的图片
            urls: Images, //所有要预览的图片
        })
    },
})
