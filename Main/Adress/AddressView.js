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
    Alert
} from 'react-native';

import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions'
import HttpRequest from '../../HttpRequest/HttpRequest'
import GroupBuyAddressView from './GroupBuyAddressView'
var Global = require('../../common/globals');
var width = Dimensions.get('window').width;

export default class AddressView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: Global.user_profile.nickname,
            mobile: null,
            address: null,
        }

    }


    back() {
        this.props.navigator.pop()
    }

    componentDidMount() {
        if (Global.user_address) {
            this.setState({
                name: Global.user_profile.nickname,
                address: Global.user_address.address,
                mobile: Global.user_address.phone_num
            })
        }
        else {
            HttpRequest.get('/v1','/user_address', {}, this.onGetAddressSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                })
        }

    }

    onGetAddressSuccess(response) {
        Global.user_address = response.data.user_address
        this.setState({
            address: response.data.user_address.address,
            mobile: response.data.user_address.phone_num
        })
    }

   isMobil(s)
    {
        var patrn=/^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
        if (!patrn.exec(s)) return false
        return true
    }
    save() {

        if (!this.state.mobile) {

            Alert.alert('提示','输入联系方式')
            return
        }
        if (!this.state.address) {

            Alert.alert('提示','输入收货地址')
            return
        }
       if(this.isMobil(this.state.mobile)){

       }else {
           Alert.alert('提示','请输入正确手机号码!')
           return
       }
        let param = {
            address: this.state.address,
            phone_num: this.state.mobile
        }
        HttpRequest.post('/v1','/user_address', param, this.onSaveAddressSuccess.bind(this),
                (e) => {

                    Alert.alert('提示','保存地址失败，请稍后再试。')
                    console.log(' error:' + e)
                })

        
    };

    onSaveAddressSuccess(response)
    {
        console.log('onSaveAddressSuccess'+JSON.stringify(response))

        if (this.props.isMineTo){
            Global.user_address = {
                address: this.state.address,
                phone_num: this.state.mobile
            }
            Alert.alert('提示','保存地址成功', [

                    {text: 'OK', onPress: this.back.bind(this)},
                ],
                { cancelable: false })

        }else {
            Global.user_address = {
                address: this.state.address,
                phone_num: this.state.mobile
            }
            this.props.navigator.push({
                component: GroupBuyAddressView,
                props: {
                    api_param: this.props.api_param,
                    image: this.props.image,

                }
            })
        }


    }


    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="收货地址"
                    rightTitle='保存'
                    rightPress={this.save.bind(this)}
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)} />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>
                    <Text style={[styles.iconSize, { marginRight: 15, color: '#1b1b1b', fontSize: 14 }]}>
                        团长名
                        </Text>
                    <Text style={{
                        marginLeft: 0, fontSize: 14, flex: 20,
                        textAlign: 'left', color: '#1c1c1c',
                    }}
                        editable={true}
                        onChangeText={(text) => this.setState({ name: text })}
                    >{this.state.name}</Text>


                </View>
                <View style={{marginLeft:10,marginRight:10,height:0.5,backgroundColor:'rbg(212,212,212)'}}></View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>
                    <Text style={[styles.iconSize, { width: 70, marginRight: 15, color: '#1b1b1b', fontSize: 14, }]}>
                        联系电话
                        </Text>
                    <TextInput style={{
                        marginLeft: 0, fontSize: 14, flex: 20,
                        textAlign: 'left', color: '#1c1c1c',
                    }}  keyboardType={'numeric'}
                        editable={true}
                               underlineColorAndroid='transparent'
                        onChangeText={(text) => this.setState({ mobile: text })}
                        value= {this.state.mobile}
                    ></TextInput>

                </View>
                <View style={{marginLeft:10,marginRight:10,height:0.5,backgroundColor:'rbg(212,212,212)'}}></View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 55, paddingLeft: 10, paddingRight: 10 }}>
                    <Text style={[styles.iconSize, { width: 70, marginRight: 15, color: '#1b1b1b', fontSize: 14,marginLeft: 5, }]}>
                        收货地址
                        </Text>
                    <TextInput numberOfLines={3}
                               style={{
                        marginLeft: 0, fontSize: 14,width:width-100,
                        textAlign: 'left', color: '#1c1c1c',
                    }}

                        onChangeText={(text) => this.handleMaxLength(text)}
                               placeholder={'街道、门牌、邮编'}

                        value= {this.state.address}

                               editable={true}
                               blurOnSubmit ={true}
                               underlineColorAndroid='transparent'
                               multiline={true}
                               returnKeyType={'done'}




                    ></TextInput>

                </View>
            </View>
        )
    }
    handleMaxLength(text){
       var lenth = this.GetLength(text);
       var newStr = ''

       if (lenth >= 120){

           // this.setState({
           //     address:newStr
           // })
       }else {

           this.setState({
               address:text
           })
           console.log('GetLength14'+lenth)
           console.log('GetLength171'+newStr)
       }


    }
    GetLength(str){
        return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
    };

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
        backgroundColor: '#f2f2f2',
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
