import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    TouchableHighlight,
    Picker,
    AsyncStorage,
    TextInput
} from 'react-native';

import NavBar from '../common/NavBar'
import Dimensions from 'Dimensions'
import Welcome from '../Login/Welcome'
var Global = require('../common/globals');
var width = Dimensions.get('window').width;

export default class AddressView extends Component {
    constructor(props) {
        super(props)

        this.state={
            name:null,
            mobile:null,
            address:null,
        }

    }


    back() {
        this.props.navigator.pop()
    }
    save(){
        if (!this.state.name) {
            alert('输入团长名')
            return
        }
        if (!this.state.mobile) {
            alert('输入联系方式')
            return
        }
        if (!this.state.address) {
            alert('输入收货地址')
            return
        }

        this.props.navigator.pop()
    };


    async _removeStorage() {
        Global.UserInfo = null;
            AsyncStorage.removeItem('k_login_info').then((value) => {

            }
            ).done();

        }


    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="收货地址"
                    rightTitle='保存'
                    rightPress={this.save.bind(this)}
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#ffffff',height:45,paddingLeft:10,paddingRight:10}}>
                      <Text style={[styles.iconSize,{width:70,marginRight:15,color: '#1b1b1b',fontSize: 14,}]}>
                            团长名
                        </Text>
                      <TextInput  style={{marginLeft:0,fontSize: 14,flex:20,
                       textAlign: 'left',color: '#1c1c1c',}}
                       editable={true}
                       onChangeText={(text) => this.setState({ name: text })}
                       ></TextInput>

                    </View>

                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#ffffff',height:45,paddingLeft:10,paddingRight:10}}>
                      <Text style={[styles.iconSize,{width:70,marginRight:15,color: '#1b1b1b',fontSize: 14,}]}>
                            联系电话
                        </Text>
                      <TextInput  style={{marginLeft:0,fontSize: 14,flex:20,
                       textAlign: 'left',color: '#1c1c1c',}}
                       editable={true}
                       onChangeText={(text) => this.setState({ mobile: text })}
                       ></TextInput>

                    </View>

                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#ffffff',height:45,paddingLeft:10,paddingRight:10}}>
                      <Text style={[styles.iconSize,{width:70,marginRight:15,color: '#1b1b1b',fontSize: 14,}]}>
                            收货地址
                        </Text>
                      <TextInput  style={{marginLeft:0,fontSize: 14,flex:20,
                       textAlign: 'left',color: '#1c1c1c',}}
                       editable={true}
                       onChangeText={(text) => this.setState({ address: text })}
                       ></TextInput>

                    </View>
            </View>
        )
    }


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
