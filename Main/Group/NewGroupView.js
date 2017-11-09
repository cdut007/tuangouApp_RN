
/**
 * Created by Arlen_JY on 2017/11/6.
 */
import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
import AddProductView from './AddProductView'
import  Swipeout from 'react-native-swipeout'

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


        }
    }

    back(){

        this.props.navigator.pop();
    }
    selectGroupDeadline(){

    }
    selectGroupDeliveryTime(){

    }
    OnAddProductViewPress(){
        this.props.navigator.push({
            component: AddProductView
        })
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
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={[ { width: 40, marginRight: 10, color: '#1b1b1b', fontSize: 16,fontFamily:'PingFangSC-Regular'}]}>
                            标题
                        </Text>
                        <TextInput style={{
                        marginLeft: 0, fontSize: 16, flex: 20,
                        textAlign: 'left', color: '#1c1c1c',
                    }}  keyboardType={'default'}
                                   placeholder ='请输入本次拼团的标题'
                                   editable={true}
                                   returnKeyType={'done'}

                                   onChangeText={(text) => this.setState({ groupTitle: text })}
                                   value= {this.state.groupTitle}
                        ></TextInput>

                    </View>
                    <View style={{marginLeft:10,marginRight:10,height:0.5,backgroundColor:'rbg(219,219,219)'}}></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start',alignItems: 'flex-start', backgroundColor: '#ffffff', paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={[ { width: 40, color: '#1b1b1b', fontSize: 16, marginRight: 10,fontFamily:'PingFangSC-Regular',marginTop:10}]}>
                            介绍
                        </Text>
                        <TextInput style={{
                       fontSize: 16,height:90,width:width-60,marginTop:8,
                        textAlign: 'left', color: '#1c1c1c',
                    }}  keyboardType={'default'}
                                   placeholder ='请输入本次拼团的内容介绍'
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