import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    AsyncStorage,
    Platform,
    Alert
} from 'react-native';

import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
} from 'react-native-update';


import Navigation from '../common/Navigation';
import TabNavigator from 'react-native-tab-navigator';
import TabView from './TabView'
import WelcomeView from '../Login/Welcome'
import * as WeChat from 'react-native-wechat';
import HttpRequest from '../HttpRequest/HttpRequest'

var Global = require('../common/globals');

import _updateConfig from '../update.json';
const {appKey} = _updateConfig[Platform.OS];

export default class MainView extends Component {

    constructor(props) {
        super(props)

        this.state = {
            hasGotLogin: false,
            hasLogin: null
        }
        this.getHasLogin()
    }

    componentWillMount() {
        // this.onLoginPress()
        console.log('checkUpdate111')
        if (isFirstTime) {
            markSuccess()
            console.log('checkUpdate112')
        }
        else if (isRolledBack) {

        }
    }


    componentDidMount() {
        WeChat.registerApp('wx22795e8274245d59')
        console.log('checkUpdate113')
        this.checkUpdate()

    }

    doUpdate = info => {
        downloadUpdate(info).then(hash => {
            Alert.alert('提示', '下载完毕,是否重启应用?', [
                { text: '是', onPress: () => { switchVersion(hash); } },
                { text: '下次启动时', onPress: () => { switchVersionLater(hash); } },
            ]);
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
            console.log('下载更新失败')
        });
    };

    checkUpdate = () => {
        checkUpdate(appKey).then(info => {
            console.log('checkUpdate:' + JSON.stringify(info))
            if (info.expired) {
                // Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
                //     { text: '确定', onPress: () => { info.downloadUrl && Linking.openURL(info.downloadUrl) } },
                // ]);
                console.log('应用版本已更新,请前往应用商店下载新的版本.')
            } else if (info.upToDate) {
                // Alert.alert('提示', '您的应用版本已是最新.');
                console.log('应用版本已是最新.')
            } else {
                // Alert.alert('提示', '检查到新的版本' + info.name + ',是否下载?\n' + info.description, [
                //     { text: '是', onPress: () => { this.doUpdate(info) } },
                //     { text: '否', },
                // ]);
                // this.doUpdate(info)
                console.log('检查到新的版本')
            }
        }).catch(err => {
            // Alert.alert('提示', '更新失败.');
            console.log('检查更新失败')
        });
    };

    // onLoginPress() {
    //     WeChat.sendAuthRequest('snsapi_userinfo', '63a7a33c0b5b75d1f44b8edb7a4ea7cd').then(res => {
    //         console.log('wx login result=' + JSON.stringify(res));
    //
    //         if (res.errCode == 0) {
    //             AsyncStorage.setItem('k_wx_auth_info', JSON.stringify(res), (error, result) => {
    //                 if (error) {
    //                     console.log('save k_wx_auth_info faild.')
    //                 }
    //             })
    //             Global.wxAuth = res;
    //             this.onGetWxToken('wx22795e8274245d59', res.code)
    //         }
    //         else {
    //             alert('Login faild, please try again.1')
    //         }
    //     })
    // }
    // onGetWxToken(appid, code) {
    //     let url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + '&secret=63a7a33c0b5b75d1f44b8edb7a4ea7cd&code=' + code + '&grant_type=authorization_code'
    //
    //     fetch(url, {
    //         method: 'GET',
    //     })
    //         .then((response) => response.text())
    //         .then((responseText) => {
    //             console.log("responseText2:" + responseText);
    //             var response = JSON.parse(responseText);
    //             Global.wxToken = response;
    //
    //             AsyncStorage.setItem('k_wx_token_info', responseText, (error, result) => {
    //                 if (error) {
    //                     console.log('save k_wx_token_info faild.')
    //                 }
    //             })
    //
    //             this.onGetWxUserInfo(response.access_token, response.openid)
    //         })
    //         .catch(function (err) {
    //             console.log('get wx token error:' + err)
    //             alert('Login faild, please try again.2')
    //         });
    // }

    // onGetWxUserInfo(token, openid) {
    //     let url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + token + '&openid=' + openid
    //     fetch(url, {
    //         method: 'GET',
    //     })
    //         .then((response) => response.text())
    //         .then((responseText) => {
    //             console.log("responseText3:" + responseText);
    //             var response = JSON.parse(responseText);
    //             Global.wxUserInfo = response;
    //
    //             AsyncStorage.setItem('k_wx_user_info', responseText, (error, result) => {
    //                 if (error) {
    //                     console.log('save k_wx_user_info faild.')
    //                 }
    //             })
    //
    //             this.onLoginWithWxInfo(response)
    //         })
    //         .catch(function (err) {
    //             console.log('get wx token error:' + err)
    //             alert('Login faild, please try again.3')
    //         });
    // }

