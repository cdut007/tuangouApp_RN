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
    AsyncStorage,
    WebView
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
import {CachedImage} from "react-native-img-cache";
import Banner from 'react-native-banner';
import Dimensions from 'Dimensions';
import Grid from 'react-native-grid-component';
import NavBar from '../../common/NavBar'
import px2dp from '../../common/util'
import CommitButton from '../../common/CommitButton'
import GroupBuyCar from '../GroupBuyCar'
import Welcome from '../../Login/Welcome'
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var hasGotGbDetail = false
var Global = require('../../common/globals');
import Swiper from 'react-native-swiper';

import LoginView from '../../Login/LoginView'
import HttpRequest from '../../HttpRequest/HttpRequest'


export default class ProductDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            banners: [],
            goods: {classify: {},goods_detail:{},related_goods:[]},//defualt image later
            // gbDetail: {classify: {name: '', icon: ''}, group_buy_goods: []},
            WebViewHeight:height,
            classifyDetailDes:{},
            gbDetail:{}
        }
    }


    onItemClick(prouduct) {
        this.props.navigator.replace({
            component: ProductDetail,
            props: {
                prouduct:{
                    'index': prouduct.goods_id,
                    'image': {uri:prouduct.image},
                },
            }
        })

    }

    componentDidMount() {
        var prouduct = this.props.prouduct;
        hasGotGbDetail = false
   this.setState({
       goods: {classify: {},goods_detail:{},related_goods:[]}
   })

        this._fetchGoods(prouduct.index);
    }

    _fetchGoods(spec_id) {

        var paramBody = {goods_id: spec_id}
        console.log('_fetchGoodsspec_id:' + spec_id)
        HttpRequest.get('/v2','/api.goods.detail', paramBody, this.onProudctDetailSuccess.bind(this),
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
                catch (err) {
                    console.log(err)
                }

                console.log(' error:' + e)
            })
    }

    onProudctDetailSuccess(response) {
        console.log('ProductDetailData' + JSON.stringify(response.data))
        var bannerImgArr =[];
        bannerImgArr.push(response.data.goods_detail.images);
        this.setState({
            goods: response.data,
            banners: response.data.goods_detail.images
        })

        let param = { classify_id: this.state.goods.classify.classify_id }
        HttpRequest.get('/v2','/api.goods.listing', param, this.onGroupBuyListSuccess.bind(this),
            (e) => {

                console.log(' group_buy_listerr:' + e)
            })
        // var paramBody = {group_buy: response.data.classify.group_buy_id}
        // HttpRequest.get('/v1','/group_buy_detail', paramBody, this.onGroupBuyDetailSuccess.bind(this),
        //     (e) => {
        //         try {
        //             var errorInfo = JSON.parse(e);
        //             console.log(errorInfo.description)
        //             if (errorInfo != null && errorInfo.description) {
        //                 console.log(errorInfo.description)
        //             } else {
        //                 console.log(e)
        //             }
        //         }
        //         catch (err) {
        //             console.log(err)
        //         }
        //
        //         console.log(' error:' + e)
        //     })
    }


    onGroupBuyListSuccess(response) {
        hasGotGbDetail = true
        var gbDetailDes = {}
        console.log('onGroupBuyListSuccess112'+JSON.stringify(response))
        var  allGb = response.data.group_buying_list;
        allGb.map((product, i) => {
            if (product.group_buy_id == this.state.goods.classify.group_buy_id){
                gbDetailDes = product;
            }else {

            }
        })
        this.setState({
            gbDetail: gbDetailDes,
            classifyDetailDes:response.data.classify
        })
    }

    clickBack() {
        this.props.navigator.pop()
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title="商品详情"
                        leftIcon={require('../../images/back.png')}
                        leftPress={this.clickBack.bind(this)}/>

                {this.renderProductDetailView()}
            </View>
        )
    }

    startGroupBuy() {
        if (!hasGotGbDetail) {
            return
        }

        AsyncStorage.setItem('k_cur_gbdetail', JSON.stringify(this.state.gbDetail), (error, result) => {
            if (error) {
                console.log('save k_cur_gbdetail faild.')
            }
        })
        console.log('k_cur_gbdetail:'+JSON.stringify(this.state.gbDetail))
        Global.gbDetail = this.state.gbDetail

        if (Global.user_profile){

            this.props.navigator.push({
                component: GroupBuyCar,
                props: {
                    showBack: true,
                    classifyDetail:this.state.classifyDetailDes
                }
            })
        }else {
            this.props.navigator.resetTo({
                component: Welcome,
                name: 'Welcome'
            })
        }

    }
    renderSwiperImageView(imageArr,imageNum){
        var displayViewArr =[];

        for (var i = 0 ;i <imageNum ; i++){
            displayViewArr.push(  <Image source={{uri:imageArr[i]}} style={{width: width,
        height: width}} />)
        }
        return displayViewArr;

    }
    renderBannerView() {
        if (this.state.banners.length > 0) {
            console.log('ProductDetailBanners' + JSON.stringify(this.state.banners))
            var imageArr = this.state.banners;
            var imageNum = imageArr.length;
            return (
                <View style={styles.topView}>

                    <Swiper
                        style={[styles.topView,{width:width*imageNum}]}
                        height={150}
                        index={0}
                        loop={true}                    //如果设置为false，那么滑动到最后一张时，再次滑动将不会滑到第一张图片。
                        autoplay={true}                //自动轮播
                        horizontal={true} //水平方向，为false可设置为竖直方向
                        paginationStyle={{bottom: 10}}
                        showsButtons={false}
                        autoplayTimeout={4}                //每隔4秒切换
                    >


                        {this.renderSwiperImageView(imageArr,imageNum)}



                    </Swiper>

                </View>

            )
        } else {

            return ( <Image
                style={{ width: width, height: width }}

            />)

        }


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

    renderProductDetailView() {
        const ItemW = width / 3 - 1, ItemH = ItemW * 1.5
        var goods = this.state.goods;

        var goodsRecommendItems = goods.related_goods
        var goodsDetailImages = goods.goods_detail.desc;
        console.log('goodsitem:' + JSON.stringify(goods))
        // if(!goods){
        //     return <Loading loadingtext='正在加载商品...'/>
        // }
        //var htmlContent = goods.description||"";
        return (
            <View style={styles.container}>
                <ScrollView
                    style={{ marginBottom: 50 ,width:width}}

                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps={false}
                >
                    <View>
                        {this.renderBannerView()}

                        <Text style={{ flex: 1, color: '#1c1c1c', fontSize: 18, margin: 10 }}>{goods.goods_detail.name}</Text>
                        <View style={{
                            alignItems: 'center', flexDirection: 'row',
                            justifyContent: 'flex-start', margin: 10,
                            flex: 1
                        }}>
                            <Text
                                style={{ alignItems: 'center', textAlign: 'left', justifyContent: 'flex-start', numberOfLines: 1, color: '#e31515', fontSize: 20, }}>S$ {goods.goods_detail.price}</Text>
                            <Text style={{
                                alignItems: 'center', marginLeft: 10, flex: 7,
                                justifyContent: 'center', numberOfLines: 1, color: '#757575', fontSize: 12
                            }}>{goods.goods_detail.unit}</Text>
                            <Text style={{
                                alignItems: 'center', marginLeft: 10, flex: 2,
                                justifyContent: 'flex-end', numberOfLines: 1, color: '#757575', fontSize: 12
                            }}>库存 {goods.goods_detail.stock}</Text>
                        </View>


                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            margin: 10,
                        }}>
                            <CachedImage style={{
                                resizeMode: 'contain', marginRight: 5, alignItems: 'center',
                                justifyContent: 'center', width: 30, height: 30
                            }} source={{ uri: goods.classify.icon }}/>
                            <Text style={{ fontSize: 16, color: '#1b1b1b' }}>
                                {goods.classify.name}

                            </Text>
                        </View>
                        <ScrollView
                            keyboardDismissMode='on-drag'
                            keyboardShouldPersistTaps={false}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}


                            contentContainerStyle={{width:ItemW*goodsRecommendItems.length,height:ItemH}}
                            style={{width:width,height:ItemH}}
                        >

                            {this.renderCategorysView(goodsRecommendItems)}
                        </ScrollView>

                        <View style={{ backgroundColor: '#f2f2f2', height: 10, flex: 1, }}>
                        </View>

                        <Text
                            style={{ fontSize: 18, color: '#757575', textAlign: 'center', marginTop: 20, marginBottom: 20 }}>
                            商品详情
                        </Text>
                        {this.renderDetailView(goodsDetailImages)}


                    </View>
                </ScrollView>

                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}><CommitButton title={'申请拼团'}
                                                                                                   onPress={this.startGroupBuy.bind(this)}></CommitButton></View>
            </View>
        );
    }


