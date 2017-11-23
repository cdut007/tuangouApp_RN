/**
 * Created by Arlen_JY on 2017/9/15.
 */
import React,{ Component } from 'react' ;
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Animated,
    TouchableHighlight,
    ScrollView,
    Alert

}   from 'react-native';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import GroupOrderListView from '../GroupOrderListView';
import Panel from '../../common/Panel';
import HttpRequest from '../../HttpRequest/HttpRequest'
var Global = require('../../common/globals');
var  WeChat = require('react-native-wechat');
export default class OrderUserDetailView extends Component{
    constructor (props){
        super(props)


        this.state = {

            gbDetail: this.props.gbDetail,
            expanded : true,
            order_detail :[],
            displayPanelAry : [],
            haveOrder_detail:false,
            isIntercept:false,

        }
    }
    componentDidMount() {



        var pos = Global.agent_url.indexOf("?");
        if (pos!= -1) {
            var str = Global.agent_url.substr(pos+1);
            var agent_code = this.getQueryString('agent_code',str);
            console.log('url agent_code='+agent_code);

        }
        let param = { option: 'order_detail', merchant_code: agent_code,group_buy_id: this.state.gbDetail.group_buy.id}

        HttpRequest.get('/v2','/api.merchant.order', param, this.onGetOrderUserSuccess.bind(this),
            (e) => {
                console.log(' error:' + e);
                Alert.alert('提示','获取团购用户列表失败，请稍后再试。')
            })
    }
    getQueryString(name,url) {
        if (!url) {
            return null
        }
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); // 匹配目标参数
        var result = url.match(reg);  // 对querystring匹配目标参数

