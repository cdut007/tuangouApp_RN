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


    onToolsItemClick(index) {
        console.log('Did click item at:' + index)
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headView}>
                <CircleImage
                    imageStyle={styles.logo}
                    src={this._displayIcon() }
                    />
                  <View style={styles.centerLayout}>
                      <Text style={styles.defaultText}>{this.state.account.nickname}</Text>
                  </View>
                </View>

                <TouchableHighlight style={[styles.itemLayout, { marginTop: 8 }]}>
                    <Text style={styles.labelInfo}>我的拼团</Text>
                </TouchableHighlight>


                <View style={styles.flexContainer}>
                <View style={styles.cell}>
                <Text style={styles.labelInfo}>
                  ¥0.00
                </Text>
                  <Text style={styles.label}>
                    拼团中
                  </Text>
                </View>

                <View style={styles.cellLine}/>
                <View style={styles.cell}>
                <Text style={styles.labelInfo}>
                  {this.state.leftCount}
                </Text>
                  <Text style={styles.label}>
                    待发货
                  </Text>
                </View>
                <View style={styles.cellLine}/>
                <View style={styles.cell}>
                <Text style={styles.labelInfo}>
                  3
                </Text>
                  <Text style={styles.label}>
                    已完成
                  </Text>
                </View>
              </View>



              <TouchableHighlight style={[styles.itemLayout, { marginTop: 8 }]}>
                  <Text style={styles.label}>团长链接</Text>
              </TouchableHighlight>
              <View style={styles.itemLine}/>
              <TouchableHighlight style={[styles.itemLayout]}>
                  <Text style={styles.label}>收货地址</Text>
              </TouchableHighlight>
              <View style={styles.itemLine}/>
              <TouchableHighlight style={[styles.itemLayout]}>
                  <Text style={styles.label}>帮助中心</Text>
              </TouchableHighlight>
               <View style={styles.itemLine}/>
              <TouchableHighlight style={[styles.itemLayout]}>
                  <Text style={styles.label}>设置</Text>
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
        backgroundColor: '#F5FCFF',
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
        height: 200,
        width: width,
        backgroundColor: '#1a8eaf',
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
            fontSize:20,
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
           width: width,
           height: 1,
           backgroundColor: '#cccccc',
       },
       label: {
           fontSize: 18,
           textAlign: 'center',
           color: '#000000',
       },
       labelInfo: {
           fontSize: 18,
           textAlign: 'center',
           color: '#fbab3b',
       },
});
