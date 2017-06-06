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
} from 'react-native';
import Dimensions from 'Dimensions';
import Grid from 'react-native-grid-component';
import NavBar from '../common/NavBar'
import px2dp from '../common/util'
import NotifyNowView from './NotifyNowView'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var toolsData = [
    {
        'index': 0,
        'title': '稍后通知',
        'image': require('../images/announceLaterIcon.png')
    },
    {
        'index': 1,
        'title': '通知成功',
        'image': require('../images/announceSuccessIcon.png')
    },
    {
        'index': 2,
        'title': '再次通知',
        'image': require('../images/announceAgainIcon.png')
    },
    {
        'index': 3,
        'title': '拍照寄存',
        'image': require('../images/cameraIcon.png')
    },
    {
        'index': 4,
        'title': '发送失败',
        'image': require('../images/announceFailIcon.png')
    },
    {
        'index': 5,
        'title': '记录查询',
        'image': require('../images/searchRecordsIcon.png')
    }
]
import LoginView from '../Login/LoginView'


export default class MainFirstView extends Component {
    constructor(props) {
        super(props)

    }

    onAnnounceNow() {
        this.props.navigator.push({
            component: NotifyNowView,

        })
    }

    onToolsItemClick(index) {
        console.log('Did click item at:' + index)
        switch (index)
        {
            case 0:
                {

                }
                break;
            case 1:
                {

                }
                break;
            case 2:
                {

                }
                break;
            case 3:
                {

                }
                break;
            case 4:
                {

                }
                break;
            case 5:
                {

                }
                break;
            default:
                {

                }
                break;

        }
    }
    render() {
        return (
            <View style={styles.container}>
                <NavBar title="哦到了" />
                {this.renderTopView()}
                {this.renderToolsView()}
                <TouchableHighlight onPress={this.onAnnounceNow.bind(this)}
                    style={styles.notifyButton}>
                    <Text style={styles.buttonText} >
                        立即通知取件
                    </Text>
                </TouchableHighlight>
            </View>
        )
    }


    renderTopView() {
        return (
            <Image style={styles.topView}
                source={require('../images/background.png')}>
            </Image>
        )
    }

    renderToolsView1() {
        return (
            <View style={styles.toolsView}>
                <Grid
                    style={styles.list}
                    renderItem={(data, i) => {
                        return (
                            <TouchableOpacity style={styles.toolsItem} key={i}
                                onPress={() => this.onToolsItemClick(data.index)}>
                                <Image source={data.image} />
                                <Text>
                                    {data.title}
                                </Text>
                            </TouchableOpacity>)
                    }}
                    data={toolsData}
                    itemsPerRow={3}
                />
            </View>
        )
    }

    renderToolsView() {
        const w = width / 3, h = w * .6 + 20
        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h }, styles.toolsItem]}>
                                    <Image source={item.image} style={{ marginBottom: 10 }} />
                                    <Text style={{ fontSize: px2dp(12), color: "#666" }}>{item.title}</Text>
                                </View>
                            )
                            return (
                                isIOS ? (
                                    <TouchableHighlight style={{ width: w, height: h }} key={i} onPress={() => { this.onToolsItemClick(item.index) }}>{render}</TouchableHighlight>
                                ) : (
                                        <TouchableNativeFeedback style={{ width: w, height: h }} key={i} onPress={() => { this.onToolsItemClick(item.index) }}>{render}</TouchableNativeFeedback>
                                    )
                            )
                        })
                    }
                </View>
            )
        }
        return (
            renderSwipeView(toolsData)
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    topView: {
        height: 150,
        width: width,
    },
    list:
    {
        flex: 1,
    },
    notifyButton:
    {
        marginTop: 10,
        height: 50,
        width: width - 20,
        backgroundColor: '#fea11e',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText:{
            color: '#ffffff',
            fontSize:20,
    },
    toolsView: {
        paddingBottom: 10,
        backgroundColor: "#fff",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    toolsItem: {
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderColor: 'gray',
        borderWidth: px2dp(0.5),
    },
});
