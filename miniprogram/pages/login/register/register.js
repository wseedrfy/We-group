// index.js
Page({
  data:{
      account:'',
      pwd:'',
      click:false,
      statusBarHeight: getApp().globalData.statusBarHeight,
      lineHeight: getApp().globalData.lineHeight,
  },
  back(){
    wx.navigateBack({
      delta: 1,
    })
  },
  register(){
    console.log("11");
    let accountNum = this.data.account
    let pwdNum = this.data.pwd
    if (accountNum.length != 11) {
      wx.showToast({
        title: '请输入11位账号',
        icon:'error'
      })
    }else if (pwdNum.length < 6) {
      wx.showToast({
        title: '请输入至少6位的密码',
        icon:'none'
      })
    }else if (accountNum.length == 11 && (pwdNum.length > 6 || pwdNum.length == 6)) {
      let that = this
      wx.showModal({
        title: '提示',
        content: '是否确定注册该账号？',
        success(abc) {
          if (abc.confirm) {
            wx.getUserProfile({
              desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
              success: (res) => {
                console.log(res.userInfo);
                let account = that.data.account
                let pwd = that.data.pwd
                let avatarUrl = res.userInfo.avatarUrl
                let nickName = res.userInfo.nickName
                wx.showLoading({
                  title: '注册中',
                })
                wx.cloud.database().collection('user').where({account:account}).get().then(res=>{
                  if (res.data.length == 0) {
                    wx.cloud.database().collection('user').add({
                      data:{
                        account,
                        pwd,
                        avatarUrl,
                        nickName
                      }
                    }).then(res=>{
                      wx.hideLoading({
                        success: (res) => {
                          wx.showToast({
                            title: '注册成功'
                          }).then(res=>{
                            wx.navigateBack({
                              delta: 1,
                            })
                          })
                        },
                      })
                    })
                  } else if (res.data.length != 0) {
                    wx.hideLoading({
                      success: (res) => {
                        wx.showToast({
                          title: '该账号已经注册过了',
                          icon: "error"
                        })
                      },
                    })
                  }
                })
              }
            })
          } else if (abc.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    }
  },
  login(){
    wx.navigateTo({
      url: '../index/index',
    })
  },
  account(e){
      console.log(e);
      this.setData({
          account:e.detail.value
      })
  },
  pwd(e){
      this.setData({
          pwd:e.detail.value
      })
  },
  click(){
      let that = this
      console.log('1');
      let click = this.data.click
      if(click == true){
          console.log("2");
          this.setData({
              click:false
          })
      }else{
          this.setData({
              click:true
          })
      }

  }
})
