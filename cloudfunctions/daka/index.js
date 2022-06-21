// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'env-2geom5wq2832c509',
})
const db=cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    switch(event.type){
        case "save_dakaRecord":
            return save_dakaRecord(event);
        case "getDakaRecord_ByHashId":
            return await getDakaRecord_ByHashId(event);
        case "updateDakaRedord_ByHashId":
            return await updateDakaRedord_ByHashId(event);
        case "delDakaRecord_ByHashId":
            return delDakaRecord_ByHashId(event);
        case "getAllDakaRecord":
            return await getAllDakaRecord(event);
        case "updateIsDaka":
            return updateIsDaka(event);
        case "getmember":
            return await getmember(event);
        case "getgroupdata":
            return await getgroupdata(event);
        case "getTotalTime_ByUserName":
            return await getTotalTime_ByUserName();
        case "getGroupMemberByUUID":
            return await getGroupMemberByUUID(event);
        case "addGroupMember":
            return addGroupMember(event);
        case "addGroup":
            return addGroup(event);
        case "createDakaChallenge": //创建打卡挑战
            return createDakaChallenge(event);
        case "joinDakaChallenge": //加入打卡挑战
            return joinDakaChallenge(event);
        case "getMyDakaChallenge": //获得成员打卡挑战信息 杰
            return await getMyDakaChallenge(event);
        case "getMyCompleteDakaChallenge": //获得成员完成打卡挑战信息 杰
            return await getMyCompleteDakaChallenge(event);
        case "addDakaChallengeCount": //增加挑战打卡次数
            return addDakaChallengeCount(event);
        case "getMyGroupByUserNum": //获取我的小组信息
            return await getMyGroupByUserNum(event);
        case "getPostByGroupId":  //获取小组里的所有帖子
            return await getPostByGroupId(event);
        case "getChallenge":  //获取小组未过期的打卡挑战
            return await getChallenge(event);
        case "getAllChallenge":  //获取小组里的全部打卡挑战 
            return await getAllChallenge(event);
        case "jubaopost":  //举报帖子
            return await jubaopost(event);
        case "removepost":  //删除帖子
            return await removepost(event);//
        case "getGroupMember":  //查询小组成员
            return await getGroupMember(event);
        case "secedeGroup":  //退出小组
            return await secedeGroup(event);
        case "delMem":  //删除小组成 
            return await delMem(event);
        case "searchGroup":  //搜索小组
            return await searchGroup(event);
    }
}

function save_dakaRecord(event){
    return db.collection("daka_record").add({
        data:{
            task:event.task,
            lable1:event.lable1,
            lable2:event.lable2,
            cycle:event.cycle,
            startTime:event.startTime,
            endTime:event.endTime,
            username:event.username,
            hashId:event.hashId,
            isDaka:event.isDaka,
            is_delete:event.is_delete,
            count:event.count,
            daka_lastTime:event.daka_lastTime,
        }
    })
}

async function getDakaRecord_ByHashId(event){
    return await db.collection("daka_record").where({hashId:event.hashId}).get();
}

async function updateDakaRedord_ByHashId(event){
    return await db.collection("daka_record").where({
        hashId:event.hashId
    }).update({
        data:{
            isDaka:true,
            //次数自增1
            count:_.inc(1),
            daka_lastTime:new Date(),
        }
    })
}

function delDakaRecord_ByHashId(event){
    return db.collection("daka_record").where({
        hashId:event.hashId
    }).update({
        data: {
            is_delete:true
        }
    }).then(res=>{
        console.log(res);
    })
}

async function getAllDakaRecord(event){
    return await db.collection("daka_record").where({
        username:event.username,
        is_delete:event.is_delete,
    }).get()
}

function updateIsDaka(event){
    return db.collection("daka_record").where({
        hashId:event.hashId
    }).update({
        data:{
            isDaka:event.isDaka,
        }
    })
}

async function getmember(event){
    return await db.collection("daka_group_member_information").get();
}

async function getgroupdata(event){
    return await db.collection("data_group_information").get();
}

async function getTotalTime_ByUserName(){
    return await db.collection("totaltime").get();
}

