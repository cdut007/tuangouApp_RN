import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    ScrollView,
    Alert,
    RefreshControl
} from 'react-native';

import {
    MKIconToggle,
    MKSwitch,
    MKRadioButton,
    MKCheckbox,
    MKColor,
    getTheme,
    setTheme,
} from 'react-native-material-kit'
import {CachedImage} from "react-native-img-cache";
var  WeChat = require('react-native-wechat');
import Banner from 'react-native-banner';
import Dimensions from 'Dimensions';
import Grid from 'react-native-grid-component';
import NavBar from '../common/NavBar'
import TabView from './TabView'
import px2dp from '../common/util'
import GroupOrderDetailView from './Order/GroupOrderDetailView';
import DownloadExcelView from './DownloadExcelView';
var Global = require('../common/globals');
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import LoginView from '../Login/LoginView'
import HttpRequest from '../HttpRequest/HttpRequest'
import OrderUserDetailView from './Order/OrderUserDetailView'
import moment from 'moment';


export default class GroupOrderListView extends Component {
    constructor(props) {
        super(props)
        var title = "查看接龙";
        if (this.props.isDoneStatus) {
            title = "已截团的";
        }
        this.state = {
            title: title,
            orders: [],
            classifytotalNum :0,
            haveOrder:true,
            isRefreshing:false
        }
    }


    clickBack() {
        if (this.props.isOrderUserDetailGo){
            this.props.navigator.resetTo({
                component: TabView,
                name: 'MainPage'
            })
        }else {
            this.props.navigator.pop()
        }


    }

