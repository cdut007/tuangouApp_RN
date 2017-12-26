
/**
 * Created by Arlen_JY on 2017/11/6.
 */
import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
import AddProductView from './AddProductView'
import HttpRequest from '../../HttpRequest/HttpRequest';
var Global = require('../../common/globals');
import ClassifyListView from './ClassifyListView'
import  Swipeout from 'react-native-swipeout'
import Picker from 'react-native-picker';
import NewProductView from '../Group/NewProductView'
import GroupProductEditView from './GroupProductEditView'
import moment from 'moment';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    AsyncStorage,
    DeviceEventEmitter
}   from 'react-native';

var  test = false;

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var  WeChat = require('react-native-wechat');
export default class NewGroupView extends Component{
    constructor (props){
        super(props)

        this.state = {
            page_Title:'修改接龙',
            groupBuyId:'',
            classify_Id:0,
            groupTitle:'',
            group_eyu:'',
            group_buying_detail:'',
            groupProductScrollArr:[],
            addGroupProductScrollArr:[],
            UpdateGroupProductScrollArr:[],
            UpdateAndAddGroupProductScrollArr:[],
            tempAddGroupProductScrollArr:[],
            isSelectPicker:true, //true是选中截团时间，false 是选中预计发货时间
            isGroupDeadlineHave:false,
            groupDeadlineTitle:'截团时间',
            groupDeadlineTime:'',
            groupDeliveryTime:'',
            groupDeliveryTitle:'预计发货时间',

            isGroupDeliveryTimeHave:false,
            isHaveDel_goods:false,
            isHaveGoodsArr:[],
            isHaveGoodsNum:0,
            isUpdate:false,
            isLoading:false,
            isGroupProductScrollArrNum:0,
            Del_goods:[],
            groupbuying_info:{},
            agent_url:'',
            addIndexArr:[],
            pickedDeadlineValue:[],
            pickedDeliveryValue:[]



        }
        if (test){
            var pos = Global.agent_url.indexOf("?");
            if (pos!= -1) {
                var str = Global.agent_url.substr(pos+1);
                var agent_code = this.getQueryString('agent_code',str);
                console.log('url agent_code='+agent_code);
                this.state.agent_url = 'http://www.ailinkgo.com/test/?agent_code='+agent_code
            }

        }else {
            this.state.agent_url = Global.agent_url


        }

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
    back(){
        Picker.hide()
        Alert.alert(
            '提示',
            '请确认是否退出此次接龙！',
            [

                {text: '取消'},
                {text: '确认', onPress: this.trueBack.bind(this)},
            ],
            { cancelable: false }
        )

    }
    trueBack(){
        this.state.addGroupProductScrollArr = []
        this.state.Del_goods = [];
        this.state.groupProductScrollArr =[];
        this.state.isGroupProductScrollArrNum = 0;

        this.state.tempAddGroupProductScrollArr = [];

        this.props.navigator.pop();
    }
    componentDidMount() {
        if (this.props.isCreateNewGroup){
            this.state.page_Title = '新建接龙';

        }else {
            if (this.state.isLoading){
                Alert.alert('已经获取数据')
            }else {
                this.state.groupBuyId = this.props.groupItem.group_buy_id;
                let param = {groupbuying_id:this.state.groupBuyId}

                HttpRequest.get('/v2','/admin.groupbuying.detail', param, this.onGetGroupbuyingDetailSuccess.bind(this),
                    (e) => {
                        console.log(' error:' + e)
                        Alert.alert('提示','获取接龙详情失败，请稍后再试。')
                    })
            }

        }
        DeviceEventEmitter.addListener('GetClassifyId',(dic)=>{
            //接收到新建商品页发送的通知，刷新商品类别页的数据，刷新UI
        console.log('GetClassifyId123'+JSON.stringify(dic));
        // this.state.classify_Id = dic.id;
        // this.state.groupTitle = dic.name;
            if (dic.selectedItem){
                this.setState({
                    classify_Id:dic.selectedItem.id,
                    groupTitle:dic.selectedItem.name
                })
            }else {
                this.setState({

                    groupTitle:'选择本次接龙标题'
                })
            }

        });
        DeviceEventEmitter.addListener('AddGroupbuying_products',(dic)=>{
            //接收到选择商品页发送的通知，刷新商品列表的数据，刷新UI
            console.log('AddGroupbuying_products234:'+JSON.stringify(dic))
            //缓存数组
            this.state.tempAddGroupProductScrollArr = []
            this.state.tempAddGroupProductScrollArr = dic.addGroupbuying_products;
            //需要添加的商品数组
            let addArr = this.state.addGroupProductScrollArr.concat(this.state.tempAddGroupProductScrollArr)
            this.state.addGroupProductScrollArr = addArr
            console.log('AddGroupbuying_products236:'+JSON.stringify(this.state.addGroupProductScrollArr))
            //显示的全部商品数组
            for (var i = 1; i <= this.state.tempAddGroupProductScrollArr.length; i++){
                this.state.addIndexArr.push(this.state.groupProductScrollArr.length-1+i)
            }

            let allArr = this.state.groupProductScrollArr.concat(this.state.tempAddGroupProductScrollArr)
            console.log('AddGroupbuying_products236:'+JSON.stringify(this.state.tempAddGroupProductScrollArr))
            this.state.tempAddGroupProductScrollArr = []
            this.state.groupProductScrollArr = allArr;
            this.state.isGroupProductScrollArrNum = this.state.groupProductScrollArr.length
            console.log('AddGroupbuying_products238:'+JSON.stringify(this.state.groupProductScrollArr))
            this.setState({ ...this.state });
            // this.state.groupBuyId = this.props.groupItem.group_buy_id;
            // let param = {groupbuying_id:this.state.groupBuyId}
            //
            // HttpRequest.get('/v2','/admin.groupbuying.detail', param, this.onGetGroupbuyingDetailSuccess.bind(this),
            //     (e) => {
            //         console.log(' error:' + e)
            //         Alert.alert('提示','获取接龙详情失败，请稍后再试。')
            //     })
        });
        // DeviceEventEmitter.addListener('updateNewGroup',(dic)=>{
        //     //接收到选择商品页发送的通知，刷新商品列表的数据，刷新UI
        //     console.log('updateNewGroup12:'+dic)
        //     // this.state.groupBuyId = this.props.groupItem.group_buy_id;
        //     // let param = {groupbuying_id:this.state.groupBuyId}
        //     //
        //     // HttpRequest.get('/v2','/admin.groupbuying.detail', param, this.onGetGroupbuyingDetailSuccess.bind(this),
        //     //     (e) => {
        //     //         console.log(' error:' + e)
        //     //         Alert.alert('提示','获取接龙详情失败，请稍后再试。')
        //     //     })
        // });
        DeviceEventEmitter.addListener('CreateNewGroupChangeProductDetail',(dic)=>{
            //接收到选择商品页发送的通知，刷新商品列表的数据，刷新UI
            console.log('ChangeProductDetail12:'+JSON.stringify(dic))
            console.log('isGroupProductScrollArrNum12:'+JSON.stringify( this.state.isGroupProductScrollArrNum))



                var groupArr =[];
                // this.state.Del_goods = [];
                // console.log('this.state.groupProductScrollArr111'+JSON.stringify(this.state.groupProductScrollArr))
                this.state.groupProductScrollArr.map((product, i) => {
                    if (i == dic.index){
                        if (this.state.isUpdate){

                        }else {
                            product.price = dic.price;
                            product.stock = dic.stock;
                            product.unit = dic.unit;
                            this.state.isUpdate = true;
                        }


                        groupArr.push(product);
                        // console.log('groupArrIndex:'+i)
                    }else {
                        console.log('groupArrIndex:'+i)
                        groupArr.push(product);
                    }
                })
                // this.state.groupProductScrollArr = groupArr;
                this.state.addGroupProductScrollArr = groupArr;
                // console.log('this.state.groupProductScrollArr112'+JSON.stringify(this.state.groupProductScrollArr))
                // console.log(' this.state.addGroupProductScrollArr112:'+JSON.stringify(this.state.addGroupProductScrollArr))
                this.setState({ ...this.state });


            // this.state.groupBuyId = this.props.groupItem.group_buy_id;
            // let param = {groupbuying_id:this.state.groupBuyId}
            //
            // HttpRequest.get('/v2','/admin.groupbuying.detail', param, this.onGetGroupbuyingDetailSuccess.bind(this),
            //     (e) => {
            //         console.log(' error:' + e)
            //         Alert.alert('提示','获取接龙详情失败，请稍后再试。')
            //     })
        });

        DeviceEventEmitter.addListener('ChangeProductDetail',(dic)=>{
            //接收到选择商品页发送的通知，刷新商品列表的数据，刷新UI
            console.log('ChangeProductDetail12:'+JSON.stringify(dic))
            console.log('isGroupProductScrollArrNum12:'+JSON.stringify( this.state.isGroupProductScrollArrNum))



                var groupArr =[];
                var updateArr =[];
                var addDateArr =[];
                // this.state.Del_goods = [];
                // console.log('this.state.groupProductScrollArr520'+JSON.stringify(this.state.groupProductScrollArr))
                if (this.state.isGroupProductScrollArrNum == this.state.groupProductScrollArr.length ){
                    console.log('isGroupProductScrollArrNum13:'+JSON.stringify( this.state.isGroupProductScrollArrNum))
                    console.log('isGroupProductScrollArr14:'+JSON.stringify( this.state.groupProductScrollArr))
                    this.state.groupProductScrollArr.map((product, i) => {

                        if (i == dic.index){

                            if (this.state.isUpdate){

                            }else {
                                product.price = dic.price;
                                product.stock = dic.stock;
                                product.unit = dic.unit;
                                this.state.isUpdate = true;
                                this.state.addIndexArr.push(dic.index);

                               this.state.addIndexArr = this.unique(this.state.addIndexArr).sort();
                            }

                            console.log('dic.index12:'+JSON.stringify(dic))

                        }else {
                            console.log('dic.index11:'+JSON.stringify(dic))
                        }
                    })


                }else {
                    console.log('dic.index13:'+JSON.stringify(dic))
                }

                console.log('groupArrall:'+JSON.stringify(this.state.groupProductScrollArr))
            console.log('dic.index14:'+JSON.stringify(dic))
                this.setState({ ...this.state });


            // this.state.groupBuyId = this.props.groupItem.group_buy_id;
            // let param = {groupbuying_id:this.state.groupBuyId}
            //
            // HttpRequest.get('/v2','/admin.groupbuying.detail', param, this.onGetGroupbuyingDetailSuccess.bind(this),
            //     (e) => {
            //         console.log(' error:' + e)
            //         Alert.alert('提示','获取接龙详情失败，请稍后再试。')
            //     })
        });
        // DeviceEventEmitter.emit('ChangeProductDetail',this.state.isOnlyUpdateSet);



    }
    unique(arr) {
        var result = [], hash = {};
        for (var i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;

    }
    componentWillUnmount() {

    }
    onGetGroupbuyingDetailSuccess(response){
        console.log('onGetGroupbuyingDetailSuccess11:'+JSON.stringify(response))
        if (response.code ==1){
            this.setState({
                group_buying_detail:response.data.group_buying_detail,
                groupProductScrollArr:response.data.group_buying_products,
                isHaveGoodsArr:response.data.group_buying_products,
                isHaveGoodsNum:response.data.group_buying_products.length,
                group_eyu:response.data.group_buying_detail.eyu,
                groupTitle:response.data.group_buying_detail.classify_name,
                groupDeadlineTime:response.data.group_buying_detail.end_time,
                groupDeliveryTime:response.data.group_buying_detail.ship_time,
                classify_Id:response.data.group_buying_detail.classify,
                isGroupProductScrollArrNum:response.data.group_buying_products.length,
                isLoading:true
            })

        }

    }
    //创建年月日时分多项选择框
    creatTimeOfPicker(isDeadline){
        let pickerData = [];
        if (isDeadline){
            let years = [],
                months = [],
                days = [];

            for(let i=1;i<15;i++){
                years.push(i+2016+'年');
            }
            for(let i=1;i<13;i++){
                months.push(i+'月');

            }
            for(let i=1;i<32;i++){
                days.push(i+'日');
            }

            pickerData = [years, months, days];
        }else {

            let years = [],
                months = [],
                days = [],
                hours = [],
                minutes = [];

            for(let i=1;i<15;i++){
                years.push(i+2016+'年');
            }
            for(let i=1;i<13;i++){
                months.push(i+'月');

            }
            for(let i=0;i<24;i++){

                hours.push(i+'点');
            }

            for(let i=1;i<32;i++){
                days.push(i+'日');
            }
            for(let i=0;i<60;i++){
                minutes.push(i+'分');
            }
            pickerData = [years, months, days, hours, minutes];
        }

        return pickerData;
    }
    creatPickerWithInfo(titles,Data,Value){
        let pickerData = Data;
        let selectedValue = Value;
        let pickerTitle = titles;
        if (pickerTitle == this.state.groupDeliveryTitle){
            Picker.init({
                pickerData,
                selectedValue,
                pickerTitleText: pickerTitle,
                pickerConfirmBtnText:'保存',
                pickerConfirmBtnColor: [234, 107, 16, 1],
                pickerCancelBtnColor: [123, 123, 123, 1],
                pickerTitleColor: [28, 28, 28, 1],
                pickerToolBarFontSize: 18,
                pickerFontSize: 18,
                pickerFontColor: [76, 76 ,76, 1],
                pickerBg: [255, 255, 255, 1],
                pickerCancelBtnText:'取消',
                wheelFlex: [1, 1, 1],
                onPickerConfirm: pickedValue => {
                    // var deliveryTime = pickedValue[0]+'/'+pickedValue[1]+'/'+pickedValue[2]+' '+pickedValue[3]+':'+pickedValue[4]+':'+pickedValue[5]

                    var year = this.state.pickedDeliveryValue[0].split('年');
                    var month = this.state.pickedDeliveryValue[1].split('月');
                    var day = this.state.pickedDeliveryValue[2].split('日');

                    var  deliveryTime = year[0]+'-'+month[0]+'-'+day[0]

                    console.log('deliveryTime1', deliveryTime);

                    // var displayDeliveryTime = new Date(deliveryTime).format("yyyy年MM月dd日");
                    // var displayDeliveryTime = deliveryTime;
                    //
                    this.setState({
                        groupDeliveryTime:deliveryTime,
                    })

                    // console.log('displayDeliveryTime2', displayDeliveryTime);
                },
                onPickerCancel: pickedValue => {
                    console.log('area', pickedValue);
                },
                onPickerSelect: pickedValue => {
                    let targetValue = [...pickedValue];
                    var year = targetValue[0].split('年')[0];
                    var month = targetValue[1].split('月')[0];
                    var day = targetValue[2].split('日')[0];

                    if(parseInt(month) === 2){
                        if(year%4 === 0 && day > 29){
                            console.log('area15', pickedValue);

                            targetValue[2] = '29日'
                        }
                        else if(year%4 !== 0 && day > 28){


                            targetValue[2] = '28日'

                            console.log('area16', pickedValue);
                        }
                    }
                    else if(month in {4:1, 6:1, 9:1, 11:1} && day > 30){
                        console.log('area17', pickedValue);

                        targetValue[2] = '30日'

                    }
                    Picker.select(targetValue);
                    this.state.pickedDeliveryValue = targetValue;
                    console.log('this.state.pickedDeliveryValue1'+JSON.stringify(this.state.pickedDeliveryValue))


                }
            });
        }else {
            Picker.init({
                pickerData,
                selectedValue,
                pickerTitleText: pickerTitle,
                pickerConfirmBtnText:'保存',
                pickerConfirmBtnColor: [234, 107, 16, 1],
                pickerCancelBtnColor: [123, 123, 123, 1],
                pickerTitleColor: [28, 28, 28, 1],
                pickerToolBarFontSize: 18,
                pickerFontSize: 18,
                pickerFontColor: [76, 76 ,76, 1],
                pickerBg: [255, 255, 255, 1],
                pickerCancelBtnText:'取消',
                wheelFlex: [1, 1, 1, 1, 1],
                onPickerConfirm: pickedValue => {

                    let selectValue = this.state.pickedDeadlineValue
                    var year = selectValue[0].split('年')[0];
                    var month = selectValue[1].split('月')[0];
                    var day = selectValue[2].split('日')[0];
                    var hour = selectValue[3].split('点')[0];
                    var minutes = selectValue[4].split('分')[0];
                    var deadlineTime =''

                    console.log('selectValue'+JSON.stringify(selectValue))
                        deadlineTime = year+'/'+month+'/'+day+' '+hour+':'+minutes

                    console.log('deadlineTime'+JSON.stringify(deadlineTime))
                    var displayDeadlineTime = new Date(deadlineTime).format("yyyy/MM/dd hh:mm:ss");

                    console.log('displayDeadlineTime1'+JSON.stringify(displayDeadlineTime))
                    this.setState({
                        groupDeadlineTime:displayDeadlineTime,
                    })
                },
                onPickerCancel: pickedValue => {
                    console.log('area', pickedValue);
                },
                onPickerSelect: pickedValue => {
                    let targetValue = [...pickedValue];
                    var year = targetValue[0].split('年')[0];
                    var month = targetValue[1].split('月')[0];
                    var day = targetValue[2].split('日')[0];

                    if(parseInt(month) === 2){
                        if(year%4 === 0 && day > 29){
                            targetValue[2] = '29日';
                        }
                        else if(year%4 !== 0 && day > 28){
                            targetValue[2] = '28日';
                        }
                    }
                    else if(month in {4:1, 6:1, 9:1, 11:1} && day > 30){
                        targetValue[2] = '30日';

                    }
                    Picker.select(targetValue);
                    this.state.pickedDeadlineValue = targetValue;
                    // pickedValue = targetValue;
                    // forbidden some value such as some 2.29, 4.31, 6.31...
                    // if(JSON.stringify(targetValue) !== JSON.stringify(pickedValue)){
                    //     // android will return String all the time，but we put Number into picker at first
                    //     // so we need to convert them to Number again
                    //     targetValue.map((v, k) => {
                    //         if(k !== 3){
                    //             targetValue[k] = parseInt(v);
                    //         }
                    //     });
                    //
                    // }
                }
            });
        }


    }

    selectGroupTitle(){
        Picker.hide()
        if(this.props.isCreateNewGroup){
            this.props.navigator.push({
                component: ClassifyListView,
                props:{

                    classify_Id:this.state.classify_Id,
                }
            })
        }else {
            this.props.navigator.push({
                component: ClassifyListView,
                props:{
                    classify_Id:this.state.classify_Id,

                }
            })
        }



    }
    selectGroupDeadline(){
        //true 为截团时间picker   ，false 为 预计发货时间picker
        this.refs.eyu.blur();

            if (this.state.isSelectPicker){
                if (this.state.isGroupDeadlineHave){
                    Picker.toggle();
                }else {
                    let pickerData = this.creatTimeOfPicker();
                    let date = new Date(this.state.groupDeadlineTime);
                    console.log('currentData1'+date)
                    let selectedValue = [
                        [date.getFullYear()],
                        [date.getMonth()+1],
                        [date.getDate()],
                        // [date.getHours() > 11 ? 'pm' : 'am'],
                        [date.getHours()],
                        [date.getMinutes()]
                    ];
                    console.log('currentData2'+selectedValue)
                    this.creatPickerWithInfo(this.state.groupDeadlineTitle,pickerData,selectedValue);
                    this.state.isGroupDeadlineHave = true;
                    this.state.isSelectPicker = true;
                    Picker.show();
                }
            }else {
                let pickerData = this.creatTimeOfPicker();
                let date = new Date(this.state.groupDeadlineTime);
                console.log('currentData3'+date)
                let selectedValue = [
                    [date.getFullYear()],
                    [date.getMonth()+1],
                    [date.getDate()],
                    [date.getHours()],
                    [date.getMinutes()]
                ];
                console.log('currentData4'+selectedValue)
                this.creatPickerWithInfo(this.state.groupDeadlineTitle,pickerData,selectedValue);
                this.state.isGroupDeadlineHave = true;
                this.state.isSelectPicker = true;
                Picker.show();
            }





    }
    selectGroupDeliveryTime(){
        this.refs.eyu.blur();
        if (this.state.isSelectPicker){
            let pickerData = this.creatTimeOfPicker(this.state.isSelectPicker );
            let date = new Date(this.state.groupDeliveryTime);
            console.log('currentData5'+date)
            let selectedValue = [
                [date.getFullYear()],
                [date.getMonth()+1],
                [date.getDate()],

            ];
            console.log('currentData6'+selectedValue)
            this.creatPickerWithInfo(this.state.groupDeliveryTitle,pickerData,selectedValue);
            this.state.isGroupDeliveryTimeHave = true;
            this.state.isSelectPicker = false;
            Picker.show();
        }else {
            if (this.state.isGroupDeliveryTimeHave){
                Picker.toggle();
            }else {
                let pickerData = this.creatTimeOfPicker();
                let date = new Date(this.state.groupDeliveryTime);
                console.log('currentData7'+date)
                let selectedValue = [
                    [date.getFullYear()],
                    [date.getMonth()+1],
                    [date.getDate()],

                ];
                console.log('currentData8'+selectedValue)
                this.creatPickerWithInfo(this.state.groupDeliveryTitle,pickerData,selectedValue);
                this.state.isGroupDeliveryTimeHave = true;
                this.state.isSelectPicker = false;
                Picker.show();
            }
        }





    }
    OnAddProductViewPress(){
        Picker.hide()
        if (this.props.isCreateNewGroup){
            var groupBuyInfo = {
                title:this.state.group_buying_detail.title,
                classify:this.state.group_buying_detail.classify,
                end_time:new Date(this.state.groupDeadlineTime).format("yyyy-MM-dd hh:mm:ss"),
                ship_time:this.state.groupDeliveryTime,
                on_sale:this.state.group_buying_detail.on_sale,
                eyu:this.state.group_buying_detail.eyu,
                id:this.state.group_buying_detail.id,
            }
            this.props.navigator.push({
                component: AddProductView,
                props:{
                    groupbuying_info:groupBuyInfo,
                    isCreateNewGroup:this.props.isCreateNewGroup
                }
            })
            // var groupProductsArr = [];
            // this.state.groupProductScrollArr.map((subitem, i) => {
            //     if (subitem.selected == true){
            //         groupProductsArr.push({
            //             name:subitem.name,
            //             goods_id:subitem.goods_id,
            //             price:subitem.default_price,
            //             stock:subitem.default_stock,
            //             image:subitem.image,
            //             unit:subitem.default_unit,
            //             org_goods_id:subitem.org_goods_id,
            //         });
            //     }
            // })
            // let param = { groupbuying_info: this.props.groupbuying_info,del_goods:[],groupbuying_products:groupProductsArr}
            // HttpRequest.post('/v2','/admin.groupbuying.update', param, this.onNewGroupBuyingSuccess.bind(this),
            //     (e) => {
            //         console.log(' error:' + e)
            //         Alert.alert('提示','新建商品类别失败，请稍后再试。')
            //     })
        }else {
            var groupBuyInfo = {
                title:this.state.group_buying_detail.title,
                classify:this.state.group_buying_detail.classify,
                end_time:new Date(this.state.groupDeadlineTime).format("yyyy-MM-dd hh:mm:ss"),
                ship_time:this.state.groupDeliveryTime,
                on_sale:this.state.group_buying_detail.on_sale,
                eyu:this.state.group_buying_detail.eyu,
                id:this.state.group_buying_detail.id,
            }
            this.props.navigator.push({
                component: AddProductView,
                props:{
                    groupbuying_info:groupBuyInfo,
                    isCreateNewGroup:this.props.isCreateNewGroup
                }
            })
        }


    }
    onCreateGroupBuyingToAddProductSuccess(response){
        console.log('onCreateGroupBuyingToAddProductSuccess112:'+JSON.stringify(response))
        this.props.navigator.push({
            component: AddProductView,
            props:{
                groupbuying_info:this.state.groupbuying_info
            }
        })
    }
    cancelItem(item,index){

        console.log('112'+item)
        if (this.props.isCreateNewGroup){
            var groupArr =[];
            // this.state.Del_goods = [];
            console.log('this.state.groupProductScrollArr111'+JSON.stringify(this.state.groupProductScrollArr))
            this.state.groupProductScrollArr.map((product, i) => {
                if (index == i){


                }else {
                    groupArr.push(product);
                }
            })
            this.state.groupProductScrollArr = groupArr;
            this.state.addGroupProductScrollArr = groupArr;
            console.log('this.state.groupProductScrollArr112'+JSON.stringify(this.state.groupProductScrollArr))
            console.log(' this.state.addGroupProductScrollArr112:'+JSON.stringify(this.state.addGroupProductScrollArr))
            this.setState({ ...this.state });
        }else {
            var groupArr =[];
            var addArr= [];
            // this.state.Del_goods = [];
            console.log('index11:'+index)
            console.log('this.state.groupProductScrollArr111'+JSON.stringify(this.state.groupProductScrollArr))
            this.state.groupProductScrollArr.map((product, i) => {
                if (index == i){

                   this.state.addIndexArr.map((addIndex, x) => {

                       if (index == addIndex){
                           console.log('addIndexArr20:'+JSON.stringify(this.state.addIndexArr))
                           //调整之后的下标
                           var testArr = this.state.addIndexArr.slice(x)
                           testArr.shift();
                           console.log('addIndexArr201:'+JSON.stringify(testArr))
                           console.log('addIndexArr21:'+JSON.stringify(this.state.addIndexArr))
                           this.state.addIndexArr.splice(x)
                           console.log('addIndexArr21:'+JSON.stringify(this.state.addIndexArr))
                           var updateIndexArr =[]
                           for (var num = 0; num < testArr.length; num++){
                               var itemIndex = testArr[num];
                               console.log('itemIndex11:'+JSON.stringify(itemIndex))
                               updateIndexArr.push(itemIndex-1);
                           }
                           console.log('updateIndexArr21:'+JSON.stringify(updateIndexArr))
                           let tempArr = this.state.addIndexArr.concat(updateIndexArr);
                           this.state.addIndexArr = tempArr;
                           console.log('addIndexArr22:'+JSON.stringify(this.state.addIndexArr))

                       }else {
                           console.log('addIndexArr23:'+JSON.stringify(this.state.addIndexArr))
                       }
                   })

                    if (item.goods_id == "NULL"){
                        console.log('indexitem1:'+JSON.stringify(item))
                        this.state.addGroupProductScrollArr.map((addProduct, h) => {

                            if (index == h+this.state.isHaveGoodsNum){
                                console.log('index11:'+h)

                            }else {
                                console.log('index22:'+h)
                                addArr.push(addProduct);
                            }
                        })
                    }else {
                        console.log('indexitem2:'+JSON.stringify(item))
                        this.state.addGroupProductScrollArr.map((addProduct, h) => {

                            if (item.goods_id == addProduct.goods_id){

                                console.log('index1:'+h)
                            }else {
                                console.log('index2:'+h)
                                addArr.push(addProduct);
                            }
                        })
                    }

                    console.log('isHaveGoodsArr'+JSON.stringify(this.state.isHaveGoodsArr));
                    console.log('isHaveGoodsitem'+JSON.stringify(item));
                    this.state.isHaveGoodsArr.map((haveProduct, j) => {
                        // if (index == j){
                        //     console.log('haveGoodindex'+index);
                        //
                        //     if (item.goods_id == haveProduct.goods_id){
                        //         console.log('haveProduct'+JSON.stringify(haveProduct));
                        //         this.state.isHaveDel_goods = true;
                        //         this.state.Del_goods.push(haveProduct.goods_id.toString())
                        //     }
                        //
                        // }else {
                        //     // groupArr.push(product);
                        // }


                            if (item.goods_id == haveProduct.goods_id){
                                console.log('haveProduct'+JSON.stringify(haveProduct));
                                this.state.isHaveDel_goods = true;
                                this.state.Del_goods.push(haveProduct.goods_id.toString())
                            }


                    })
                }else {
                    groupArr.push(product);
                }

            })
            this.state.groupProductScrollArr = groupArr;
            this.state.addGroupProductScrollArr = addArr;
            this.state.isGroupProductScrollArrNum = groupArr.length
            console.log('this.state.groupProductScrollArr112'+JSON.stringify(this.state.groupProductScrollArr))
            console.log('this.state.Del_goods112:'+JSON.stringify(this.state.Del_goods))
            this.setState({ ...this.state });
        }
        // if (this.props.isCreateNewGroup){
        //     var groupArr =[];
        //     // this.state.Del_goods = [];
        //     console.log('this.state.groupProductScrollArr111'+JSON.stringify(this.state.groupProductScrollArr))
        //     this.state.groupProductScrollArr.map((product, i) => {
        //         if (product.org_goods_id == item.org_goods_id){
        //
        //
        //         }else {
        //             groupArr.push(product);
        //         }
        //     })
        //     this.state.groupProductScrollArr = groupArr;
        //     this.state.addGroupProductScrollArr = groupArr;
        //     console.log('this.state.groupProductScrollArr112'+JSON.stringify(this.state.groupProductScrollArr))
        //     console.log(' this.state.addGroupProductScrollArr112:'+JSON.stringify(this.state.addGroupProductScrollArr))
        //     this.setState({ ...this.state });
        // }else {
        //     var groupArr =[];
        //     var addArr= [];
        //     // this.state.Del_goods = [];
        //     console.log('this.state.groupProductScrollArr111'+JSON.stringify(this.state.groupProductScrollArr))
        //     this.state.groupProductScrollArr.map((product, i) => {
        //         if (product.org_goods_id == item.org_goods_id){
        //             this.state.addGroupProductScrollArr.map((addProduct, i) => {
        //                 if (addProduct.org_goods_id == item.org_goods_id){
        //
        //                 }else {
        //                     addArr.push(addProduct);
        //                 }
        //             })
        //             this.state.isHaveGoodsArr.map((haveProduct, i) => {
        //                 if (haveProduct.goods_id == item.goods_id){
        //                     this.state.isHaveDel_goods = true;
        //                     this.state.Del_goods.push(haveProduct.goods_id.toString())
        //                 }else {
        //                     // groupArr.push(product);
        //                 }
        //             })
        //
        //         }else {
        //             groupArr.push(product);
        //         }
        //     })
        //     this.state.groupProductScrollArr = groupArr;
        //     this.state.addGroupProductScrollArr = addArr;
        //     console.log('this.state.groupProductScrollArr112'+JSON.stringify(this.state.groupProductScrollArr))
        //     console.log('this.state.Del_goods112:'+JSON.stringify(this.state.Del_goods))
        //     this.setState({ ...this.state });
        // }

    }
    disPlayIcon(item){
        if (item.image ==''){
            return  require('../../images/me_bj.jpg')
        }else if (item.image == null){
            return  require('../../images/me_bj.jpg')
        }else {
            return {uri:item.image}
        }
    }
    renderProductInfo(item, w, h, i){
        var  swipeoutBtns = [
            {
                backgroundColor:'red',
                color:'white',
                text:'删除',

                onPress:() => this.cancelItem(item, i),

            }


        ]
        console.log('item22:'+JSON.stringify(item))
        return(  <Swipeout right={swipeoutBtns}
                           autoClose={true}
                           sensitivity={5}
                           buttonWidth={60}


        >
            <View style={{
            resizeMode: 'contain', alignItems: 'center', width: w, height: h,
            justifyContent: 'flex-start', paddingLeft: 10, paddingRight: 10, flexDirection: "row", backgroundColor: '#ffffff',
            flex: 1
        }}>


                <View style={{

            }}>
                    <Image style={{
                    resizeMode: 'contain', alignItems: 'center', width: 80, height: 80,
                    justifyContent: 'center',
                }} source={this.disPlayIcon(item)} />
                </View>

                <View style={{marginLeft:10,width:width-100
            }}><TouchableOpacity style={{flexDirection:'column',alignItems: 'flex-start',height: h,

                }} onPress={this. onPressToEditGoods.bind(this,item,i)}>
                    <Text style={{  marginTop: 15, numberOfLines: 2, ellipsizeMode: 'tail', fontSize: 14, color: "#1c1c1c",textAlign: 'center', }}>{item.name}</Text>
                    <Text style={{ marginTop: 3, fontSize: 12, color: "#757575",  textAlign: 'center',}}>{item.unit}</Text>
                    <View style={{ alignItems: 'flex-start', flexDirection: 'row',}}>
                        <Text style={{ marginTop: 20,fontSize: 16, color: "#fb7210", }}>S$ {item.price}</Text>
                        <Text style={{  textAlign: 'left',fontSize: 12, color: "#757575", marginLeft:10,marginTop: 23 }}>库存：{item.stock}</Text>
                    </View>
                </TouchableOpacity>
                </View>

            </View>
            <View style={{marginLeft:10,marginRight:10,height:0.5,backgroundColor:'rbg(219,219,219)'}}></View>
        </Swipeout>)
    }
    renderProductScrollView(groupProductScrollArr){
        const w = width, h = 100
        console.log('groupProductScrollArr1:'+JSON.stringify(groupProductScrollArr))
        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h, marginTop: 5, marginRight: 5,  }, styles.toolsItem]}>
                                    {this.renderProductInfo(item, w, h, i)}
                                </View>
                            )
                            return (
                                <View style={{ width: w, height: h }}>{render}</View>
                            )
                        })
                    }
                </View>
            )
        }
        return (
            renderSwipeView(groupProductScrollArr)
        )
    }
    onPressToEditGoods(goodItem,index){
        console.log('GroupProductEditView890:'+JSON.stringify(goodItem))
        this.state.isUpdate =false;
        Picker.hide();
            this.props.navigator.push({
                component: GroupProductEditView,
                props: {
                    oldSet:this.state.groupTitle,
                    isEditGood:true,
                    isCreateNewGroup:this.props.isCreateNewGroup,
                    org_goods_id:goodItem.org_goods_id,
                        price:goodItem.price,
                        stock:goodItem.stock,
                        unit:goodItem.unit,
                        index:index,




                }

            })
        // if (this.state.groupTitle ==''){
        //     Alert.alert('提示','请输入您的商品类别')
        // }else if (this.state.groupTitle == this.state.oldSet){
        //     console.log('onPressToEditGoods116:'+JSON.stringify(goodItem))
        //     this.props.navigator.push({
        //         component: NewProductView,
        //         props: {
        //             oldSet:this.state.oldSet,
        //             isEditGood:true,
        //             org_goods_id:goodItem.org_goods_id
        //
        //         }
        //
        //     })
        //
        //
        // }else {
        //     console.log('onPressToEditGoods117:'+JSON.stringify(goodItem))
        //     this.state.UpdateSetToEditOrg_goods_id = goodItem.this.state.org_goods_id;
        //     let param = { new_set: this.state.groupTitle,old_set:this.state.oldSet }
        //
        //     HttpRequest.post('/v2','/admin.goods.set.update', param, this.onUpdateSetToEditProductSuccess.bind(this),
        //         (e) => {
        //             console.log(' error:' + e)
        //             Alert.alert('提示','新建商品类别失败，请稍后再试。')
        //         })
        // }

        // if (this.state.groupTitle ==''){
        //     Alert.alert('提示','请输入您的商品类别')
        // }else if (this.state.groupTitle == this.state.oldSet){
        //     console.log('onPressToEditGoods116:'+JSON.stringify(goodItem))
        //     this.props.navigator.push({
        //         component: NewProductView,
        //         props: {
        //             oldSet:this.state.oldSet,
        //             isEditGood:true,
        //             org_goods_id:goodItem.org_goods_id
        //
        //         }
        //
        //     })
        //
        //
        // }else {
        //     console.log('onPressToEditGoods117:'+JSON.stringify(goodItem))
        //     this.state.UpdateSetToEditOrg_goods_id = goodItem.this.state.org_goods_id;
        //     let param = { new_set: this.state.groupTitle,old_set:this.state.oldSet }
        //
        //     HttpRequest.post('/v2','/admin.goods.set.update', param, this.onUpdateSetToEditProductSuccess.bind(this),
        //         (e) => {
        //             console.log(' error:' + e)
        //             Alert.alert('提示','新建商品类别失败，请稍后再试。')
        //         })
        // }

    }
    compareCalendar(startDate, endDate) {
        if (startDate.indexOf(" ") != -1 && endDate.indexOf(" ") != -1 ) {
            //包含时间，日期
            compareTime(startDate, endDate);
        } else {
            //不包含时间，只包含日期
            compareDate(startDate, endDate);
        }
    }
    saveGroup(){


        Picker.hide()


        if (this.state.group_eyu){

        }else {
            Alert.alert('提示','请输入商品类别')
            return
        }
        if (this.state.groupDeadlineTime){

        }else {
            Alert.alert('提示','请选择截团时间')
            return
        }
        if (this.state.groupDeliveryTime){

        }else {
            Alert.alert('提示','请选择预计发货时间时间')
            return
        }
        console.log('endTime0',this.state.groupDeliveryTime)
        var DeliveryArray =  this.state.groupDeliveryTime.split("-");
        console.log('endTime01',DeliveryArray)
        var endTime = new Date(DeliveryArray[0], DeliveryArray[1]-1, DeliveryArray[2]);
        this.state.groupDeliveryTime = new Date(endTime).format("yyyy-MM-dd")
        var startTime  = new Date( this.state.groupDeadlineTime);
            console.log('startTime',startTime)
        console.log('endTime',endTime)

        // let isTimeNo =  this.compareCalendar(startTime, endTime);
        if(endTime>startTime){

        }else {

            Alert.alert('提示','预计发货时间必须大于截团时间')
            return
        }




        if (this.props.isCreateNewGroup){
            if (this.state.classify_Id){

            }else {
                Alert.alert('提示','请选择本次接龙的标题！')
                return
            }
            if (this.state.groupProductScrollArr.length  > 0){
                Alert.alert(
                    '分享接龙',
                    '点击分享接龙，将本次创建的接龙商品分享给团友即刻开启拼团之旅！',
                    [

                        {text: '稍候分享', onPress: this.onPressWaitShareJieLong.bind(this)},
                        {text: '立即分享', onPress: this.onPressShareJieLong.bind(this)},
                    ],
                    { cancelable: false }
                )


            }else {
                Alert.alert('提示','请添加参加拼团的商品！')
            }

            // var groupProductsArr = [];
            // this.state.groupProductScrollArr.map((subitem, i) => {
            //     if (subitem.selected == true){
            //         groupProductsArr.push({
            //             name:subitem.name,
            //             goods_id:subitem.goods_id,
            //             price:subitem.default_price,
            //             stock:subitem.default_stock,
            //             image:subitem.image,
            //             unit:subitem.default_unit,
            //             org_goods_id:subitem.org_goods_id,
            //         });
            //     }
            // })
            // let param = { groupbuying_info: this.props.groupbuying_info,del_goods:[],groupbuying_products:groupProductsArr}
            // HttpRequest.post('/v2','/admin.groupbuying.update', param, this.onNewGroupBuyingSuccess.bind(this),
            //     (e) => {
            //         console.log(' error:' + e)
            //         Alert.alert('提示','新建商品类别失败，请稍后再试。')
            //     })
        }else {

            if (this.state.isHaveDel_goods){
                if (this.state.group_buying_detail.on_sale =='0'){
                    Alert.alert(
                        '分享接龙',
                        '点击分享接龙，将本次创建的接龙商品分享给团友即刻开启拼团之旅！',
                        [

                            {text: '稍候分享', onPress: this.onPressWaitShareJieLong.bind(this)},
                            {text: '立即分享', onPress: this.onPressShareJieLong.bind(this)},
                        ],
                        { cancelable: false }
                    )
                }else {
                    var groupBuyInfo = {
                        title:this.state.groupTitle,
                        classify:this.state.classify_Id,
                        end_time:new Date(this.state.groupDeadlineTime).format("yyyy-MM-dd hh:mm:ss"),
                        ship_time:this.state.groupDeliveryTime,
                        on_sale:this.state.group_buying_detail.on_sale,
                        eyu:this.state.group_eyu,
                        id:this.state.group_buying_detail.id,
                    }
                    let updateArr = []
                    for (var i = 0; i <this.state.addIndexArr.length;i++){
                        let indexNum = this.state.addIndexArr[i];
                        updateArr.push(this.state.groupProductScrollArr[indexNum]);
                    }
                    let param = { groupbuying_info: groupBuyInfo,del_goods:this.state.Del_goods,groupbuying_products:updateArr}
                    console.log('dele1:'+JSON.stringify(param))
                    console.log('groupArrall1:'+JSON.stringify(this.state.groupProductScrollArr))
                    console.log('this.state.addIndexArr1:'+JSON.stringify(this.state.addIndexArr))

                    HttpRequest.post('/v2','/admin.groupbuying.update', param, this.onUpdateGroupBuyingSuccess.bind(this),
                        (e) => {
                            console.log(' error:' + e)
                            Alert.alert('提示','新建商品类别失败，请确认输入文本信息中不含图形和表情。。')
                        })
                }


            }else {
                if (this.state.group_buying_detail.on_sale =='0'){
                    Alert.alert(
                        '分享接龙',
                        '点击分享接龙，将本次创建的接龙商品分享给团友即刻开启拼团之旅！',
                        [

                            {text: '稍候分享', onPress: this.onPressWaitShareJieLong.bind(this)},
                            {text: '立即分享', onPress: this.onPressShareJieLong.bind(this)},
                        ],
                        { cancelable: false }
                    )
                }else {
                    var groupBuyInfo = {
                        title:this.state.groupTitle,
                        classify:this.state.classify_Id,
                        end_time:new Date(this.state.groupDeadlineTime).format("yyyy-MM-dd hh:mm:ss"),
                        ship_time:this.state.groupDeliveryTime,
                        on_sale:this.state.group_buying_detail.on_sale,
                        eyu:this.state.group_eyu,
                        id:this.state.group_buying_detail.id,
                    }
                    let updateArr = []
                    for (var i = 0; i <this.state.addIndexArr.length;i++){
                        let indexNum = this.state.addIndexArr[i];
                        updateArr.push(this.state.groupProductScrollArr[indexNum]);
                    }
                    let param = { groupbuying_info: groupBuyInfo,del_goods:[],groupbuying_products:updateArr}
                    console.log('dele2:'+JSON.stringify(param))
                    console.log('groupArrall2:'+JSON.stringify(this.state.groupProductScrollArr))
                    console.log('this.state.addIndexArr2:'+JSON.stringify(this.state.addIndexArr))
                    HttpRequest.post('/v2','/admin.groupbuying.update', param, this.onUpdateGroupBuyingSuccess.bind(this),
                        (e) => {
                            console.log(' error:' + e)
                            Alert.alert('提示','新建商品类别失败，请确认输入文本信息中不含图形和表情。。')
                        })
                }

            }

        }

    }
    onNewGroupBuyingSuccess(response){

    }
    onCreateGroupBuyingNoShareSuccess(response){
        console.log('onCreateGroupBuyingSuccess'+JSON.stringify(response))



        Alert.alert('提示','保存成功', [

                {text: 'OK', onPress: this.saveSuccess.bind(this)},
            ],
            { cancelable: false })
    }
    onCreateGroupBuyingSuccess(response){
        console.log('onCreateGroupBuyingSuccess'+JSON.stringify(response))

        var  thumbImageStr = ''
        if (response.data.sharing_info.image == null){

        }else {
            thumbImageStr = response.data.sharing_info.image
        }
        console.log('onCreateGroupBuyingSuccess12'+JSON.stringify(response.data.sharing_info))
        if (response.data.sharing_info){
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled){
                        WeChat.shareToSession({
                            type:'news',
                            title:response.data.sharing_info.name,
                            description:response.data.sharing_info.desc,
                            webpageUrl:this.state.agent_url,
                            thumbImage: thumbImageStr,
                        }).cache((error) =>{
                            ToastShort(error.message);
                        });
                    }else {
                        ToastShort('没有安装微信软件，请您安装微信之后再试');

                    }
                });
            this.saveSuccess();
        }else {
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled){
                        WeChat.shareToSession({
                            type:'news',
                            title:response.data.sharing_info.name,
                            description:response.data.sharing_info.desc ,
                            webpageUrl:this.state.agent_url,
                            thumbImage: thumbImageStr,
                        }).cache((error) =>{
                            ToastShort(error.message);
                        });
                    }else {
                        ToastShort('没有安装微信软件，请您安装微信之后再试');

                    }
                });
            this.saveSuccess();
        }

        // Alert.alert('提示','保存成功', [
        //
        //         {text: 'OK', onPress: this.saveSuccess.bind(this)},
        //     ],
        //     { cancelable: false })
    }
    onPressShareJieLong(){
        if (this.props.isCreateNewGroup){
            var groupBuyInfo = {

                classify:this.state.classify_Id,
                end_time:new Date(this.state.groupDeadlineTime).format("yyyy-MM-dd hh:mm:ss"),
                ship_time:this.state.groupDeliveryTime,
                on_sale:1,
                eyu:this.state.group_eyu,
            }
            let param = { groupbuying_info: groupBuyInfo,groupbuying_products:this.state.addGroupProductScrollArr}
            console.log('dele:'+JSON.stringify(param))
            HttpRequest.post('/v2','/admin.groupbuying.create', param, this.onCreateGroupBuyingSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                    Alert.alert('提示','新建接龙失败，请稍后再试。')
                })
        }else {
            if (this.state.isHaveDel_goods){
                var groupBuyInfo = {
                    title:this.state.groupTitle,
                    classify:this.state.classify_Id,
                    end_time:new Date(this.state.groupDeadlineTime).format("yyyy-MM-dd hh:mm:ss"),
                    ship_time:this.state.groupDeliveryTime,
                    on_sale:1,
                    eyu:this.state.group_eyu,
                    id:this.state.group_buying_detail.id,
                }
                let updateArr = []
                for (var i = 0; i <this.state.addIndexArr.length;i++){
                    let indexNum = this.state.addIndexArr[i];
                    updateArr.push(this.state.groupProductScrollArr[indexNum]);
                }
                let param = { groupbuying_info: groupBuyInfo,del_goods:this.state.Del_goods,groupbuying_products:updateArr}
                console.log('dele1:'+JSON.stringify(param))
                HttpRequest.post('/v2','/admin.groupbuying.update', param, this.onUpdateGroupBuyingShareSuccess.bind(this),
                    (e) => {
                        console.log(' error:' + e)
                        Alert.alert('提示','新建接龙失败，请稍后再试。')
                    })
            }else {
                var groupBuyInfo = {
                    title:this.state.groupTitle,
                    classify:this.state.classify_Id,
                    end_time:new Date(this.state.groupDeadlineTime).format("yyyy-MM-dd hh:mm:ss"),
                    ship_time:this.state.groupDeliveryTime,
                    on_sale:1,
                    eyu:this.state.group_eyu,
                    id:this.state.group_buying_detail.id,
                }
                let updateArr = []
                for (var i = 0; i <this.state.addIndexArr.length;i++){
                    let indexNum = this.state.addIndexArr[i];
                    updateArr.push(this.state.groupProductScrollArr[indexNum]);
                }
                let param = { groupbuying_info: groupBuyInfo,del_goods:[],groupbuying_products:updateArr}
                console.log('dele2:'+JSON.stringify(param))
                HttpRequest.post('/v2','/admin.groupbuying.update', param, this.onUpdateGroupBuyingShareSuccess.bind(this),
                    (e) => {
                        console.log(' error:' + e)
                        Alert.alert('提示','新建接龙失败，请稍后再试。')
                    })
            }
        }



    }
    onPressWaitShareJieLong(){
        if (this.props.isCreateNewGroup){
            var groupBuyInfo = {

                classify:this.state.classify_Id,
                end_time:new Date(this.state.groupDeadlineTime).format("yyyy-MM-dd hh:mm:ss"),
                ship_time:this.state.groupDeliveryTime,
                on_sale:0,
                eyu:this.state.group_eyu,
            }
            let param = { groupbuying_info: groupBuyInfo,groupbuying_products: this.state.addGroupProductScrollArr}
            console.log('dele:'+JSON.stringify(param))
            HttpRequest.post('/v2','/admin.groupbuying.create', param, this.onCreateGroupBuyingNoShareSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                    Alert.alert('提示','新建商品类别失败，请稍后再试。')
                })
        }else {
            if (this.state.isHaveDel_goods){
                var groupBuyInfo = {
                    title:this.state.groupTitle,
                    classify:this.state.classify_Id,
                    end_time:new Date(this.state.groupDeadlineTime).format("yyyy-MM-dd hh:mm:ss"),
                    ship_time:this.state.groupDeliveryTime,
                    on_sale:0,
                    eyu:this.state.group_eyu,
                    id:this.state.group_buying_detail.id,
                }
                let updateArr = []
                for (var i = 0; i <this.state.addIndexArr.length;i++){
                    let indexNum = this.state.addIndexArr[i];
                    updateArr.push(this.state.groupProductScrollArr[indexNum]);
                }
                let param = { groupbuying_info: groupBuyInfo,del_goods:this.state.Del_goods,groupbuying_products:updateArr}
                console.log('dele1:'+JSON.stringify(param))
                HttpRequest.post('/v2','/admin.groupbuying.update', param, this.onUpdateGroupBuyingSuccess.bind(this),
                    (e) => {
                        console.log(' error:' + e)
                        Alert.alert('提示','新建商品类别失败，请确认输入文本信息中不含图形和表情。。')
                    })
            }else {
                var groupBuyInfo = {
                    title:this.state.groupTitle,
                    classify:this.state.classify_Id,
                    end_time:new Date(this.state.groupDeadlineTime).format("yyyy-MM-dd hh:mm:ss"),
                    ship_time:this.state.groupDeliveryTime,
                    on_sale:0,
                    eyu:this.state.group_eyu,
                    id:this.state.group_buying_detail.id,
                }
                let updateArr = []
                for (var i = 0; i <this.state.addIndexArr.length;i++){
                    let indexNum = this.state.addIndexArr[i];
                    updateArr.push(this.state.groupProductScrollArr[indexNum]);
                }
                let param = { groupbuying_info: groupBuyInfo,del_goods:[],groupbuying_products:updateArr}
                console.log('dele2:'+JSON.stringify(param))
                HttpRequest.post('/v2','/admin.groupbuying.update', param, this.onUpdateGroupBuyingSuccess.bind(this),
                    (e) => {
                        console.log(' error:' + e)
                        Alert.alert('提示','新建商品类别失败，请确认输入文本信息中不含图形和表情。。')
                    })
            }
        }

    }
    saveSuccess(){
        DeviceEventEmitter.emit('ChangeGroupBuyListViewUI');
        this.props.navigator.pop();

    }
    onUpdateGroupBuyingSuccess(response){
        console.log('onUpdateGroupBuyingSuccess'+JSON.stringify(response))
        Alert.alert('提示','保存成功', [

                {text: 'OK', onPress: this.saveSuccess.bind(this)},
            ],
            { cancelable: false })

        // this.state.groupBuyId = this.props.groupItem.group_buy_id;
        // let param = {groupbuying_id:this.state.groupBuyId}
        //
        // HttpRequest.get('/v2','/admin.groupbuying.detail', param, this.onGetGroupbuyingDetailSuccess.bind(this),
        //     (e) => {
        //         console.log(' error:' + e)
        //         Alert.alert('提示','获取接龙详情失败，请稍后再试。')
        //     })
    }
    onUpdateGroupBuyingShareSuccess(response){
        console.log('onUpdateGroupBuyingSuccess'+JSON.stringify(response))
        var  thumbImageStr = ''
        if (response.data.sharing_info.image == null){

        }else {
            thumbImageStr = response.data.sharing_info.image
        }
        console.log('onCreateGroupBuyingSuccess12'+JSON.stringify(response.data.sharing_info))
        if (response.data.sharing_info){
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled){
                        WeChat.shareToSession({
                            type:'news',
                            title:response.data.sharing_info.name,
                            description:response.data.sharing_info.desc,
                            webpageUrl:this.state.agent_url,
                            thumbImage: thumbImageStr,
                        }).cache((error) =>{
                            ToastShort(error.message);
                        });
                    }else {
                        ToastShort('没有安装微信软件，请您安装微信之后再试');

                    }
                });
            this.saveSuccess();
        }else {
            WeChat.isWXAppInstalled()
                .then((isInstalled) => {
                    if (isInstalled){
                        WeChat.shareToSession({
                            type:'news',
                            title:response.data.sharing_info.name,
                            description:response.data.sharing_info.desc ,
                            webpageUrl:this.state.agent_url,
                            thumbImage: thumbImageStr,
                        }).cache((error) =>{
                            ToastShort(error.message);
                        });
                    }else {
                        ToastShort('没有安装微信软件，请您安装微信之后再试');

                    }
                });
            this.saveSuccess();
        }
        // Alert.alert('提示','保存成功', [
        //
        //         {text: 'OK', onPress: this.saveSuccess.bind(this)},
        //     ],
        //     { cancelable: false })

        // this.state.groupBuyId = this.props.groupItem.group_buy_id;
        // let param = {groupbuying_id:this.state.groupBuyId}
        //
        // HttpRequest.get('/v2','/admin.groupbuying.detail', param, this.onGetGroupbuyingDetailSuccess.bind(this),
        //     (e) => {
        //         console.log(' error:' + e)
        //         Alert.alert('提示','获取接龙详情失败，请稍后再试。')
        //     })
    }



    render() {

        //页面标题
        var page_Str = '';
        if (this.props.isCreateNewGroup){
            page_Str = '新建接龙';
        }else {
            page_Str = '修改接龙';
        }
        //商品列表

        //标题
        if (this.state.groupTitle ==''){
                this.state.groupTitle = '选择本次接龙标题';
        }else {

        }
        //eyu
        //截团时间
        var jietuanTime =''
        var jietuanColor='';
        if (this.state.groupDeadlineTime == ''){
           jietuanTime ='请选择拼团截止时间';
            jietuanColor='rgb(193,193,193)';
        }else {
            jietuanTime =new Date(this.state.groupDeadlineTime).format("yyyy年MM月dd日 hh点mm分");
            jietuanColor='black';
        }

        //发货时间
        var fahuoTime =''
        var fahuoColor='';
        if (this.state.groupDeliveryTime == ''){
            fahuoTime ='请选择本次拼团发货时间';
            fahuoColor='rgb(193,193,193)';
        }else {
            var DeliveryArray =  this.state.groupDeliveryTime.split("-");

            var endTime = new Date(DeliveryArray[0], DeliveryArray[1]-1, DeliveryArray[2]);
            this.state.groupDeliveryTime = new Date(endTime).format("yyyy-MM-dd")
            fahuoTime = new Date(this.state.groupDeliveryTime).format("yyyy年MM月dd日");
            fahuoColor='black';
        }
        //共计商品数量
        var totalNum = '';
        totalNum = this.state.groupProductScrollArr.length
        return (
            <View style={styles.container}>
                <NavBar
                    title={page_Str}
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)}
                    rightTitle={'保存'}
                    rightPress={this.saveGroup.bind(this)}/>

                <View style={{}}>
                    <TouchableOpacity onPress={this.selectGroupTitle.bind(this)}>


                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={[ { flex:1, marginRight: 10, color: '#1b1b1b', fontSize: 16,fontFamily:'PingFangSC-Regular'}]} numberOfLines={1}>
                            {this.state.groupTitle}
                        </Text>
                        <Image
                            source={require('../../images/next_icon@3x.png')}>

                        </Image>

                    </View>
                    </TouchableOpacity>
                    <View style={{marginLeft:10,marginRight:10,height:1,backgroundColor:'rbg(219,219,219)'}}></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start',alignItems: 'center', backgroundColor: '#ffffff', paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={[ { width: 80, color: '#1b1b1b', fontSize: 16, marginRight: 0,fontFamily:'PingFangSC-Regular',}]} >
                            商品类别：
                        </Text>
                        <TextInput style={{
                       fontSize: 16,height:40,width:width-60,marginTop:8,
                        textAlign: 'left', color: '#1c1c1c',
                    }}  keyboardType={'default'}
                                   ref="eyu"
                                   placeholder ='如蔬菜、面食、酒水…'
                                   blurOnSubmit ={true}
                                   maxLength={6}
                                   multiline={true}
                                   editable={true}
                                   returnKeyType={'done'}
                                   underlineColorAndroid='transparent'
                                   onChangeText={(text) => this.setState({ group_eyu: text })}
                                   value= {this.state.group_eyu}
                        ></TextInput>


                    </View>
                </View>
                <View style={{marginTop:10}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={[ { marginRight: 10, color: '#1b1b1b', fontSize: 16,fontFamily:'PingFangSC-Regular',flex:1.3}]}>
                            截团时间
                        </Text>
                        <View style={{flex:5}}>
                        <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',alignItems: 'center'}} onPress={this.selectGroupDeadline.bind(this)}>

                            <Text style={[ { marginRight: 10, color: jietuanColor, fontSize: 16,fontFamily:'PingFangSC-Regular'}]}>
                                {jietuanTime}
                            </Text>
                            <Image
                                source={require('../../images/unfoldIcon@2x.png')}>

                            </Image>
                        </TouchableOpacity>
                        </View>

                    </View>
                    <View style={{marginLeft:10,marginRight:10,height:0.8,backgroundColor:'rbg(213,213,219)'}}></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 ,}}>
                        <Text style={[ { marginRight: 10, color: '#1b1b1b', fontSize: 16,fontFamily:'PingFangSC-Regular',flex:1.3}]}>
                            预计发货时间
                        </Text>
                        <View style={{flex:3}}>
                            <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',alignItems: 'center'}} onPress={this.selectGroupDeliveryTime.bind(this)}>

                                <Text style={[ { marginRight: 10, color: fahuoColor, fontSize: 16,fontFamily:'PingFangSC-Regular'}]}>
                                    {fahuoTime}
                                </Text>
                                <Image
                                    source={require('../../images/unfoldIcon@2x.png')}>

                                </Image>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
                <View style={{marginTop:10}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 }}>
                        <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}} onPress={this.OnAddProductViewPress.bind(this)}>

                       <Image source={require('../../images/addProductIcon@3x.png')}>

                        </Image>
                            <Text style={{marginLeft:10}}>添加商品</Text>
                        </TouchableOpacity>
                        <Text style={{fontSize:14,fontFamily:'PingFangSC-Regular',textAlign:'left',color:'rgb(117,117,117)'}}>共计{totalNum}件商品</Text>
                    </View>
                </View>
                <View style={{justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',}}>
                    <ScrollView
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={false}
                        style={{width:width,height:height-335}}>

                        {this.renderProductScrollView(this.state.groupProductScrollArr)}
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
        flexWrap: "wrap",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    toolsItem: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:'#f2f2f2'

    },




})