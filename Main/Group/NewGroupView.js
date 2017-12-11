
/**
 * Created by Arlen_JY on 2017/11/6.
 */
import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
import AddProductView from './AddProductView'
import HttpRequest from '../../HttpRequest/HttpRequest';

import ClassifyListView from './ClassifyListView'
import  Swipeout from 'react-native-swipeout'
import Picker from 'react-native-picker';
import NewProductView from '../Group/NewProductView'
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

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
export default class NewGroupView extends Component{
    constructor (props){
        super(props)

        this.state = {
            page_Title:'修改拼团',
            groupBuyId:'',
            classify_Id:0,
            groupTitle:'',
            group_eyu:'',
            group_buying_detail:'',
            groupProductScrollArr:[],
            isSelectPicker:true, //true是选中截团时间，false 是选中预计发货时间
            isGroupDeadlineHave:false,
            groupDeadlineTitle:'请选择截团时间',
            groupDeadlineTime:'',
            groupDeliveryTitle:'请选择预计发货时间',
            groupDeliveryTime:'',
            isGroupDeliveryTimeHave:false,
            isHaveDel_goods:false,
            Del_goods:[]


        }
    }

    back(){

        this.props.navigator.pop();
    }
    componentDidMount() {
        if (this.props.isCreateNewGroup){
            this.state.page_Title = '新建拼团';

        }else {
            this.state.groupBuyId = this.props.groupItem.group_buy_id;
            let param = {groupbuying_id:this.state.groupBuyId}

            HttpRequest.get('/v2','/admin.groupbuying.detail', param, this.onGetGroupbuyingDetailSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                    Alert.alert('提示','获取接龙详情失败，请稍后再试。')
                })
        }
        DeviceEventEmitter.addListener('GetClassifyId',(dic)=>{
            //接收到新建商品页发送的通知，刷新商品类别页的数据，刷新UI
        console.log('GetClassifyId123'+JSON.stringify(dic));
        // this.state.classify_Id = dic.id;
        // this.state.groupTitle = dic.name;
        this.setState({
            classify_Id:dic.selectedItem.id,
            groupTitle:dic.selectedItem.name
        })
        });

