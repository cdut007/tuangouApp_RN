import React,{Component} from 'react';
import HttpRequest from '../HttpRequest/HttpRequest'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    AsyncStorage,
    Image
} from 'react-native';
import Dimensions from 'Dimensions';
import LoginView from './LoginView'
import RegisterView from './RegisterView'
import TabView from '../Main/TabView'
import * as WeChat from 'react-native-wechat';

var width = Dimensions.get('window').width;
var index;
export default class Welcome extends Component
{
    constructor(props)
    {
        super(props)
        index = this.props.index;
    }
    state =
    {

    }


    onLoginPress()
    {
        WeChat.sendAuthRequest('snsapi_userinfo','1111111').then(res=>{
            console.log('log result='+res);
        })

        this.props.navigator.resetTo({
            component: TabView,
            name: 'MainPage'
        })
    }

    onRegiserPress()
    {
        this.props.navigator.push({
            component: RegisterView,
        })
    }

    render()
    {
        return (
            <View style = {styles.rootcontainer}>
            <Image style={{resizeMode:'contain', alignItems:'center',
            marginTop: 120,
            justifyContent:'center'}}
            source={require('../images/logo_icon.png')}/>
            <Text style={{alignItems:'center',marginTop: 5,
            color: '#dc6917',
            fontSize:16,
            justifyContent:'center',
            letterSpacing:5,
            flex:1}} >
            用 心 为 您 精 挑 细 选
            </Text>


            <TouchableOpacity onPress={this.onLoginPress.bind(this)}
                style={styles.loginButton}>
            <View style = {styles.logincontainer}>
                <Image style={{resizeMode:'contain', alignItems:'center',
      justifyContent:'center',
      flex:1}} source={require('../images/login_wechat.png')}/>
                <Text style={[styles.loginText,{marginTop:5}]} >
                    微信登录
                </Text>
                </View>
            </TouchableOpacity>


            </View>
        )
    }
}

const styles = StyleSheet.create(
    {

        buttonText:{
                    color: '#ffffff',
                    fontSize:45,
                    fontWeight:'bold',
                    alignSelf:'center',
                    justifyContent: 'center',
                    alignItems: 'center',
            },
        logo: {
        marginTop: 20,
        alignSelf:'center',
        height: 100,
        width: 100,
        resizeMode: Image.resizeMode.contain,
    },
        logincontainer:
        {
            flexDirection:'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },

        rootcontainer:
        {
            flex: 1,
            flexDirection:'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: '#ebebeb',
        },

        loginText:
        {
            color: '#8dc81b',
            fontSize:14,
        },
        labelText:
        {
            marginTop: 70,
            color: '#ffffff',
            fontSize:45,
            backgroundColor: '#00000000'
        },

        loginButton:
        {
            margin: 30,
            height:100,
            width: width/2 - 40,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems:'center',
        },
});