async function getGroupMemberByUUID(event){
    return await db.collection("daka_group_member_information").where({
        uuid:event.uuid
    }).get()
}

function addGroupMember(event){
    db.collection("daka_group_member_information").add({
        data:{
            group_name:event.group_name,
            member_name:event.member_name,
            member_url:event.member_url,
            member_username:event.member_username,
            task:event.task,
            time_logs:event.time_logs,
            totalTime:event.totalTime,
            uuid:event.uuid,
        }
    })
}

function addGroup(event){
    db.collection("daka_group_information").add({
        data:{
            group_name:event.group_name,
            introduce:event.introduce,
            notice:event.notice,
            username:event.username,
            uuid:event.uuid,
            wxname:event.wxname, 
            wxurl:event.wxurl,
            imgUrl:event.imgUrl,
            roomNum:event.roomNum,
            qxbq:event.qxbq,
            creattime:event.creattime,
        }
    })
}

function createDakaChallenge(event){
    db.collection("dakaChallenge_information").add({
        data:{
            challengeguide:event.challengeguide,
            challengeid:event.challengeid,
            challengename:event.challengename,
            deadline:event.deadline,
            deadlinetime:event.deadlinetime,
            ispastdue:event.ispastdue,
            totalday:event.totalday, 
            usernum:event.usernum,
            wxname:event.wxname,
            wxurl:event.wxurl,
        }
    })
}

function joinDakaChallenge(event){
    db.collection("dakaChallenge_member").add({
        data:{
            challengename:event.challengename,
            challengeuuid:event.challengeuuid,
            // dakalog: 不知道怎么加
            dayrequire:event.dayrequire,
            iscomplete:false,
            totalday:0,
            usernum:event.usernum,
            wxname:event.wxname,
            wxurl:event.wxurl,
        }
    })
}

async function getMyDakaChallenge(event){ 
    let mydata = await db.collection("dakaChallenge_member").where({
        usernum:event.usernum,
        challengeuuid:event.challengeuuid,
    }).get()
    return mydata
}
async function getMyCompleteDakaChallenge(event){ 
  let completeNum = await db.collection("dakaChallenge_member").where({
      challengeuuid:event.challengeuuid,
      iscomplete:true
   }).get()
   return completeNum
}


function addDakaChallengeCount(event){
    db.collection("dakaChallenge_member").where({
        usernum:event.usernum,
        challengeuuid:event.challengeuuid,
    }).update({
        data:{
            //次数自增1
            totalday:_.inc(1),
        }
    })
}

async function getMyGroupByUserNum(event){
    return await db.collection("daka_group_member_information").where({
        member_username:event.usernum,
    }).get()
}

async function getPostByGroupId(event){
    return await db.collection("personalDynamic").where({
        groupuuid:event.groupId
    }).get()
}

async function getChallenge(event){
  return await db.collection("dakaChallenge_information").where({
    groupid:event.groupId,
    ispastdue:event.ispastdue
  }).get()

}
async function getAllChallenge(event){
  return await db.collection("dakaChallenge_information").where({
    groupid:event.groupId,
  }).get()

}
function jubaopost(event){
  console.log(event);
  db.collection("personalDynamic").where({
      postid:event.postid
  }).update({
      data:{
          report:true,
      }
  })
}
function removepost(event){
  db.collection("personalDynamic").where({
      postid:event.postid
  }).remove({ 
    success: function(res) {
      console.log(res.data)
    }
  })
}
async function getGroupMember(event){
  return await db.collection("daka_group_member_information").where({
    uuid:event.groupid,
  }).get()
}
async function secedeGroup(event){
  db.collection("daka_group_member_information").where({
      uuid:event.groupid
  }).remove({
    success: function(res) {
      console.log(res.data)
    }
  })
}
function delMem(event){
  db.collection("daka_group_member_information").where({
      uuid:event.uuid,
      member_username:event.member_username
  }).remove({ 
    success: function(res) {
      console.log(res.data)
    }
  })
}
async function searchGroup(event){
  return await db.collection("data_group_information").where({
    uuid:event.groupid,
  }).get()
}