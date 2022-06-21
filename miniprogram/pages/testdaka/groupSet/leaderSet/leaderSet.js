// pages/testdaka/groupSet/leaderSet/leaderSet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myname:'我的名字',
    groupid:'abcdefghijklmn',
    groupMember:[
      // {wxurl:"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKKOWAmUxaHaIukl0M80BT6eIw8zW30E3muSOWLmEfhU60syBGHnGx3PJxIFPFt1tn9cwh45ibZ1Qg/132"},
    ],
  },
  transfer(){
    wx.showToast({
      title: '转移小组长',
    })
  },
  secede(){
    wx.showToast({
      title: '退出小组',
    })
  },
  showDayNum(){
    wx.showToast({
      title: '开发中，敬请期待',
      icon:"none"
    })
  },
  joinGroup(){
    wx.showToast({
      title: '开发中，敬请期待',
      icon:"none"
    })
  },
  //解散小组
  secede(){
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否确定退出？',
      success(abc) {
        if (abc.confirm) {
          wx.showLoading({
            title: '退出中',
          }).then(res=>{
            let groupid = that.data.groupData.uuid
            that.setData({
              isupdate:true
            })
            wx.cloud.callFunction({
              name:"daka",
              data:{
                type:"secedeGroup",
                groupid:groupid,
              }
            }).then(res=>{
              wx.hideLoading({
                success: (res) => {
                  wx.showToast({
                    title: '退出成功',
                  }).then(res=>{
                    wx.navigateBack({
                      delta: 2,
                    })
                  })
                },
              })
            })
          })
        } else if (abc.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },
  memberSet(){
    let groupMemberdata = this.data.groupMemberdata
    groupMemberdata = JSON.stringify(groupMemberdata)
    wx.navigateTo({
      url: '../memberSet/memberSet?groupMemberdata='+groupMemberdata,
    })
  },
  getMember(groupid){
    wx.cloud.callFunction({
      name:"daka",
      data:{
        type:"getGroupMember",
        groupid:groupid,
      }
    }).then(res=>{
      console.log(res);
      let data = res.result.data
      let groupMember = []
      for (let i = 0; i < data.length; i++) {
        let obj = {
          wxurl:data[i].member_url
        }
        groupMember.push(obj)
      }
      this.setData({
        groupMember,
        groupMemberdata:data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let args = wx.getStorageSync('args');
    var groupData = JSON.parse(options.thisGroupData)
    console.log(groupData);
    this.setData({
      myname:args.nickName,
      groupname:groupData.groupName,
      args,
      groupid:groupData.uuid,
      groupData
    })
    this.getMember(groupData.uuid);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})