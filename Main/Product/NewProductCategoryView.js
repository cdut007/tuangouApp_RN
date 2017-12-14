/**
 * Created by Arlen_JY on 2017/11/15.
 */


import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
import AddProductView from '../Group/AddProductView'
import NewProductView from '../Group/NewProductView'
import  Swipeout from 'react-native-swipeout'
import HttpRequest from '../../HttpRequest/HttpRequest'

import {
    StyleSheet,
    View,
    Text,
    Alert,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter,//引入监听事件
}   from 'react-native';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
export default class NewProductCategoryView extends Component{
    constructor (props){
        super(props)

        this.state = {

            groupTitle:'',
            groupDetail:'',
            groupProductScrollArr:[],
            oldSet:'',
            newSet:'',
            hasSet:this.props.hasSet,
            firstSet:'',
            isOnlyUpdateSet:true,
            isDelectProduct:false,
            UpdateSetToEditOrg_goods_id:''


        }
    }

    back(){
        if (this.state.isDelectProduct){
            DeviceEventEmitter.emit('ChangeProductManagerUI');
            this.state.oldSet = null;
            this.state.firstSet = null;
            this.props.navigator.pop();
        }else {

            this.state.oldSet = null;
            this.state.firstSet = null;
            this.props.navigator.pop();
        }



        // if (this.state.groupTitle ==''){
        //
        // }else {
        //     this.state.oldSet = this.state.groupTitle;
        // }
        //
        // if (this.state.oldSet == this.state.firstSet){
        //     Alert.alert('提示','请输入您的商品类别')
        // }else {
        //     // DeviceEventEmitter.emit('ChangeProductManagerUI');
        //     this.state.oldSet = null;
        //     this.state.firstSet = null;
        //     this.props.navigator.pop();
        //
        // }

    }
    saveCategory(){
        if (this.state.groupTitle ==''){
            Alert.alert('提示','请输入您的商品类别')
        }else {

            if (this.state.groupProductScrollArr.length !==0){
                if (this.state.isOnlyUpdateSet){
                    let param = { new_set: this.state.groupTitle,old_set:this.state.oldSet }
                    console.log('isOnlyUpdateSet12:'+JSON.stringify(param))

                    HttpRequest.post('/v2','/admin.goods.set.update', param, this.onUpdateSetSuccess.bind(this),
                        (e) => {
                            console.log(' error:' + e)
                            if (e.code === '11'){

                            }else {
                                // Alert.alert('提示','修改商品类别失败，请稍后再试。')
                                Alert.alert('提示','修改商品类别失败，请确认输入文本信息中不含图形和表情。')
                            }


                        })
                }else {
                    if (this.state.isDelectProduct){

                    }else {
                        DeviceEventEmitter.emit('ChangeProductManagerUI');
                        this.state.oldSet = null;
                        this.state.firstSet = null;
                        this.props.navigator.pop();
                    }

                }

            }else {
                Alert.alert('提示','请添加商品')
            }

        }

        // if (this.state.oldSet == this.state.firstSet){
        //     Alert.alert('提示','请输入您的商品类别')
        // }else {
        //
        //
        // }



    }

