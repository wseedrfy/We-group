// pages/testdaka/groupSet/memberSet/memberSet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupMemberdata:[
      {member_url:'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJibDQFks5pOuShJWibDXwwdedywTShX9R6ylXkNHUuUUFgGG2P1HmgNhAvOq1ZAiaps7zTGfQd47MpQ/132',member_name:'Start from scratch'}
    ]
  },
  delMem(e){
    console.log(e);
    let uuid = e.currentTarget.dataset.iiem.uuid
    let member_username = e.currentTarget.dataset.iiem.member_username
    let myusername = this.data.args.username
    let that = this
    if (member_username==myusername) {
      wx.showToast({
        title: '您不能删除自己',
        icon:'none'
      })
    } else if (member_username!=myusername) {
      wx.showModal({
        title: '提示',
        content: '是否确定删除？',
        success(abc) {
          if (abc.confirm) {
            wx.showLoading({
              title: '删除中',
            }).then(res=>{
              that.deleteSetdata(member_username);
              wx.cloud.callFunction({
                name:"daka",
                data:{
                  type:"delMem",
                  uuid:uuid,
                  member_username:member_username
                }
              }).then(res=>{
                wx.hideLoading({})
              })
            })
          } else if (abc.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    }
  },
  deleteSetdata(member_username){
    let groupMemberdata_data = this.data.groupMemberdata
    let groupMemberdata = []
    for (let i = 0; i < groupMemberdata_data.length; i++) {
      if (member_username!=groupMemberdata_data[i].member_username) {
        let obj = {
          bgurl:groupMemberdata_data[i].bgurl,
          groupIntro:groupMemberdata_data[i].groupIntro,
          groupUsername:groupMemberdata_data[i].groupUsername,
          group_name:groupMemberdata_data[i].group_name,
          member_name:groupMemberdata_data[i].member_name,
          member_url:groupMemberdata_data[i].member_url,
          member_username:groupMemberdata_data[i].member_username,
          task:groupMemberdata_data[i].task,
          time_logs:groupMemberdata_data[i].time_logs,
          totalTime:groupMemberdata_data[i].totalTime,
          uuid:groupMemberdata_data[i].uuid,
          wxname:groupMemberdata_data[i].wxname,
          wxurl:groupMemberdata_data[i].wxurl,
          _id:groupMemberdata_data[i]._id,
        }
        groupMemberdata.push(obj)
      }
    }
    this.setData({
      groupMemberdata
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let args = wx.getStorageSync('args');
    var groupMemberdata = JSON.parse(options.groupMemberdata)
    console.log(groupMemberdata);
    this.setData({
      groupMemberdata,
      args
    })
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