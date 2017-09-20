import React,{Component} from 'react';
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
export default class RegisterView extends Component
{
    constructor(props)
    {
        super(props)
        index = this.props.index;
    }
    state =
    {
        userName: '',
        mobile:"",
        passWord: '',
        loadingVisible: false,
    }

    onLoginPress()
    {
        console.log('username:' + this.state.userName + '  password:' + this.state.passWord)
        this.setState({
            loadingVisible: true
        });

        var paramBody = (
            {
                'username': 'Mike.zk',
                'password': '1234567a',
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
                    Alert.alert('提示','登录超时，请稍候再试')
                }
            }, 1000 *15);

    }

    onLoginSuccess(response)
    {
        this.setState({
                    loadingVisible: false
                });

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
        HttpRequest.get('/v1','/user', {}, this.onGetUserInfoSuccess.bind(this),
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
    render()
    {
        return (
            <View style = {styles.rootcontainer}>
            <NavBar title="注册" />
            <View style = {styles.container}>
             <Image source={require('../images/logo_icon.png') } style={styles.logo}/>

             {/*<TextInput*/}
                 {/*style = {styles.userName}*/}
                 {/*value = {this.state.userName}*/}
                 {/*editable = {true}*/}
                 {/*placeholder = {'昵称'}*/}
                 {/*onChangeText = {(text) => this.setState({userName: text})}>*/}
             {/*</TextInput>*/}

                <TextInput
                    style = {styles.userName}

                    editable = {true}

                    placeholder = {'你的用户名'}
                    onChangeText = {(text) => this.setState({userName: text})}>
                </TextInput>
                <TextInput
                    style = {styles.passWord}

                    editable = {true}
                    secureTextEntry = {true}
                    placeholder = {'密码'}
                    onChangeText = {(text) => this.setState({passWord: text})}>
                </TextInput>
                <TouchableOpacity onPress={this.onLoginPress.bind(this)}
                    style={styles.loginButton}>
                    <Text style={styles.loginText} >
                        注册并登录
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
        alignSelf:'center',
        height: 100,
        width: 100,
        resizeMode: Image.resizeMode.contain,
    },
        container:
        {
            flex: 1,
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

        userName:
        {
            alignSelf: 'stretch',
            fontSize: 20,
            textAlign: 'left',
            margin: 10,
            marginTop:20,
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
            fontSize:18,
        },
        loginButton:
        {
            marginTop: 30,
            height:50,
            width: width - 20,
            backgroundColor: '#1a8eaf',
            borderRadius:5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems:'center',
        },
});
