import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    ScrollView,
    Clipboard
} from 'react-native';

import {
    MKIconToggle,
    MKSwitch,
    MKRadioButton,
    MKCheckbox,
    MKColor,
    getTheme,
    setTheme,
} from 'react-native-material-kit'

import Banner from 'react-native-banner';
import Dimensions from 'Dimensions';
import Grid from 'react-native-grid-component';
import NavBar from '../common/NavBar'
import px2dp from '../common/util'
import * as WeChat from 'react-native-wechat';

var Global = require('../common/globals');
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import LoginView from '../Login/LoginView'


export default class GroupBuyNowView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            agent_url: '',
            image: ''
        }
    }


    back() {
        this.props.navigator.pop()
    }

    componentDidMount() {
        this.setState({ agent_url: this.props.agent_url, image: this.props.image });
    }

    onCopyPress() {
        Clipboard.setString(this.state.agent_url);

        alert('链接已复制到剪切板。')
    }

    async onSharePress() {
        try {
            let result = await WeChat.shareToSession({
                type: 'news',
                title: '团购',
                description: '最新团购',
                webpageUrl: this.state.agent_url,
                imageUrl: this.state.image,
            });
            console.log('share to session successful:', result);
        } catch (e) {
            if (e instanceof WeChat.WechatError) {
                console.error(e.stack);
            } else {
                throw e;
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="拼团成功"
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                <Text style={{ fontSize: 14, color: '#a9a9a9', padding: 40, marginTop: 20 }}>该链接为团长：{Global.wxUserInfo.nickname}团长高优良品购的专属链接
每次申请拼团后直接分享该链接至微信群即可
团员点击链接购买的商品可在拼团中查看</Text>
                <Text style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 14, color: '#1c1c1c', padding: 10, marginTop: 40 }}>{this.state.agent_url}</Text>
                <View style={{ flex: 1, marginTop: 60, justifyContent: 'center', flexDirection: 'row' }}>

                    <TouchableOpacity style={{
                        height: 36,
                        width: 120,
                        backgroundColor: '#6d9ee1',
                        borderRadius: 50,
                        borderColor: '#5590df',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                        onPress={this.onCopyPress.bind(this)}
                    >
                        <Text style={{ color: '#ffffff', fontSize: 16 }}>复制链接</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.onSharePress.bind(this)}
                        style={{
                            height: 36,
                            width: 120,
                            marginLeft: 60,
                            backgroundColor: '#8dc81b',
                            borderRadius: 50,
                            borderColor: '#7db909',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{ color: '#ffffff', fontSize: 16 }}>分享链接</Text>
                    </TouchableOpacity>
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
        backgroundColor: '#F5FCFF',
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
