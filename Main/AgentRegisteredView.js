/**
 * Created by Arlen_JY on 2017/7/13.
 */

import React ,{ Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TextInput,
    Text,
    TouchableOpacity,
    AsyncStorage,
    Alert,
    Keyboard



}   from 'react-native'
import NavBar from '../common/NavBar'
import Dimensions from 'Dimensions'
import Spinner from 'react-native-loading-spinner-overlay';
import HttpRequest from '../HttpRequest/HttpRequest'
import Welcome from '../Login/Welcome'
var Global = require('../common/globals');
var width = Dimensions.get('window').width;

export default class AgentRegisteredView extends Component{
  constructor(props){
      super(props);
          this.state = {
              name:'',
              phoneNum:'',
              agentAddresss:'',
              loadingVisible:false,


          }



    }
        back(){
             this.props.navigator.pop()

            }
    backKeyBoard(){
        Keyboard.dismiss();
    }

    goToWelcome(){
            // this.props.navigation.push({
            //     component:Welcome,
            //
            // })

            // this.props.navigator.resetTo({
            //     component: Welcome,
            //     name: 'Welcome'
            // })
            this.props.navigator.resetTo({
                component: Welcome,
                name: 'Welcome'
            })

        }
        componentDidMount(){

        }
    onRegisteredAgentSuccess(response){

        console.log('Get RegisteredAgent Success:' + JSON.stringify(response));
        if (response.code == 1){

            Alert.alert('提示','您已申请成功')
            this.goToWelcome();

        }

    }
    matchPhoneNum(phoneNum){
        var  reg = '^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\\d{8}$';
        var r = phoneNum.match(reg);
        console.log('matchPhoneNum:'+r);

    }
    onRegisteredAgentPress(){
            console.log('AgentRegisteredView name:'+this.state.name +'phoneNum:'+this.state.phoneNum+'agentAddresss:'+this.state.agentAddresss)
            if (!this.state.name.length  || !this.state.phoneNum.length  || !this.state.agentAddresss.length || this.matchPhoneNum(this.state.phoneNum)){
                Alert.alert('提示','请完整填写详细信息！')
            }else {

                var paramBody =
                    {
                        'name': this.state.name,
                        'phone_num': this.state.phoneNum,
                        'address': this.state.agentAddresss
                    }

                HttpRequest.post('/agent_apply', paramBody, this.onRegisteredAgentSuccess.bind(this),
                    (e) => {
                        this.setState({
                            loadingVisible: false
                        });
                        try {
                            var errorInfo = JSON.parse(e);
                            if (errorInfo != null && errorInfo.description) {
                                Alert.alert('报错', errorInfo.description)
                            } else {
                                Alert.alert('报错', e)
                            }
                        }
                        catch(err)
                        {
                            console.log( 'RegisteredAgentErr:'+err);
                        }


                    })
                setTimeout(() => {//logout timeout  15s
                    if (this.state.loadingVisible == true) {
                        this.setState({
                            loadingVisible: false
                        });
                        Aler
                        Alert.alert('提示','登录超时，请稍候再试');
                    }
                }, 1000 * 15);



            }
        }
        render(){

            return(

                <View style ={styles.container} >
                    <NavBar
                        title={'申请成为团长'}
                        leftIcon={require('../images/back.png')}
                        leftPress={this.back.bind(this)}
                    />
                    <TouchableOpacity onPress ={this.backKeyBoard.bind(this)}
                                      style={{}}>

                    <Text style={styles.warnText}>      对不起，您当前的身份还不是团长，所以没有专属的团长链接；请填写您的真实信息申请成为团长，我们将派专人联系并核实您的团长身份
                    </Text>
                    </TouchableOpacity>
                    <View style ={styles.textInputView}>
                        <Text style={styles.TextInputText}>姓名：</Text>
                        <TextInput style={styles.textInput}
                                   value={this.state.name}
                                   placeholder={'李小明'}
                                   keyboardType={'default'}
                                   returnKeyType ={'send'}
                                   onChangeText={(text) => this.setState({ name: text })}


                        >

                        </TextInput>

                    </View>
                    <View style ={styles.textInputView}>
                        <Text style={styles.TextInputText}>电话：</Text>
                        <TextInput style={styles.textInput}
                                   value={this.state.phoneNum}
                                   placeholder={'86728498'}
                                   keyboardType={'numeric'}
                                   onChangeText={(text) => this.setState({ phoneNum: text })}


                        >

                        </TextInput>

                    </View>
                    <View style ={styles.textInputView}>
                        <Text style={styles.TextInputText}>地址：</Text>
                        <TextInput style={styles.textInput}
                                   value={this.state.agentAddresss}
                                   placeholder={'9 Lim Tua Tow Road'}
                                   keyboardType={'default'}
                                   returnKeyType ={'done'}
                                   onChangeText={(text) => this.setState({ agentAddresss: text })}


                        >

                        </TextInput>

                    </View>
                    <TouchableOpacity onPress ={this.onRegisteredAgentPress.bind(this)}
                        style={styles.registeredAgentButton}>
                        <Text style={styles.registeredAgentText}>
                            提交申请
                        </Text>

                    </TouchableOpacity>
                    <Spinner
                        visible={this.state.loadingVisible}
                    />

                </View>


            )

        }




}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },

    warnText: {
        color: '#a9a9a9',
        fontSize: 16,
        textAlign:'left',
        marginTop:10,
        padding:40,
        fontFamily:'PingFangSC-Light',


    },
    textInputView: {

        flexDirection:'row',
        color: '#333333',
        marginTop: 25,

        marginLeft: 25,
        marginRight: 25,
        padding:5,
        width:width-50,
        height: 60,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 50,

    },
    textInput: {
        flex:4,
        textAlign: 'left',
        color: '#333333',


        height: 40,



    },
    TextInputText:{
        flex:1,
        textAlign:'center',
        fontSize:18,
        color: 'black',

        width:100,
        marginTop:8,
        marginLeft:10,
        fontFamily:'PingFangSC-Light',
    },

    registeredAgentButton:{
        marginTop: 50,
        height: 60,
        width: width - 50,
        backgroundColor: 'rgb(234,107,16)',
        borderRadius: 50,
        paddingTop:20,


    },
    registeredAgentText:{
        color: '#ffffff',
        fontSize: 20,
        fontWeight:'bold',
        textAlign:'center',
        marginLeft:20,
        marginRight:20,

    },

})
