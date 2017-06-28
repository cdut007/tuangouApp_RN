import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    AsyncStorage,
    Platform
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
        if (isFirstTime) {
            markSuccess()
        }
        else if (isRolledBack) {

        }
    }


    componentDidMount() {
        WeChat.registerApp('wx22795e8274245d59')
    }

    doUpdate = info => {
        downloadUpdate(info).then(hash => {
            Alert.alert('提示', '应用数据,是否重启应用?', [
                { text: '是', onPress: () => { switchVersion(hash); } },
                { text: '下次启动时', onPress: () => { switchVersionLater(hash); } },
            ]);
        }).catch(err => {
            // Alert.alert('提示', '更新失败.');
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
                this.doUpdate(info)
                console.log('检查到新的版本')
            }
        }).catch(err => {
            // Alert.alert('提示', '更新失败.');
            console.log('检查更新失败')
        });
    };

    getHasLogin() {
        var me = this


        AsyncStorage.getItem('k_http_token', function (errs, result) {
            if (!errs && result && result.length) {
                Global.token = result
                me.setState({ hasLogin: true })

                console.log('get k_http_token:' + result)


                HttpRequest.get('/user_address', {}, me.onGetAddressSuccess.bind(me),
                    (e) => {
                        console.log(' error:' + e)
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

    render() {
        if (this.state.hasLogin == null) {
            return (<View />)
        }

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
