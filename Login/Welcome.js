import React, { Component } from 'react';
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

var Global = require('../common/globals');
var width = Dimensions.get('window').width;
var index;
export default class Welcome extends Component {
    constructor(props) {
        super(props)
        index = this.props.index;
    }
    state =
    {

    }


    onLoginPress() {
        WeChat.sendAuthRequest('snsapi_userinfo', '63a7a33c0b5b75d1f44b8edb7a4ea7cd').then(res => {
            console.log('wx login result=' + JSON.stringify(res));

            if (res.errCode == 0) {
                AsyncStorage.setItem('k_wx_auth_info', JSON.stringify(res), (error, result) => {
                    if (error) {
                        console.log('save k_wx_auth_info faild.')
                    }
                })
                Global.wxAuth = res;
                this.onGetWxToken(res.appid, res.code)
            }
            else {
                alert('Login faild, please try again.')
            }
        })
    }

    onRegiserPress() {
        this.props.navigator.push({
            component: RegisterView,
        })
    }

    onGetWxToken(appid, code) {
        let url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + '&secret=63a7a33c0b5b75d1f44b8edb7a4ea7cd&code=' + code + '&grant_type=authorization_code'
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.text())
            .then((responseText) => {
                console.log("responseText:" + responseText);
                var response = JSON.parse(responseText);
                Global.wxToken = response;

                AsyncStorage.setItem('k_wx_token_info', responseText, (error, result) => {
                    if (error) {
                        console.log('save k_wx_token_info faild.')
                    }
                })

                this.onGetWxUserInfo(response.access_token, response.openid)
            })
            .catch(function (err) {
                console.log('get wx token error:' + err)
                alert('Login faild, please try again.')
            });
    }

    onGetWxUserInfo(token, openid) {
        let url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + token + '&openid=' + openid
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.text())
            .then((responseText) => {
                console.log("responseText:" + responseText);
                var response = JSON.parse(responseText);
                Global.wxUserInfo = response;

                AsyncStorage.setItem('k_wx_user_info', responseText, (error, result) => {
                    if (error) {
                        console.log('save k_wx_user_info faild.')
                    }
                })

                this.onLoginWithWxInfo(response)
            })
            .catch(function (err) {
                console.log('get wx token error:' + err)
                alert('Login faild, please try again.')
            });
    }

    onLoginWithWxInfo(userInfo) {
        HttpRequest.post('/user', userInfo, this.onLoginSuccess.bind(this),
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
                alert('Login faild, please try again.')
            })
    }

    onLoginSuccess(response) {

        console.log('login success'+JSON.stringify(response))
        AsyncStorage.setItem('k_http_token', response.data.token, (error, result) => {
            if (error) {
                console.log('save k_http_token faild.')
            }
        })

        Global.token = response.data.token

        this.props.navigator.resetTo({
            component: TabView,
            name: 'MainPage'
        })
    }

    render() {
        return (
            <View style={styles.rootcontainer}>
                <Image style={{
                    resizeMode: 'contain', alignItems: 'center',
                    marginTop: 120,
                    justifyContent: 'center'
                }}
                    source={require('../images/logo_icon.png')} />
                <Text style={{
                    alignItems: 'center', marginTop: 5,
                    color: '#dc6917',
                    fontSize: 16,
                    justifyContent: 'center',
                    letterSpacing: 5,
                    flex: 1
                }} >
                    用 心 为 您 精 挑 细 选
            </Text>


                <TouchableOpacity onPress={this.onLoginPress.bind(this)}
                    style={styles.loginButton}>
                    <View style={styles.logincontainer}>
                        <Image style={{
                            resizeMode: 'contain', alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1
                        }} source={require('../images/login_wechat.png')} />
                        <Text style={[styles.loginText, { marginTop: 5 }]} >
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

        buttonText: {
            color: '#ffffff',
            fontSize: 45,
            fontWeight: 'bold',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
        },
        logo: {
            marginTop: 20,
            alignSelf: 'center',
            height: 100,
            width: 100,
            resizeMode: Image.resizeMode.contain,
        },
        logincontainer:
        {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },

        rootcontainer:
        {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: '#ebebeb',
        },

        loginText:
        {
            color: '#8dc81b',
            fontSize: 14,
        },
        labelText:
        {
            marginTop: 70,
            color: '#ffffff',
            fontSize: 45,
            backgroundColor: '#00000000'
        },

        loginButton:
        {
            margin: 30,
            height: 100,
            width: width / 2 - 40,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
