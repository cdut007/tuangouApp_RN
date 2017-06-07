import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    ScrollView,
    TouchableHighlight,
} from 'react-native';

import {
    MKIconToggle,
    MKSwitch,
    MKRadioButton,
    MKCheckbox,
    MKColor,
    getTheme,
    setTheme,
} from 'react-native-material-kit'

import Banner from 'react-native-banner';
import Dimensions from 'Dimensions';
import Grid from 'react-native-grid-component';
import NavBar from '../common/NavBar'
import px2dp from '../common/util'
import NotifyNowView from './NotifyNowView'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;

import LoginView from '../Login/LoginView'


export default class GroupBuyCar extends Component {
    constructor(props) {
        super(props)

    }



    render() {
        return (
            <View style={styles.container}>
                <NavBar title="拼团车" />
                <ScrollView
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps={false}
                style={styles.mainStyle}>
                {this.renderTopView()}
                {this.renderProductCategoryView()}


                </ScrollView>
            </View>
        )
    }



    renderTopView() {


    }

    onItemClick(prouduct){

    }


    renderProductCategoryView() {
         var categoryDataAry = [];
         var displayCategoryAry = [];

         var toolsData = [
             {
                 'index': 0,
                 'title': '稍后通知',
                 'image': {uri:'http://www.qq745.com/uploads/allimg/141106/1-141106153Q5.png'}
             },
             {
                 'index': 1,
                 'title': '通知成功',
                 'image': {uri:'http://www.qq745.com/uploads/allimg/141106/1-141106153Q5.png'}
             },
             {
                 'index': 2,
                 'title': '再次通知',
                 'image': {uri:'http://img1.3lian.com/2015/a1/53/d/198.jpg'}
             },
             {
                 'index': 3,
                 'title': '拍照寄存',
                 'image': {uri:'http://image.tianjimedia.com/uploadImages/2012/235/9J92Z5E5R868.jpg'}
             },
             {
                 'index': 4,
                 'title': '发送失败',
                 'image': {uri:'http://img1.3lian.com/2015/a1/53/d/200.jpg'}
             },
             {
                 'index': 5,
                 'title': '记录查询',
                 'image': require('../images/searchRecordsIcon.png'),
                 'tag': 'total_count'
             }
         ]

          categoryDataAry.push({id:'meat',name:'品质水果',prouductItems:toolsData,countdown:'201123232'},);

            for (var i = 0; i<categoryDataAry.length; i++) {
                displayCategoryAry.push(
                        <View style={{margin:5}}>
                        <View style = {styles.brandLabelContainer}>
                            {/* <Image style={{resizeMode:'contain', alignItems:'center',
                  justifyContent:'center'}} source={require('../images/login_wechat.png')}/> */}
                            <Text style={{fontSize:16,color:'#1b1b1b'}}>
                                {categoryDataAry[i].name}
                            </Text>
                            </View>
                        {this.renderCategorysView(categoryDataAry[i].prouductItems)}
                        <View style = {{flex:1,justifyContent:'flex-end',alignItems: 'flex-end',marginRight:5}}>

                        </View>
                        </View>
            );
            }
            return displayCategoryAry;
    }

    renderItemInfo(item,w,h){
        if (item.tag!='total_count') {
            return(<View style={{resizeMode:'contain', alignItems:'center',width: w-20, height: h,
            justifyContent:'center',margin:2,flexDirection: "row",
            flex:1}}>
            <View style={{
            flex:1,marginRight:10, alignItems:'center',
            justifyContent:'center',}}>
                     <MKCheckbox checked={false} />
                 </View>

                <View style={{
                flex:2}}>
                <Image style={{resizeMode:'contain', alignItems:'center',width: 40, height: 40,
                justifyContent:'center',}} source={item.image}/>
                <Text style={{alignItems:'center',marginTop:5,justifyContent:'center',fontSize: 14, color: "#000000",}}>库存450</Text>
                </View>
                <View style={{
                flex:6}}>
                <Text style={{margin:10,alignItems:'center',justifyContent:'center',fontSize: 14, color: "#000000",}}>山东烟台大樱桃新鲜水果 露天车厘子美早红灯黑珍珠，纯天然绿色无污染</Text>
                </View>
                <Text style={{alignItems:'center',justifyContent:'center',fontSize: 14, color: "#000000",}}>S$ 20.00</Text>

            </View>)
        }
        return(<View style={{opacity:0.4, position:'absolute',left:0,top:0,alignItems:'flex-end',flex:1,width: w, height: h/3 ,
        justifyContent:'center',backgroundColor:'#999999'}}
        needsOffscreenAlphaCompositing={true}
        >
        <Text needsOffscreenAlphaCompositing={true} style={{marginRight:10,opacity:1,alignItems:'center',justifyContent:'center',fontSize: 14, color: "#ffffff",}}>拼团总计:6件商品</Text>
        </View>)
    }

    renderCategorysView(prouductItems) {
        const w = width , h = w/3

        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h ,marginTop:5,marginRight:5,marginBottom:5 }, styles.toolsItem]}>
                                     {this.renderItemInfo(item,w,h)}
                                </View>
                            )
                            return (
                                isIOS ? (
                                    <TouchableHighlight style={{ width: w, height: h }} key={i} onPress={() => { this.onItemClick(item) }}>{render}</TouchableHighlight>
                                ) : (
                                        <TouchableNativeFeedback style={{ width: w, height: h }} key={i} onPress={() => { this.onItemClick(item) }}>{render}</TouchableNativeFeedback>
                                    )
                            )
                        })
                    }
                </View>
            )
        }
        return (
            renderSwipeView(prouductItems)
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
    topView: {
        height: 150,
        width: width,
    },
    list:
    {
        flex: 1,
    },
    countdownContainer:
    {
        marginTop: 10,
        marginBottom:20,
        height: 50,
        width: width - 160,
        borderColor: '#e31515',
        borderWidth:1,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
    },

    countdownText:{
            color: '#e31515',
            fontSize:14,
    },
    brandLabelContainer:
    {
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    toolsView: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'center',
        alignItems: 'center',
    },
    toolsItem: {
        justifyContent: "center",
        alignItems: "center",
        borderColor: '#e6e6e6',
        borderWidth:1,
    },
});
