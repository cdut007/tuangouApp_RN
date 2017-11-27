
/**
 * Created by Arlen_JY on 2017/11/6.
 */
import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
import AddProductView from './AddProductView'
import SelectProductView from '../Product/SelectProductView'
import  Swipeout from 'react-native-swipeout'
import Picker from 'react-native-picker';
import moment from 'moment';
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
export default class NewGroupView extends Component{
    constructor (props){
        super(props)

        this.state = {

            groupTitle:'',
            groupDetail:'',
            groupProductScrollArr:[1,2,3],
            isSelectPicker:true,
            isGroupDeadlineHave:false,
            groupDeadlineTitle:'请选择截团时间',
            groupDeliveryTime:'请选择预计发货时间',
            isGroupDeliveryTimeHave:false,


        }
    }

    back(){

        this.props.navigator.pop();
    }
    //创建年月日时分多项选择框
    creatTimeOfPicker(){
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
        let pickerData = [years, months, days, ['am', 'pm'], hours, minutes];
        return pickerData;
    }
    creatPickerWithInfo(titles,Data,Value){
        let pickerData = Data;
        let selectedValue = Value;
        let pickerTitle = titles;

        Picker.init({
            pickerData,
            selectedValue,
            pickerTitleText: pickerTitle,
            pickerConfirmBtnText:'确定',
            pickerCancelBtnText:'取消',
            wheelFlex: [2, 1, 1, 2, 1, 1],
            onPickerConfirm: pickedValue => {
                console.log('area', pickedValue);
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
    selectGroupTitle(){


    }
    selectGroupDeadline(){
        //true 为截团时间picker   ，false 为 预计发货时间picker


            if (this.state.isSelectPicker){
                if (this.state.isGroupDeadlineHave){
                    Picker.toggle();
                }else {
                    let pickerData = this.creatTimeOfPicker();
                    let date = new Date();
                    let selectedValue = [
                        [date.getFullYear()],
                        [date.getMonth()+1],
                        [date.getDate()],
                        [date.getHours() > 11 ? 'pm' : 'am'],
                        [date.getHours() === 12 ? 12 : date.getHours()%12],
                        [date.getMinutes()]
                    ];
                    this.creatPickerWithInfo(this.state.groupDeadlineTitle,pickerData,selectedValue);
                    this.state.isGroupDeadlineHave = true;
                    this.state.isSelectPicker = true;
                    Picker.show();
                }
            }else {
                let pickerData = this.creatTimeOfPicker();
                let date = new Date();
                let selectedValue = [
                    [date.getFullYear()],
                    [date.getMonth()+1],
                    [date.getDate()],
                    [date.getHours() > 11 ? 'pm' : 'am'],
                    [date.getHours() === 12 ? 12 : date.getHours()%12],
                    [date.getMinutes()]
                ];
                this.creatPickerWithInfo(this.state.groupDeadlineTitle,pickerData,selectedValue);
                this.state.isGroupDeadlineHave = true;
                this.state.isSelectPicker = true;
                Picker.show();
            }





    }
    selectGroupDeliveryTime(){
        if (this.state.isSelectPicker){
            let pickerData = this.creatTimeOfPicker();
            let date = new Date();
            let selectedValue = [
                [date.getFullYear()],
                [date.getMonth()+1],
                [date.getDate()],
                [date.getHours() > 11 ? 'pm' : 'am'],
                [date.getHours() === 12 ? 12 : date.getHours()%12],
                [date.getMinutes()]
            ];
            this.creatPickerWithInfo(this.state.groupDeliveryTime,pickerData,selectedValue);
            this.state.isGroupDeliveryTimeHave = true;
            this.state.isSelectPicker = false;
            Picker.show();
        }else {
            if (this.state.isGroupDeliveryTimeHave){
                Picker.toggle();
            }else {
                let pickerData = this.creatTimeOfPicker();
                let date = new Date();
                let selectedValue = [
                    [date.getFullYear()],
                    [date.getMonth()+1],
                    [date.getDate()],
                    [date.getHours() > 11 ? 'pm' : 'am'],
                    [date.getHours() === 12 ? 12 : date.getHours()%12],
                    [date.getMinutes()]
                ];
                this.creatPickerWithInfo(this.state.groupDeliveryTime,pickerData,selectedValue);
                this.state.isGroupDeliveryTimeHave = true;
                this.state.isSelectPicker = false;
                Picker.show();
            }
        }





    }
    OnAddProductViewPress(){
        this.props.navigator.push({
            component: AddProductView
        })
        // this.props.navigator.push({
        //     component: SelectProductView
        // })
    }
    cancelItem(item){

    }
    renderProductInfo(item, w, h){
        var  swipeoutBtns = [
            {
                backgroundColor:'red',
                color:'white',
                text:'移除',

                onPress:() => this.cancelItem(item),

            }


        ]
        console.log('item22:'+JSON.stringify(item))
        return(  <Swipeout right={swipeoutBtns}
                           autoClose={true}
                           sensitivity={5}
                           buttonWidth={100}


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
                }} source={require('../../images/me_bj.jpg')} />
                </View>
                <View style={{
                height: h,
                alignItems: 'flex-start',
                flex: 7
            }}>
                    <Text style={{ marginLeft: 30, marginTop: 10, numberOfLines: 2, ellipsizeMode: 'tail', fontSize: 14, color: "#1c1c1c", }}>名字</Text>
                    <Text style={{ marginLeft: 30, alignItems: 'center', justifyContent: 'center', fontSize: 12, color: "#757575", }}>描述</Text>
                    <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 30, paddingBottom: 10, position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                        <Text style={{ alignItems: 'center', justifyContent: 'center', fontSize: 16, color: "#fb7210", }}>S$ 价格</Text>
                        <Text style={{ alignItems: 'center', textAlign: 'right', flex: 9, justifyContent: 'center', fontSize: 12, color: "#757575", }}>库存 </Text>
                    </View>
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






    render() {
        var groupProductArr = [];
        groupProductArr = this.state.groupProductScrollArr;

        return (
            <View style={styles.container}>
                <NavBar
                    title="新建拼团"
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)} />
                <View style={{}}>
                    <TouchableOpacity onPress={this.selectGroupTitle.bind(this)}>


                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={[ { flex:1, marginRight: 10, color: '#1b1b1b', fontSize: 16,fontFamily:'PingFangSC-Regular'}]}>
                            选择本次接龙标题
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
                                   onChangeText={(text) => this.setState({ groupDetail: text })}
                                   value= {this.state.groupDetail}
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

                            <Text style={[ { marginRight: 10, color: 'rgb(193,193,193)', fontSize: 16,fontFamily:'PingFangSC-Regular'}]}>
                                请选择拼团截止时间
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

                                <Text style={[ { marginRight: 10, color: 'rgb(193,193,193)', fontSize: 16,fontFamily:'PingFangSC-Regular'}]}>
                                    请选择本次拼团发货时间
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
                        <Text style={{fontSize:14,fontFamily:'PingFangSC-Regular',textAlign:'left',color:'rgb(117,117,117)'}}>共计3件商品</Text>
                    </View>
                </View>
                <View style={{justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',}}>
                    <ScrollView
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={false}
                        style={{width:width, backgroundColor:'gray',height:height-380}}>

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