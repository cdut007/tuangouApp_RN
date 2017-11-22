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
    RefreshControl



} from 'react-native';
import Banner from 'react-native-banner';
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar'
import px2dp from '../common/util'
import ProductCatagoryListViewTab from './Product/ProductCategoryListViewTab'
import ProductDetail from './Product/ProductDetail'
import HttpRequest from '../HttpRequest/HttpRequest'
import {CachedImage} from "react-native-img-cache";
import Swiper from 'react-native-swiper';
import Welcome from '../Login/Welcome'
var Global = require('../common/globals');


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
            displayCategoryAry : [],
            selectedImageIndex: 0,
            isRefreshing:false

        };

    }
    onBannerSuccess(response){
        this.state.banners = response.data.images;
        // console.log('BannerSuccess:' + JSON.stringify(response.data));
        this.setState({banners:this.state.banners});
    }

    onProudctListSuccess(response){
        this.state.goodsList = response.data;
        // console.log('ProudctListSuccess:' + this.state.goodsList.length);
        this.setState({goodsList:this.state.goodsList, isRefreshing: false});

    }
    onBannerListSuccess(response){
        this.state.goodsList = response.data;
        console.log('onBannerListSuccess:' + this.state.goodsList.length);
        this.setState({goodsList:this.state.goodsList, isRefreshing: false});

    }
    componentWillReceiveProps(){
        // this.fetchBanner();
        // this.fetchProductList();
    }
    componentWillMount(){
        this.fetchBanner();
        // this.fetchProductList();
        this.fetchBannerList();

    }


    fetchProductList(){
        var paramBody ={ }
        HttpRequest.get('/v1','/home_page_list', paramBody, this.onProudctListSuccess.bind(this),
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

                console.log(' home_page_listerror:' + e)
            })
    }


     fetchBanner(){
         var paramBody ={ }
         HttpRequest.get('/v1','/banner', paramBody, this.onBannerSuccess.bind(this),
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
    fetchBannerList(){
        var paramBody ={ }
        HttpRequest.get('/v2','/api.index.page', paramBody, this.onBannerListSuccess.bind(this),
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

                console.log(' api.index.page:' + e)
            })
    }


    onAnnounceNow() {
        // this.props.navigator.push({
        //     component: NotifyNowView,
        //
        // })
    }





    onRefresh(){

        this.setState({isRefreshing: true});
        setTimeout(() => {
            this.fetchBanner();
            // this.fetchProductList();
            this.fetchBannerList();
        }, 2000);


    }
    render() {
        return (
            <View style={styles.container}>
                {/*<NavBar title="爱邻购" />*/}



                 <ScrollView
                 keyboardDismissMode='on-drag'
                 keyboardShouldPersistTaps={false}
                 showsHorizontalScrollIndicator = {false}
                 showsVerticalScrollIndicator={false}


                 horizontal={false}
                 style={{width:width}}
                 refreshControl={
           <RefreshControl
             refreshing={this.state.isRefreshing}
             onRefresh={this.onRefresh.bind(this)}  //(()=>this.onRefresh)或者通过bind来绑定this引用来调用方法
             tintColor='red'
             title= {this.state.isRefreshing? '刷新中....':'下拉刷新'}
           />
                 }
                 >

                     {this.renderTopView()}
                     {this.renderCategoryBannerView()}
                 {/*{this.renderProductCategoryView()}*/}
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

    renderSwiperImageView(imageArr,imageNum){
        var displayViewArr =[];

        for (var i = 0 ;i <imageNum ; i++){
            displayViewArr.push(  <CachedImage source={{uri:imageArr[i].image}} style={{width: width,
        height: 200,resizeMode: 'cover'}} />)
        }
        return displayViewArr;

    }
    renderTopView() {





        var errorInfo = JSON.stringify(this.state.banners);
        console.log("this.state.banners="+errorInfo)
        var imageArr = this.state.banners;
        var imageNum = imageArr.length;
        if (this.state.banners.length == 0) {
            return (
                <View
                    style={styles.topView}
                />

            )
        }else{
            // return (
            //     <Banner
            //         style={styles.topView}
            //         banners={imageArr}
            //         defaultIndex={this.defaultIndex}
            //         onMomentumScrollEnd={this.bannerOnMomentumScrollEnd.bind(this)}
            //         intent={this.bannerClickListener.bind(this)}
            //     />
            //
            //
            // )
            return (
                <View>
                <Swiper
                    style={[styles.topView,{width:width*imageNum}]}
                    height={200}
                    index={0}
                    loop={true}                    //如果设置为false，那么滑动到最后一张时，再次滑动将不会滑到第一张图片。
                    autoplay={true}                //自动轮播
                    horizontal={true} //水平方向，为false可设置为竖直方向
                    paginationStyle={{bottom: 20}}
                    showsButtons={false}
                    autoplayTimeout={4}                //每隔4秒切换
                                  >


                    {this.renderSwiperImageView(imageArr,imageNum)}



                </Swiper>
                <View style={{alignItems:'center',marginTop:10}}>
                    <Text style={{color:'rgb(220,90,25)',fontFamily:'PingFangSC-Regular',fontSize:24,textAlign:'center'}}>【爱邻购】</Text>
                    <Text style={{color:'rgb(220,90,25)',fontFamily:'PingFangSC-Regular',fontSize:18,textAlign:'center',marginBottom:15}}>选择商品类别，点击申请接龙</Text>
                </View>
                </View>
            )
        }
    }

    onItemClick(prouduct){
        // console.log('prouduct :' +JSON.stringify(prouduct))
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
             // if (Global.wxUserInfo){
             //
             //
             // }else {
             //     this.props.navigator.resetTo({
             //         component: Welcome,
             //         name: 'Welcome'
             //     })
             // }

        }
    }
    onBannerClick(prouduct){
        console.log('prouduct :' +JSON.stringify(prouduct))

            this.props.navigator.push({
                component: ProductCatagoryListViewTab,
                props: {
                    prouduct:prouduct,
                }
            })
            // if (Global.wxUserInfo){
            //
            //
            // }else {
            //     this.props.navigator.resetTo({
            //         component: Welcome,
            //         name: 'Welcome'
            //     })
            // }


    }

    renderItemSpaceLine(index){
        if (index == 0) {
            return
        }
        return (<View style={{backgroundColor:"#f2f2f2",height:10,flex:1}}></View>)
    }
    renderCategoryBannerView(){
        var categoryDataAry = [];
        var displayCategoryAry = [];

        // console.log( ' this.state.goodsList.length === '+ this.state.goodsList.length);
        for (var i = 0; i < this.state.goodsList.length; i ++) {
            // console.log( ' this.state.goodsList.i === '+ i);

            var classify = this.state.goodsList[i];
            // var goodsMaxLengh = goods.length > 6 ? 6: goods.length;


            categoryDataAry.push({
                'index': classify.classify_id,
                'image': {uri:classify.image},
                'title':classify.name,
                'icon':classify.icon

            });
            // console.log(goodsMaxLengh+ ' toolsData max length === '+toolsData.length+";type name"+ classify.name);




        }



        for (var j = 0; j<categoryDataAry.length; j++) {
            var item = categoryDataAry[j]
            displayCategoryAry.push(
                <View>
                    {this.renderItemSpaceLine(j)}


                    <TouchableOpacity onPress={this.onBannerClick.bind(this,item)}>

                        <Image style={{resizeMode:'contain',width: width, height: 150}} source={item.image}></Image>
                    </TouchableOpacity>




                </View>
            );
        }
        // if (categoryDataAry.length >3 ){
        //     displayCategoryAry.push(<View style={{color:'#686868',backgroundColor:'#f2f2f2',height:54,flex:1,justifyContent:'center',alignItems:'center'}}>
        //         <Text style={{fontSize:12,color:'#686868',backgroundColor:'#f2f2f2',textAlign:'center',justifyContent:'center',alignItems:'center'}}>拉不动了...</Text>
        //     </View>);
        // }



        return displayCategoryAry;
    }
    renderProductCategoryView() {

        var categoryDataAry = [];
        var displayCategoryAry = [];

        // console.log( ' this.state.goodsList.length === '+ this.state.goodsList.length);
        for (var i = 0; i < this.state.goodsList.length; i ++) {
            // console.log( ' this.state.goodsList.i === '+ i);
            var goods = this.state.goodsList[i].goods;
            var classify = this.state.goodsList[i].classify;
            var goodsMaxLengh = goods.length > 6 ? 6: goods.length;
            var toolsData = [];
            for (var j = 0; j < goodsMaxLengh; j++) {
                // console.log( ' goodsMaxLengh.length === '+ j);
                var product = goods[j];
                if (i == 1 && j == 0){
                    // console.log( ' product i1 j0 === '+ JSON.stringify(product));

                }
                // console.log( ' product === '+ product);
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
            // console.log(goodsMaxLengh+ ' toolsData max length === '+toolsData.length+";type name"+ classify.name);


            categoryDataAry.push({id:classify.id,name:classify.name,image:{uri:classify.icon} ,desc:classify.desc ,prouductItems:toolsData,countdown:'48:38:29'},);
            if(i == 1){
                // console.log('categoryNum1:' +JSON.stringify(categoryDataAry.length));
            }else {

                // console.log('categoryNum0:' +JSON.stringify(categoryDataAry.length));
            }
        }



            for (var i = 0; i<categoryDataAry.length; i++) {
                // console.log( ' displayCategoryAry.length === '+ i);
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
        return(<View style={{opacity:1, position:'absolute',left:0,top:h -30,alignItems:'center',flex:1,width: w, height: 30 ,
        justifyContent:'center',backgroundColor:'#rgb(234,107,16)'}}
        needsOffscreenAlphaCompositing={true}
        >
        <Text needsOffscreenAlphaCompositing={true} style={{opacity:1,alignItems:'center',justifyContent:'center',fontSize: 18,fontWeight:'bold', color: "#ffffff",fontFamily:'PingFangSC-Regular'}}>{item.title}</Text>
        </View>)
    }

    renderCategorysView(prouductItems) {
        const w = (width-30)/3, h = w


        let renderSwipeView = (types, n) => {
            return (
                <View style={[styles.toolsView]}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h }, styles.toolsItem]}>

                                    <CachedImage style={{resizeMode:'contain',width: w, height: h,
                                    flex:1}} source={item.image}/>
                                     {this.renderMoreInfo(item,w,h)}
                                </View>
                            )
                            return (
                                <TouchableOpacity style={{ width: w+6, height: h+10 }} key={i} onPress={() => { this.onItemClick(item) }}>{render}</TouchableOpacity>
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
        height: 200,
        width:width,
        // alignSelf:'stretch'
    },




    row: {
        justifyContent: 'center',
        padding: 1,
        margin: 5,
        width: (width - 20) / 2,
        height: 220,
        backgroundColor: '#F6F6F6',
        alignItems: 'center',
        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: '#CCC'
    },

    countdownContainer:
    {
        marginTop: 20,
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
        alignItems: 'baseline',
        marginLeft:2



    },
    toolsItem: {







    },
});