renderDetailView(goodsDetailImages) {

    const w = width, h = height;

             return ( <View style={[styles.goodsWebView]}>
                <WebView  style={{width:width,height:this.state.WebViewHeight,maxWidth:width}}

                         source={{html: `<!DOCTYPE html><html><body style="height:100%">${goodsDetailImages}<script>window.onload=function(){window.location.hash = 1;document.title = document.body.clientHeight;}</script></body></html>`}}
                          javaScriptEnabled={true}
                          domStorageEnabled={true}
                          bounces={false}
                          scrollEnabled={false}
                          automaticallyAdjustContentInsets={true}
                          contentInset={{top:0,left:0}}
                          onNavigationStateChange={(title)=>{
                              if(title.title != undefined) {
                                  this.setState({
                                      WebViewHeight:(parseInt(title.title)+20)
                                  })
                              }
                          }}
                 >

                 </WebView>
             </View>)

    }


    renderCategorysView(prouductItems){
        const w = width / 3 - 1, h = w * 1.5

        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (

                                <View style={[{ width: w, height: h }, styles.toolsItem]}>

                                    <Image style={{
                                        resizeMode: 'contain', alignItems: 'center', width: w - 2, height: w,
                                        justifyContent: 'center', margin: 2
                                    }} source={{ uri: item.image }} />

                                    <Text style={{ fontSize: 12, color: '#1b1b1b', textAlign: 'center', numberOfLines: 2, margin: 10 }}>{item.name}</Text>
                                    <Text style={{ textAlign: 'center', numberOfLines: 1, color: '#e31515', fontSize: 12 }}>S$ {item.price}</Text>
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

    thumb: {
        width: 60,
        height: 60,
        marginRight: 10
    },
    line1: {
        height: 1,
        backgroundColor: '#dadce2'
    },
    line10: {
        height: 10,
        backgroundColor: '#ebeef1'
    },
    textprimary: {
        fontSize: 18,
        color: '#4a4d52',
    },
    textsecond: {
        fontSize: 18,
        color: '#929aa2',
    },
    textPrice: {
        fontSize: 18,
        color: '#fb7e00',
    },
    marginTop10: {
        marginTop: 15,
    },
    paddingLeftRight: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    scrollSpinner: {
        marginVertical: 20,
    },
    rowSeparator: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height: 10,
    },
    rowSeparatorHide: {
        opacity: 0.0,
    },
    line: {
        height: 1,
        backgroundColor: '#eef0f3',
    },
    row: {
        flexDirection: 'row',
    },
    topView:{
        width:width,
        height:width,
        alignSelf:'stretch'




    },
    toolsView: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    toolsItem: {
        justifyContent: "flex-start",
        alignItems: "center",

    },
    goodsWebView:{

        flexDirection: "column",
        flexWrap: "wrap",


    }
});
