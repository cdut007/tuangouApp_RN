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
import Banner from 'react-native-banner';
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar'
import px2dp from '../common/util'
import ProductCatagoryListViewTab from './ProductCatagoryListViewTab'
import ProductDetail from './ProductDetail'
import HttpRequest from '../HttpRequest/HttpRequest'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;

import LoginView from '../Login/LoginView'


export default class HomeView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            banners:[],
        };
    }
    onBannerSuccess(response){
        this.state.banners = response;
        this.setState({banners:this.state.banners});
    }

    componentWillMount(){
        var paramBody ={ }
        HttpRequest.get('/banner', paramBody, this.onBannerSuccess.bind(this),
            (e) => {

                try {
                    var errorInfo = JSON.parse(e);
                    console.log(errorInfo.description)
                    if (errorInfo != null && errorInfo.description) {
                        console.log(errorInfo.description)
                    } else {
                        console.log(e)
                    }
                }
                catch(err)
                {
                    console.log(err)
                }

                console.log(' error:' + e)
            })
    }


    onAnnounceNow() {
        // this.props.navigator.push({
        //     component: NotifyNowView,
        //
        // })
    }


    render() {
        return (
            <View style={styles.container}>
                <NavBar title="爱邻购" />
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


     bannerClickListener(index) {
     this.setState({
             clickTitle: this.state.banners[index].title ? `you click ${this.state.banners[index].title}` : 'this banner has no title',
         })
     }

     bannerOnMomentumScrollEnd(event, state) {
         console.log(`--->onMomentumScrollEnd page index:${state.index}, total:${state.total}`);
         this.defaultIndex = state.index;
     }

    renderTopView() {


        var errorInfo = JSON.stringify(this.state.banners);
        console.log("this.state.banners="+errorInfo)
        if (this.state.banners.length == 0) {
            return (
                <View
                    style={styles.topView}
                />

            )
        }else{
            return (
                <Banner
                    style={styles.topView}
                    banners={this.state.banners}
                    defaultIndex={this.defaultIndex}
                    onMomentumScrollEnd={this.bannerOnMomentumScrollEnd.bind(this)}
                    intent={this.bannerClickListener.bind(this)}
                />

            )
        }
    }

    onItemClick(prouduct){
         if (prouduct.tag != 'scan_more') {
             this.props.navigator.push({
                component: ProductDetail,
                 props: {
                     prouduct:prouduct,
                    }
            })
        }else{
            this.props.navigator.push({
               component: ProductCatagoryListViewTab,
                props: {
                    prouduct:prouduct,
                   }
           })
        }
    }

    renderItemSpaceLine(index){
        if (index == 0) {
            return
        }
        return (<View style={{backgroundColor:"#f2f2f2",height:10,flex:1}}></View>)
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
             {
                 'index': 5,
                 'title': '更多精选',
                 'image': {uri:'http://image82.360doc.com/DownloadImg/2015/02/2022/50345829_1.jpg'},
                 'tag': 'scan_more'
             }
         ]

          categoryDataAry.push({id:'meat',name:'品质水果','image': require('../images/fruit_type.png'),prouductItems:toolsData,countdown:'48:38:29'},);
          categoryDataAry.push({id:'meat',name:'绿色生鲜','image': require('../images/fresh_type.png'),prouductItems:toolsData,countdown:'48:38:29'},);
          categoryDataAry.push({id:'meat',name:'有机蔬菜','image': require('../images/vegetable_type.png'),prouductItems:toolsData,countdown:'48:38:29'},);

            for (var i = 0; i<categoryDataAry.length; i++) {
                displayCategoryAry.push(
                        <View>
                        {this.renderItemSpaceLine(i)}
                        <View style={{margin:5}}>
                        <View style = {styles.brandLabelContainer}>
                            <Image style={{resizeMode:'contain', marginRight:5,alignItems:'center',
                  justifyContent:'center'}} source={categoryDataAry[i].image}/>
                            <Text style={{fontSize:16,color:'#1b1b1b'}}>
                                {categoryDataAry[i].name}
                            </Text>
                            </View>
                        {this.renderCategorysView(categoryDataAry[i].prouductItems)}
                        <View style = {{flex:1,justifyContent:'flex-end',alignItems: 'flex-end',marginRight:5}}>
                        <View onPress={this.onAnnounceNow.bind(this)}
                            style={styles.countdownContainer}>
                            <Text style={styles.countdownText} >
                                截团倒计时{categoryDataAry[i].countdown}
                            </Text>
                        </View>
                        </View>
                        </View>
                        </View>
            );
            }
            displayCategoryAry.push(<View style={{color:'#686868',backgroundColor:'#f2f2f2',height:54,flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:12,color:'#686868',backgroundColor:'#f2f2f2',textAlign:'center',justifyContent:'center',alignItems:'center'}}>拉不动了...</Text>
            </View>);
            return displayCategoryAry;
    }

    renderMoreInfo(item,w,h){
        if (item.tag!='scan_more') {
            return
        }
        return(<View style={{opacity:0.4, position:'absolute',left:0,top:0,alignItems:'center',flex:1,width: w, height: h ,
        justifyContent:'center',backgroundColor:'#999999'}}
        needsOffscreenAlphaCompositing={true}
        >
        <Text needsOffscreenAlphaCompositing={true} style={{opacity:1,alignItems:'center',justifyContent:'center',fontSize: 14, color: "#ffffff",}}>{item.title}</Text>
        </View>)
    }

    renderCategorysView(prouductItems) {
        const w = width / 3 - 9, h = w

        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h ,marginTop:5,marginRight:5,marginBottom:0 }, styles.toolsItem]}>

                                    <Image style={{resizeMode:'contain', alignItems:'center',width: w-2, height: h,
                                    justifyContent:'center',margin:2,
                                    flex:1}} source={item.image}/>
                                     {this.renderMoreInfo(item,w,h)}
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
        height: 32,
        width: width - 220,
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
    {   marginTop:5,
        marginBottom:5,
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
