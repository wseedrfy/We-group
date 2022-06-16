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
        let obj = {wxurl:data[i].member_url}
        groupMember.push(obj)
      }
      this.setData({
        groupMember
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