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

    },
    register(){
      wx.navigateTo({
        url: '../register/register',
      })
    },
    login(){
      let accountNum = this.data.account
      if (accountNum.length != 11) {
        wx.showToast({
          title: '请输入11位账号',
          icon:'error'
        })
      } else if (accountNum.length == 11) {
        wx.getUserProfile({
          desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            console.log(res.userInfo);
            let account = this.data.account
            let pwd = this.data.pwd
            let avatarUrl = res.userInfo.avatarUrl
            let nickName = res.userInfo.nickName
            let data = {
              username : account,
              nickName : nickName,
              iconUrl : avatarUrl,
              tabitem:["全部","日常","开学季","打卡"],
            }
            wx.setStorageSync('args', data)
            wx.cloud.database().collection('user').where({account:account}).get().then(res=>{
              console.log(res.data);
              console.log();
              if (res.data.length == 0) {
                wx.showToast({
                  title: '您还未注册',
                  icon: 'none'
                })
              } else if (res.data[0].pwd != pwd) {
                wx.showToast({
                  title: '密码错误',
                  icon: 'none'
                })
              } else if (res.data[0].pwd == pwd) {
                wx.showToast({
                  title: '登录成功',
                  icon: 'none',
                  success: (res) =>{
                    wx.navigateTo({
                      url: '../../testdaka/index/index',
                    })
                  }
                })
              }
            })

          }
        })
      }
    }
})
