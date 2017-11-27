import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    AsyncStorage
} from 'react-native';
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar';
import px2dp from '../common/util';
import HttpRequest from '../HttpRequest/HttpRequest'
import CircleImage from '../common/CircleImage';
import SettingView from './SettingView';
import GroupOrderListView from './GroupOrderListView';
import AddressView from './Adress/AddressView';
import GroupBuyManager from './Group/GroupBuyManager'
import AgentRegisteredView from './AgentRegisteredView';
import GroupMasterLinkView from './GroupMasterLinkView';
import NoticeOrderView from  './Order/NoticeOrderView';
import ProductManager from './Product/ProductManager'
import NewGroupView from './Group/NewGroupView'
import NoticeSuccessView from './Order/NoticeSuccessView'

import HelpView from './HelpView';
import Welcome from '../Login/Welcome'
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var account = Object();
var Global = require('../common/globals');


export default class MineView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: account,
        };
    }

    componentWillMount() {
        var me = this
        AsyncStorage.getItem('k_user_info', function (errs, result) {
            if (!errs && result && result.length) {

                //me.setState({account: JSON.parse(result)})
            }
            else {
                // me.queryUserInfo();
                // me.queryLeftCountInfo();
            }
        });
    }

    queryUserInfo() {
        console.log('queryUserInfo id:' + Global.id)
        HttpRequest.get('/v1/user/' + Global.id, null, this.onQuerySuccess.bind(this),
            (e) => {

                try {
                    var errorInfo = JSON.parse(e);
                    if (errorInfo != null && errorInfo.description) {
                        console.log(errorInfo.description)
                    } else {
                        console.log(e)
                    }
                }
                catch (err) {
                    console.log(err)
                }

                console.log('Login error:' + e)
            })
    }
    queryLeftCountInfo() {
        console.log('queryLeftCountInfo id:' + Global.id)
        HttpRequest.get('/v1/usage_count', null, this.onQueryLeftCountSuccess.bind(this),
            (e) => {

                try {
                    var errorInfo = JSON.parse(e);
                    if (errorInfo != null && errorInfo.description) {
                        console.log(errorInfo.description)
                    } else {
                        console.log(e)
                    }
                }
                catch (err) {
                    console.log(err)
                }

                console.log('Login error:' + e)
            })
    }

    onQuerySuccess(response) {
        // console.log('queryUserInfo success:' + JSON.stringify(response))
        this.setState({ account: response });
    }

    onQueryLeftCountSuccess(response) {
        // console.log('onQueryLeftCountSuccess:' + JSON.stringify(response))
        this.setState({ leftCount: response.result });
    }
    // onGroupBuyManagerPress() {
    //     this.props.navigator.push({
    //
    //         component: GroupBuyManager,
    //     })
    // }
    OnProductManagerPress(){
        this.props.navigator.push({
            component: ProductManager
        })

    }
    OnNewGroupPress(){
        this.props.navigator.push({
            component: NewGroupView
        })
    }
    onAddressPress() {
        this.props.navigator.push({
            component: AddressView,
        })
    }
    onSettingPress() {
        this.props.navigator.push({
            component: SettingView,
        })
    }
    onHelpPress() {
        this.props.navigator.push({
            component: HelpView,
        })
    }
    onGroupBuyDonePress() {
        this.props.navigator.push({
            props: {
                isDoneStatus: true,
            },
            component: GroupOrderListView,
        })
    }
    onNoticePickUpPress(){
        this.props.navigator.push({
            // component: NoticeSuccessView
            component: NoticeOrderView,

        })
    }
    onGroupMasterLinkPress() {
        if (!Global.agent_url){

            this.props.navigator.push({

                component: AgentRegisteredView,
            })

        }else {

            this.props.navigator.push({
                component: GroupMasterLinkView,
                props: {
                    isAddressTo:false

                }
            })
        }

    }

    onGroupBuyProgressingPress() {
        this.props.navigator.push({
            props: {
                isDoneStatus: false,
            },
            component: GroupOrderListView,
        })
    }

    onToolsItemClick(index) {
        console.log('Did click item at:' + index)
    }
    onPressWelcome(){



        this.props.navigator.resetTo({
            component: Welcome,
            name: 'Welcome'
        })

    }
    render() {
        if (Global.user_profile){
            return (
                <View style={styles.container}>
                    <View style={styles.headView}>

                        <Image style={[styles.headView, { position: 'absolute', left: 0, right: 0, }]}
                               source={require('../images/meBj.png')}
                        />
                        <CircleImage
                            imageStyle={styles.logo}
                            src={this._displayIcon()}
                        />
                        <View style={styles.centerLayout}>
                            <Text style={styles.defaultText}>{Global.user_profile.nickname}</Text>
                        </View>
                        <TouchableOpacity style={[ { alignItems: "flex-end", position: 'absolute', top: 20, right: 10, }]} onPress={this.onSettingPress.bind(this)}>
                            <Image style={{width:36,height:36}} source={require('../images/settingIcon.png')}></Image>
                        </TouchableOpacity>

                    </View>

                    <TouchableOpacity style={[styles.itemLayout, { alignItems: "flex-start", }]}>
                        <Text style={{ marginLeft: 10, fontSize: 16, color: '#1c1c1c', textAlign: 'left' }}>我的接龙</Text>
                    </TouchableOpacity>

                    <View style={styles.itemLine} />


                    <View style={styles.flexContainer}>
                        <TouchableOpacity style={styles.cell} onPress={this.onGroupMasterLinkPress.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/link_icon.png')}
                                >
                                </Image>
                                <Text style={styles.label}>
                                    分享接龙
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cell} onPress={this.onGroupBuyProgressingPress.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/buying_icon.png')}
                                >
                                </Image>
                                <Text style={styles.label}>
                                    查看接龙
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cell} onPress={this.onGroupBuyDonePress.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/success_icon.png')}
                                >
                                </Image>
                                <Text style={styles.label}>
                                    已截团的
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cell} onPress={this.onNoticePickUpPress.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/noticeIcon@2x.png')}
                                >
                                </Image>
                                <Text style={styles.label}>
                                    通知取货
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[styles.itemLayout, { alignItems: "flex-start",marginTop:10 }]}>
                        <Text style={{ marginLeft: 10, fontSize: 16, color: '#1c1c1c', textAlign: 'left' }}>自助服务</Text>
                    </TouchableOpacity>

                    <View style={styles.itemLine} />


                    <View style={styles.flexContainer}>
                        <TouchableOpacity style={styles.cell} onPress={this.OnNewGroupPress.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/createIcon.png')}
                                >
                                </Image>
                                <Text style={[styles.label,{marginTop:8}]}>
                                    新建接龙
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cell} onPress={this.OnProductManagerPress.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/productsIcon.png')}
                                >
                                </Image>
                                <Text style={[styles.label,{marginTop:8}]}>
                                    上传商品
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cell} onPress={this.onAddressPress.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/addressIcon.png')}
                                >
                                </Image>
                                <Text style={[styles.label,{marginTop:8}]}>
                                    收货地址
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cell} onPress={this.onHelpPress.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/helpIcon.png')}
                                >
                                </Image>
                                <Text style={[styles.label,{marginTop:8}]}>
                                    帮助中心
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/*<TouchableOpacity underlayColor="#ffffff" style={[styles.itemLayout, { marginTop: 10 }]} onPress={this.onGroupBuyManagerPress.bind(this)}>*/}

                        {/*<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>*/}
                            {/*<Image style={[styles.iconSize, { marginRight: 15 }]}*/}
                                   {/*source={require('../images/newGroupBuyIcon@2x.png')} />*/}
                            {/*<Text style={{*/}
                            {/*fontSize: 16, flex: 20,*/}
                            {/*textAlign: 'left',*/}
                            {/*color: '#1c1c1c',*/}
                        {/*}}>发布拼团</Text>*/}
                            {/*<Image style={[styles.iconSize]}*/}
                                   {/*source={require("../images/next_icon.png")} />*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<View style={styles.itemLine} />*/}
                    {/*<TouchableOpacity underlayColor="#ffffff" style={[styles.itemLayout, {}]} onPress={this.onAddressPress.bind(this)}>*/}

                        {/*<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>*/}
                            {/*<Image style={[styles.iconSize, { marginRight: 15 }]}*/}
                                   {/*source={require('../images/addressIcon.png')} />*/}
                            {/*<Text style={{*/}
                            {/*fontSize: 16, flex: 20,*/}
                            {/*textAlign: 'left',*/}
                            {/*color: '#1c1c1c',*/}
                        {/*}}>收货地址</Text>*/}
                            {/*<Image style={[styles.iconSize]}*/}
                                   {/*source={require("../images/next_icon.png")} />*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<View style={styles.itemLine} />*/}
                    {/*<TouchableOpacity underlayColor="#ffffff" style={[styles.itemLayout]} onPress={this.onHelpPress.bind(this)}>*/}
                        {/*<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>*/}
                            {/*<Image style={[styles.iconSize, { marginRight: 15 }]}*/}
                                   {/*source={require('../images/helpIcon.png')} />*/}
                            {/*<Text style={{*/}
                            {/*fontSize: 16, flex: 20,*/}
                            {/*textAlign: 'left',*/}
                            {/*color: '#1c1c1c',*/}
                        {/*}}>帮助中心</Text>*/}
                            {/*<Image style={[styles.iconSize]}*/}
                                   {/*source={require("../images/next_icon.png")} />*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<View style={styles.itemLine} />*/}
                    {/*<TouchableOpacity underlayColor="#ffffff" style={[styles.itemLayout]} onPress={this.onSettingPress.bind(this)}>*/}
                        {/*<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>*/}
                            {/*<Image style={[styles.iconSize, { marginRight: 15 }]}*/}
                                   {/*source={require('../images/settingIcon.png')} />*/}
                            {/*<Text style={{*/}
                            {/*fontSize: 16, flex: 20,*/}
                            {/*textAlign: 'left',*/}
                            {/*color: '#1c1c1c',*/}
                        {/*}}>设置</Text>*/}
                            {/*<Image style={[styles.iconSize]}*/}
                                   {/*source={require("../images/next_icon.png")} />*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}

                </View>
            )
        }else {
            return (
                <View style={styles.container}>
                    <TouchableOpacity onPress={this.onPressWelcome.bind(this)}>
                        <View style={styles.headView}>
                            <Image style={[styles.headView, { position: 'absolute', left: 0, right: 0, }]}
                                   source={require('../images/meBj.png')}
                            />
                            <CircleImage
                                imageStyle={styles.logo}
                                src={this._displayIcon()}
                            />
                            <View style={styles.centerLayout}>
                                <Text style={styles.defaultText}>未登录</Text>
                            </View>
                            <TouchableOpacity style={[ { alignItems: "flex-end", position: 'absolute', top: 20, right: 10, }]} onPress={this.onPressWelcome.bind(this)}>
                                <Image style={{width:40,height:40}} source={require('../images/settingIcon.png')}></Image>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.itemLayout, { alignItems: "flex-start", }]}>
                        <Text style={{ marginLeft: 10, fontSize: 16, color: '#1c1c1c', textAlign: 'left' }}>我的接龙</Text>
                    </TouchableOpacity>

                    <View style={styles.itemLine} />


                    <View style={styles.flexContainer}>
                        <TouchableOpacity style={styles.cell} onPress={this.onPressWelcome.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/link_icon.png')}
                                >
                                </Image>
                                <Text style={styles.label}>
                                    分享接龙
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cell} onPress={this.onPressWelcome.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/buying_icon.png')}
                                >
                                </Image>
                                <Text style={styles.label}>
                                    查看接龙
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cell} onPress={this.onPressWelcome.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/success_icon.png')}
                                >
                                </Image>
                                <Text style={styles.label}>
                                    已截团的
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cell} onPress={this.onPressWelcome.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/noticeIcon@2x.png')}
                                >
                                </Image>
                                <Text style={styles.label}>
                                    通知取货
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={[styles.itemLayout, { alignItems: "flex-start", marginTop:10}]}>
                        <Text style={{ marginLeft: 10, fontSize: 16, color: '#1c1c1c', textAlign: 'left' }}>自助服务</Text>
                    </TouchableOpacity>

                    <View style={styles.itemLine} />


                    <View style={[styles.flexContainer,{}]}>
                        <TouchableOpacity style={styles.cell} onPress={this.onPressWelcome.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/createIcon.png')}
                                >
                                </Image>
                                <Text style={[styles.label,{marginTop:8}]}>
                                    新建接龙
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cell} onPress={this.onPressWelcome.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/productsIcon.png')}
                                >
                                </Image>
                                <Text style={[styles.label,{marginTop:8}]}>
                                    上传商品
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cell} onPress={this.onPressWelcome.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/addressIcon.png')}
                                >
                                </Image>
                                <Text style={[styles.label,{marginTop:8}]}>
                                    收货地址
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cell} onPress={this.onHelpPress.bind(this)}>
                            <View style={styles.labelView}>
                                <Image style={styles.labelInfo}
                                       source={require('../images/helpIcon.png')}
                                >
                                </Image>
                                <Text style={[styles.label,{marginTop:8}]}>
                                    帮助中心
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/*<TouchableOpacity underlayColor="#ffffff" style={[styles.itemLayout, { marginTop: 10 }]} onPress={this.onPressWelcome.bind(this)}>*/}

                        {/*<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>*/}
                            {/*<Image style={[styles.iconSize, { marginRight: 15 }]}*/}
                                   {/*source={require('../images/newGroupBuyIcon@2x.png')} />*/}
                            {/*<Text style={{*/}
                                {/*fontSize: 16, flex: 20,*/}
                                {/*textAlign: 'left',*/}
                                {/*color: '#1c1c1c',*/}
                            {/*}}>发布拼团</Text>*/}
                            {/*<Image style={[styles.iconSize]}*/}
                                   {/*source={require("../images/next_icon.png")} />*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<View style={styles.itemLine} />*/}
                    {/*<TouchableOpacity underlayColor="#ffffff" style={[styles.itemLayout, { }]} onPress={this.onPressWelcome.bind(this)}>*/}

                        {/*<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>*/}
                            {/*<Image style={[styles.iconSize, { marginRight: 15 }]}*/}
                                   {/*source={require('../images/addressIcon.png')} />*/}
                            {/*<Text style={{*/}
                                {/*fontSize: 16, flex: 20,*/}
                                {/*textAlign: 'left',*/}
                                {/*color: '#1c1c1c',*/}
                            {/*}}>收货地址</Text>*/}
                            {/*<Image style={[styles.iconSize]}*/}
                                   {/*source={require("../images/next_icon.png")} />*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<View style={styles.itemLine} />*/}
                    {/*<TouchableOpacity underlayColor="#ffffff" style={[styles.itemLayout]} onPress={this.onHelpPress.bind(this)}>*/}
                        {/*<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>*/}
                            {/*<Image style={[styles.iconSize, { marginRight: 15 }]}*/}
                                   {/*source={require('../images/helpIcon.png')} />*/}
                            {/*<Text style={{*/}
                                {/*fontSize: 16, flex: 20,*/}
                                {/*textAlign: 'left',*/}
                                {/*color: '#1c1c1c',*/}
                            {/*}}>帮助中心</Text>*/}
                            {/*<Image style={[styles.iconSize]}*/}
                                   {/*source={require("../images/next_icon.png")} />*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<View style={styles.itemLine} />*/}
                    {/*<TouchableOpacity underlayColor="#ffffff" style={[styles.itemLayout]} onPress={this.onPressWelcome.bind(this)}>*/}
                    {/*<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 45, paddingLeft: 10, paddingRight: 10 }}>*/}
                    {/*<Image style={[styles.iconSize, { marginRight: 15 }]}*/}
                    {/*source={require('../images/settingIcon.png')} />*/}
                    {/*<Text style={{*/}
                    {/*fontSize: 16, flex: 20,*/}
                    {/*textAlign: 'left',*/}
                    {/*color: '#1c1c1c',*/}
                    {/*}}>设置</Text>*/}
                    {/*<Image style={[styles.iconSize]}*/}
                    {/*source={require("../images/next_icon.png")} />*/}
                    {/*</View>*/}
                    {/*</TouchableOpacity>*/}

                </View>
            )
        }

    }



    _displayIcon() {

        if (Global.user_profile) {
            return {uri: Global.user_profile.headimgurl};
        } else {
            return require('../images/default_head.png');
        }

    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    centerLayout: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff00ff00'
    },
    itemLayout: {
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        width: width,
        height: 50,
        alignItems: 'center',
    },
    topView: {
        height: 120,
        width: width,
    },
    headView: {
        height: 180,
        width: width,
        backgroundColor: '#ffffff',
    },
    toolsView:
    {
        height: width / 1.5 + 30,
        //   backgroundColor: 'red',
    },
    list:
    {
        flex: 1,
        // height: width / 1.5,
    },

    typesView: {
        paddingBottom: 10,
        backgroundColor: "#fff",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    typesItem: {
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderColor: 'gray',
        borderWidth: px2dp(1),
    },
    logo: {
        width: 80,
        height: 80,
        marginTop: 50,
        borderRadius: 40,
        alignSelf: 'center',
        borderWidth:2,
        borderColor:'rgb(255,233,131)'
    },
    defaultText: {
        marginTop: 5,
        color: '#ffffff',
        fontSize: 16,
        justifyContent: "center",
        alignItems: 'center',
        fontFamily:'PingFang-SC-Medium'
    },
    flexContainer: {
        height: 80,
        // 容器需要添加direction才能变成让子元素flex
        flexDirection: 'row',
    },
    cell: {
        backgroundColor: '#ffffff',
        flex: 1,
        height: 80,
        justifyContent: "center",
        alignItems: 'center',
    },
    cellLine: {
        width: 1,
        height: 80,
        backgroundColor: '#cccccc',
    },
    itemLine: {
        marginLeft: 10,
        width: width,
        height: 0.5,
        backgroundColor: '#d5d5d5',
    },
    label: {
        fontSize: 14,
        textAlign: 'center',
        color: '#4f4f4f',
    },
    labelInfo: {


    },
    labelView:{
        alignItems: 'center',
    }
});