    // onLoginWithWxInfo(userInfo) {
    //     HttpRequest.post('/user', userInfo, this.onLoginSuccess.bind(this),
    //         (e) => {
    //             try {
    //                 var errorInfo = JSON.parse(e);
    //                 console.log(errorInfo.description)
    //                 if (errorInfo != null && errorInfo.description) {
    //                     console.log(errorInfo.description)
    //                 } else {
    //                     console.log(e)
    //                 }
    //             }
    //             catch (err) {
    //                 console.log(err)
    //             }
    //
    //             console.log(' error:' + e)
    //             alert('Login faild, please try again.4')
    //         })
    // }
    // onLoginSuccess(response) {
    //
    //     console.log('login success'+JSON.stringify(response))
    //     console.log('login successToken:'+response.data.token)
    //     AsyncStorage.setItem('k_http_token',response.data.token, (error, result) => {
    //
    //         if (error) {
    //             console.log('save k_http_token faild.')
    //         }else {
    //             console.log('save k_http_token result:'+result)
    //         }
    //     })
    //
    //     Global.token = response.data.token
    //
    //     this.props.navigator.resetTo({
    //         component: TabView,
    //         name: 'MainPage'
    //     })
    //     // HttpRequest.get('/user', {}, this.onGetUserInfoSuccess.bind(this),
    //     //     (e) => {
    //     //         console.log(' usererror:' + e)
    //     //     })
    //
    //
    // }
    onGetUserInfoSuccess(response) {
        Global.user_profile = response.data.user_profile
        Global.agent_url = response.data.user_profile.agent_url
        Global.nickname = response.data.user_profile.nickname
        Global.headimgurl =response.data.user_profile.headimgurl
        console.log('Global.user_profile :'+JSON.stringify(Global.user_profile))

        this.props.navigator.resetTo({
            component: TabView,
            name: 'MainPage'
        })
    }
    getHasLogin() {
        var me = this


        AsyncStorage.getItem('k_http_token', function (errs, result) {
            if (!errs && result && result.length) {
                Global.token = result
                me.setState({ hasLogin: true })




                HttpRequest.get('/v1','/user_address', {}, me.onGetAddressSuccess.bind(me),
                    (e) => {

                    })
                HttpRequest.get('/v1','/user', {}, me.onGetUserInfoSuccess.bind(me),
                    (e) => {
                        // alert.log(' usererror:' + e)
                    })
            }
            else {
                me.setState({ hasLogin: false })
                console.log('get k_http_token faild')
            }
        });

        AsyncStorage.getItem('k_wx_auth_info', function (errs, result) {
            if (!errs && result) {
                Global.wxAuth = JSON.parse(result)

                console.log('get k_wx_auth_info:' + result)
            }
            else {
                console.log('get k_wx_auth_info faild')
            }
        });


        AsyncStorage.getItem('k_wx_token_info', function (errs, result) {
            if (!errs && result) {
                Global.wxToken = JSON.parse(result)
                console.log('get k_wx_token_info:' + result)
            }
            else {
                console.log('get k_wx_token_info faild')
            }
        });


        AsyncStorage.getItem('k_wx_user_info', function (errs, result) {
            if (!errs && result) {
                Global.wxUserInfo = JSON.parse(result)
                console.log('get k_wx_user_info:' + result)
            }
            else {
                console.log('get k_wx_user_info faild')
            }
        });


        AsyncStorage.getItem('k_login_info', function (errs, result) {
            if (!errs && result && result.length) {
                Global.id = JSON.parse(result).id;
                console.log('local user id:' + Global.id)
            }
            else {

            }
        });

        AsyncStorage.getItem('k_cur_gbdetail', function (errs, result) {
            if (!errs && result && result.length) {
                Global.gbDetail = JSON.parse(result)
            }
            else {
                console.log('get k_cur_gbdetail faild')
            }
        });


    }

    onGetAddressSuccess(response) {
        Global.user_address = response.data.user_address
    }
    onGetUserInfoSuccess(response) {
        Global.user_profile = response.data.user_profile
        Global.agent_url = response.data.user_profile.agent_url
        Global.nickname = response.data.user_profile.nickname
        Global.headimgurl =response.data.user_profile.headimgurl
        console.log('Global.user_profile :'+JSON.stringify(Global.user_profile))

    }

    render() {
        if (this.state.hasLogin == null) {
            return (<View />)
        }
        return (
            <Navigator
                initialRoute={{ component: TabView, name: "MainPage" }}
                configureScene={() => Navigator.SceneConfigs.FloatFromRight}
                renderScene={(route, navigator) => {
                        return <route.component navigator={navigator} {...route.props} />
                    }
                    }
            />
        )
         if (this.state.hasLogin) {
            return (
                <Navigator
                     initialRoute={{ component: TabView, name: "MainPage" }}
                     configureScene={() => Navigator.SceneConfigs.FloatFromRight}
                    renderScene={(route, navigator) => {
                        return <route.component navigator={navigator} {...route.props} />
                    }
                     }
                 />
             )
         }
         else {
             return (
                 <Navigator
                    initialRoute={{ component: WelcomeView, name: "WelcomePage", index: this.props.index }}
                     configureScene={() => Navigator.SceneConfigs.FloatFromRight}
                     renderScene={(route, navigator) => {
                        return <route.component navigator={navigator} {...route.props} />
                     }
                    }
                />
            )
         }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