        DeviceEventEmitter.addListener('updateNewGroup',(dic)=>{
            //接收到选择商品页发送的通知，刷新商品列表的数据，刷新UI
            console.log('updateNewGroup12:'+dic)
            // this.state.groupBuyId = this.props.groupItem.group_buy_id;
            // let param = {groupbuying_id:this.state.groupBuyId}
            //
            // HttpRequest.get('/v2','/admin.groupbuying.detail', param, this.onGetGroupbuyingDetailSuccess.bind(this),
            //     (e) => {
            //         console.log(' error:' + e)
            //         Alert.alert('提示','获取接龙详情失败，请稍后再试。')
            //     })
        });

    }
    onGetGroupbuyingDetailSuccess(response){
        console.log('onGetGroupbuyingDetailSuccess11:'+JSON.stringify(response))
        if (response.code ==1){
            this.setState({
                group_buying_detail:response.data.group_buying_detail,
                groupProductScrollArr:response.data.group_buying_products,
                group_eyu:response.data.group_buying_detail.eyu,
                groupTitle:response.data.group_buying_detail.classify_name,
                groupDeadlineTime:response.data.group_buying_detail.end_time,
                groupDeliveryTime:response.data.group_buying_detail.ship_time,
                classify_Id:response.data.group_buying_detail.classify
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
                years.push(i+2016);
            }
            for(let i=1;i<13;i++){
                months.push(i);

            }
            for(let i=1;i<32;i++){
                days.push(i);
            }

            pickerData = [years, months, days];
        }else {

            let years = [],
                months = [],
                days = [],
                hours = [],
                minutes = [];

            for(let i=1;i<15;i++){
                years.push(i+2016);
            }
            for(let i=1;i<13;i++){
                months.push(i);
                hours.push(i);
            }
            for(let i=1;i<32;i++){
                days.push(i);
            }
            for(let i=1;i<61;i++){
                minutes.push(i);
            }
            pickerData = [years, months, days, ['am', 'pm'], hours, minutes];
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
                pickerConfirmBtnText:'确定',
                pickerCancelBtnText:'取消',
                wheelFlex: [2, 1, 1, 2, 1, 1],
                onPickerConfirm: pickedValue => {
                    // var deliveryTime = pickedValue[0]+'/'+pickedValue[1]+'/'+pickedValue[2]+' '+pickedValue[3]+':'+pickedValue[4]+':'+pickedValue[5]


                    var deliveryTime = pickedValue[0]+'/'+pickedValue[1]+'/'+pickedValue[2]


                    console.log('deliveryTime1', deliveryTime);

                    var displayDeliveryTime = new Date(deliveryTime).format("yyyy-MM-dd");

                    this.setState({
                        groupDeliveryTime:displayDeliveryTime,
                    })

                    console.log('displayDeliveryTime2', displayDeliveryTime);
                },
                onPickerCancel: pickedValue => {
                    console.log('area', pickedValue);
                },
                onPickerSelect: pickedValue => {
                    let targetValue = [...pickedValue];
                    if(parseInt(targetValue[1]) === 2){
                        if(targetValue[0]%4 === 0 && targetValue[2] > 29){
                            targetValue[2] = 29;
                        }
                        else if(targetValue[0]%4 !== 0 && targetValue[2] > 28){
                            targetValue[2] = 28;
                        }
                    }
                    else if(targetValue[1] in {4:1, 6:1, 9:1, 11:1} && targetValue[2] > 30){
                        targetValue[2] = 30;

                    }
                    // forbidden some value such as some 2.29, 4.31, 6.31...
                    if(JSON.stringify(targetValue) !== JSON.stringify(pickedValue)){
                        // android will return String all the time，but we put Number into picker at first
                        // so we need to convert them to Number again
                        targetValue.map((v, k) => {
                            if(k !== 3){
                                targetValue[k] = parseInt(v);
                            }
                        });
                        Picker.select(targetValue);
                        pickedValue = targetValue;
                    }
                }
            });
        }else {
            Picker.init({
                pickerData,
                selectedValue,
                pickerTitleText: pickerTitle,
                pickerConfirmBtnText:'确定',
                pickerCancelBtnText:'取消',
                wheelFlex: [2, 1, 1, 2, 1, 1],
                onPickerConfirm: pickedValue => {
                    var deadlineTime =''
                    if (pickedValue[3] =='pm'){
                        var hours = pickedValue[4];
                        var hoursStr = ''
                        hoursStr = parseInt(hours)+12
                        deadlineTime = pickedValue[0]+'/'+pickedValue[1]+'/'+pickedValue[2]+' '+hoursStr+':'+pickedValue[5]
                        console.log('deadlineTime1', deadlineTime);

                    }else {
                        deadlineTime = pickedValue[0]+'/'+pickedValue[1]+'/'+pickedValue[2]+' '+pickedValue[4]+':'+pickedValue[5]

                    }
                    // var  displayDeliveryTime = moment(deliveryTime).format("Y")+'/'+moment(deliveryTime).format("M")+'/'+moment(deliveryTime).format("D")+' '+moment(deliveryTime).format("hh")+':'+moment(deliveryTime).format("mm");

                    // var endTime = (new Date(groupend_time.replace(' ','T'))).getTime();
                    var displayDeadlineTime = new Date(deadlineTime).format("yyyy/MM/dd hh:mm:ss");

                    this.setState({
                        groupDeadlineTime:displayDeadlineTime,
                    })
                },
                onPickerCancel: pickedValue => {
                    console.log('area', pickedValue);
                },
                onPickerSelect: pickedValue => {
                    let targetValue = [...pickedValue];
                    if(parseInt(targetValue[1]) === 2){
                        if(targetValue[0]%4 === 0 && targetValue[2] > 29){
                            targetValue[2] = 29;
                        }
                        else if(targetValue[0]%4 !== 0 && targetValue[2] > 28){
                            targetValue[2] = 28;
                        }
                    }
                    else if(targetValue[1] in {4:1, 6:1, 9:1, 11:1} && targetValue[2] > 30){
                        targetValue[2] = 30;

                    }
                    // forbidden some value such as some 2.29, 4.31, 6.31...
                    if(JSON.stringify(targetValue) !== JSON.stringify(pickedValue)){
                        // android will return String all the time，but we put Number into picker at first
                        // so we need to convert them to Number again
                        targetValue.map((v, k) => {
                            if(k !== 3){
                                targetValue[k] = parseInt(v);
                            }
                        });
                        Picker.select(targetValue);
                        pickedValue = targetValue;
                    }
                }
            });
        }


    }

    selectGroupTitle(){
        this.props.navigator.push({
            component: ClassifyListView,
            props:{
                classify_Id:this.state.group_buying_detail.classify
            }
        })

    }
    selectGroupDeadline(){
        //true 为截团时间picker   ，false 为 预计发货时间picker


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
                        [date.getHours() > 11 ? 'pm' : 'am'],
                        [date.getHours() === 12 ? 12 : date.getHours()%12],
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
                    [date.getHours() > 11 ? 'pm' : 'am'],
                    [date.getHours() === 12 ? 12 : date.getHours()%12],
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
                groupbuying_info:groupBuyInfo
            }
        })

    }
    cancelItem(item){
        console.log('112'+item.name)
        this.state.isHaveDel_goods = true;
        var groupArr =[];
        this.state.Del_goods = [];
        this.state.groupProductScrollArr.map((product, i) => {
            if (product.goods_id == item.goods_id){
                this.state.Del_goods.push(product.goods_id.toString())
            }else {
                groupArr.push(product);
            }
        })
        this.state.groupProductScrollArr = groupArr;

        this.setState({ ...this.state });
    }
    disPlayIcon(item){
        if (item.image ==''){
            return  require('../../images/me_bj.jpg')
        }else {
            return {uri:item.image}
        }
    }
    renderProductInfo(item, w, h){
        var  swipeoutBtns = [
            {
                backgroundColor:'red',
                color:'white',
                text:'删除',

                onPress:() => this.cancelItem(item),

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
            justifyContent: 'center', paddingLeft: 10, paddingRight: 10, flexDirection: "row", backgroundColor: '#f7f7f7',
            flex: 1
        }}>


                <View style={{
                flex: 2
            }}>
                    <Image style={{
                    resizeMode: 'contain', alignItems: 'center', width: 80, height: 80,
                    justifyContent: 'center',
                }} source={this.disPlayIcon(item)} />
                </View>
                <View style={{
                flex: 7
            }}><TouchableOpacity style={{alignItems: 'flex-start',height: h,

                }} onPress={this.onPressToEditGoods.bind(this,item)}>
                    <Text style={{ marginLeft: 30, marginTop: 10, numberOfLines: 2, ellipsizeMode: 'tail', fontSize: 14, color: "#1c1c1c",textAlign: 'center', }}>{item.name}</Text>
                    <Text style={{ marginLeft: 30, alignItems: 'center', justifyContent: 'center', fontSize: 12, color: "#757575",  textAlign: 'center',}}>{item.unit}</Text>
                    <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 30, paddingBottom: 10, position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                        <Text style={{ alignItems: 'center', justifyContent: 'center', fontSize: 16, color: "#fb7210", }}>S$ {item.price}</Text>
                        <Text style={{ alignItems: 'center', textAlign: 'left', flex: 9, justifyContent: 'center', fontSize: 12, color: "#757575", marginLeft:10}}>库存：{item.stock}</Text>
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
                                    {this.renderProductInfo(item, w, h)}
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
    onPressToEditGoods(goodItem){
        console.log('onPressToEditGoods890:'+JSON.stringify(goodItem))
            this.props.navigator.push({
                component: NewProductView,
                props: {
                    oldSet:this.state.groupTitle,
                    isEditGood:true,
                    org_goods_id:goodItem.org_goods_id

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
    saveGroup(){
        if (this.props.isCreateNewGroup){
            var groupBuyInfo = {

                classify:this.state.classify_Id,
                end_time:new Date(this.state.groupDeadlineTime).format("yyyy-MM-dd hh:mm:ss"),
                ship_time:this.state.groupDeliveryTime,
                on_sale:1,
                eyu:this.state.group_eyu,
            }
            let param = { groupbuying_info: groupBuyInfo,groupbuying_products:[]}
            console.log('dele:'+JSON.stringify(param))
            HttpRequest.post('/v2','/admin.groupbuying.create', param, this.onCreateGroupBuyingSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                    Alert.alert('提示','新建商品类别失败，请稍后再试。')
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

            if (this.state.isHaveDel_goods){
                var groupBuyInfo = {
                    title:this.state.groupTitle,
                    classify:this.state.classify_Id,
                    end_time:new Date(this.state.groupDeadlineTime).format("yyyy-MM-dd hh:mm:ss"),
                    ship_time:this.state.groupDeliveryTime,
                    on_sale:this.state.group_buying_detail.on_sale,
                    eyu:this.state.group_eyu,
                    id:this.state.group_buying_detail.id,
                }
                let param = { groupbuying_info: groupBuyInfo,del_goods:this.state.Del_goods,groupbuying_products:[]}
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
                    on_sale:this.state.group_buying_detail.on_sale,
                    eyu:this.state.group_eyu,
                    id:this.state.group_buying_detail.id,
                }
                let param = { groupbuying_info: groupBuyInfo,del_goods:[],groupbuying_products:[]}
                console.log('dele2:'+JSON.stringify(param))
                HttpRequest.post('/v2','/admin.groupbuying.update', param, this.onUpdateGroupBuyingSuccess.bind(this),
                    (e) => {
                        console.log(' error:' + e)
                        Alert.alert('提示','新建商品类别失败，请确认输入文本信息中不含图形和表情。。')
                    })
            }

        }

    }
    onNewGroupBuyingSuccess(response){

    }
    onCreateGroupBuyingSuccess(response){
        console.log('onCreateGroupBuyingSuccess'+JSON.stringify(response))

        Alert.alert('提示','保存成功', [

                {text: 'OK', onPress: this.saveSuccess.bind(this)},
            ],
            { cancelable: false })
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



    render() {

        //页面标题
        var page_Str = '';
        if (this.props.isCreateNewGroup){
            page_Str = '新建拼团';
        }else {
            page_Str = '修改拼团';
        }
        //商品列表
        var groupProductArr = [];
        groupProductArr = this.state.groupProductScrollArr;
        var groupBuyDetail = this.state.group_buying_detail;
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
            jietuanTime =this.state.groupDeadlineTime
            jietuanColor='black';
        }
        //发货时间
        var fahuoTime =''
        var fahuoColor='';
        if (this.state.groupDeliveryTime == ''){
            fahuoTime ='请选择本次拼团发货时间';
            fahuoColor='rgb(193,193,193)';
        }else {
            fahuoTime =this.state.groupDeliveryTime
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
                        <Text style={[ { flex:1, marginRight: 10, color: '#1b1b1b', fontSize: 16,fontFamily:'PingFangSC-Regular'}]}>
                            {this.state.groupTitle}
                        </Text>
                        <Image
                            source={require('../../images/next_icon@3x.png')}>

                        </Image>

                    </View>
                    </TouchableOpacity>
                    <View style={{marginLeft:10,marginRight:10,height:0.5,backgroundColor:'rbg(219,219,219)'}}></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start',alignItems: 'flex-start', backgroundColor: '#ffffff', paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={[ { width: 80, color: '#1b1b1b', fontSize: 16, marginRight: 0,fontFamily:'PingFangSC-Regular',marginTop:10}]}>
                            商品类别：
                        </Text>
                        <TextInput style={{
                       fontSize: 16,height:40,width:width-60,marginTop:8,
                        textAlign: 'left', color: '#1c1c1c',
                    }}  keyboardType={'default'}
                                   placeholder ='如蔬菜、面食、酒水…'
                                   blurOnSubmit ={true}
                                   multiline={true}
                                   editable={true}
                                   returnKeyType={'done'}
                                   onChangeText={(text) => this.setState({ group_eyu: text })}
                                   value= {this.state.group_eyu}
                        ></TextInput>


                    </View>
                </View>
                <View style={{marginTop:10}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={[ { marginRight: 10, color: '#1b1b1b', fontSize: 16,fontFamily:'PingFangSC-Regular',flex:1}]}>
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
                    <View style={{marginLeft:10,marginRight:10,height:0.5,backgroundColor:'rbg(219,219,219)'}}></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 ,}}>
                        <Text style={[ { marginRight: 10, color: '#1b1b1b', fontSize: 16,fontFamily:'PingFangSC-Regular',flex:1}]}>
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

                        {this.renderProductScrollView(groupProductArr)}
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