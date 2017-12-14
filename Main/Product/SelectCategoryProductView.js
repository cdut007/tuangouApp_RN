/**
 * Created by Arlen_JY on 2017/11/15.
 */
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
import CheckBox from 'react-native-checkbox'
import NewGroupView from '../Group/NewGroupView'

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
export default class SelectCategoryProductView extends Component{
    constructor (props){
        super(props)

        this.state = {


            groupProductScrollArr:[],
            Set:'',
            selectedId:[],
            oldSelect:'',
            isAllSelected:false,
            selectedNum:''



        }
    }

    back(){

        this.props.navigator.pop();




    }




    componentDidMount() {



            //接收到新建商品页发送的通知，刷新商品类别页的数据，刷新UI
            this.state.Set = this.props.categoryItem.set;
            let param = { set: this.state.Set }
            console.log('this.state.Set112:' +this.state.Set)

            HttpRequest.get('/v2','/admin.set.goods.list', param, this.onSetGroupListSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                    Alert.alert('提示','新建商品类别失败，请稍后再试。')
                })


        // DeviceEventEmitter.addListener('ChangeProductCategoryUI',(dic)=>{
        //     //接收到新建商品页发送的通知，刷新商品类别页的数据，刷新UI
        //     console.log('ChangeProductCategoryUI:16')
        //
        //
        //     let param = { set: this.state.oldSet }
        //     console.log('setStr122:' +this.state.oldSet)
        //     HttpRequest.get('/v2','/admin.goods.list.set', param, this.onSetGroupListSuccess.bind(this),
        //         (e) => {
        //             console.log(' error:' + e)
        //             Alert.alert('提示','新建商品类别失败，请稍后再试。')
        //         })
        // });





    }

    onSetGroupListSuccess(response){
        console.log('onSetGroupListSuccess:'+JSON.stringify(response.data))

        response.data.goods_list.map((item, i) => {

                item.selected = false;



        })
        this.state.groupProductScrollArr = response.data.goods_list
        this.setState({ ...this.state });

    }
    cancelItem(item){

    }
    disPlayIcon(item){
        if (item.image ==''){
            return  require('../../images/me_bj.jpg')
        }else {
            return {uri:item.image}
        }
        // return require('../../images/me_bj.jpg')
    }
    renderCheckBox(item,groupProductScrollArr) {
        if (!item) {
            return ({})
        }

        return (<CheckBox

            label=''
            checkedImage={require('../../images/choose_one_click.png')}
            uncheckedImage={require('../../images/choose_one.png')}
            checked={item.selected == null ? false : item.selected}
            onChange={(checked) => {
                item.selected = !checked
                if (item.selected == true){



                }else {

                }
                console.log('CheckBoxitem11'+JSON.stringify(item))
                this.setState({ ...this.state })
            }
            }

        />)
    }
    renderAllCheckBox(groupProductScrollArr) {
        if (!groupProductScrollArr) {
            return ({})
        }

        return (
            <View style={{marginLeft:10,justifyContent:'center',alignItems:'center'}}>
                <CheckBox
            style={{}}
            label=''
            checkedImage={require('../../images/choose_one_click.png')}
            uncheckedImage={require('../../images/choose_one.png')}
            checked={this.state.isAllSelected}
            onChange={(checked) => {
                this.state.isAllSelected = !checked
                if (this.state.isAllSelected == true){
                    groupProductScrollArr.map((subitem, i) => {
                        subitem.selected = true;
                    })
                }else {
                    groupProductScrollArr.map((subitem, i) => {
                        subitem.selected = false;
                    })
                }

                this.setState({ ...this.state })
            }
            }

        />
            </View>)
    }
    renderProductInfo(item,groupProductScrollArr, w, h){
        var  swipeoutBtns = [
            {
                backgroundColor:'red',
                color:'white',
                text:'移除',

                onPress:() => this.cancelItem(item),

            }


        ]
        console.log('item22:'+JSON.stringify(item))
        return(
            <View style={{
                resizeMode: 'contain', alignItems: 'center', width: w, height: h,
                justifyContent: 'flex-start',  paddingRight: 10, flexDirection: "row", backgroundColor: 'white',
                flex: 1
            }}>

                <View style={{
                    marginLeft:10,marginRight:10,width:20,alignItems: 'center',
                }}>
                    {this.renderCheckBox(item,groupProductScrollArr)}

                </View>
                <View style={{

                }}>
                    <Image style={{
                        resizeMode: 'contain', alignItems: 'center', width: 80, height: 80,
                        justifyContent: 'center',
                    }} source={this.disPlayIcon(item)} />
                </View>
                <View style={{
                    height: h,width:width-100,
                    alignItems: 'flex-start'
                }}>
                    <Text style={{ marginLeft: 10, marginTop: 10, numberOfLines: 2, ellipsizeMode: 'tail', fontSize: 14, color: "#1c1c1c", }}>{item.name}</Text>
                    <Text style={{ marginLeft: 10, alignItems: 'center', justifyContent: 'center', fontSize: 12, color: "#757575", }}>{item.default_unit}</Text>
                    <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 10, paddingBottom: 10, position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                        <Text style={{ alignItems: 'center', justifyContent: 'center', fontSize: 16, color: "#fb7210", }}>S${item.default_price}</Text>
                        <Text style={{ alignItems: 'center', textAlign: 'left', flex: 9, justifyContent: 'center', fontSize: 12, color: "#757575", marginLeft:10}}>库存：{item.default_stock} </Text>
                    </View>
                </View>

            </View>
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
                                <View style={[{ width: w, height: h }, styles.toolsItem]}>
                                    {this.renderProductInfo(item,groupProductScrollArr, w, h)}
                                    <View style={{marginLeft:10,marginRight:10,height:1,backgroundColor:'rbg(219,219,219)'}}></View>
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





    onSelectProductPress(){
        var groupProductsArr = [];
        this.state.groupProductScrollArr.map((subitem, i) => {
            if (subitem.selected == true){
                groupProductsArr.push({
                    name:subitem.name,
                    goods_id:subitem.goods_id,
                    price:subitem.default_price,
                    stock:subitem.default_stock,
                    image:subitem.image,
                    unit:subitem.default_unit,
                    org_goods_id:subitem.org_goods_id,
                });
            }
        })
        let param = { isCreateNewGroup: this.props.isCreateNewGroup,addGroupbuying_products:groupProductsArr}


        DeviceEventEmitter.emit('AddGroupbuying_products',param);
        DeviceEventEmitter.emit('GetHaveSelectArr',this.state.selectedNum);
        this.back()
        // HttpRequest.post('/v2','/admin.groupbuying.update', param, this.onUpdateGroupBuyingSuccess.bind(this),
        //     (e) => {
        //         console.log(' error:' + e)
        //         Alert.alert('提示','新建商品类别失败，请稍后再试。')
        //     })

    }
    onUpdateGroupBuyingSuccess(response){

        console.log('onUpdateGroupBuyingSuccess11:'+JSON.stringify(response))
        DeviceEventEmitter.emit('updateNewGroup',this.props.groupbuying_info.id);
        const routes = this.props.navigator.state.routeStack;
        console.log('routeStack12:'+JSON.stringify(routes))
        // let destinationRoute ='';
        // for (var i = routes.length - 1; i >= 0; i--) {
        //     console.log('routeStack14:'+JSON.stringify(routes[i]))
        //     if(routes[i].name === 'NewGroupView'){
        //         destinationRoute = this.props.navigator.getCurrentRoutes()[i]
        //         console.log('destinationRoute14:'+JSON.stringify(destinationRoute))
        //         return;
        //     }
        // }

        // this.props.navigator.jumpTo(destinationRoute)
        this.props.navigator.pop();
        // DeviceEventEmitter.addListener('ChangeProductCategoryUI',(dic)=>{
        //     //接收到新建商品页发送的通知，刷新商品类别页的数据，刷新UI
        //     console.log('ChangeProductCategoryUI:16')
        //
        //
        //     let param = { set: this.state.oldSet }
        //     console.log('setStr122:' +this.state.oldSet)
        //     HttpRequest.get('/v2','/admin.goods.list.set', param, this.onSetGroupListSuccess.bind(this),
        //         (e) => {
        //             console.log(' error:' + e)
        //             Alert.alert('提示','新建商品类别失败，请稍后再试。')
        //         })
        // });

    }
    render() {
        console.log('this.state.groupProductScrollArr13:'+JSON.stringify(this.state.groupProductScrollArr))

        var isSelectedArr =[]
        this.state.groupProductScrollArr.map((subitem, i) => {
            if (subitem.selected == true){
                isSelectedArr.push(subitem)
            }

        })
        this.state.selectedNum = isSelectedArr.length;

        return (
            <View style={styles.container}>
                <NavBar
                    title="选择商品"
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)} />

                <View style={{justifyContent: 'flex-start',
                    alignItems: 'center',
                    backgroundColor: '#ffffff'}}>
                    <ScrollView
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={false}
                        style={{width:width,height:height-120,backgroundColor:'rgb(242,242,242)'}}>

                        {this.renderProductScrollView(this.state.groupProductScrollArr)}
                    </ScrollView>



                </View>
                <View style={{width:width,height:50,position:'absolute',bottom:0,backgroundColor:'white',flexDirection:'row',justifyContent:'flex-start'}}>
                    <View style={{flex:137.5,backgroundColor:'white',flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                        {this.renderAllCheckBox(this.state.groupProductScrollArr)}
                        <Text style={{color:'black',fontFamily:'PingFangSC-Regular',fontSize:14,textAlign:'center',marginLeft:10}}>全选</Text>

                    </View>
                    <View style={{flex:137.5,backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>
                        <Text style={{color:'rgb(117,117,117)',fontSize:14,fontFamily:'PingFangSC-Regular',textAlign:'center'}}>已选：{this.state.selectedNum}件</Text>
                    </View>
                    <TouchableOpacity style={{flex:100,backgroundColor:'rgb(234,107,16)',justifyContent:'center',alignItems:'center'}} onPress={this.onSelectProductPress.bind(this)}>
                        <Text style={{color:'white',fontSize:18,fontFamily:'PingFang-SC-Medium',textAlign:'center'}}>确认</Text>
                    </TouchableOpacity>

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