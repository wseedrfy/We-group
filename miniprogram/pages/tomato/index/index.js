const util = require('../../../utils/util.js')
const app = getApp()
Page({
    data: {
        statusBarHeight: getApp().globalData.statusBarHeight,
        lineHeight: getApp().globalData.lineHeight,
        logsa:{},//放云端的logs
        clockshow: false,
        clockHeight: 0,
        time: '5',
        mTime: 300000,
        timeStr: '05:00',
        timer: null,
        rate: '',
        taskshow:'番茄时钟',
        task:[{name:'工作'},{name:'学习'},{name:'休息'},{name:'睡觉'},{name:'写bug'},{name:'修bug'}],
        cateActive: '0',
        okShow: false,
        pauseShow: false,
        continueCancelShow: false,
        userInfo: {},
        hasUserInfo: false,
        isRuning:false,
        pickershow:false,
    },
    clickpicker(){
        console.log("clickpicker");
        let pickershow = this.data.pickershow
        this.setData({
            pickershow:!pickershow
        })
    },
    pickerdata(e){
        console.log(e);
        this.setData({
            taskshow:e.currentTarget.dataset.task,
            pickershow:false
        })
    },
    init_canvas(){
          let wpx = wx.getSystemInfoSync().windowWidth/375
          let iconurl = wx.getStorageSync('args').iconUrl;
          const query = wx.createSelectorQuery()
          query.select('#bottombox_clock_bg')
          .fields({ node: true, size: true })
          .exec((res) => {
              console.log(res);
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = res[0].width * dpr
            canvas.height = res[0].height * dpr
            ctx.scale( dpr,dpr)
            this.setData({
              ctx,canvas,wpx
            })
            this.new_drawbg(ctx);
          })
        
      },
      init_canvas2(){
          let wpx = wx.getSystemInfoSync().windowWidth/375
          const query = wx.createSelectorQuery()
          query.select('#bottombox_clock_active')
          .fields({ node: true, size: true })
          .exec((res) => {
            const canvas2 = res[0].node
            const ctx2 = canvas2.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas2.width = res[0].width * dpr
            canvas2.height = res[0].height * dpr
            ctx2.scale( dpr,dpr)
            this.setData({
              ctx2,canvas2
            })
          })
      },
        //更新开始键点击事件
    start: function() {
        console.log('start');
        let ctx2 = this.data.ctx2
        let isRuning = this.data.isRuning
        if (!isRuning) {
            //开始计时
            this.setData({
                pauseShow:true,
                isRuning:true,
                mTime: this.data.time * 60 * 1000,
                timeStr: parseInt(this.data.time) >= 10 ? this.data.time + ':00' : '0' + this.data.time + ':00',
            })
            this.drawActive();
          } else {
            //放弃
            ctx2.clearRect(0,0,600,600)
            clearInterval(this.data.timer);
            this.setData({
                isRuning:false,
                pauseShow: false,
                continueCancelShow: false,
                okShow: false,
                mTime: this.data.time * 60 * 1000,
                timeStr: parseInt(this.data.time) >= 10 ? this.data.time + ':00' : '0' + this.data.time + ':00',
            })
          }
    },
    //动态画圆
    drawActive: function() {
        let ctx2 = this.data.ctx2;
        var _this = this; //此this指向该页的page
        var timer = setInterval(function() {
            var angle = 1.5 + 2 * (_this.data.time * 60 * 1000 - _this.data.mTime) / (_this.data.time * 60 * 1000);
            var currentTime = _this.data.mTime - 100;
            _this.setData({
                mTime: currentTime
            });
            if (angle < 3.5) {
                if (currentTime % 1000 == 0) {
                    var timeStr1 = currentTime / 1000; //s
                    var timeStr2 = parseInt(timeStr1 / 60); //得到一个整的分钟数
                    var timeStr3 = (timeStr1 - timeStr2 * 60) >= 10 ? (timeStr1 - timeStr2 * 60) : '0' + (timeStr1 - timeStr2 * 60);
                    var timeStr2 = timeStr2 >= 10 ? timeStr2 : '0' + timeStr2;
                    _this.setData({
                        timeStr: timeStr2 + ':' + timeStr3
                    })
                }
                var lineWidth = 13 / _this.data.rate;
                ctx2.lineWidth=Number(lineWidth);
                ctx2.strokeStyle='#5879fa';
                ctx2.lineCap='round'; //形状
                ctx2.beginPath(); //开新路径
                ctx2.arc(600 / _this.data.rate / 2, 600 / _this.data.rate / 2, 600 / _this.data.rate / 2 - 2 * lineWidth, 1.5 * Math.PI, angle * Math.PI, false);
                //(圆心x，y，度数0，到2*math.PI,逆时针false)  一点一点得画
                ctx2.stroke();
            } else {
                wx.showLoading({
                  title: '上传数据中',
                })
                let logs = [
                    {date:util.formatTime(new Date),
                    cate:_this.data.taskshow,
                    // Number(_this.data.cateActive),  
                    time:Number(_this.data.time),}
                ]
                let date=util.formatTime(new Date)
                let cate=_this.data.taskshow
                // _this.data.cateActive
                let time=_this.data.time
                let storageInfo=_this.data.storageInfo
                let username = String(storageInfo.username)
                wx.cloud.database().collection("totaltime").where({username:username}).get().then(res=>{
                    let name = storageInfo.nickName
                    let touxiangurl = storageInfo.iconUrl
                    let len = res.data.length
                    let totaltime = wx.cloud.database().collection("totaltime")
                    let totalTime = 0
                    // let logs=_this.data.logsa
                    const _=wx.cloud.database().command
                    if (len == 0) { //用学号username判断用户在数据库有没有数据
                        console.log('123')
                        totaltime.add({
                            data: {
                                totalTime,
                                logs:logs,
                                name,
                                touxiangurl,
                                username:String(username)
                            }
                        }).then(res => {
                            console.log(res);
                            wx.hideLoading();
                        })
                    }else {
                        totaltime.where({username:username}).update({
                            data: {
                                logs: _.push({
                                    date:date,
                                    cate:cate,
                                    time:_this.data.time
                                })
                            }
                        }).then(res=>{
                            console.log('添加成功')
                        })
                    }
                })
                _this.setData({
                    timeStr: '00:00',
                    okShow: true,
                    pauseShow: false,
                    continueCancelShow: false,
                })
                clearInterval(timer);
                console.log(logs);
                wx.hideLoading();
            }
        }, 100);
        _this.setData({
            timer: timer
        })
    },
    new_drawbg(ctx){
        var lineWidth = 13 / this.data.rate;
        ctx.lineWidth=Number(lineWidth);
        ctx.strokeStyle='#d0dafd';
        ctx.lineCap='round'; //形状
        ctx.beginPath(); //开新路径
        ctx.arc(600 / this.data.rate / 2, 600 / this.data.rate / 2, 600 / this.data.rate / 2 - 2 * lineWidth, 0, 2 * Math.PI, false);
        //(圆心x，y，度数0，到2*math.PI,逆时针false)
        ctx.stroke();
    },
    //监听加载页
    onLoad: function() {
        console.log("w",wx.getSystemInfoSync().windowWidth);
        console.log("h",wx.getSystemInfoSync().windowHeight);
        var res = wx.getSystemInfoSync(); //获取设备的信息
        var rate = 750 / res.windowWidth;
        //console.log(rate);
        this.setData({
            rate: rate,
            clockHeight: rate * res.windowHeight
        })
        let that = this
        wx.getStorage({
            key: 'args',
            success(res) {
              that.setData({
                storageInfo: res.data,
              });
            },
            fail(err) {
              console.log("失败失败失败");
            }
          })
        this.init_canvas();
        this.init_canvas2();
    },
    //更新滑动条时间
    slideChange: function(e) {
        this.setData({
            time: e.detail.value,
        })
        this.setData({
            mTime: this.data.time * 60 * 1000,
            timeStr: parseInt(this.data.time) >= 10 ? this.data.time + ':00' : '0' + this.data.time + ':00',
        })
    },
    //更新点击选择做的事件获取index
    clickCate: function(e) {
        this.setData({
            cateActive: e.currentTarget.dataset.index
        })
        console.log(e)
    },
    //暂停
    pause: function() {
        clearInterval(this.data.timer);
        this.setData({
            pauseShow: false, //暂停框
            continueCancelShow: true, //继续放弃框
            okShow: false, //返回框
        })

    },
    continue: function() {
        this.drawActive();
        this.setData({
            pauseShow: true,
            continueCancelShow: false,
            okShow: false,
        })
    },
    ok: function() {
        let ctx2 =this.data.ctx2
        ctx2.clearRect(0,0,600,600);
        clearInterval(this.data.timer);
        this.setData({
            isRuning:false,
            pauseShow: false,
            continueCancelShow: false,
            okShow: false,
            clockshow: false,
        })
    },
    // 事件处理函数
    bindViewTap() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    statistics: function(){ 
        wx.navigateTo({
          url: '../logs/logs',
        })
    },
    rank: function() {
        wx.navigateTo({
          url: '../rank/rank',
        })
    },
    text(){
        wx.navigateTo({
          url: '../text/text',
        })
    },
    changeType: function(e) {
            let username = wx.getStorageSync('args').username
            wx.cloud.database().collection("totaltime").where({username:username}).get().then(res=>{
                let logs = res.data[0].logs
                //console.log(this.data.list)
            })
    },
    res(res){
        console.log(res)
    },
    backto(){
        wx.navigateBack({
            delta: 1
          })
    }
})