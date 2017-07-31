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

import NavBar from '../common/NavBar'
import Dimensions from 'Dimensions'
import HttpRequest from '../HttpRequest/HttpRequest'
import CommitButton from '../common/CommitButton'
var Global = require('../common/globals');
var width = Dimensions.get('window').width;

export default class AddressView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: Global.wxUserInfo.nickname,
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
                name: Global.wxUserInfo.nickname,
                address: Global.user_address.address,
                mobile: Global.user_address.phone_num
            })
        } 
    }

    startGroupBuy()
    {
        HttpRequest.post('/agent_order', this.props.api_param, this.onOrderSuccess.bind(this),
            (e) => {
                try {
                    var errorInfo = JSON.parse(e);

                    if (errorInfo != null &&  errorInfo.code == 4) {
                        Alert.alert('提示','已申请过本次团购')
                        return
                    }else if (errorInfo != null && errorInfo.code == 3 ){
                        Alert.alert('提示','用户不是团长')
                        return
                    }else if (errorInfo != null && errorInfo.code == 2 ){
                        Alert.alert('提示', '参数错误')
                        return
                    }

                }
                catch (err) { }


            })
    }

    onOrderSuccess(response) {
        if (response.code == 1 && response.message == 'Success'){


            this.props.navigator.push({
                component: GroupMasterLinkView,
            })
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="申请拼团"
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>
                    <Text style={[styles.iconSize, { width: 70, marginRight: 15, color: '#1b1b1b', fontSize: 14, }]}>
                        {this.state.name}
                    </Text>
                    <Text style={{
                        marginLeft: 0, fontSize: 14, flex: 20,
                        textAlign: 'right', color: '#1c1c1c',
                    }}
                    >{this.state.mobile}</Text>

                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>
                    <Text style={[styles.iconSize, { width: 70, marginRight: 15, color: '#1b1b1b', fontSize: 14, flex: 1}]}>
                        {this.state.address}
                    </Text>
                </View>
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 ,paddingTop:100}}>
                    <CommitButton title={'确认申请'} onPress={this.startGroupBuy.bind(this)}></CommitButton>
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
