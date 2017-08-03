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
import NavBar from '../common/NavBar'
import px2dp from '../common/util'
import CommitButton from '../common/CommitButton'
import GroupBuyCar from './GroupBuyCar'
import Welcome from '../Login/Welcome'
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var hasGotGbDetail = false
var Global = require('../common/globals');


import LoginView from '../Login/LoginView'
import HttpRequest from '../HttpRequest/HttpRequest'


export default class ProductDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            banners: [],
            goods: {goods: {images: [{image: ''}, {desc: ''}]}},//defualt image later
            gbDetail: {classify: {name: '', icon: ''}, group_buy_goods: []}
        }
    }


    onItemClick(prouduct) {
        this.props.navigator.replace({
            component: ProductDetail,
            props: {
                prouduct:{
                    'index': prouduct.id,
                    'image': {uri:prouduct.goods.images[0].image},
                },
            }
        })

    }

    componentDidMount() {
        var prouduct = this.props.prouduct;
        hasGotGbDetail = false

        this.setState({
            goods: {goods: {images: [{image: ''}, {desc: ''}]}}

        });
        this._fetchGoods(prouduct.index);
    }

    _fetchGoods(spec_id) {

        var paramBody = {goods: spec_id}
        console.log('_fetchGoodsspec_id:' + spec_id)
        HttpRequest.get('/goods_detail', paramBody, this.onProudctDetailSuccess.bind(this),
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
        this.setState({
            goods: response.data,
            banners: response.data.goods.images
        })

        var paramBody = {group_buy: response.data.group_buy}
        HttpRequest.get('/group_buy_detail', paramBody, this.onGroupBuyDetailSuccess.bind(this),
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


    onGroupBuyDetailSuccess(response) {
        hasGotGbDetail = true
        this.setState({
            gbDetail: response.data
        })
    }

    clickBack() {
        this.props.navigator.pop()
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title="商品详情"
                        leftIcon={require('../images/back.png')}
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

        if (Global.wxUserInfo){

            this.props.navigator.push({
                component: GroupBuyCar,
                props: {
                    showBack: true,
                }
            })
        }else {
            this.props.navigator.resetTo({
                component: Welcome,
                name: 'Welcome'
            })
        }

    }

    renderBannerView() {
        if (this.state.banners.length > 0) {
            console.log('ProductDetailBanners' + JSON.stringify(this.state.banners))
            return (
                <View style={styles.topView}>

                    <Banner style={styles.topView}
                            banners={this.state.banners}
                            defaultIndex={this.defaultIndex}
                            onMomentumScrollEnd={this.bannerOnMomentumScrollEnd.bind(this)}
                            intent={this.bannerClickListener.bind(this)}>


                    </Banner>

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

        var goodsRecommendItems = this.state.gbDetail.group_buy_goods
        var goodsDetailImages = goods.goods.desc;
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

                        <Text style={{ flex: 1, color: '#1c1c1c', fontSize: 18, margin: 10 }}>{goods.goods.name}</Text>
                        <View style={{
                            alignItems: 'center', flexDirection: 'row',
                            justifyContent: 'flex-start', margin: 10,
                            flex: 1
                        }}>
                            <Text
                                style={{ alignItems: 'center', textAlign: 'left', justifyContent: 'flex-start', numberOfLines: 1, color: '#e31515', fontSize: 20, }}>S$ {goods.price}</Text>
                            <Text style={{
                                alignItems: 'center', marginLeft: 10, flex: 7,
                                justifyContent: 'center', numberOfLines: 1, color: '#757575', fontSize: 12
                            }}>{goods.brief_dec}</Text>
                            <Text style={{
                                alignItems: 'center', marginLeft: 10, flex: 2,
                                justifyContent: 'flex-end', numberOfLines: 1, color: '#757575', fontSize: 12
                            }}>库存 {goods.stock}</Text>
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
                            }} source={{ uri: this.state.gbDetail.classify.icon }}/>
                            <Text style={{ fontSize: 16, color: '#1b1b1b' }}>
                                {this.state.gbDetail.classify.name}

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

             return ( <View style={styles.goodsWebView}>
                <WebView  style={{width:width,height:h*2.5,maxWidth:width}}
                         source={{html:goodsDetailImages}}

                          scalesPageToFit={true}
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

                                    <CachedImage style={{
                                        resizeMode: 'cover', alignItems: 'center', width: w - 2, height: w,
                                        justifyContent: 'center', margin: 2
                                    }} source={{ uri: item.goods.images[0].image }} />

                                    <Text style={{ fontSize: 12, color: '#1b1b1b', textAlign: 'center', numberOfLines: 2, margin: 10 }}>{item.goods.name}</Text>
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
        height:230,
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