    componentDidMount() {
        let orderStatus = this.props.isDoneStatus ? 1 : 0
        let param = { status: orderStatus }
        console.log('orderStatus:' +orderStatus)
        HttpRequest.get('/v1','/agent_order', param, this.onGetListSuccess.bind(this),
            (e) => {
                console.log(' error:' + e)
                Alert.alert('提示','获取团购列表失败，请稍后再试。')
            })
    }
    onRefresh(){

        this.setState({isRefreshing: true});
        setTimeout(() => {
            let orderStatus = this.props.isDoneStatus ? 1 : 0
            let param = { status: orderStatus }
            console.log('orderStatus:' +orderStatus)
            HttpRequest.get('/v1','/agent_order', param, this.onGetListSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                    Alert.alert('提示','获取团购列表失败，请稍后再试。')
                })
        }, 2000);


    }
    onGetListSuccess(response) {

        // for (var i = 0 ;i < response.data.order.length ; i ++){
        //     console.log('groupOrderList:'+i +':'+JSON.stringify(response.data.order[i]) )
        // }
        console.log('onGetListSuccess:'+JSON.stringify(response))
        if (response.data.order.length == 0){
            this.setState({
                haveOrder:false
            })
        }else {
            this.setState({
                orders: response.data.order,
                haveOrder:true,
                isRefreshing: false
            })
        }

    }
    onSendOrderSuccess(response){
        console.log('onSendOrderSuccess332:'+JSON.stringify(response))
        if (response.code == 1){
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled){
                        WeChat.shareToSession({
                            thumbImage: Global.headimgurl,
                            title:response.data.title,
                            description:'拼团订单',
                            type: 'news',
                            webpageUrl: response.data.excel_url
                        }).cache((error) =>{
                            ToastShort(error.message);
                        });
                    }else {
                        ToastShort('没有安装微信软件，请您安装微信之后再试');

                    }
                });
        }else {
            Alert.alert('提示','该订单数量为空！')
        }

    }

    render() {

        if (this.state.haveOrder){
            return (
                <View style={styles.container}>
                    <NavBar title={this.state.title}
                            leftIcon={require('../images/back.png')}
                            leftPress={this.clickBack.bind(this)} />
                    {this.renderGroupOrderListView()}

                </View>
            )
        }else {
            return (
                <View style={styles.container}>
                    <NavBar title={this.state.title}
                            leftIcon={require('../images/back.png')}
                            leftPress={this.clickBack.bind(this)} />
                    {this.renderNoOrderView()}

                </View>
            )
        }

    }

    onDownloadExcelClick(prouductItems) {

        this.props.navigator.push({
            component: DownloadExcelView,
            props:{
                group_buy_id:prouductItems.group_buy.id,
            }
        })
    }

    onItemsClick(prouductItems) {
        this.props.navigator.push({
            props: {
                gbDetail: prouductItems,
            },
            component: GroupOrderDetailView,
        })
    }
    onOrderUserClick(prouductItems){
        this.props.navigator.push({
            props: {
                gbDetail: prouductItems,
                isDoneStatus:this.props.isDoneStatus

            },
            component: OrderUserDetailView,
        })

}
    renderNoOrderView(){
        return (
            <View style={styles.NoOrderView}>
                <Image style={styles.NoOrderImage}
                       source={require('../images/orderingIcon@2x.png')}
                >
                </Image>
                <Text style={styles.NoOrderlabel}>
                    还没有相关订单
                </Text>
            </View>
        )
    }
    renderGroupOrderListView() {
        return (<ScrollView
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps={false}
            style={[styles.mainStyle, { height: height - 220 }]}
           >
            {this.renderProductCategoryView()}
        </ScrollView>)
    }

    renderProductCategoryView() {
        var categoryDataAry = this.state.orders;
        var displayCategoryAry = [];
        console.log('this.state.orders:'+JSON.stringify(this.state.orders))

        for (var i = 0; i < categoryDataAry.length; i++) {
            var order = categoryDataAry[i]


            var shipTime = moment(order.group_buy.ship_time).format("预计M"+'月'+"D"+'号发货');
            this.state.classifytotalNum = 0
            for (var j = 0; j < order.goods.length; j++){
               this.state.classifytotalNum = this.state.classifytotalNum+ parseInt(order.goods[j].purchased)
                console.log('classifytotalNumtest:'+i+':'+j+':'+this.state.classifytotalNum)

            }

            displayCategoryAry.push(
                <View style={{ margin: 0 }}>
                    <View style={[styles.brandLabelContainer, {  }]}>
                        <View style={{
                            marginLeft: 10, marginTop: 10, marginRight: 5, alignItems: 'center',
                            justifyContent: 'flex-start',flexDirection: 'row',width:width-120
                        }}>
                            <CachedImage style={{
                                resizeMode: 'contain', marginRight: 5, alignItems: 'center',
                                justifyContent: 'center', width: 30, height: 30
                            }} source={{ uri: order.classify.icon }} />
                            <Text style={{ fontSize: 16, color: '#1b1b1b' ,width:width-160}}>{order.classify.name}</Text>
                        </View>

                        <Text style={{textAlign:'center', fontSize: 12, color: '#rgb(117,117,117)' , alignSelf:'center',marginRight:10,marginTop:10,fontFamily:'PingFangSC-Regular'}}>{shipTime}</Text>
                    </View>

                    {this.renderCategorysView(order,this.state.classifytotalNum)}
                    <View style={{ width: width, backgroundColor: '#d5d5d5', flex: 1, height: 0.5 }}>
                    </View>
                    {this.renderStatus(order)}
                    <View style={{width:width,height:10,backgroundColor:'rgb(242,242,242)'}}></View>

                </View>
            );
        }
        return displayCategoryAry;
    }
    onSendOrderClick(prouductItems){

        // WeChat.isWXAppInstalled()
        //     .then((isInstalled) => {
        //         if (isInstalled){
        //             WeChat.shareToSession({
        //                 thumbImage: Global.headimgurl,
        //                 title:'微信好友测试链接',
        //                 description: '收货订单',
        //                 type: 'news',
        //                 webpageUrl: response.data.excel_url
        //             }).cache((error) =>{
        //                 ToastShort(error.message);
        //             });
        //         }else {
        //             ToastShort('没有安装微信软件，请您安装微信之后再试');
        //
        //         }
        //     });
        console.log('onSendOrderClick11'+JSON.stringify(prouductItems))

        let param = { group_buy_id: prouductItems.group_buy.id, send_type:'weixin'}

        HttpRequest.post('/v2','/api.send.order.info', param, this.onSendOrderSuccess.bind(this),
            (e) => {
                console.log(' error:' + e);

            })
    }
    renderStatus(items) {
        if (this.props.isDoneStatus) {
            return (<View style={{flexDirection:'row',justifyContent:'flex-start',width:width}}>
                <TouchableOpacity onPress={this.onDownloadExcelClick.bind(this,items)} style={{
                alignItems: 'center', backgroundColor: 'white',
                justifyContent: 'center', height: 40,flex:1
            }}>
                <Text style={{
                    alignItems: 'center',
                    justifyContent: 'center', fontSize: 18, color: 'rgb(234,107,16)', textAlign: 'center',fontFamily:'PingFang-SC-Medium'
                }}>
                    下载Excel表
                </Text>
            </TouchableOpacity>
                <TouchableOpacity onPress={this.onSendOrderClick.bind(this,items)} style={{
                    alignItems: 'center', backgroundColor: 'rgb(234,107,16)',
                    justifyContent: 'center', height: 40,flex:1
                }}>
                    <Text style={{
                        alignItems: 'center',
                        justifyContent: 'center', fontSize: 18, color: 'white', textAlign: 'center',fontFamily:'PingFang-SC-Medium'
                    }}>
                        发送订单
                    </Text>
                </TouchableOpacity>

            </View>)
        } else {
            return (<TouchableOpacity onPress={this.onItemsClick.bind(this, items)} style={{
                alignItems: 'center', backgroundColor: '#f7f7f7',
                justifyContent: 'center', height: 40, width: width
            }}>
                <Text style={{
                    alignItems: 'center',
                    justifyContent: 'center', fontSize: 12, color: '#1c1c1c', textAlign: 'center'
                }}>
                    查看全部
            </Text>
            </TouchableOpacity>)
        }
    }

    renderItemInfo(item,classifytotalNum, w, h) {
        console.log('renderItemInfo11:'+JSON.stringify(item))
        return (<View style={{
            resizeMode: 'contain', alignItems: 'center', width: w, height: h,
            justifyContent: 'center', paddingLeft: 20, paddingRight: 10, flexDirection: "row", backgroundColor: '#f7f7f7',
            flex: 1
        }}>
            <View style={{ flex: 2 }}>
                <CachedImage style={{
                    resizeMode: 'contain', alignItems: 'center', width: 80, height: 80,
                    justifyContent: 'center',
                }} source={{ uri: item.goods.images[0].image }} />
            </View>
            <View style={{
                height: h,
                alignItems: 'flex-start',
                flex: 6
            }}>
                <Text style={{ marginLeft: 30, marginTop: 10, numberOfLines: 2, ellipsizeMode: 'tail', fontSize: 14, color: "#1c1c1c", }}>{item.goods.name}</Text>
                <Text style={{ marginLeft: 30, alignItems: 'center', justifyContent: 'center', fontSize: 12, color: "#757575", }}>{item.brief_dec}</Text>
                <Image style={{position: 'absolute',width:36,height:36,right:0,top:35}} source={require('../images/next_icon@2x.png')}></Image>
                <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 30, paddingBottom: 10, position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                    <Text style={{ alignItems: 'center', justifyContent: 'center', fontSize: 16, color: "#fb7210", }}>S$ {item.price}</Text>
                    <Text style={{ alignItems: 'center', textAlign: 'right', flex: 9, justifyContent: 'center', fontSize: 12, color: "#757575", }}>已购：{classifytotalNum}件</Text>
                </View>
            </View>
        </View>)
    }

    renderCategorysView(prouductItems,classifytotalNum) {
        const w = width, h = 110
        let items = prouductItems.goods[0]
        console.log('classifytotalNum11'+':'+classifytotalNum)
        let render = () => {
            return (
                <View style={[{ width: w, height: h, marginTop: 0, marginRight: 5, marginBottom: 0 }, styles.toolsItem]}>
                    {this.renderItemInfo(items,classifytotalNum, w, h)}
                </View>
            )
        }
        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    <TouchableOpacity style={{ width: w, height: h }} onPress={this.onOrderUserClick.bind(this, prouductItems)}>{render()}</TouchableOpacity>
                </View>
            )
        }
        return (
            renderSwipeView(prouductItems)
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },

    thumb: {
        width: 60,
        height: 60,
        marginRight: 10
    },
    line1: {
        height: 1,
        backgroundColor: '#dadce2'
    },
    line10: {
        height: 10,
        backgroundColor: '#ebeef1'
    },
    brandLabelContainer:
    {
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width:width
    },
    line: {
        height: 1,
        backgroundColor: '#eef0f3',
    },
    row: {
        flexDirection: 'row',
    },
    NoOrderView:{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    NoOrderImage:{
        marginTop:200,
        height:90,
        width:90
    },
    NoOrderlabel:{
        marginTop:10,
        color   :'rgb(117,117,117)',
        fontSize:14,
        textAlign: 'center',
        fontFamily:'PingFangSC-Regular',

    }
});