    OnAddProductViewPress(){
        // this.props.navigator.push({
        //     component: AddProductView
        // })
        if (this.state.groupTitle ==''){
            Alert.alert('提示','请输入您的商品类别')
        }else if (this.state.groupTitle == this.state.oldSet){

            this.props.navigator.push({
                component: NewProductView,
                props: {
                    oldSet:this.state.oldSet,
                    isEditGood:false

                }

            })


        }else {
            let param = { new_set: this.state.groupTitle,old_set:this.state.oldSet }

            HttpRequest.post('/v2','/admin.goods.set.update', param, this.onUpdateSetToNewProductSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                    Alert.alert('提示','新建商品类别失败，请稍后再试。')
                })
        }


    }
    onPressToEditGoods(goodItem){
        console.log('onPressToEditGoods115:'+JSON.stringify(goodItem))

        if (this.state.groupTitle ==''){
            Alert.alert('提示','请输入您的商品类别')
        }else if (this.state.groupTitle == this.state.oldSet){
            console.log('onPressToEditGoods116:'+JSON.stringify(goodItem))
            this.props.navigator.push({
                component: NewProductView,
                props: {
                    oldSet:this.state.oldSet,
                    isEditGood:true,
                    org_goods_id:goodItem.org_goods_id

                }

            })


        }else {
            console.log('onPressToEditGoods117:'+JSON.stringify(goodItem))
            this.state.UpdateSetToEditOrg_goods_id = goodItem.org_goods_id;
            let param = { new_set: this.state.groupTitle,old_set:this.state.oldSet }

            HttpRequest.post('/v2','/admin.goods.set.update', param, this.onUpdateSetToEditProductSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                    Alert.alert('提示','新建商品类别失败，请稍后再试。')
                })
        }

    }
    onUpdateSetSuccess(response){
        console.log('onUpdateSetSuccess112:'+JSON.stringify(response))
        if (response.code ==1){
            this.state.oldSet = this.state.groupTitle;
            DeviceEventEmitter.emit('ChangeProductManagerUI');
            this.state.oldSet = null;
            this.state.firstSet = null;
            this.props.navigator.pop();


        }

    }
    onUpdateSetToNewProductSuccess(response){
        console.log('onUpdateSetSuccess112:'+JSON.stringify(response))
        if (response.code ==1){
            this.state.oldSet = this.state.groupTitle;
            DeviceEventEmitter.emit('ChangeProductManagerUI');
            this.props.navigator.push({
                component: NewProductView,
                props: {
                    oldSet:this.state.oldSet,
                    isEditGood:false,

                }

            })
        }

    }
    onUpdateSetToEditProductSuccess(response){
        console.log('onUpdateSetSuccess112:'+JSON.stringify(response))
        if (response.code ==1){
            this.state.oldSet = this.state.groupTitle;
            DeviceEventEmitter.emit('ChangeProductManagerUI');
            this.props.navigator.push({
                component: NewProductView,
                props: {
                    oldSet:this.state.oldSet,
                    isEditGood:true,
                    org_goods_id:this.state.UpdateSetToEditOrg_goods_id,

                }

            })
        }

    }


    componentDidMount() {
        console.log('ChangeProductCategoryUI:14')
        if (this.state.hasSet){


                this.state.oldSet = this.props.oldSet;
                let param = { set: this.state.oldSet }
                console.log('setStr11:' +this.state.oldSet)
            console.log('ChangeProductCategoryUI:15')
                HttpRequest.get('/v2','/admin.set.goods.list', param, this.onSetGroupListSuccess.bind(this),
                    (e) => {
                        console.log(' error:' + e)
                        Alert.alert('提示','新建商品类别失败，请稍后再试。')
                    })




        }else {
            console.log('ChangeProductCategoryUI:17')
            this.state.oldSet = this.randomstring(5);
            this.state.firstSet = this.state.oldSet;

            console.log('setStr11:' +this.state.oldSet)

        }
        DeviceEventEmitter.addListener('ChangeProductCategoryUI',(dic)=>{
            //接收到新建商品页发送的通知，刷新商品类别页的数据，刷新UI
            console.log('ChangeProductCategoryUI:16:'+dic)
            this.state.isOnlyUpdateSet = dic;


            let param = { set: this.state.oldSet }
            console.log('setStr122:' +this.state.oldSet)
            HttpRequest.get('/v2','/admin.set.goods.list', param, this.onSetGroupListSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                    Alert.alert('提示','新建商品类别失败，请稍后再试。')
                })
        });





    }
    randomstring(L){
        var s= '';

        var randomchar=function(){
            var n= Math.floor(Math.random()*62);
            if(n<10) return n; //1-10
            if(n<36) return String.fromCharCode(n+55); //A-Z
            return String.fromCharCode(n+61); //a-z
        }
        while(s.length< L) s+= randomchar();
        return s;

    }
    onSetGroupListSuccess(response){
        console.log('onSetGroupListSuccess:'+JSON.stringify(response.data))
        this.state.groupProductScrollArr = response.data.goods_list

        this.state.groupTitle = this.state.oldSet

        this.setState({ ...this.state });

    }
    onDeleteGoodsSuccess(response){
        console.log('onDeleteGoodsSuccess:'+JSON.stringify(response.data))
        this.state.isDelectProduct = true;
        let param = { set: this.state.oldSet }
        console.log('setStr11:' +this.state.oldSet)

        HttpRequest.get('/v2','/admin.set.goods.list', param, this.onSetGroupListSuccess.bind(this),
            (e) => {
                console.log(' error:' + e)
                Alert.alert('提示','新建商品类别失败，请稍后再试。')
            })

    }
    cancelItem(item){
        console.log('cancelItem11'+JSON.stringify(item))
        let param = { org_goods_id: item.org_goods_id }
        console.log('cancelItem122:' +JSON.stringify(param))
        HttpRequest.post('/v2','/admin.goods.delete', param, this.onDeleteGoodsSuccess.bind(this),
            (e) => {
                console.log(' error:' + e)
                Alert.alert('提示','新建商品类别失败，请稍后再试。')
            })

    }
    disPlayIcon(item){
        if (item.image ==''){
            return  require('../../images/me_bj.jpg')
        }else {
            return {uri:item.image}
        }
        // return require('../../images/me_bj.jpg')
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
        return(<Swipeout  right={swipeoutBtns}
                          autoClose={true}
                          sensitivity={5}
                          buttonWidth={60}>
                <View style={{
                    resizeMode: 'contain', alignItems: 'center', width: w, height: h,
                    justifyContent: 'center', paddingLeft: 10, paddingRight: 10, flexDirection: "row", backgroundColor: '#ffffff',
                    flex: 1
                }}>


                    <View style={{

                    }}>
                        <Image style={{
                            resizeMode: 'contain', alignItems: 'center', width: 80, height: 80,
                            justifyContent: 'center',
                        }} source={this.disPlayIcon(item)} />
                    </View>
                    <View style={{
                        width:width-100
                    }}>
                        <TouchableOpacity style={{alignItems: 'flex-start',height: h,

                        }} onPress={this.onPressToEditGoods.bind(this,item)}>

                            <Text style={{ marginLeft: 10, marginTop: 10, numberOfLines: 2, ellipsizeMode: 'tail', fontSize: 14, color: "#1c1c1c", }}>{item.name}</Text>
                            <Text style={{ marginLeft: 10,marginTop: 5, alignItems: 'center', justifyContent: 'center', fontSize: 12, color: "#757575", }}>{item.default_unit}</Text>
                            <View style={{ alignItems: 'flex-start', flexDirection: 'row', marginLeft: 10, paddingBottom: 10, position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                                <Text style={{ alignItems: 'center', justifyContent: 'center', fontSize: 16, color: "#fb7210", }}>S${item.default_price}</Text>
                                <Text style={{ alignItems: 'center', textAlign: 'right', flex: 9, justifyContent: 'center', fontSize: 12, color: "#757575", }}>库存：{item.default_stock} </Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                </View>
                <View style={{marginLeft:10,marginRight:10,height:0.5,backgroundColor:'rgb(212,212,212)'}}></View>

            </Swipeout>
        )
        // return(  <Swipeout right={swipeoutBtns}
        //                    autoClose={true}
        //                    sensitivity={5}
        //                    buttonWidth={100}
        //
        //
        // >
        //     <View style={{
        //     resizeMode: 'contain', alignItems: 'center', width: w, height: h,
        //     justifyContent: 'center', paddingLeft: 10, paddingRight: 10, flexDirection: "row", backgroundColor: '#f7f7f7',
        //     flex: 1
        // }}>
        //
        //
        //         <View style={{
        //         flex: 2
        //     }}>
        //             <Image style={{
        //             resizeMode: 'contain', alignItems: 'center', width: 80, height: 80,
        //             justifyContent: 'center',
        //         }} source={require('../../images/me_bj.jpg')} />
        //         </View>
        //         <View style={{
        //         height: h,
        //         alignItems: 'flex-start',
        //         flex: 7
        //     }}>
        //             <Text style={{ marginLeft: 30, marginTop: 10, numberOfLines: 2, ellipsizeMode: 'tail', fontSize: 14, color: "#1c1c1c", }}>名字</Text>
        //             <Text style={{ marginLeft: 30, alignItems: 'center', justifyContent: 'center', fontSize: 12, color: "#757575", }}>描述</Text>
        //             <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 30, paddingBottom: 10, position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        //                 <Text style={{ alignItems: 'center', justifyContent: 'center', fontSize: 16, color: "#fb7210", }}>S$ 价格</Text>
        //                 <Text style={{ alignItems: 'center', textAlign: 'right', flex: 9, justifyContent: 'center', fontSize: 12, color: "#757575", }}>库存 </Text>
        //             </View>
        //         </View>
        //
        //     </View>
        //     <View style={{marginLeft:10,marginRight:10,height:0.5,backgroundColor:'rbg(219,219,219)'}}></View>
        // </Swipeout>)
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
        console.log('ChangeProductCategoryUI:13')
        var groupProductArr = [];
        groupProductArr = this.state.groupProductScrollArr;
        var groupProductNum = groupProductArr.length;



        return (
            <View style={styles.container}>
                <NavBar
                    title="新建商品类别"
                    leftTitle={'取消'}
                    leftPress={this.back.bind(this)}
                    rightTitle={'保存'}
                    rightPress={this.saveCategory.bind(this)}/>
                <View style={{}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={[ { width: 70, marginRight: 10, color: '#1b1b1b', fontSize: 16,fontFamily:'PingFangSC-Regular'}]}>
                            商品类别:
                        </Text>
                        <TextInput style={{
                        marginLeft: 0, fontSize: 16, flex: 20,
                        textAlign: 'left', color: '#1c1c1c',
                    }}  keyboardType={'default'}
                                   placeholder ='如：水果类、蔬菜类、肉类...'
                                   editable={true}
                                   returnKeyType={'done'}
                                   underlineColorAndroid='transparent'
                                   onChangeText={(text) => this.setState({ groupTitle: text })}
                                   value= {this.state.groupTitle}
                        ></TextInput>

                    </View>
                    <View style={{marginLeft:10,marginRight:10,height:0.5,backgroundColor:'rbg(219,219,219)'}}></View>

                </View>
                <View style={{marginTop:10}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 }}>
                        <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}} onPress={this.OnAddProductViewPress.bind(this)}>

                            <Image source={require('../../images/addProductIcon@3x.png')}>

                            </Image>
                            <Text style={{marginLeft:10}}>新建商品</Text>
                        </TouchableOpacity>
                        <Text style={{fontSize:14,fontFamily:'PingFangSC-Regular',textAlign:'left',color:'rgb(117,117,117)'}}>共计{groupProductNum}件商品</Text>
                    </View>
                </View>
                <View style={{marginLeft:10,marginRight:10,height:0.5,backgroundColor:'rbg(219,219,219)'}}></View>
                <View style={{justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',}}>
                    <ScrollView
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={false}
                        style={{width:width,height:height-180}}>

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
        backgroundColor:'#ffffff'

    },




})