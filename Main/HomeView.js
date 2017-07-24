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
    ListView,
} from 'react-native';
import { CachedImage } from 'react-native-img-cache'
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
            goodsList:[],
            categoryDataAry : [],
            displayCategoryAry : []
        };
    }
    onBannerSuccess(response){
        this.state.banners = response.data.images;
        console.log('BannerSuccess:' + JSON.stringify(response.data));
        this.setState({banners:this.state.banners});
    }

    onProudctListSuccess(response){
        this.state.goodsList = response.data;
        console.log('ProudctListSuccess:' + this.state.goodsList.length);
        this.setState({goodsList:this.state.goodsList});
    }

    componentWillMount(){
        this.fetchBanner();
        this.fetchProductList();
    }

    fetchProductList(){
        var paramBody ={ }
        HttpRequest.get('/home_page_list', paramBody, this.onProudctListSuccess.bind(this),
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

     fetchBanner(){
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
                <NavBar title="爱邻" />



                 <ScrollView
                 keyboardDismissMode='on-drag'
                 keyboardShouldPersistTaps={false}
                 iosalwaysBounceHorizontal={false}
                 iosbounces={false}
                 showsHorizontalScrollIndicator = {false}
                 removeClippedSubviews = {true}
                 horizontal={false}
                 style={{width:width}}

                 >

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
        //  console.log(`--->onMomentumScrollEnd page index:${state.index}, total:${state.total}`);
         this.defaultIndex = state.index;
     }
    renderHeader = () => {
        return (<View style={styles.topView} >
            {this.renderTopView()}
        </View>)
    }
    renderItem = ({ item}) =>{
        return (<TouchableOpacity underlayColor="#dad9d7" style={[styles.row]} onPress={this.onPress.bind(this)}>
                <View style={[styles.row]}>


                </View>
            </TouchableOpacity>
        )
    };


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
                    scalesPageToFit={true}
                />

            )
        }
    }

    onItemClick(prouduct){
        console.log('prouduct :' +JSON.stringify(prouduct))
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

        console.log( ' this.state.goodsList.length === '+ this.state.goodsList.length);
        for (var i = 0; i < this.state.goodsList.length; i ++) {
            console.log( ' this.state.goodsList.i === '+ i);
            var goods = this.state.goodsList[i].goods;
            var classify = this.state.goodsList[i].classify;
            var goodsMaxLengh = goods.length > 6 ? 6: goods.length;
            var toolsData = [];
            for (var j = 0; j < goodsMaxLengh; j++) {
                console.log( ' goodsMaxLengh.length === '+ j);
                var product = goods[j];
                if (i == 1 && j == 0){
                    console.log( ' product i1 j0 === '+ JSON.stringify(product));

                }
                console.log( ' product === '+ product);
                if (j == goodsMaxLengh -1 ) {
                    toolsData.push({
                        'index': classify.id,
                        'image': {uri:product.image},
                         'title':'申请拼团',
                        'tag': 'scan_more'
                    });
                }else{
                    toolsData.push({
                        'index': product.goods_id,
                        'image': {uri:product.image},
                    });
                }
            }
            console.log(goodsMaxLengh+ ' toolsData max length === '+toolsData.length+";type name"+ classify.name);


            categoryDataAry.push({id:classify.id,name:classify.name,image:{uri:classify.icon} ,desc:classify.desc ,prouductItems:toolsData,countdown:'48:38:29'},);
            if(i == 1){
                console.log('categoryNum1:' +JSON.stringify(categoryDataAry.length));
            }else {

                console.log('categoryNum0:' +JSON.stringify(categoryDataAry.length));
            }
        }



            for (var i = 0; i<categoryDataAry.length; i++) {
                console.log( ' displayCategoryAry.length === '+ i);
                displayCategoryAry.push(
                        <View>
                        {this.renderItemSpaceLine(i)}
                        <View style={{margin:5}}>
                        <View style = {styles.brandLabelContainer}>
                            <CachedImage style={{resizeMode:'contain', marginRight:10,alignItems:'center',width:30,height:30,
                  justifyContent:'center'}} source={categoryDataAry[i].image}/>
                            <Text style={{fontSize:16,color:'#1b1b1b'}}>
                                {categoryDataAry[i].name}
                            </Text>
                        </View>
                        {this.renderCategorysView(categoryDataAry[i].prouductItems)}
                        <View style = {{flex:1,justifyContent:'flex-start',alignItems: 'flex-start',marginLeft:5}}>
                        <View onPress={this.onAnnounceNow.bind(this)}
                            style={styles.countdownContainer}>
                            <Text style={styles.countdownText} >
                                {categoryDataAry[i].desc}
                            </Text>
                        </View>
                        </View>
                        </View>
                        </View>
            );
            }
                if (categoryDataAry.length >3 ){
                    displayCategoryAry.push(<View style={{color:'#686868',backgroundColor:'#f2f2f2',height:54,flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:12,color:'#686868',backgroundColor:'#f2f2f2',textAlign:'center',justifyContent:'center',alignItems:'center'}}>拉不动了...</Text>
                    </View>);
                }



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
        const w = width / 3 - 30, h = w

        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h ,margin:5 }, styles.toolsItem]}>

                                    <CachedImage style={{resizeMode:'contain', alignItems:'center',width: w, height: h,
                                    justifyContent:'center',margin:2,
                                    flex:1}} source={item.image}/>
                                     {this.renderMoreInfo(item,w,h)}
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
        flex:1,
        alignItems:'stretch',
        justifyContent:'center',
        width:300,
        height:75,

    },

    row: {
        justifyContent: 'center',
        padding: 1,
        margin: 5,
        width: (width - 20) / 2,
        height: 220,
        backgroundColor: '#F6F6F6',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#CCC'
    },

    countdownContainer:
    {
        marginTop: 10,
        marginBottom:20,
        height: 32,
        width: width - 10,
        // borderColor: '#e31515',
        // borderWidth:1,
        // borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'flex-start',
    },

    countdownText:{
            color: 'black',
            fontSize:16,
            fontFamily:'PingFangSC-Regular',
            textAlign:'left',
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
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft:5,
    },
    toolsItem: {
        justifyContent: "center",
        alignItems: "center",


    },
});
