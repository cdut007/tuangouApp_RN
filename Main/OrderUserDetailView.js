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
    ScrollView

}   from 'react-native';
import NavBar from '../common/NavBar'
import Dimensions from 'Dimensions';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import Panel from '../common/Panel';
import HttpRequest from '../HttpRequest/HttpRequest'
var Global = require('../common/globals');
export default class OrderUserDetailView extends Component{
    constructor (props){
        super(props)


        this.state = {

            gbDetail: this.props.gbDetail,
            expanded : true,
            order_detail :[],
            displayPanelAry : [],

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
                console.log(' error:' + e)
                Alert.alert('提示','获取团购用户列表失败，请稍后再试。')
            })
    }
    getQueryString(name,url) {
        if (!url) {
            return null
        }
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); // 匹配目标参数
        var result = url.match(reg);  // 对querystring匹配目标参数
        console.log('url result='+url);
        if (result != null) {
            return decodeURIComponent(result[2]);
        } else {
            return null;
        }
    }
    clickBack() {
        this.props.navigator.pop()
    }
    onGetOrderUserSuccess(response){
        console.log('onGetOrderUserSuccess221'+JSON.stringify(response))
        if (response.message == "Success"){
            this.setState({order_detail:response.data.order_detail});

            console.log('onGetOrderUserSuccess222'+JSON.stringify(this.state.order_detail))
        }

    }
    onItemClick(item){

    }
    render() {
        return (
            <View style={styles.container}>
                <NavBar title="品质水果"
                        leftIcon={require('../images/back.png')}
                        leftPress={this.clickBack.bind(this)} />
                {this.renderOrderUserListView(this.state.order_detail)}

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

        var  panelDataAry = []
        if (order_detail){
            panelDataAry = order_detail;
        }else {
            panelDataAry = [];
            console.log('panelDataAryNo')
        }

        console.log('order_detail334'+JSON.stringify(panelDataAry))
        var displayPanelAry = []
        console.log('panelDataAry112'+JSON.stringify(panelDataAry))
        if (panelDataAry)
        {

        }else {
            console.log('panelDataAry555'+JSON.stringify(panelDataAry))
        }
        for (var  j = 0 ; j < panelDataAry.length ; j++){
            console.log( ' displayCategoryAry.length === '+ j);
            var item = panelDataAry[j ]
            displayPanelAry.push(
                    <Panel title={item.nickname}  ship_time={item.time} totalNum={item.total_quantity} totalPrice={item.total_amount} titleIcon ={item.headimgurl} >
                        {this.renderOrderUserView(item.goods_list)}
                    </Panel>
            );
        }





        return displayPanelAry;
    }
    renderOrderUserView(productItem){
            var orderUserListAry = []
        for (var p = 1 ; p <= productItem.length ; p++){
                var titleItem =productItem[p-1]
                var productTitle = p+'、'+titleItem.name;
                if (p == 1){
                    orderUserListAry.push(
                        <View style={styles.productOneTitleContainer}>
                            <Text style={styles.productTitle}>{productTitle}</Text>
                            <Text style={styles.productTitlequantity}>{'X'+titleItem.quantity}</Text>
                        </View>

                    )
                }else {
                    orderUserListAry.push(
                        <View style={styles.productTitleContainer}>
                            <Text style={styles.productTitle}>{productTitle}</Text>
                            <Text style={styles.productTitlequantity}>{'X'+titleItem.quantity}</Text>
                        </View>

                    )
                }


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
        backgroundColor : '#f4f7f9',
        paddingTop : 0
    },
    productOneTitleContainer :{
        flexDirection: 'row',
        height:18,
        marginTop:20,
    },
    productTitleContainer:{
        flexDirection: 'row',
        height:18,
    },
    productTitle: {
        marginLeft:5,

        width:width -50,
        color   :'rgb(28,28,28)',
        fontSize:12,
        fontFamily:'PingFangSC-Regular',
    },

    productTitlequantity:{
        color   :'rgb(130,130,130)',
        fontSize:12,
        fontFamily:'PingFangSC-Regular',
        // alignSelf:'flex-end'
    },



})