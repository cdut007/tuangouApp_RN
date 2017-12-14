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
    TextInput
} from 'react-native';

import NavBar from '../common/NavBar'
import Dimensions from 'Dimensions'
import Welcome from '../Login/Welcome'
var Global = require('../common/globals');
var width = Dimensions.get('window').width;

export default class HelpView extends Component {
    constructor(props) {
        super(props)

    }


    back() {
        this.props.navigator.pop()
    }
    _logout_function(){

        //logout here
        this._removeStorage();
        //logout success go 2 call page
        // var routes = this.props.navigator.state.routeStack;
        // for (var i = routes.length - 1; i >= 0; i--) {
        //     if(routes[i].name === "MyDestinationRoute"){
        //     var destinationRoute = this.props.navigator.getCurrentRoutes()[i]
        //     this.props.navigator.popToRoute(destinationRoute);
        //
        //     }
        // }
        this.props.navigator.resetTo({
            component: Welcome,
            name: 'Welcome'
        })
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
                    title="帮助中心"
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                <View >
                    <Text style={[styles.defaultText,{marginTop:80}]}>您有任何的问题都可以电话或微信联系客服。</Text>
                    <Text style={{marginTop:10,fontSize:18,color:'#1c1c1c',fontFamily:'PingFang-SC-Medium',textAlign:'left',width:300,}}>
                        客服电话：400-0358-3848
                    </Text>
                    <Text style={{marginTop:10,fontSize:18,color:'#1c1c1c',fontFamily:'PingFang-SC-Medium',textAlign:'left',width:300,}}>
                        客服微信：ILGO_SG
                    </Text>
                </View>
                <View>
                    <Image style={{marginTop:60,width:150,height:150}} source={require('../images/qrCode.png')}></Image>
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
        backgroundColor: '#ffffff',
    },
    defaultText: {
        color:'#1c1c1c',
        fontSize: 16,
        fontFamily:'PingFangSC-Light',
        textAlign:'center',
        width:width-50,
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
