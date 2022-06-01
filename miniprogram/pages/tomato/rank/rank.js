// pages/rank/rank.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        abc:"",

    },
    
    /**
     * 生命周期函数--监听页面加载
      *///options
    onLoad: function () {
        // wx.cloud.database().collection('totaltime').aggregate().sort({totalTime: -1}).end()
        wx.cloud.database().collection("totaltime").orderBy('totalTime','desc').get().then(res=>{
            // console.log(res);
            this.setData({
                abc:res.data
            })
        })

    },
    //监听下拉的函数
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading()
            wx.cloud.database().collection("totaltime").orderBy('totalTime','desc').get().then(res=>{
            // console.log(res);
             this.setData({
                 abc:res.data
             })
         }).catch(err => {
             console.log(err);
         })
         //模拟加载
         setTimeout(function(){
             wx.hideNavigationBarLoading()
             wx.stopPullDownRefresh()
         },1000)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})