        if (result != null) {
            return decodeURIComponent(result[2]);
        } else {
            return null;
        }
    }
    formatPrice(price){
        var f = parseFloat(price);
        var   currency = 'S$'
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(price*100)/100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return currency + ' ' + s;
    }
    clickBack() {
        this.props.navigator.pop()

    }
    onGetOrderUserSuccess(response){
        if (response.message == "Success"){
            if (response.data.order_detail.length == 0){
                this.setState({
                    haveOrder_detail:false
                });
            }else {
                this.setState({
                    order_detail:response.data.order_detail,
                    haveOrder_detail:true
                });
            }



        }
        // if (response.message == "Success"){
        //     if (response.data.order_detail.length == 0){
        //         this.setState({
        //             haveOrder_detail:true
        //         });
        //     }else {
        //         this.setState({
        //             order_detail:response.data.order_detail,
        //             haveOrder_detail:false
        //         });
        //     }
        //
        //
        //
        // }

    }
    onGetInterceptGroupSuccess(response){
        console.log('onGetInterceptGroupSuccess112'+JSON.stringify(response))
        if (response.message == "Success"){
            this.props.navigator.resetTo({
                component: GroupOrderListView,
                props: {
                    isDoneStatus:true,
                    isOrderUserDetailGo:true
                }
            })



        }
    }
    onItemClick(item){

    }
    onPressInterceptGroupList(){
        let param = { group_buying_id: this.state.gbDetail.group_buy.id}

        HttpRequest.post('/v2','/api.merchant.mc.end', param, this.onGetInterceptGroupSuccess.bind(this),
            (e) => {
                console.log(' error:' + e);

            })

    }
    onPressGroupCommit(){

        Alert.alert(
            '确认截团',
            '确认截团后将生成本次接龙订单，平台不可再加单哦！',
            [

                {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: '确定', onPress: this.onPressInterceptGroupList.bind(this)},
            ],
            { cancelable: false }
        )
    }
    render() {
        if (this.props.isDoneStatus){
            if (this.state.haveOrder_detail){
                return (
                    <View style={styles.container}>
                        <NavBar title={this.props.gbDetail.classify.name}
                                leftIcon={require('../../images/back.png')}
                                leftPress={this.clickBack.bind(this)} />
                        {this.renderOrderUserListView(this.state.order_detail)}



                    </View>
                )
            }else {
                return (
                    <View style={styles.container}>
                        <NavBar title={this.props.gbDetail.classify.name}
                                leftIcon={require('../../images/back.png')}
                                leftPress={this.clickBack.bind(this)} />
                        {this.renderNoOrderUserView()}

                    </View>
                )
            }
        }else {
            if (this.state.haveOrder_detail){
                return (
                    <View style={styles.container}>
                        <NavBar title={this.props.gbDetail.classify.name}
                                leftIcon={require('../../images/back.png')}
                                leftPress={this.clickBack.bind(this)} />
                        {this.renderOrderUserListView(this.state.order_detail)}
                        <TouchableOpacity onPress={this.onPressGroupCommit.bind(this)}>
                            <View style={{width:width,height:49,backgroundColor:'rgb(234,107,16)',   justifyContent: 'center',
                                alignItems: 'center',}}>
                                <Text style={{color:'white',fontFamily:'PingFang-SC-Medium',fontSize:18}}>截团提交订单</Text>
                            </View>
                        </TouchableOpacity>


                    </View>
                )
            }else {
                return (
                    <View style={styles.container}>
                        <NavBar title={this.props.gbDetail.classify.name}
                                leftIcon={require('../../images/back.png')}
                                leftPress={this.clickBack.bind(this)} />
                        {this.renderNoOrderUserView()}

                    </View>
                )
            }
        }


    }
    renderNoOrderUserView(){
        return (
            <View style={styles.NoOrderView}>
                <Image style={styles.NoOrderImage}
                       source={require('../../images/orderingIcon@2x.png')}
                >
                </Image>
                <Text style={styles.NoOrderlabel}>
                    还没有相关订单
                </Text>
            </View>
        )
    }
    renderOrderUserListView(order_detail){

            return (

                    <ScrollView style={styles.scrollcontainer}>
                        {this.renderPanelView(order_detail)}
                        {/*<Panel title="5" ship_time="2017-8-12 14:23" totalNum="5" totalPrice="23.00">*/}
                        {/*<Text>Lorem ipsum dolor sit amet, cing elit  consectetur adipiscing elit.</Text>*/}
                        {/*</Panel>*/}
                        {/*<Panel title="brownie" ship_time="2017-8-12 14:23" totalNum="5" totalPrice="23.00">*/}
                        {/*<Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, conse</Text>*/}

                    </ScrollView>


            )


    }
    renderPanelView(order_detail){

        // var RemarkStr = "团长给我挑大个点的苹果，送礼用 谢谢"

        var  panelDataAry = [];
        if (order_detail){
            panelDataAry = order_detail;
        }else {
            panelDataAry = [];

        }


        var displayPanelAry = [];

        if (panelDataAry)
        {

        }else {

        }
        for (var  j = 0 ; j < panelDataAry.length ; j++){
            var item = panelDataAry[j ];
            let totalTitle = item.total_quantity+"件/合计：S$"+item.total_amount;
            let RemarkStr = "备注："+item.remark;
            displayPanelAry.push(
            <View>
                    <Panel title={item.nickname}  ship_time={item.time} titleIcon ={item.headimgurl}>
                        {this.renderOrderUserView(item.goods_list)}
                    </Panel>
                       <View style={{height:0.5,backgroundColor:"rgb(213,213,213)",width:width}}></View>
                <View style={styles.totalFooterContainer} >
                                    <Text style={styles.totalFooterRemarkTitle}>{RemarkStr}</Text>
                                    <Text style={styles.totalFooterTitle}>{totalTitle}</Text>
                </View>
              </View>
            );
        }





        return displayPanelAry;
    }

    renderOrderUserView(productItem){
            var orderUserListAry = []
        for (var p = 1 ; p <= productItem.length ; p++){
                var titleItem =productItem[p-1];
                var productTitle = p+'、'+titleItem.name;
                var productPrice = this.formatPrice(titleItem.price);
                var  panelBackColor = 'rgb(242,242,242)';
                if (p%2 !==0){

                }else if(p%2 ==0){
                    panelBackColor = 'rgb(255,255,255)'
                }else {

                }
            orderUserListAry.push(
                <View style={{backgroundColor :panelBackColor}}>
                    <View style={styles.productTitleContainer}>
                        <View style={styles.productFirstContainer}>
                            <Text style={styles.productTitle}
                                  numberOfLines={2}
                            >{productTitle}</Text>
                        </View>
                        <View style={styles.productPriceContainer}>
                            <Text style={styles.productTitleprice}>{productPrice}</Text>
                            <Text style={styles.productTitlequantity}>{'x'+titleItem.quantity}</Text>
                        </View>
                    </View>
                </View>
            )


        }
        return orderUserListAry;
    }




}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',

    },
    scrollcontainer: {
        flex : 1,
        backgroundColor : 'rgb(242,242,242)',
        paddingTop : 0
    },
    productFirstContainer :{
        flexDirection: 'row',
        height:36,
        flex: 2,


    },
    productTitleContainer:{
        flexDirection: 'row',
        height:36,
        flex: 2,
        marginTop:8,
        marginLeft:10,
        marginBottom:10
    },
    productTitle: {


        width:width/3*2,
        color   :'rgb(28,28,28)',
        fontSize:12,
        fontFamily:'PingFangSC-Regular',
    },
    productPriceContainer :{
        flexDirection: 'column',
        height:36,
        flex: 1,
        marginRight:10

    },

    productTitlequantity:{
        color   :'rgb(130,130,130)',
        fontSize:12,
        fontFamily:'PingFangSC-Regular',
        alignSelf:'flex-end',
        marginTop:3,
    },
    productTitleprice:{
        color   :'rgb(28,28,28)',
        fontSize:12,
        fontFamily:'PingFangSC-Regular',
        alignSelf:'flex-end'
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

    }, totalFooterContainer :{
              flexDirection: 'column',
              height:65.5,
        backgroundColor:'white'
              // justifyContent: 'center',
              // alignItems: 'center',
      //        height:65.5
          },
          totalFooterTitle :{
              marginTop:8,
              color   :'rgba(234,107,16,1.0)',
              fontSize:14,
              fontFamily:'PingFang-SC-Medium',

              textAlign:'center',
          },
          totalFooterRemarkTitle :{
              marginTop:8,
              marginLeft:8,
              color   :'rgb(28,28,28)',
              fontSize:16,
              fontFamily:'PingFang-SC-Medium',
              textAlign:'left',
          }



})