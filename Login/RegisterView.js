import React,{Component} from 'react';
import HttpRequest from '../HttpRequest/HttpRequest'
import {
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    AsyncStorage,
    Image
} from 'react-native';
import Dimensions from 'Dimensions';
import Spinner from 'react-native-loading-spinner-overlay';
import NavBar from '../common/NavBar'

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
        var paramBody = JSON.stringify(
        {
            'mobile': this.state.userName,
            'password': this.state.passWord,
            'domain': 'uc'
        })
        if(!this.state.userName.length || !this.state.passWord.length)
        {
            this.setState({
                        loadingVisible: false
                    });
            alert('请输入用户名或密码')
        }
        else
        {
            HttpRequest.post('/authuser', paramBody,this.onLoginSuccess.bind(this),
            (e)=>
            {
                this.setState({
                    loadingVisible: false
                });
                var errorInfo = JSON.parse(e);
                if (errorInfo!=null && errorInfo.description) {
                     alert(errorInfo.description)
                }else{
                    alert(e)
                }
                console.log('Login error:' + e)
            })
        }

        setTimeout(() => {//logout timeout  15s
                if (this.state.loadingVisible == true) {
                    this.setState({
                        loadingVisible: false
                    });
                    alert('登录超时，请稍候再试');
                }
            }, 1000 *15);

    }

    onLoginSuccess(response)
    {
        this.setState({
                    loadingVisible: false
                });

        console.log('Login success:' + JSON.stringify(response))
        if(response.access_token.length)
        {
            AsyncStorage.setItem('k_http_token',response.access_token,(error,result)=>{
                if (error)
                {
                    console.log('save http token faild.')
                }

            });
        }

        AsyncStorage.setItem('k_login_info',JSON.stringify(response), (error,result)=>{
            if (error)
            {
                console.log('save login info faild.')
            }
        });

        //show main view
        index.setState({hasLogin: true})
    }

    render()
    {
        return (
            <View style = {styles.rootcontainer}>
            <NavBar title="注册" />
            <View style = {styles.container}>
             <Image source={require('../images/logo.png') } style={styles.logo}/>

             <TextInput
                 style = {styles.userName}
                 value = {this.state.userName}
                 editable = {true}
                 placeholder = {'昵称'}
                 onChangeText = {(text) => this.setState({userName: text})}>
             </TextInput>

                <TextInput
                    style = {styles.userName}
                    value = {this.state.mobile}
                    editable = {true}
                    keyboardType="numeric"
                    placeholder = {'你的手机号码'}
                    onChangeText = {(text) => this.setState({userName: text})}>
                </TextInput>
                <TextInput
                    style = {styles.passWord}
                    value = {this.state.passWord}
                    editable = {true}
                    secureTextEntry = {true}
                    placeholder = {'密码'}
                    onChangeText = {(text) => this.setState({passWord: text})}>
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
