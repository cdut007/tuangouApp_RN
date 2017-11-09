/**
 * Created by Arlen_JY on 2017/11/8.
 */


import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';



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
export default class NoticeOrderView extends Component{
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
        for (var i = 0;i < groupArr.length;i++){
            displayGroupArr.push(<View style={{backgroundColor:'#ffffff',height:140,width:width,marginTop:10}}>
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


                                contentContainerStyle={{width:70*this.state.groupProductArr.length,height:90}}
                                style={{width:width,flexWrap:'nowrap'}}>
                        {this.renderGroupProductArr(this.state.groupProductArr)}

                    </ScrollView>
                </View>

                <View style={{flex:2.5,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{color:'rgb(117,117,117)',marginLeft:10}}>预计2017年11月12日发货</Text>
                    <TouchableOpacity style={{}}>
                        <View style={{}}>

                        </View>
                    </TouchableOpacity>
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
                    title="通知取货"
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)} />

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