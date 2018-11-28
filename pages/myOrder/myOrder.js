const app = getApp()

Page({
    data: {
        type:0,
        orderLists:[],
    },
    onLoad(option) {
        this.setData({
            type:option.type
        })
    },
    tabOrder(e){
        this.setData({
            type:e.currentTarget.dataset.type
        })
    },
})
