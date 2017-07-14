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
    SectionList
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
            goodsList:[],
        };
    }
    onBannerSuccess(response){
        this.state.banners = response.data.images;
        console.log('BannerSuccess:' + JSON.stringify(response.data));
        this.setState({banners:this.state.banners});
    }

    onProudctListSuccess(response){
        this.state.goodsList = response.data;
        console.log('ProudctListSuccess:' + JSON.stringify(response));
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
                <NavBar title="爱邻购" />
                {/*<SectionList*/}
                    {/**/}
                    {/*ListHeaderComponent = {this.renderHeader}*/}
                    {/*renderItem =  {this.renderItem}*/}
                    {/*showsVerticalScrollIndicator={false}*/}
                    {/*sections = {[*/}
                    {/*{data: ['cell1','cell2','cell3','cell4','cell5','cell6'], key: 'section1'},*/}
                    {/*{data: ['cell1','cell2','cell3','cell4','cell5','cell6'], key: 'section2'},*/}
                    {/*{data: ['cell1','cell2','cell3','cell4','cell5','cell6'], key: 'section3'},*/}
                {/*]}*/}
                    {/*contentContainerStyle={styles.list}//设置cell的样式*/}
                    {/*pageSize={6}  // 配置pageSize确认网格数量*/}
                {/*/>*/}

                {/*<ListView*/}
                    {/*renderHeader={this.renderHeader}*/}
                    {/*contentContainerStyle={styles.list}*/}
                    {/*dataSource={this.state.dataSource}*/}
                    {/*initialListSize={21}*/}
                    {/*pageSize={10}*/}
                    {/*scrollRenderAheadDistance={500}*/}
                    {/*renderRow={this.renderItem}*/}
                    {/*removeClippedSubviews={false}*/}

                {/*/>*/}
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



        for (var i = 0; i < this.state.goodsList.length; i++) {
            var goods = this.state.goodsList[i].goods
            var classify = this.state.goodsList[i].classify
            var goodsMaxLengh = goods.length > 6 ? 6: goods.length;
            var toolsData = [];
            for (var i = 0; i < goodsMaxLengh; i++) {
                var product = goods[i]
                if (i == goodsMaxLengh -1 ) {
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

            categoryDataAry.push({id:classify.id,name:classify.name,image:{uri:classify.icon} ,prouductItems:toolsData,countdown:'48:38:29'},);

        }

            for (var i = 0; i<categoryDataAry.length; i++) {
                displayCategoryAry.push(
                        <View>
                        {this.renderItemSpaceLine(i)}
                        <View style={{margin:5}}>
                        <View style = {styles.brandLabelContainer}>
                            <Image style={{resizeMode:'contain', marginRight:5,alignItems:'center',width:30,height:30,
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
                            </Text>
                        </View>
                        </View>
                        </View>
                        </View>
            );
            }
            if (categoryDataAry.length>3) {
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
        height: 150,
        width: width,
    },
    list:
    {
        flex: 1,
        flexDirection: 'row',//设置横向布局
        flexWrap: 'wrap',  //设置换行显示
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF'
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
        width: width - 220,
        // borderColor: '#e31515',
        // borderWidth:1,
        // borderRadius: 5,
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
