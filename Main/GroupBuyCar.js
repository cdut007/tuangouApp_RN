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
import GroupBuyNowView from './GroupBuyNowView'
import CommitButton from '../common/CommitButton'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import LoginView from '../Login/LoginView'


export default class GroupBuyCar extends Component {
    constructor(props) {
        super(props)

    }

    onGroupBuyNow(){
        this.props.navigator.push({
           component: GroupBuyNowView,
            props: {

               }
       })
    }

    clickBack() {
     this.props.navigator.pop()
    }

   renderTopBar(){
       if (this.props.showBack) {
           return(<NavBar title="拼团车"
           leftIcon={require('../images/back.png')}
           leftPress={this.clickBack.bind(this)}/>
           )
       }else{
           return(<NavBar title="拼团车" />)
       }
   }


    render() {
        return (
            <View style={styles.container}>
                {this.renderTopBar()}
                <ScrollView
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps={false}
                style={[styles.mainStyle,{height:height-220}]}>
                {this.renderTopView()}
                {this.renderProductCategoryView()}
                </ScrollView>
                <View style={{flex:1}}>
                <View style={{height:0.5,width:width,backgroundColor:'#dedede'}}></View>
                {this.renderProductStartGroupBuyView()}
                </View>

            </View>
        )
    }
    renderProductStartGroupBuyView(){
        let h = width/6
        return(<View style={{resizeMode:'contain', alignItems:'center',width: width, height: h,
        justifyContent:'center',margin:0,flexDirection: "row",
        flex:1}}>
        <View style={{
        flex:1,marginLeft:10,marginRight:0, alignItems:'center',
        justifyContent:'center',}}>
                 <MKCheckbox checked={false} />
             </View>

            <View style={{
            flex:1}}>
            <Text style={{alignItems:'center',justifyContent:'center',fontSize: 14, color: "#1c1c1c",}}>全选</Text>
            </View>
            <View style={{
            flex:6}}>
            <Text style={{margin:10,alignItems:'center',justifyContent:'flex-start',fontSize: 14, color: "#757575",}}>合计：2件商品</Text>
            </View>
            <View style={[{flex:4,alignItems:'flex-end',justifyContent:'flex-end',}]}>
            <CommitButton title={'开始拼团'} onPress={this.onGroupBuyNow.bind(this)}>
            </CommitButton>
            </View>
        </View>)
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
                 'image': {uri:'http://img1.juimg.com/141110/330464-1411100SS535.jpg'}
             },
             {
                 'index': 1,
                 'title': '通知成功',
                 'image': {uri:'http://www.lyqixuantang.com/upload/image/20151202/1449045717253254.jpg'}
             },
             {
                 'index': 2,
                 'title': '再次通知',
                 'image': {uri:'http://images.meishij.net/p/20120905/d3c961321d94bcfa08b33fc99b754874.jpg'}
             },
             {
                 'index': 3,
                 'title': '拍照寄存',
                 'image': {uri:'http://img.shelive.net/201608/ba70006454058984a1a.jpg'}
             },
             {
                 'index': 4,
                 'title': '发送失败',
                 'image': {uri:'http://photocdn.sohu.com/20151019/mp36482548_1445239748270_2_th_fv23.jpeg'}
             },

         ]

          categoryDataAry.push({id:'meat',name:'品质水果',prouductItems:toolsData,countdown:'201123232'},);

            for (var i = 0; i<categoryDataAry.length; i++) {
                displayCategoryAry.push(
                        <View style={{margin:5}}>
                        <View style = {styles.brandLabelContainer}>
                        <View style={{marginRight:5, alignItems:'center',
                        justifyContent:'flex-start',}}>
                                 <MKCheckbox checked={true} />
                             </View>
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
            return(<View style={{resizeMode:'contain', alignItems:'center',width: w, height: h,
            justifyContent:'center',paddingLeft:5,paddingRight:10,flexDirection: "row",backgroundColor:'#f7f7f7',
            flex:1}}>
            <View style={{
            flex:1,marginRight:10, alignItems:'center',
            justifyContent:'center',}}>
            <MKCheckbox checked={true} />
                 </View>

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
                <Text style={{alignItems:'center',textAlign:'right',flex:9,justifyContent:'center',fontSize: 12, color: "#757575",}}>库存 230</Text>
                </View>
                </View>

            </View>)
        }

    }

    renderCategorysView(prouductItems) {
        const w = width , h = 110

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
    GroupBuyContainer:
    {

        borderColor: '#e31515',
        borderWidth:1,
        textAlign:'center',
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
