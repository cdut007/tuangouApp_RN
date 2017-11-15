
/**
 * Created by Arlen_JY on 2017/11/6.
 */
import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
import NewGroupView from './NewGroupView'
import ProductManager from '../Product/ProductManager'
import NewProductView from './NewProductView'
import AddProductView from './AddProductView'

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
Date.prototype.format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};
export default class GroupBuyManager extends Component{
    constructor (props){
        super(props)

        this.state = {

            groupTitle:'',
            groupDetail:'',
            groupArr:[1,2,3,4],
            groupProductArr:[1,2,3,4,5,6],


        }
    }

    back(){

        this.props.navigator.pop();
    }
    OnNewGroupPress(){
        this.props.navigator.push({
            component: NewGroupView
        })
    }
    OnProductManagerPress(){
        this.props.navigator.push({
            component: ProductManager
        })

    }
    OnMemberManagerPress(){

    }
    renderGroupProductArr(GroupProductArr){
        const w = (width-10)/ 5.6 , h = w
        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (

                                <View style={[{ width: w, height: h}, styles.toolsItem]}>
                                    <Image style={{width: w-5, height: h-5,margin:5}}
                                           source={require('../../images/me_bj.jpg')}
                                    >

                                    </Image>




                                </View>
                            )
                            return (
                                <TouchableOpacity style={{ width: w, height: h }} key={i} onPress={() => { this.onItemClick(item) }}>{render}</TouchableOpacity>
                            )
                        })
                    }
                </View>
            )
        }
        return (
            renderSwipeView(GroupProductArr)
        )
    }

    renderGroupScrollView(groupArr){
        var displayGroupArr =[];
        var timetitle ='';
        // var groupProductNum = this.state.groupProductArr.length
        for (var i = 0;i <= groupArr.length;i++){
            displayGroupArr.push(<View style={{backgroundColor:'#ffffff',height:132,width:width,marginTop:10}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',flex:3.5,paddingLeft:10}}>
                        <Text style={{}}>双十一水果拼团开始啦！双十一水果拼团开始啦！双…</Text>
                        <Image style={{marginRight:5}}
                        source={require('../../images/next_icon@3x.png')}>

                        </Image>
                </View>
                <View style={{flex:8}}>
                    <ScrollView keyboardDismissMode='on-drag'
                                keyboardShouldPersistTaps={false}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}


                                contentContainerStyle={{width:70*this.state.groupProductArr.length}}
                                style={{width:width}}>
                        {this.renderGroupProductArr(this.state.groupProductArr)}

                    </ScrollView>
                </View>

                <View style={{flex:2.5}}>
                    <Text style={{color:'rgb(117,117,117)',marginLeft:10}}>预计2017年11月12日发货</Text>
                </View>
            </View>)
        }

        return displayGroupArr;
    }
    render() {

        var groupCount = this.state.groupArr.length;
        if (this.state.groupArr.length >= 4){
            groupCount = 4;
        }

        return (
            <View style={styles.container}>
                <NavBar
                    title="拼团管理"
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)} />
                <View style={{marginTop:10,backgroundColor:'#ffffff',height:80,flexDirection:'row',justifyContent: 'flex-start',}}>
                    <View style={{flex:125}}>
                        <TouchableOpacity style={{marginTop:15,flexDirection:'column',justifyContent: 'flex-start',alignItems:'center'}} onPress={this.OnNewGroupPress.bind(this)}>
                            <Image
                            source={require('../../images/createIcon@3x.png')}>
                            </Image>
                            <Text style={[ { marginTop:6, color: 'rgb(28,28,28)', fontSize: 14,fontFamily:'PingFangSC-Regular',width:70,textAlign:'center'}]}>
                                新建拼团
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop:10,marginBottom:10,flex:0.5,backgroundColor:'rgb(213,213,213)'}}></View>
                    <View style={{flex:125}}>
                        <TouchableOpacity style={{marginTop:15,flexDirection:'column',justifyContent: 'flex-start',alignItems:'center'}} onPress={this.OnProductManagerPress.bind(this)}>
                            <Image
                                source={require('../../images/productsIcon@3x.png')}>
                            </Image>
                            <Text style={[ { marginTop:6, color: 'rgb(28,28,28)', fontSize: 14,fontFamily:'PingFangSC-Regular',width:70,textAlign:'center'}]}>
                                商品管理
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop:10,marginBottom:10,flex:0.5,backgroundColor:'rgb(213,213,213)'}}></View>
                    <View style={{flex:125}}>
                        <TouchableOpacity style={{marginTop:15,flexDirection:'column',justifyContent: 'flex-start',alignItems:'center'}} onPress={this.OnMemberManagerPress.bind(this)}>
                            <Image
                                source={require('../../images/teamUserIcon@3x.png')}>
                            </Image>
                            <Text style={[ { marginTop:6, color: 'rgb(28,28,28)', fontSize: 14,fontFamily:'PingFangSC-Regular',width:70,textAlign:'center'}]}>
                                团员管理
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{}}>
                    <ScrollView
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={false}

                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}



                        style={{width:width,backgroundColor:'#f2f2f2',height:140 *groupCount}}
                    >

                        {this.renderGroupScrollView(this.state.groupArr)}
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
        justifyContent: 'flex-start',
        // alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    toolsItem: {
        justifyContent: "flex-start",
        // alignItems: "center",
        backgroundColor:'#f2f2f2'

    },


})