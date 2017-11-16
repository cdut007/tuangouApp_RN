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
    TouchableOpacity
}   from 'react-native';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
export default class NewProductCategoryView extends Component{
    constructor (props){
        super(props)

        this.state = {

            groupTitle:'',
            groupDetail:'',
            groupProductScrollArr:[1,2,3],


        }
    }

    back(){

        this.props.navigator.pop();
    }
    saveCategory(){
        this.props.navigator.pop();
    }
    selectGroupDeadline(){

    }
    selectGroupDeliveryTime(){

    }
    OnAddProductViewPress(){
        // this.props.navigator.push({
        //     component: AddProductView
        // })
        this.props.navigator.push({
            component: NewProductView
        })

    }
    componentDidMount() {
        var setStr = this.randomstring(5);
        let param = { set: setStr }
        console.log('setStr11:' +setStr)
        HttpRequest.get('/v2','/admin.goods.list.set', param, this.onSetGroupListSuccess.bind(this),
            (e) => {
                console.log(' error:' + e)
                Alert.alert('提示','新建商品类别失败，请稍后再试。')
            })


    }
    randomstring(L){
        var s= '';
        s = Math.floor(Math.random()*50);
        // var randomchar=function(){
        //     var n= Math.floor(Math.random()*62);
        //     if(n<10) return n; //1-10
        //     if(n<36) return String.fromCharCode(n+55); //A-Z
        //     return String.fromCharCode(n+61); //a-z
        // }
        // while(s.length< L) s+= randomchar();
        return s;
    }
    onSetGroupListSuccess(response){
        console.log('onSetGroupListSuccess:'+JSON.stringify(response.data))

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
        return(
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
        var groupProductArr = [];
        groupProductArr = this.state.groupProductScrollArr;

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