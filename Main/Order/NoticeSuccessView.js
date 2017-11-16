/**
 * Created by Arlen_JY on 2017/11/8.
 */


import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
import HttpRequest from '../../HttpRequest/HttpRequest';
var Global = require('../../common/globals');
var  WeChat = require('react-native-wechat');


import {CachedImage} from "react-native-img-cache";
import {
    StyleSheet,
    View,
    Text,
    Alert,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity
}   from 'react-native';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import moment from 'moment';

export default class NoticeSuccessView extends Component{
    constructor (props){
        super(props)

        this.state = {




        }
    }

    back(){

        this.props.navigator.pop();
    }
    componentWillMount(){


    }
    shareQRImageView(){
        // Alert.alert(
        //     '提示',
        //     '发送通知成功',
        //     [
        //
        //
        //         {text: '确定', onPress: this.onPressUpdateGroup_buyingList.bind(this)},
        //     ],
        //     { cancelable: false }
        // )

        WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled){
                    WeChat.shareToSession({
                        type:'imageUrl',
                        title:'可关注微信公众号',
                        description:'关注可随时接收到货通知' ,
                        imageUrl:'http://www.ailinkgo.com/admin/images/GoodsDetail/2017-11/mn_wo6nM.png'
                    }).cache((error) =>{
                        ToastShort(error.message);
                    });
                }else {
                    ToastShort('没有安装微信软件，请您安装微信之后再试');

                }
            });
    }
    render() {



        return (
            <View style={styles.container}>
                <NavBar
                    title="通知成功"
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)} />

                <View style={{flex:235,backgroundColor:'#ffffff',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <View style={{width:width-200,height:height-400,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                        <Image style={{width:(width-55)/4,height:(width-55)/4}} source={require('../../images/successImg.png')}></Image>
                        <Text style={{fontFamily:'PingFangSC-Regular',fontSize:18,color:'black',marginTop:10,width:(width-55)/4,textAlign:'center'}}>通知成功</Text>
                    </View>

                </View>
                <View style={{flex:368,backgroundColor:'#f2f2f2',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                    <View style={{width:width-200,height:height-400,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity onPress={this.shareQRImageView.bind(this)}>
                            <Image style={{width:width-160,height:width-160}} source={require('../../images/qrCode@2x.png')}></Image>
                        </TouchableOpacity>

                        <Text style={[styles.QrWarnTitle,{marginTop:10}]}>推荐团员关注微信公众号</Text>
                        <Text style={styles.QrWarnTitle}>【爱邻购团购网】</Text>
                        <Text style={styles.QrWarnTitle}>随时接收到货通知，方便及时取货</Text>
                    </View>

                </View>



            </View>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        // alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    QrWarnTitle:{
        fontFamily:'PingFangSC-Regular',
        fontSize:14,
        color:'rgb(117,117,117)',
        width:width-160,
        height:20,
        textAlign:'center'
    }


})