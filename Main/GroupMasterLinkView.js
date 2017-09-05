import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    Picker,
    AsyncStorage,
    TextInput,
    Clipboard,
    Alert
} from 'react-native';
var test = false
import NavBar from '../common/NavBar'
import Dimensions from 'Dimensions'
import Welcome from '../Login/Welcome'
var  WeChat = require('react-native-wechat');
var Global = require('../common/globals');
var width = Dimensions.get('window').width;

export default class GroupMasterLinkView extends Component {
    constructor(props) {
        super(props)
        this.state =  {

            agent_url: '',
            image: '',
            group_buy_info:this.props.group_buy_info
        }
        if (test){
            var pos = Global.agent_url.indexOf("?");
            if (pos!= -1) {
                var str = Global.agent_url.substr(pos+1);
                var agent_code = this.getQueryString('agent_code',str);
                console.log('url agent_code='+agent_code);
                this.state.agent_url = 'http://www.ailinkgo.com/testing/?agent_code='+agent_code
            }

        }else {
            this.state.agent_url = Global.agent_url
        }

    }
    getQueryString(name,url) {
        if (!url) {
            return null
        }
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); // 匹配目标参数
        var result = url.match(reg);  // 对querystring匹配目标参数
        console.log('url result='+url);
        if (result != null) {
            return decodeURIComponent(result[2]);
        } else {
            return null;
        }
    }

    back() {
        this.props.navigator.pop()
        // this.props.navigator.resetTo({
        //     component: Welcome,
        //     name: 'Welcome'
        // })
    }
    _logout_function(){

        //logout here
        this._removeStorage();
        //logout success go 2 call page
        // var routes = this.props.navigator.state.routeStack;
        // for (var i = routes.length - 1; i >= 0; i--) {
        //     if(routes[i].name === "MyDestinationRoute"){
        //     var destinationRoute = this.props.navigator.getCurrentRoutes()[i]
        //     this.props.navigator.popToRoute(destinationRoute);
        //
        //     }
        // }
        this.props.navigator.resetTo({
            component: Welcome,
            name: 'Welcome'
        })
    };
    async _removeStorage() {
        Global.UserInfo = null;
            AsyncStorage.removeItem('k_login_info').then((value) => {

            }
            ).done();

        }

        onCopyPress(){

            Clipboard.setString(this.state.agent_url);
            Alert.alert('提示','链接已复制到剪切板！');
        }

        onSharePress(){
            console.log('onSharePress11'+JSON.stringify(Global.group_buy_info))
            if (Global.group_buy_info!= null){
                WeChat.isWXAppInstalled()
                    .then((isInstalled) => {
                        if (isInstalled){
                            WeChat.shareToSession({
                                type:'news',
                                title:Global.group_buy_info[0].classify_name,
                                description:Global.group_buy_info[0].classify_desc ,
                                webpageUrl:this.state.agent_url,
                                thumbImage: Global.headimgurl,
                            }).cache((error) =>{
                                ToastShort(error.message);
                            });
                        }else {
                            ToastShort('没有安装微信软件，请您安装微信之后再试');

                        }
                    });
            }else {
                WeChat.isWXAppInstalled()
                    .then((isInstalled) => {
                        if (isInstalled){
                            WeChat.shareToSession({
                                type:'news',
                                title:'扑面而来',
                                description:'牛车水扑面而来做新加坡最好吃，最健康的馒头' ,
                                webpageUrl:this.state.agent_url,
                                thumbImage: Global.headimgurl,
                            }).cache((error) =>{
                                ToastShort(error.message);
                            });
                        }else {
                            ToastShort('没有安装微信软件，请您安装微信之后再试');

                        }
                    });
            }



        }


    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="团长链接"
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                <View style={{padding:40,}}>
                   <Text style={{fontSize:14,color:'#a9a9a9',marginTop:10,textAlign:'center',fontFamily:'PingFangSC-Regular'}}>该链接为团长：{Global.nickname}的专属链接</Text>
                    <Text style={{fontSize:14,color:'#a9a9a9',marginTop:0,textAlign:'center',fontFamily:'PingFangSC-Regular'}}>每次申请拼团后直接分享该链接至微信群即可</Text>
                    <Text style={{fontSize:14,color:'#a9a9a9',marginTop:0,textAlign:'center',fontFamily:'PingFangSC-Regular'}}>团员点击链接购买的商品可在拼团中查看 </Text>
                </View>

                    <Text style={{alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:14,color:'#1c1c1c',padding:10,marginTop:10}}>{this.state.agent_url}</Text>
                    <View style={{flex:1,marginTop:50,justifyContent:'center',flexDirection:'row'}}>

                                        <TouchableOpacity style={{
                                            height: 36,
                                            width: 120,
                                            backgroundColor: '#6d9ee1',
                                            borderRadius: 50,
                                            borderColor:'#5590df',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderWidth:0.5,

                                        }}
                                            onPress={this.onCopyPress.bind(this)}
                                        >
                                        <Text style={{color:'#ffffff',fontSize:16, fontFamily:'PingFang-SC-Medium'}}>
                                         复制链接
                                        </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={this.onSharePress.bind(this)} style={{
                                            height: 36,
                                            width: 120,
                                            marginLeft:60,
                                            backgroundColor: '#8dc81b',
                                            borderRadius: 50,
                                            borderColor:'#7db909',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderWidth:0.5,
                                        }}>
                                        <Text style={{color:'#ffffff',fontSize:16,fontFamily:'PingFang-SC-Medium'}}
                                        >
                                         分享链接
                                        </Text>
                                        </TouchableOpacity>
                    </View>
            </View>
        )
    }


}


const styles = StyleSheet.create({

    btnLogout: {
        marginTop: 30,
        height: 50,
        width: width - 20,
        backgroundColor: '#d40000',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
},
logoutText: {
    color: '#ffffff',
    fontSize: 18,
},
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    defaultText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    itemView:
    {
        alignSelf: 'stretch',
        // justifyContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        width: width,
        borderColor: 'gray',
        borderWidth: 0.5,
        flexDirection: 'row',
        backgroundColor: 'white'
    }
})
