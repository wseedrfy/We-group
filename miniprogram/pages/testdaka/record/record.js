//开发者需注意：假如测试的时候把所对应的任务的在daka_status表里所对应的数据删除后，会出现bug打不了卡。但页面上仍有（因为渲染是根据daka_record表渲染的）
// 原理分析：打卡会操作daka_status表，删了会空指针报错
const _=wx.cloud.database().command
const db = wx.cloud.database()
const util = require('../../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        starttime:'输入开始时间',//这个用户输入的开始时间，下面那个是结束时间
        endtime:'输入结束时间',
        cycleitems:[
            // { name: '每天', value: 'Everyday' },
            { name: '周一', value: '周一' },
            { name: '周二', value: '周二' },
            { name: '周三', value: '周三' },
            { name: '周四', value: '周四' },
            { name: '周五', value: '周五' },
            { name: '周六', value: '周六' },
            { name: '周日', value: '周日' },
        ],
        bqshuru:0,
        array: ['学习', '工作', '阅读', '思考','运动'],
        qxbq:'请点击选择标签',
        objectArray: [
            {
              id: 0,
              name: '请点击选择标签'
            },
            {
              id: 1,
              name: '学习'
            },
            {
              id: 2,
              name: '工作'
            },
            {
              id: 3,
              name: '阅读'
            },
            {
              id: 4,
              name: '思考'
            },
            {
              id: 5,
              name: '运动'
            }
        ],
        index: 0,
        items:[
            {'value': '四级'},
            {'value': '六级'},
            {'value': '跑步'},
            {'value': '篮球'},
          ],
        lable2:""
    },
    bindPickerChange(e){
        console.log('picker发送选择改变，携带值为', e.detail.value)
        let array =this.data.array
        let index =e.detail.value
        this.setData({
            index, 
            qxbq:array[index]
        })
         
        let index1 = this.data.index
        if( index1 !=-1){
          this.setData({
            bqshuru:1
          })
          console.log('bqshuru:',this.data.bqshuru)
        }else{
            console.log('erro!!!')
        }
    },
    userCheck:function(e){//热榜标签复选框
        let index = e.currentTarget.dataset.id;//获取用户当前选中的索引值
        let checkBox = this.data.items;
        if (checkBox[index].checked){
          this.data.items[index].checked = false;
        }else{
          this.data.items[index].checked = true;
        }
        this.setData({ items: this.data.items})
        var reduArr = new Array();
        //返回用户选中的值
        let value = checkBox.filter((item,index)=>{
          if(item.checked == true){
            reduArr.push(item.value);
          }
        })
        this.data.lable2=reduArr
        console.log(reduArr);
    },
    bindstattimeChange: function (e) {//用户输入开始时间传参
        console.log('用户输入开始时间，携带值为', e.detail.value)
        this.setData({
          starttime: e.detail.value
        })
      },
    bindendtimeChange: function (e) {//用户结束开始时间传参
        console.log('用户输入结束时间，携带值为', e.detail.value)
        this.setData({
          endtime: e.detail.value
        })
    },

    //生成一个活着都不会出现重复的一大串字符
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0,
              v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
      });
    },
    hash(input){
    var I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');

     var hash = 5389;
     var i = input.length - 1;
      
     if(typeof input == 'string'){
      for (; i > -1; i--)
       hash += (hash << 5) + input.charCodeAt(i);
     }
     else{
      for (; i > -1; i--)
       hash += (hash << 5) + input[i];
     }
     var value = hash & 0x7FFFFFFF;
      
     var retValue = '';
     do{
      retValue += I64BIT_TABLE[value & 0x3F];
     }
     while(value >>= 1);
      
     return retValue;
    },
    //节流
    saveRecord:util.throttle(function(res){
      console.log(res);
      this.saveRecord_last(res)
    },500),

    async saveRecord_last(res){
      console.log(res);
      let username = wx.getStorageSync('args').username
      await db.collection('daka_record').where({username:username,is_delete:false}).get().then(res=>{
        this.setData({len:res.data.length})
      }).catch(err => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
        })
    })
      let len =this.data.len
      console.log(len);

      var value = res[0].detail.value
      console.log(value)
      let {cycle,endTime,lable1,startTime,task} = value
      if(!task){
        wx.showToast({
          title: '任务不能为空~',
          icon: 'none',
          duration: 1000
        })
      }else if(task.length >= 8){
        wx.showToast({
          title: '任务名字不能过长噢~最多7个字',
          icon: 'none',
          duration: 1000
        })
      }else if(startTime == "输入开始时间"){
        wx.showToast({
          title: '请选择您的开始时间~',
          icon: 'none',
          duration: 1000
        })
      }else if(endTime == "输入结束时间"){
        wx.showToast({
          title: '请选择您的结束时间~',
          icon: 'none',
          duration: 1000
        })
      }else if(cycle.length == 0){
        wx.showToast({
          title: '打卡周期不能为空~',
          icon: 'none',
          duration: 1000
        })
      }else if(!lable1){
        wx.showToast({
          title: '请选择您的标签~',
          icon: 'none',
          duration: 1000
        })
      }else if(len>=10){
        wx.showToast({
          title: '最多创建10个打卡噢，请返回删除多余打卡~',
          icon: 'none',
          duration: 1000
        })
      }else{
        wx.showLoading({
          title: '提交数据中',
          //防触摸
          //防止一段时间内请求多次
          mask:true
        })
        // 获取学号
        console.log(res);
        let username = wx.getStorageSync('args').username 
        
        //给周期变中文名
        var cycleChinese = [];
        for(var i = 0; i < cycle.length; i++){
          cycleChinese.push(cycle[i])
        }
        //获取lable1的真实值
        var realLable1;
        switch(value.lable1){
          case '0':
            realLable1 = '未选择任何标签'
          case '1':
            realLable1 = '学习'
          case '2':
            realLable1 = '工作'
          case '3':
            realLable1 = '阅读'
          case '4':
            realLable1 = '思考'
          case '5':
            realLable1 = '运动'
        }
        var uid = this.guid();

        //存入打卡任务记录表
        wx.cloud.callFunction({
              name: "daka",
              data: {
                  type:"save_dakaRecord",
                  task:value.task,//
                  // 标签可以为空 
                  lable1:realLable1,
                  lable2:this.data.lable2,
                  cycle: cycleChinese,//
                  startTime: value.startTime,//
                  endTime: value.endTime,//
                  username:username,
                  hashId:this.hash(username+value.task+uid),
                  isDaka:false,
                  is_delete:false,
                  count:0,
              },
                  success: res => {
                    console.log("add", res)
                    wx.showToast({
                      duration: 4000,
                      title: '添加成功'
                    })
                    var pages = getCurrentPages()
                    var prevPage = pages[pages.length - 2]
                    prevPage.setData({
                      mydata: {
                          count:0,
                          task_name:value.task,
                          task_cycle: cycleChinese,//
                          task_start_time: value.startTime,//
                          task_end_time: value.endTime,//
                          task_isDaka:false,
                          task_hashId:this.hash(username+value.task+uid),
                      }
                    })
                    wx.navigateBack({
                      delta: 1
                    })
                  },
                  fail: err => {
                    wx.showToast({
                      icon: 'none',
                      title: '出错啦！请稍后重试'
                    })
                    console.error
                  },
          })
          // .then(res=>{
          //   console.log(res);
          //   wx.hideLoading();
          // })
        //  .then(res=>{
        //   var pages = getCurrentPages()
        //   var prevPage = pages[pages.length - 2]
        //   prevPage.setData({
        //     mydata: {
        //         count:0,
        //         task_name:value.task,
        //         task_cycle: cycleChinese,//
        //         task_start_time: value.startTime,//
        //         task_end_time: value.endTime,//
        //         task_isDaka:false,
        //         task_hashId:this.hash(username+value.task+uid),
        //     }
        //   })
        //   wx.navigateBack({
        //     delta: 1
        //   })
        // })
      }
    },
    
    cancel(){
      wx.navigateBack({
        delta: 1
      })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {  
      wx.setNavigationBarTitle({
        title: 'We打卡',
    });
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
      // this.saveRecord()
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
    onPullDownRefresh: function () {

    },

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