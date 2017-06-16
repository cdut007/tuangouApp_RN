import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    AsyncStorage
} from 'react-native';


import Navigation from '../common/Navigation';
import TabNavigator from 'react-native-tab-navigator';
import TabView from './TabView'
import WelcomeView from '../Login/Welcome'
import * as WeChat from 'react-native-wechat';

var Global = require('../common/globals');

export default class MainView extends Component {

    constructor(props)
    {
        super(props)

        this.state={
            hasGotLogin: false,
            hasLogin: null
        }
        this.getHasLogin()
    }

    componentDidMount(){
        WeChat.registerApp('wx22795e8274245d59')
    }

    getHasLogin()
    {
        var me = this
        AsyncStorage.getItem('k_wx_auth_info',function(errs,result)
        {
            if (!errs && result)
            {
                me.setState({hasLogin: true})
                Global.wxAuth = JSON.parse(result)

                console.log('get k_wx_auth_info:'+result)
            }
            else
            {
                me.setState({hasLogin: false})
                console.log('get k_wx_auth_info faild')
            }
        });


        AsyncStorage.getItem('k_wx_token_info',function(errs,result)
        {
            if (!errs && result)
            {
                Global.wxToken = JSON.parse(result)
                console.log('get k_wx_token_info:'+result)
            }
            else
            {
                console.log('get k_wx_token_info faild')
            }
        });
        

        AsyncStorage.getItem('k_wx_user_info',function(errs,result)
        {
            if (!errs && result)
            {
                Global.wxUserInfo = JSON.parse(result)
                console.log('get k_wx_user_info:'+result)
            }
            else
            {
                console.log('get k_wx_user_info faild')
            }
        });


        AsyncStorage.getItem('k_login_info',function(errs,result)
        {
            if (!errs && result && result.length)
            {
                Global.id = JSON.parse(result).id;
                console.log('local user id:' + Global.id)
            }
            else
            {

            }
        });



    }

    render() {
        if(this.state.hasLogin == null)
        {
            return(<View/>)
        }

        if (this.state.hasLogin)
        {
            return (
                <Navigator
                initialRoute={{component: TabView, name: "MainPage"}}
                configureScene={() => Navigator.SceneConfigs.FloatFromRight}
                renderScene={(route, navigator) => {
                      return <route.component navigator={navigator} {...route.props}/>
                    }
                }
              />
            )
        }
        else {
            return (
                <Navigator
                initialRoute={{component: WelcomeView, name: "WelcomePage", index: this.props.index}}
                configureScene={() => Navigator.SceneConfigs.FloatFromRight}
                renderScene={(route, navigator) => {
                      return <route.component navigator={navigator} {...route.props}/>
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
