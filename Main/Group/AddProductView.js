/**
 * Created by Arlen_JY on 2017/11/7.
 */

import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
import NewGroupView from './NewGroupView'
import NewProductView from './NewProductView'
import HttpRequest from '../../HttpRequest/HttpRequest';
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


        }
    }

    back(){

        this.props.navigator.pop();
    }

    componentDidMount() {
        if (this.state.isHaveProductInGroup){
            this.state.titleName ='选择商品';

            let param = {}

            HttpRequest.get('/v2','/admin.goods.set', param, this.onGetGoodsSetListSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                    Alert.alert('提示','获取接龙详情失败，请稍后再试。')
                })
        }else {
            this.state.titleName='添加商品'

        }


        DeviceEventEmitter.addListener('GetProductIdArr',(dic)=>{
            //接收到新建商品页发送的通知，刷新商品类别页的数据，刷新UI
            console.log('GetClassifyId12'+dic);
            this.state.classify_Id = dic;
        });

    }
    onGetGoodsSetListSuccess(response){
        console.log('onGetGoodsSetListSuccess12:'+JSON.stringify(response))
        this.setState({
            groupProductScrollArr:response.data.set_list
        })

    }

    onPressCategoryProductView(item){
        this.props.navigator.push({
            component: SelectCategoryProductView,
            props:{
                categoryItem:item,
                groupbuying_info:this.props.groupbuying_info
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
                    <View style={{flex:100}}>
                        <Image style={{width:80,height:80,marginLeft:10}} source={this.disPlayIcon(item)}></Image>
                    </View>
                    <View style={{flex:300,height:100,flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
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
                    style={{width:width,height:height-380}}>

                    {this.renderProductScrollView(groupProductArr)}
                </ScrollView>

            </View>)
        }else {
            return (
                <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center'}}>
                    <View style={{flexDirection:'column',justifyContent: 'center',alignItems:'center',height:80,width:width-160,marginTop:height/3}}>
                        <Text style={{color:'rgb(193,193,193)',textAlign:'center',fontSize:14,fontFamily:'PingFangSC-Regular'}}>
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
    render() {



            return (
                <View style={styles.container}>
                    <NavBar
                        title={this.state.titleName}
                        leftIcon={require('../../images/back.png')}
                        leftPress={this.back.bind(this)} />
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