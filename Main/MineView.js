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
    AsyncStorage
} from 'react-native';
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar';
import px2dp from '../common/util';
import HttpRequest from '../HttpRequest/HttpRequest'
import CircleImage from '../common/CircleImage';
import SettingView from './SettingView';
import GroupOrderListView from './GroupOrderListView';
import AddressView from './AddressView';
import GroupMasterLinkView from './GroupMasterLinkView';
import HelpView from './HelpView';
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

    componentWillMount(){
        var me = this
        AsyncStorage.getItem('k_user_info',function(errs,result)
        {
            if (!errs && result && result.length)
            {

                //me.setState({account: JSON.parse(result)})
            }
            else
            {
                me.queryUserInfo();
                me.queryLeftCountInfo();
            }
        });
    }

    queryUserInfo(){
        console.log('queryUserInfo id:' + Global.id)
        HttpRequest.get('/v1/user/'+Global.id, null, this.onQuerySuccess.bind(this),
            (e) => {

                try {
                    var errorInfo = JSON.parse(e);
                    if (errorInfo != null && errorInfo.description) {
                        console.log(errorInfo.description)
                    } else {
                        console.log(e)
                    }
                }
                catch(err)
                {
                    console.log(err)
                }

                console.log('Login error:' + e)
            })
    }
    queryLeftCountInfo(){
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
                catch(err)
                {
                    console.log(err)
                }

                console.log('Login error:' + e)
            })
    }

    onQuerySuccess(response){
    console.log('queryUserInfo success:' + JSON.stringify(response))
      this.setState({account:response});
    }

    onQueryLeftCountSuccess(response){
    console.log('onQueryLeftCountSuccess:' + JSON.stringify(response))
    this.setState({leftCount:response.result});
    }

   onAddressPress(){
       this.props.navigator.push({
                   component: AddressView,
               })
   }
   onSettingPress(){
       this.props.navigator.push({
                   component: SettingView,
               })
   }
   onHelpPress(){
       this.props.navigator.push({
                   component: HelpView,
               })
   }
   onGroupBuyDonePress(){
       this.props.navigator.push({
                   isDoneStatus:true,
                   component: GroupOrderListView,
               })
   }
   onGroupMasterLinkPress(){
       this.props.navigator.push({
                   component: GroupMasterLinkView,
               })
   }

   onGroupBuyProgressingPress(){
       this.props.navigator.push({
                   component: GroupOrderListView,
               })
   }

    onToolsItemClick(index) {
        console.log('Did click item at:' + index)
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headView}>
                <Image style={[styles.headView,{position: 'absolute', left: 0, right: 0,}]}
                       source={require('../images/me_bj.jpg')}
                 />
                <CircleImage
                    imageStyle={styles.logo}
                    src={this._displayIcon() }
                    />
                  <View style={styles.centerLayout}>
                      <Text style={styles.defaultText}>{this.state.account.nickname}Lisa团长高优良品购</Text>
                  </View>
                </View>

                <TouchableHighlight style={[styles.itemLayout, {alignItems: "flex-start",}]}>
                    <Text style={{marginLeft:10,fontSize:16,color:'#1c1c1c',textAlign:'left'}}>我的拼团</Text>
                </TouchableHighlight>

                <View style={styles.itemLine}/>


                <View style={styles.flexContainer}>
                <TouchableHighlight style={styles.cell} onPress={this.onGroupMasterLinkPress.bind(this)}>
                <View>
                <Image style={styles.labelInfo}
                source={require('../images/link_icon.png')}
                >
                </Image>
                  <Text style={styles.label}>
                    团长链接
                  </Text>
                </View>
                </TouchableHighlight>

                <TouchableHighlight style={styles.cell} onPress={this.onGroupBuyProgressingPress.bind(this)}>
                <View>
                <Image style={styles.labelInfo}
                source={require('../images/buying_icon.png')}
                >
                </Image>
                  <Text style={styles.label}>
                    拼团中
                  </Text>
                </View>
                </TouchableHighlight>

                <TouchableHighlight style={styles.cell} onPress={this.onGroupBuyDonePress.bind(this)}>
                <View>
                <Image style={styles.labelInfo}
                source={require('../images/success_icon.png')}
                >
                </Image>
                  <Text style={styles.label}>
                    已完成
                  </Text>
                </View>
                </TouchableHighlight>
              </View>


              <TouchableHighlight underlayColor="#ffffff" style={[styles.itemLayout,{marginTop:10}]}  onPress={this.onAddressPress.bind(this)}>

                  <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#ffffff',height:45,paddingLeft:10,paddingRight:10}}>
                    <Image style={[styles.iconSize,{marginRight:15}]}
                      source={require('../images/address_icon.png')} />
                    <Text  style={{fontSize: 16,flex:20,
                     textAlign: 'left',
                     color: '#1c1c1c',}}>收货地址</Text>
                    <Image style={[styles.iconSize]}
                      source={require("../images/next_icon.png")} />
                  </View>
              </TouchableHighlight>
              <View style={styles.itemLine}/>
              <TouchableHighlight underlayColor="#ffffff" style={[styles.itemLayout]}  onPress={this.onHelpPress.bind(this)}>
              <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#ffffff',height:45,paddingLeft:10,paddingRight:10}}>
                <Image style={[styles.iconSize,{marginRight:15}]}
                  source={require('../images/help_icon.png')} />
                <Text  style={{fontSize: 16,flex:20,
                 textAlign: 'left',
                 color: '#1c1c1c',}}>帮助中心</Text>
                <Image style={[styles.iconSize]}
                  source={require("../images/next_icon.png")} />
              </View>
              </TouchableHighlight>
               <View style={styles.itemLine}/>
              <TouchableHighlight underlayColor="#ffffff" style={[styles.itemLayout]}  onPress={this.onSettingPress.bind(this)}>
              <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#ffffff',height:45,paddingLeft:10,paddingRight:10}}>
                <Image style={[styles.iconSize,{marginRight:15}]}
                  source={require('../images/setting_icon.png')} />
                <Text  style={{fontSize: 16,flex:20,
                 textAlign: 'left',
                 color: '#1c1c1c',}}>设置</Text>
                <Image style={[styles.iconSize]}
                  source={require("../images/next_icon.png")} />
              </View>
              </TouchableHighlight>

            </View>
        )
    }



    _displayIcon() {
            if (this.state.account.icon_url != null) {
                return { uri: this.state.account.icon_url };
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
    centerLayout:{
      justifyContent:'center',
      alignItems:'center',
    },
    itemLayout:{
        backgroundColor:'#ffffff',
        justifyContent:'center',
        width:width,
        height:50,
        alignItems:'center',
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
        marginTop: 30,
        alignSelf: 'center',
    },
    defaultText:{
            marginTop:10,
            color: '#ffffff',
            fontSize:16,
            justifyContent: "center",
            alignItems: 'center',
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
       itemLine:{
           marginLeft:10,
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
           fontSize: 18,
           textAlign: 'center',
           color: '#fbab3b',
       },
});
