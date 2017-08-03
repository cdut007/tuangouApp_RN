import React, { Component } from 'react';
import HttpRequest from '../HttpRequest/HttpRequest'
import {
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    AsyncStorage,
    Image,
    Alert
} from 'react-native';
import Dimensions from 'Dimensions';
import Spinner from 'react-native-loading-spinner-overlay';
import NavBar from '../common/NavBar'
import TabView from '../Main/TabView'
var Global = require('../common/globals');
var width = Dimensions.get('window').width;
var index;
export default class LoginView extends Component {
    constructor(props) {
        super(props)
        index = this.props.index;
    }
    state =
    {
        userName: '',
        passWord: '',
        loadingVisible: false,
    }

    onLoginPress() {
        console.log('username:' + this.state.userName + '  password:' + this.state.passWord)
        this.setState({
            loadingVisible: true
        });

        var paramBody = (
            {
                'username': this.state.userName,
                'password': this.state.passWord,
                'virtual_account': 1
            })
        if (!this.state.userName.length || !this.state.passWord.length) {
            this.setState({
                loadingVisible: false
            });
            Alert.alert('提示',
                '请输入用户名或密码。')
        }
        else {
            HttpRequest.post('/user', paramBody, this.onLoginSuccess.bind(this),
                (e) => {
                    this.setState({
                        loadingVisible: false
                    });
                    try {
                        var errorInfo = JSON.parse(e);
                        if (errorInfo != null && errorInfo.description) {

                        } else {

                        }
                    }
                    catch(err)
                    {
                        console.log(err)
                    }

                    console.log('Login error:' + e)
                })
        }

        setTimeout(() => {//logout timeout  15s
            if (this.state.loadingVisible == true) {
                this.setState({
                    loadingVisible: false
                });
                Alert.alert('提示','登录超时，请稍候再试');
            }
        }, 1000 * 15);

    }
    onGetWxToken(appid, code) {
        let url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + '&secret=63a7a33c0b5b75d1f44b8edb7a4ea7cd&code=' + code + '&grant_type=authorization_code'

        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.text())
            .then((responseText) => {
                console.log("responseText2:" + responseText);
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
                alert('Login faild, please try again.2')
            });
    }

    onGetWxUserInfo(token, openid) {
        let url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + token + '&openid=' + openid
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.text())
            .then((responseText) => {
                console.log("responseText3:" + responseText);
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
                alert('Login faild, please try again.3')
            });
    }
    onLoginSuccess(response) {
        this.setState({
            loadingVisible: false
        });


        // if (response.data.token.length) {
        //     AsyncStorage.setItem('k_http_token', response.data.token, (error, result) => {
        //         if (error) {
        //             console.log('save http token faild.')
        //         }
        //
        //     });
        // }
        //
        // AsyncStorage.setItem('k_login_info', JSON.stringify(response), (error, result) => {
        //     if (error) {
        //         console.log('save login info faild.')
        //     }
        // });
        console.log('login success'+JSON.stringify(response))
        console.log('login successToken:'+response.data.token)
        AsyncStorage.setItem('k_http_token',response.data.token, (error, result) => {

            if (error) {
                console.log('save k_http_token faild.')
            }else {
                console.log('save k_http_token result:'+result)
            }
        })

        Global.token = response.data.token
        HttpRequest.get('/user', {}, this.onGetUserInfoSuccess.bind(this),
            (e) => {
                console.log(' usererror:' + e)
            })


    }
    onGetUserInfoSuccess(response) {
        Global.user_profile = response.data.user_profile
        Global.agent_url = response.data.user_profile.agent_url
        Global.nickname = response.data.user_profile.nickname
        Global.headimgurl =response.data.user_profile.headimgurl
        console.log('Global.user_profile :'+JSON.stringify(Global.user_profile))
        //show main view
        this.props.navigator.resetTo({
            component: TabView,
            name: 'MainPage'
        })
    }
    render() {
        return (
            <View style={styles.rootcontainer}>
                <NavBar title="登录" />
                <View style={styles.container}>
                    <Image source={require('../images/logo_icon.png')} style={styles.logo} />
                    <TextInput
                        style={styles.userName}
                        value={this.state.userName}
                        editable={true}
                        placeholder={'用户名'}
                        onChangeText={(text) => this.setState({ userName: text })}>
                    </TextInput>
                    <TextInput
                        style={styles.passWord}
                        value={this.state.passWord}
                        editable={true}
                        secureTextEntry={true}
                        placeholder={'密码'}
                        onChangeText={(text) => this.setState({ passWord: text })}>
                    </TextInput>
                    <TouchableOpacity onPress={this.onLoginPress.bind(this)}
                        style={styles.loginButton}>
                        <Text style={styles.loginText} >
                            登录
                    </Text>
                    </TouchableOpacity>
                    <Spinner
                        visible={this.state.loadingVisible}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        logo: {
            marginTop: 20,
            alignSelf: 'center',
            height: 100,
            width: 100,
            resizeMode: Image.resizeMode.contain,
        },
        container:
        {
            flex: 1,
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

        userName:
        {
            alignSelf: 'stretch',
            fontSize: 20,
            textAlign: 'left',
            margin: 10,
            marginTop: 20,
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            paddingLeft: 10
        },

        passWord:
        {
            alignSelf: 'stretch',
            textAlign: 'left',
            color: '#333333',
            marginLeft: 10,
            marginRight: 10,
            fontSize: 20,
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            paddingLeft: 10
        },
        loginText:
        {
            color: '#ffffff',
            fontSize: 18,
        },
        loginButton:
        {
            marginTop: 30,
            height: 50,
            width: width - 20,
            backgroundColor: '#1a8eaf',
            borderRadius: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
