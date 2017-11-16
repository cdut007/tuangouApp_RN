/**
 * Created by Arlen_JY on 2017/11/14.
 */

import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import CommitButton from '../../common/CommitButton'
import Dimensions from 'Dimensions';
import CheckBox from 'react-native-checkbox'
import {CachedImage} from "react-native-img-cache";
import NewProductCategoryView from './NewProductCategoryView'
import CategoryProductView from './CategoryProductView'
// import ImagePicker from 'react-native-image-crop-picker';
import HttpRequest from '../../HttpRequest/HttpRequest'
import {
    StyleSheet,
    View,
    Text,
    Alert,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Platform
}   from 'react-native';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

//存放数组
var dataToPost = [];
export default class ProductManager extends Component{
    constructor (props){
        super(props)

        this.state = {
            ProductCategoryArr:[],
            hasProductCategory:false




        }
    }

    back(){

        this.props.navigator.pop();
    }
    componentWillMount(){
        let param = {}

        HttpRequest.get('/v2','/admin.goods.set', param, this.onGetCategorySuccess.bind(this),
            (e) => {
                console.log(' error:' + e);
                Alert.alert('提示','获取商品类别失败，请稍后再试。')
            })


    }
    onGetCategorySuccess(response){
        console.log('onGetCategorySuccess11:'+JSON.stringify(response))
        this.state.ProductCategoryArr = response.data.set_list;
        this.setState({ ...this.state });

    }
    onPressCategoryView(categoryItem){
        // Alert.alert('分类',JSON.stringify(categoryItem))
        // this.props.navigator.push({
        //     component: CategoryProductView
        // })
        this.props.navigator.push({
            component: NewProductCategoryView,
            props: {
                hasSet:true,
                oldSet:'水果'

            }

        })

    }
    renderProductCategory(ProductCategoryArr){


        var displayCategoryAry = [];
        console.log('this.state.orders:'+JSON.stringify(this.state.ProductCategoryArr))
        for (var i = 0 ;i < ProductCategoryArr.length ; i++){
            var categoryItem = ProductCategoryArr[i];

            displayCategoryAry.push(
                <TouchableOpacity onPress={this.onPressCategoryView.bind(this,categoryItem)}>
                    <View style={{ marginTop:10 ,backgroundColor:'white',width:width,height:100,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                        <View style={{flex:100}}>
                            <Image style={{width:80,height:80,marginLeft:10}} source={require('../../images/me_bj.jpg')}></Image>
                        </View>
                        <View style={{flex:300,height:100,flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
                            <Text style={{textAlign:'left',marginTop:10,fontSize:16,fontFamily:'PingFangSC-Regular'}}>
                                {categoryItem.set}
                            </Text>
                            <Text style={{textAlign:'left',marginBottom:10,fontSize:12,fontFamily:'PingFangSC-Regular',color:'rgb(117,117,117)'}}>
                                商品总量：{categoryItem.count}个
                            </Text>
                        </View>




                    </View>
                </TouchableOpacity>
            )
        }





        return displayCategoryAry;
    }
    onPressNewCategoryView(){
        this.props.navigator.push({
            component: NewProductCategoryView,
            props: {
                hasSet:false,
                oldSet:null

            }
        })

    }
    render() {
        if (this.state.ProductCategoryArr.length>0){
            this.state.hasProductCategory = true;
        }else {
            this.state.hasProductCategory = false;
        }
        if (this.state.hasProductCategory){
            return (
                <View style={styles.container}>
                    <NavBar
                        title="商品管理"
                        leftIcon={require('../../images/back.png')}
                        leftPress={this.back.bind(this)} />
                    <TouchableOpacity onPress={this.onPressNewCategoryView.bind(this)}>
                        <View style={{width:width,height:44,backgroundColor:'white',marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                                <Image style={{width:18,height:18,resizeMode:'contain'}} source={require('../../images/addTypeIcon@3x.png')}>

                                </Image>
                                <Text style={{color:'rgb(234,107,16)',textAlign:'center',fontFamily:'PingFangSC-Regular',fontSize:16,marginLeft:10}}>
                                    新建商品类别
                                </Text>
                            </View>

                        </View>
                    </TouchableOpacity>
                    <View style={{justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',}}>
                        <ScrollView
                            keyboardDismissMode='on-drag'
                            keyboardShouldPersistTaps={false}
                            style={{width:width, backgroundColor:'#f2f2f2',height:height-128}}>
                            {this.renderProductCategory(this.state.ProductCategoryArr)}


                        </ScrollView>

                    </View>

                </View>
            )

        }else {
            return (
                <View style={styles.container}>
                    <NavBar
                        title="商品管理"
                        leftIcon={require('../../images/back.png')}
                        leftPress={this.back.bind(this)} />
                    <TouchableOpacity onPress={this.onPressNewCategoryView.bind(this)}>
                        <View style={{width:width,height:44,backgroundColor:'white',marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                                <Image style={{width:18,height:18,resizeMode:'contain'}} source={require('../../images/addTypeIcon@3x.png')}>

                                </Image>
                                <Text style={{color:'rgb(234,107,16)',textAlign:'center',fontFamily:'PingFangSC-Regular',fontSize:16,marginLeft:10}}>
                                    新建商品类别
                                </Text>
                            </View>

                        </View>
                    </TouchableOpacity>
                    <View style={{justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',}}>
                        <View style={{ marginTop:10 ,width:width,height:height-100,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>

                            <View style={{height:100,flexDirection:'column',justifyContent:'center',alignItems:'center',marginBottom:200}}>
                                <Text style={{textAlign:'left',marginTop:10,fontSize:16,fontFamily:'PingFangSC-Regular',color:'rgb(117,117,117)'}}>
                                    请先创建商品类别，再添加商品
                                </Text>
                                <Text style={{textAlign:'left',marginBottom:10,fontSize:16,fontFamily:'PingFangSC-Regular',color:'rgb(117,117,117)'}}>
                                    如：商品类别-水果类；商品-苹果、桃子...
                                </Text>
                            </View>




                        </View>

                    </View>

                </View>
            )




        }



    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        // alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    toolsView: {
        flexDirection: "row",
        // flexWrap: "wrap",
        justifyContent: 'flex-start',
        backgroundColor: '#f2f2f2',
    },
    toolsItem: {
        justifyContent: "flex-start",
        // alignItems: "center",
        backgroundColor:'#f2f2f2'

    },
    brandLabelContainer:
        {
            marginTop: 5,
            marginBottom: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width:width
        },


})