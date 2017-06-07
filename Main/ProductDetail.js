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

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import LoginView from '../Login/LoginView'


export default class ProductDetail extends Component {
    constructor(props) {
        super(props)
        this.state={
            goods:{description:''}
        }
    }


    onItemClick(prouduct){

    }


    renderProductView() {
         var categoryDataAry = [];
         var displayCategoryAry = [];

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




    componentDidMount() {
        var prouduct = this.props.prouduct;
        this.setState({
          goods: prouduct,
        });
        this._fetchGoods(prouduct.spec_id);
    }

    _fetchGoods(spec_id) {

    var thiz = this;
    // Util.post(API.GOODSDETAIL,{'spec_id':spec_id},function (ret){
    //   if(ret.code==0){
    //     thiz.setState({
    //       goods: ret.data,
    //     });
    //   }else{
    //     alert(ret.msg);
    //   }
    // });
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

    renderProductDetailView() {
        var goods = this.state.goods;
        // if(!goods){
        //     return <Loading loadingtext='正在加载商品...'/>
        // }
        var htmlContent = goods.description||"";
        return (
            <ScrollView>
                <View style={styles.container}>
                    {/* <Image
                        style={{width:Util.size.width,height:490}}
                        source={{uri: goods.default_image}}
                        /> */}
                    {/* <Text style={[styles.textprimary,styles.paddingLeftRight,styles.marginTop10]}>商品名称：{goods.goods_name}</Text>
                    <Text style={[styles.textPrice,styles.paddingLeftRight,styles.marginTop10]}>倍全价：{goods.shichang}</Text>
                    <View style={[styles.line1,styles.marginTop10]}/>
                    <Text style={[styles.textsecond,styles.paddingLeftRight,styles.marginTop10]}>品牌：{goods.brand}</Text>
                    <View style={[styles.line10,styles.marginTop10]}/>
                    <Text style={[styles.textprimary,styles.paddingLeftRight,styles.marginTop10]}>商品图文详情</Text>
                    <Text style={[styles.textprimary,styles.paddingLeftRight,styles.marginTop10]}>{htmlContent}</Text> */}
                    {/* <HTMLView
                        value={htmlContent}
                        style={styles.container}
                      /> */}
                </View>
            </ScrollView>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
        backgroundColor:'#f9f9f9',
        marginBottom:100,
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
    textprimary:{
        fontSize:18,
        color:'#4a4d52',
    },
    textsecond:{
        fontSize:18,
        color:'#929aa2',
    },
    textPrice:{
        fontSize:18,
        color:'#fb7e00',
    },
    marginTop10:{
        marginTop:15,
    },
    paddingLeftRight:{
        paddingLeft:10,
        paddingRight:10,
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
    line:{
        height:1,
        backgroundColor: '#eef0f3',
    },
    row: {
        flexDirection: 'row',
    },
});
