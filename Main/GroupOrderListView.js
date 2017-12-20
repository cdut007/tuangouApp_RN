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
    RefreshControl,
    ListView,
    BackAndroid,
    ToastAndroid
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
        var title = "已截团的";


        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            title: title,
            orders: [],
            classifytotalNum :0,
            haveDoneOrder:true,

            dataSource:ds,
            doneData:[],
            dataSourceArr:[],
            isRefreshing:false,
            isNoMoreData: false,
            cachedData:[],
            currentPage:1,
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
    componentWillMount(){
        BackAndroid.addEventListener('hardwareBackPress', () => {
            if (this.props.navigator) {
                let routes = this.props.navigator.getCurrentRoutes();

                if (routes.length === 1) {// 在第一页了,2秒之内点击两次返回键，退出应用
                   this.clickBack();


                } else {
                    this.clickBack();
                }
            }
            return true;
        });
    }

    componentDidMount(){



        // let rowData = this.state.doneData
        // this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows(rowData)
        // });
        this.fetchData();




    }
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress',()=>{});
        }
    }
    fetchData() {


        this.state.currentPage = 1;

        let param = {pageSize:10,currentPage:this.state.currentPage}

        HttpRequest.get('/v2','/api.merchant.check.jielong.done', param, this.onGetDoneListSuccess.bind(this),
            (e) => {
                console.log(' error:' + e)
                Alert.alert('提示','获取团购列表失败，请稍后再试。')
            })

    }
    fetchMoreData(){

        console.log(' fetchMoreData12:' + this.state.currentPage);
        let param = {pageSize:10,currentPage:this.state.currentPage}

        HttpRequest.get('/v2','/api.merchant.check.jielong.done', param, this.onGetMoreDoneListSuccess.bind(this),
            (e) => {
                console.log(' error:' + e)
                Alert.alert('提示','获取团购列表失败，请稍后再试。')
            })

    }
    _endReached = () => {

        if (this.state.isNoMoreData){
            console.log('_endReached1')
        }else {
            this.state.currentPage  += 1
            console.log('_endReached2')
            console.log('_endReached3:'+this.state.currentPage)
            // 获取数据
            this.fetchMoreData();
        }


    }
    reloadData(){


        this.setState({isNoMoreData: false});
        setTimeout(() => {
            this.fetchData();
        }, 2000);
    }
    onRefresh(){

        this.setState({isRefreshing: true});
        setTimeout(() => {

            let param = { }

            // HttpRequest.get('/v1','/agent_order', param, this.onGetListSuccess.bind(this),
            //     (e) => {
            //         console.log(' error:' + e)
            //         Alert.alert('提示','获取团购列表失败，请稍后再试。')
            //     })
        }, 2000);


    }
    onGetDoneListSuccess(response) {

        // for (var i = 0 ;i < response.data.order.length ; i ++){
        //     console.log('groupOrderList:'+i +':'+JSON.stringify(response.data.order[i]) )
        // }
        console.log('onGetDoneListSuccess:'+JSON.stringify(response))
        this.state.dataSourceArr = []
        let rowData = response.data
        if (response.data.length == 0){

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(rowData),
                haveDoneOrder:false,
                dataSourceArr:rowData

            })
        }else {

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(rowData),
                haveDoneOrder:true,
                dataSourceArr:rowData
            });
        }



    }
    onGetMoreDoneListSuccess(response) {

        // for (var i = 0 ;i < response.data.order.length ; i ++){
        //     console.log('groupOrderList:'+i +':'+JSON.stringify(response.data.order[i]) )
        // }
        console.log('onGetDoneListSuccess:'+JSON.stringify(response))
        if(response.data.length < 5) {
            this.setState({
                isNoMoreData: true
            });
        }else {
            this.setState({
                isNoMoreData: false
            });
        }
        this.state.cachedData = []
        this.state.cachedData = response.data;
        console.log('onGetMoreCategorySuccess332:'+JSON.stringify(this.state.cachedData))
        let testArr =  this.state.dataSourceArr.concat(this.state.cachedData)

        this.state.dataSourceArr = testArr
        console.log('onGetMoreCategorySuccess334:'+JSON.stringify(this.state.dataSourceArr))
        this.setState({
            haveDoneOrder:true,
            dataSource:this.state.dataSource.cloneWithRows(this.state.dataSourceArr)
        });




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
            Alert.alert('提示','该订单发送失败。')
        }

    }

    render() {

        if (this.state.haveDoneOrder){
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
        if (prouductItems.purchased_count == 0){
            Alert.alert('提示','该订单数量为0')

        }else {
            this.props.navigator.push({
                component: DownloadExcelView,
                props:{
                    group_buy_id:prouductItems.group_buy_id,
                }
            })
        }

    }

    // onItemsClick(prouductItems) {
    //     this.props.navigator.push({
    //         props: {
    //             gbDetail: prouductItems,
    //         },
    //         component: GroupOrderDetailView,
    //     })
    // }
    onOrderUserClick(prouductItems){
        this.props.navigator.push({
            props: {
                gbDetail: prouductItems,
                isDoneStatus:true


            },
            component: OrderUserDetailView,
        })

}
    renderUserIconView(imgArr){
        let w = (width-20-5*8)/10
        let renderSwipeView = (types, n) => {
            return (
                <View style={{flexDirection:'row',marginLeft:5}}>
                    {
                        types.map((item, i) => {

                                let render = (
                                    <View style={{ width: w, height: w, marginRight: 5,  }}>
                                        <Image style={{width:w,height:w}} source={{uri:item}}></Image>
                                    </View>
                                )


                            return (
                                <View style={{ width: w , height: w ,marginTop:10,marginLeft:5}}>{render}</View>
                            )
                        })
                    }
                </View>
            )
        }
        return (
            renderSwipeView(imgArr)
        )


    }
    renderIconItem(){

    }
    disPlayIcon(item){
        if (item == null){
            return  require('../images/me_bj.jpg')
        }else {
            return {uri:item}
        }
        // return require('../../images/me_bj.jpg')
    }
    disPlayClassName(item){
        if (item ==''){
            return '接龙详情' ;
        }else {
            return item;
        }
    }
    renderItem = (item, sectionID, rowID) => {
        return(
            <View style={{width:width,height:180,flexDirection:'column',justifyContent:'flex-start',backgroundColor:'white',marginTop:10}}>
                <View style={{flex:50,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                    <Image style={styles.classifyTypeIcon} source={this.disPlayIcon(item.icon)}></Image>
                    <Text style={styles.classifyTitle} numberOfLines={1}>{this.disPlayClassName(item.classify_name)}</Text>
                </View>
                <View style={{marginLeft:10,marginRight:10,height:0.5,backgroundColor:'rgb(212,212,212)'}}></View>
                <TouchableOpacity style={{flex:60}}>


                    <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                        {this.renderUserIconView(item.headimages)}


                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flex:30}} onPress={() => { this.onOrderUserClick(item)}}>

                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={styles.userCount} >已有{item.purchased_count}成功接龙</Text>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={styles.checkOrderTitle}>查看接龙</Text>
                            <Image style={styles.checkOrderIcon} source={require('../images/checkIcon.png')}></Image>
                        </View>


                    </View>
                </TouchableOpacity>
                <View style={{flex:40,flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                    <TouchableOpacity style={styles.loadExcelBtn} onPress={() => { this.onDownloadExcelClick(item)}}>
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                            <Text style={styles.loadExcelTitle}>下载Excel表</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sendGroupBtn} onPress={() => { this.onSendOrderClick(item)}}>
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                            <Text style={styles.sendGroupTitle}>发送接龙订单</Text>

                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
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


        return(  <ListView style={{backgroundColor:'rgb(242,242,242)'}}
                           dataSource={this.state.dataSource}
                           renderRow={this.renderItem}
                           contentContainerStyle={styles.list}
                           initialListSize={21}
                           pageSize={10}
                           scrollRenderAheadDistance={500}
                           removeClippedSubviews={false}
                           refreshControl={
                               <RefreshControl
                                   refreshing={this.state.isRefreshing}
                                   onRefresh={this.reloadData.bind(this)}
                               />}
                           onEndReached={() => this._endReached()}
                           onEndReachedThreshold={20}>

        </ListView>)

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
                    {/*{this.renderStatus(order)}*/}
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
        if (prouductItems.purchased_count == 0){
            Alert.alert('提示','该订单数量为0')

        }else {
            console.log('onSendOrderClick11'+JSON.stringify(prouductItems))

            let param = { group_buy_id: prouductItems.group_buy_id, send_type:'weixin'}

            HttpRequest.post('/v2','/api.send.order.info', param, this.onSendOrderSuccess.bind(this),
                (e) => {
                    console.log(' error1:' + e);
                    if (e.code == 17){


                    }else {


                    }


                })
        }

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
    list:{

    },
    classifyTypeIcon:{
        marginLeft:10,
        width:30,
        height:30,

    },
    classifyTitle:{
        marginLeft:10,
        fontSize:16,
        fontFamily:'PingFangSC-Regular',
        marginRight:10,
        width:width-50,
        textAlign:'left',
    },
    userIcon:{

    },
    userCount:{
        fontFamily:'PingFangSC-Regular',
        fontSize:14,
        textAlign:'left',
        marginLeft:10
    },
    checkOrderTitle:{
        fontFamily:'PingFangSC-Regular',
        fontSize:14,
        textAlign:'center',
        marginRight:5
    },
    checkOrderIcon:{
        marginRight:10,width:20,height:20
    },

    loadExcelTitle:{
        fontFamily:'PingFang-SC-Medium',
        color:'rgb(234,107,16)',
        marginTop:4,
        fontSize:14,
    },
    sendGroupTitle:{
        fontFamily:'PingFang-SC-Medium',
        color:'white',
        marginTop:4,
        fontSize:14,
    },
    loadExcelBtn:{
        width:120,
        height:30,
        borderWidth:1,
        borderRadius:20,
        borderColor:'rgb(234,107,16)',
        marginRight:20,
        marginTop:8,
        marginBottom:10
    },
    sendGroupBtn:{
        width:120,
        height:30,
        borderWidth:1,
        borderRadius:20,
        borderColor:'rgb(234,107,16)',
        marginRight:10,
        marginTop:8,
        marginBottom:10,
        backgroundColor:'rgb(234,107,16)'
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
