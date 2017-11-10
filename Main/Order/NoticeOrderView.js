/**
 * Created by Arlen_JY on 2017/11/8.
 */


import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
import HttpRequest from '../../HttpRequest/HttpRequest';
var Global = require('../../common/globals');


import {CachedImage} from "react-native-img-cache";
import {
    StyleSheet,
    View,
    Text,
    Alert,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity
}   from 'react-native';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import moment from 'moment';
Date.prototype.format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};
export default class NoticeOrderView extends Component{
    constructor (props){
        super(props)

        this.state = {

            groupTitle:'',
            groupDetail:'',
            groupArr:[],
            groupProductArr:[],
            groupData:{group_buying_list:[],classify:{}}


        }
    }

    back(){

        this.props.navigator.pop();
    }
    componentWillMount(){
        let param = { pageSize: '20',currentPage:'1'}

        HttpRequest.get('/v2','/api.merchant.group_buying.list', param, this.onGetFirstNoticeOrderSuccess.bind(this),
            (e) => {
                console.log(' error:' + e);
                Alert.alert('提示','获取团购用户列表失败，请稍后再试。')
            })

    }
    onGetFirstNoticeOrderSuccess(response){
        console.log('onGetNoticeOrderSuccess11:'+JSON.stringify(response))
        this.setState({
            groupData:response.data
        })


    }
    onGetNoticeOrderSuccess(response){
        console.log('onGetNoticeOrderSuccess12:'+JSON.stringify(response))
        this.setState({
            groupData:response.data
        })


    }
    OnNewGroupPress(){
        this.props.navigator.push({
            component: NewGroupView
        })
    }
    OnProductManagerPress(){

    }
    OnMemberManagerPress(){

    }
    onPressUpdateGroup_buyingList(){
        let param = { pageSize: '20',currentPage:'1'}

        HttpRequest.get('/v2','/api.merchant.group_buying.list', param, this.onGetNoticeOrderSuccess.bind(this),
            (e) => {
                console.log(' error:' + e);
                Alert.alert('提示','获取团购列表失败，请稍后再试。')
            })
    }
    onPressSendNotice(productItem){
        let param = { group_buy_id: productItem.group_buy_id}

        HttpRequest.post('/v2','/api.merchant.notice.take_goods', param, this.onSendNoticeSuccess.bind(this),
            (e) => {
                console.log(' error:' + e);
                Alert.alert('提示','获取团购列表失败，请稍后再试。')
            })
    }
    onSendNoticeSuccess(response){

        Alert.alert(
            '提示',
            '发送通知成功',
            [


                {text: '确定', onPress: this.onPressUpdateGroup_buyingList.bind(this)},
            ],
            { cancelable: false }
        )
    }
    onPressNoticePickUp(productItem){
        Alert.alert(
            '提示',
            '你的团员将通过关注微信公众号【爱邻购团购网】收到你发送的取货通知！',
            [

                {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: '确定发送', onPress: this.onPressSendNotice.bind(this,productItem)},
            ],
            { cancelable: false }
        )


    }
    renderGroupProductArr(GroupProductArr){
        const w = (width-10)/ 5.6 , h = w
        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (

                                <View style={[{ width: w, height: h}, styles.toolsItem]}>
                                    <Image style={{width: w-5, height: h-5,margin:5,resizeMode:'contain',}}
                                           source={{uri:item}}
                                    >

                                    </Image>




                                </View>
                            )
                            return (
                                <TouchableOpacity style={{ width: w, height: h }} key={i} onPress={() => {  }}>{render}</TouchableOpacity>
                            )
                        })
                    }
                </View>
            )
        }
        return (
            renderSwipeView(GroupProductArr)
        )
    }

    renderGroupScrollView(groupArr){
        var displayGroupArr =[];
        var timetitle ='';
        // var groupProductNum = this.state.groupProductArr.length
        for (var i = 0;i < groupArr.length;i++){
            var  groupItem = groupArr[i];
            var ship_time = moment(groupItem.ship_time).format("预计Y年M"+'月'+"D"+'号发货');
            var notice_pushed = groupItem.notice_pushed;
            var productImgCount = groupItem.images.length
            console.log('groupProductNum'+i+':'+JSON.stringify(groupItem))
            // var notice_pushed = 0;
            var noticeBtnColor =''
            var noticeBtnTitle =''
            var noticeBtnTitleColor =''
            if (notice_pushed ==0){
                noticeBtnColor ='rgb(234,107,16)'
                noticeBtnTitle ='发送收货通知'
                noticeBtnTitleColor ='#ffffff'
            }else {
                noticeBtnColor ='rgb(216,216,216)'
                noticeBtnTitle ='已发送'
                noticeBtnTitleColor ='rgb(117,117,117)'

            }
            displayGroupArr.push(<View style={{backgroundColor:'#ffffff',height:140,width:width,marginTop:10}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',flex:3.5,paddingLeft:10}}>
                    <Text style={{width:width-40}}>{groupItem.desc}</Text>
                    <Image style={{marginRight:5}}
                           source={require('../../images/next_icon@3x.png')}>

                    </Image>
                </View>
                <View style={{flex:8}}>
                    <ScrollView
                                contentContainerStyle={{width:75*productImgCount,height:70}}
                                style={{width:width,height:90}}
                                keyboardDismissMode='on-drag'
                                keyboardShouldPersistTaps={false}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}>
                        {this.renderGroupProductArr(groupItem.images)}

                    </ScrollView>
                </View>

                <View style={{flex:3.5,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginRight:10}}>
                    <Text style={{color:'rgb(117,117,117)',marginLeft:10}}>{ship_time}</Text>
                    <TouchableOpacity style={{}} disabled={notice_pushed} onPress={() => { this.onPressNoticePickUp(groupItem) }}>
                        <View style={{backgroundColor:noticeBtnColor,width:100,height:30,borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{ fontSize:14,
        fontFamily:'PingFang-SC-Medium',
        textAlign:'center',color:noticeBtnTitleColor}}>{noticeBtnTitle}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>)
        }

        return displayGroupArr;
    }
    render() {

        var groupScrollHeight = '';
        this.state.groupArr = this.state.groupData.group_buying_list;
        if (this.state.groupArr.length*150 >= height-69){
            groupScrollHeight = height-69;
        }else {
            groupScrollHeight = this.state.groupArr.length *150;
        }

        return (
            <View style={styles.container}>
                <NavBar
                    title="通知取货"
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)} />

                <View style={{}}>
                    <ScrollView
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={false}

                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}



                        style={{width:width,backgroundColor:'#f2f2f2',height:groupScrollHeight}}
                    >

                        {this.renderGroupScrollView(this.state.groupArr)}
                    </ScrollView>
                </View>



            </View>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        // alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    toolsView: {
        flexDirection: "row",
        // flexWrap: "wrap",
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    toolsItem: {
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor:'#ffffff'

    },
    noticeTitle:{


    }

})