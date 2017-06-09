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
import GroupOrderDetailView from './GroupOrderDetailView';
import DownloadExcelView from './DownloadExcelView';
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import LoginView from '../Login/LoginView'


export default class GroupOrderListView extends Component {
    constructor(props) {
        super(props)
        var title = "拼团中";
        if (this.props.isDoneStatus) {
            title = "拼团已完成";
        }
        this.state={
            goods:{description:''},
            title:title,

        }
    }


    clickBack() {
     this.props.navigator.pop()
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={this.state.title}
                leftIcon={require('../images/back.png')}
                leftPress={this.clickBack.bind(this)}/>
                {this.renderGroupOrderListView()}

            </View>
        )
    }

    onDownloadExcelClick(){
        this.props.navigator.push({

                    component: DownloadExcelView,
                })
    }

    onItemsClick(prouductItems){
        this.props.navigator.push({
                props: {
                    items:prouductItems,
                },

                    component: GroupOrderDetailView,
                })
    }

    renderGroupOrderListView(){
        return(<ScrollView
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps={false}
            style={[styles.mainStyle,{height:height-220}]}>
            {this.renderProductCategoryView()}
            </ScrollView>)
    }

    renderProductCategoryView() {
         var categoryDataAry = [];
         var displayCategoryAry = [];

         var toolsData = [
             {
                 'index': 0,
                 'title': '稍后通知',
                 'image': {uri:'http://img1.juimg.com/141110/330464-1411100SS535.jpg'}
             },


         ]

         categoryDataAry.push({id:'meat',name:'品质水果',image: require('../images/fruit_type.png'),prouductItems:toolsData,countdown:'48:38:29'},);
         categoryDataAry.push({id:'meat',name:'绿色生鲜',image: require('../images/fresh_type.png'),prouductItems:toolsData,countdown:'48:38:29'},);
            for (var i = 0; i<categoryDataAry.length; i++) {
                var items = categoryDataAry[i].prouductItems;
                displayCategoryAry.push(
                        <View style={{margin:0}}>
                        <View style = {[styles.brandLabelContainer,{marginBottom:10}]}>
                        <View style={{marginLeft:10,marginTop:10,marginRight:5, alignItems:'center',
                        justifyContent:'flex-start',}}>
                        <Image style={{resizeMode:'contain', marginRight:5,alignItems:'center',
              justifyContent:'center'}} source={categoryDataAry[i].image}/>
                             </View>
                        <Text style={{fontSize:16,color:'#1b1b1b'}}>
                                {categoryDataAry[i].name}
                            </Text>
                            </View>

                        {this.renderCategorysView(items)}
                        <View style={{width:width,backgroundColor:'#d5d5d5',flex:1,height:0.5}}>
                        </View>
                        {this.renderStatus(items)}

                        </View>
            );
            }
            return displayCategoryAry;
    }

    renderStatus(items){
        if (this.props.isDoneStatus) {
            return(<TouchableOpacity onPress={this.onDownloadExcelClick.bind(this)} style={{alignItems:'center',backgroundColor:'#f7f7f7',
            justifyContent:'center',height:40,width:width}}>
            <Text style={{alignItems:'center',
            justifyContent:'center',fontSize:12,color:'#6d9ee1',textAlign:'center'}}>
               下载Excel表
            </Text>
            </TouchableOpacity>)
        }else {
            return(<TouchableOpacity onPress={this.onItemsClick.bind(this,items)} style={{alignItems:'center',backgroundColor:'#f7f7f7',
            justifyContent:'center',height:40,width:width}}>
            <Text style={{alignItems:'center',
            justifyContent:'center',fontSize:12,color:'#1c1c1c',textAlign:'center'}}>
               查看全部
            </Text>
            </TouchableOpacity>)
        }
    }

    renderItemInfo(item,w,h){
        if (item.tag!='total_count') {
            return(<View style={{resizeMode:'contain', alignItems:'center',width: w, height: h,
            justifyContent:'center',paddingLeft:20,paddingRight:10,flexDirection: "row",backgroundColor:'#f7f7f7',
            flex:1}}>


                <View style={{
                flex:2}}>
                <Image style={{resizeMode:'contain', alignItems:'center',width: 80, height: 80,
                justifyContent:'center',}} source={item.image}/>
                </View>
                <View style={{
                height:h,
                alignItems:'flex-start',
                flex:6}}>
                <Text style={{marginLeft:30,marginTop:10,numberOfLines:2,ellipsizeMode:'tail',fontSize: 14, color: "#1c1c1c",}}>越南芒果</Text>
                <Text style={{marginLeft:30,alignItems:'center',justifyContent:'center',fontSize: 12, color: "#757575",}}>每个约350g</Text>
                <View style={{alignItems:'center',flexDirection:'row',marginLeft:30,paddingBottom:10,position:'absolute',left:0,right:0,bottom:0}}>
                <Text style={{alignItems:'center',justifyContent:'center',fontSize: 16, color: "#fb7210",}}>S$ 8.00</Text>
                <Text style={{alignItems:'center',textAlign:'right',flex:9,justifyContent:'center',fontSize: 12, color: "#757575",}}>已购 230</Text>
                </View>
                </View>

            </View>)
        }

    }

    renderCategorysView(prouductItems) {
        const w = width , h = 110
        let items = prouductItems
        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h ,marginTop:0,marginRight:5,marginBottom:0 }, styles.toolsItem]}>
                                     {this.renderItemInfo(item,w,h)}
                                </View>
                            )
                            return (
                                isIOS ? (
                                    <TouchableHighlight style={{ width: w, height: h }} key={i} onPress={this.onItemsClick.bind(this,items)}>{render}</TouchableHighlight>
                                ) : (
                                        <TouchableNativeFeedback style={{ width: w, height: h }} key={i} onPress={this.onItemsClick.bind(this,items)}>{render}</TouchableNativeFeedback>
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

    thumb: {
        width: 60,
        height: 60,
        marginRight: 10
    },
    line1:{
        height:1,
        backgroundColor:'#dadce2'
    },
    line10:{
        height:10,
        backgroundColor:'#ebeef1'
    },
    brandLabelContainer:
    {   marginTop:5,
        marginBottom:5,
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    line:{
        height:1,
        backgroundColor: '#eef0f3',
    },
    row: {
        flexDirection: 'row',
    },
});
