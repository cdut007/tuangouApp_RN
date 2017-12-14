/**
 * Created by Arlen_JY on 2017/11/7.
 */

import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
import NewGroupView from './NewGroupView'
import NewProductView from './NewProductView'
import HttpRequest from '../../HttpRequest/HttpRequest';
import  ProductManager from '../Product/ProductManager'
import SelectCategoryProductView from '../Product/SelectCategoryProductView'

import {
    StyleSheet,
    View,
    Text,
    Alert,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter
}   from 'react-native';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
export default class AddProductView extends Component{
    constructor (props){
        super(props)

        this.state = {

            isHaveProductInGroup:true,
            groupTitle:'',
            titleName:'',
            groupDetail:'',
            groupProductScrollArr:[],
            hasSelectNum:0


        }
    }

    back(){

        this.props.navigator.pop();
    }

    componentDidMount() {


            let param = {}

            HttpRequest.get('/v2','/admin.goods.set', param, this.onGetGoodsSetListSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                    Alert.alert('提示','获取接龙详情失败，请稍后再试。')
                })



        DeviceEventEmitter.addListener('GetProductIdArr',(dic)=>{
            //接收到新建商品页发送的通知，刷新商品类别页的数据，刷新UI
            console.log('GetClassifyId12'+dic);
            this.state.classify_Id = dic;
        });
        DeviceEventEmitter.addListener('GetHaveSelectArr',(dic)=>{
            //接收到新建商品页发送的通知，刷新商品类别页的数据，刷新UI
            console.log('GetHaveSelectArr55'+dic);
            this.state.hasSelectNum =this.state.hasSelectNum+parseInt(dic) ;

            this.setState({ ...this.state });

        });

    }
    onGetGoodsSetListSuccess(response){
        console.log('onGetGoodsSetListSuccess12:'+JSON.stringify(response))
        var groupArr =response.data.set_list;
        if (groupArr.length >0){
            this.state.isHaveProductInGroup = true
            this.state.titleName ='选择商品';
        }else {
            this.state.isHaveProductInGroup = false
            this.state.titleName='添加商品'
        }
        this.setState({
            groupProductScrollArr:response.data.set_list
        })

    }

    onPressCategoryProductView(item){
        console.log('onPressCategoryProductView124:'+JSON.stringify(this.props.groupbuying_info))
        this.props.navigator.push({
            component: SelectCategoryProductView,
            props:{
                categoryItem:item,
                groupbuying_info:this.props.groupbuying_info,
                isCreateNewGroup:this.props.isCreateNewGroup
            }
        })
    }

    renderGroupScrollView(groupArr){

    }
    disPlayIcon(item){
        if (item.image ==''){
            return  require('../../images/me_bj.jpg')
        }else {
            return {uri:item.image}
        }
    }
    renderProductInfo(item, w, h){

        console.log('item22:'+JSON.stringify(item))
        return(
            <TouchableOpacity onPress={this.onPressCategoryProductView.bind(this,item)}>
                <View style={{ backgroundColor:'white',width:width,height:100,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                    <View style={{}}>
                        <Image style={{width:80,height:80,marginLeft:10}} source={this.disPlayIcon(item)}></Image>
                    </View>
                    <View style={{width:width-100,marginLeft:10,height:100,flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <Text style={{textAlign:'left',marginTop:10,fontSize:16,fontFamily:'PingFangSC-Regular'}}>
                            {item.set}
                        </Text>
                        <Text style={{textAlign:'left',marginBottom:10,fontSize:12,fontFamily:'PingFangSC-Regular',color:'rgb(117,117,117)'}}>
                            商品总量：{item.count}个
                        </Text>
                    </View>




                </View>
            </TouchableOpacity>
          )
    }
    renderProductScrollView(groupProductScrollArr){
        const w = width, h = 100
        console.log('groupProductScrollArr1:'+JSON.stringify(groupProductScrollArr))
        let renderSwipeView = (types, n) => {
            return (
                <View style={[styles.toolsView,{}]}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h,  }, styles.toolsItem]}>
                                    {this.renderProductInfo(item, w, h)}
                                </View>
                            )
                            return (
                                <View style={{ width: w, height: h ,marginTop:10}}>{render}</View>
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
    renderAddProductContent(){
        var groupProductArr = [];
        groupProductArr = this.state.groupProductScrollArr;
        if (this.state.isHaveProductInGroup){
            return ( <View style={{justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',}}>
                <ScrollView
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps={false}
                    style={{width:width,height:height-350}}

                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{width:width,height:groupProductArr.length *118}}

                >


                    {this.renderProductScrollView(groupProductArr)}
                </ScrollView>

            </View>)
        }else {
            return (
                <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center'}}>
                    <View style={{flexDirection:'column',justifyContent: 'center',alignItems:'center',height:80,width:width-160,marginTop:height/3}}>
                        <Text style={{color:'rgb(193,193,193)',textAlign:'center',fontSize:14,fontFamily:'PingFangSC-Regular'}} numberOfLines={1}>
                            还未上传任何商品，请先上传商品
                        </Text>
                        <View style={{height:40,width:width-240,backgroundColor:'rgb(234,107,16)',marginTop:10,borderRadius:4}}>
                            <TouchableOpacity style={{flexDirection:'row',justifyContent: 'center',alignItems:'center'}
                            } onPress={this.OnNewProductPress.bind(this)}>
                            <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center'}
                            }>

                                <Text style={{color:'#ffffff',fontSize:30}}>+</Text>
                                <Text style={{color:'#ffffff',fontSize:18,marginLeft:10,marginTop:5}}>上传商品</Text>


                            </View>
                            </TouchableOpacity>


                        </View>
                    </View>
                </View>
            )
        }
    }
    OnNewProductPress(){
        this.props.navigator.push({
            component: ProductManager,
        })
    }
    render() {



            return (
                <View style={styles.container}>
                    <NavBar
                        title={this.state.titleName}
                        leftIcon={require('../../images/back.png')}
                        leftPress={this.back.bind(this)}
                        rightTitle={'已选('+this.state.hasSelectNum+')'}/>
                    {this.renderAddProductContent()}



                </View>
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




})