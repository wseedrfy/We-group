// index.js
Page({
    data:{
        account:'',
        pwd:'',
        click:false,
        statusBarHeight: getApp().globalData.statusBarHeight,
        lineHeight: getApp().globalData.lineHeight,
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
