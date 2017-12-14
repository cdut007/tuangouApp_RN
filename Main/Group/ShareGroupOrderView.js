/**
 * Created by Arlen_JY on 2017/11/28.
 */
/**
 * Created by Arlen_JY on 2017/11/28.
 */



import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
import HttpRequest from '../../HttpRequest/HttpRequest';
import CheckBox from 'react-native-checkbox'
import moment from 'moment';
import {CachedImage} from "react-native-img-cache";
import AgentRegisteredView from '../AgentRegisteredView';
var  WeChat = require('react-native-wechat');
var Global = require('../../common/globals');


import {
    StyleSheet,
    View,
    Text,
    Alert,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ListView

}   from 'react-native';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;


var  test = false;


export default class ShareGroupOrderView extends Component{
    constructor (props){
        super(props)


        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource:ds,
            data:[],
            agent_url:''
        }
        if (test){
            var pos = Global.agent_url.indexOf("?");
            if (pos!= -1) {
                var str = Global.agent_url.substr(pos+1);
                var agent_code = this.getQueryString('agent_code',str);
                console.log('url agent_code='+agent_code);
                this.state.agent_url = 'http://www.ailinkgo.com/test/?agent_code='+agent_code
            }

        }else {
            this.state.agent_url = Global.agent_url


        }
    }

    back(){

        this.props.navigator.pop();
    }
    componentDidMount() {
        // if (this.props.isCreateNewClassify){
        //
        // }else {
        //     let param = {}
        //
        //
        //     HttpRequest.get('/v2','/admin.classify.create', param, this.onGetClassifyListSuccess.bind(this),
        //         (e) => {
        //             console.log(' error:' + e)
        //             Alert.alert('提示','新建商品类别失败，请稍后再试。')
        //         })
        // }


                HttpRequest.get('/v2','/api.user.info', {}, this.onGetUserInfoSuccess.bind(this),
                    (e) => {
                        console.log(' usererror:' + e)
                    })



    }
    getQueryString(name,url) {
        if (!url) {
            return null
        }
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); // 匹配目标参数
        var result = url.match(reg);  // 对querystring匹配目标参数
        console.log('url result='+url);
        if (result != null) {
            return decodeURIComponent(result[2]);
        } else {
            return null;
        }
    }
    onGetUserInfoSuccess(response){
        Global.user_profile = response.data.user_profile
        Global.agent_url = response.data.user_profile.agent_url
        Global.role = response.data.user_profile.role
        let param = {}
        HttpRequest.get('/v2','/api.merchant.share.jielong', param, this.onGetShareJieLongSuccess.bind(this),
            (e) => {
                console.log(' error:' + e)
                Alert.alert('提示','获取分享接龙列表失败，请稍后再试。')
            })
    }
    onGetShareJieLongSuccess(response){

        console.log('onGetShareJieLongSuccess:'+JSON.stringify(response))
        if (response.code == 1){
            console.log('onGetShareJieLongSuccess12')
            let rowData = response.data
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(rowData)
            });
            console.log('dataSource12'+JSON.stringify(this.state.dataSource))
        }
    }


    saveClassifyTitle(){

    }
    onSharePress(dataItem){

        if (Global.role =='consumer'){

            this.props.navigator.push({

                component: AgentRegisteredView,
            })

        }else {

            var  thumbImageStr = ''
            var name = '';
            var desc = '';
            if (dataItem.goods_image == null){

            }else {
                thumbImageStr = dataItem.goods_image
            }
            if (dataItem.classify_name == null){

            }else {
                name = dataItem.classify_name
            }
            if (dataItem.desc == null){

            }else {
                desc = dataItem.desc
            }

            console.log('onSharePress11'+JSON.stringify(dataItem))
            console.log('onSharePress12'+JSON.stringify(thumbImageStr))
                WeChat.isWXAppInstalled()
                    .then((isInstalled) => {
                        if (isInstalled){
                            WeChat.shareToSession({
                                type:'news',
                                title:name,
                                description:desc ,
                                webpageUrl:this.state.agent_url,
                                thumbImage:Global.headimgurl,
                            }).cache((error) =>{
                                ToastShort(error.message);
                            });
                        }else {
                            ToastShort('没有安装微信软件，请您安装微信之后再试');

                        }
                    });

        }




    }
    disPlayIcon(item){
        if (item.goods_image == null){
            return  require('../../images/me_bj.jpg')
        }else {
            return {uri:item.goods_image}
        }
    }
    disPlayClassName(item){
        if (item == null){
            return '接龙详情';
        }else {
            return item;
        }
    }
    renderItem = (item, sectionID, rowID) => {
        var ship_timeStr = moment(item.ship_time).format("预计Y年M"+'月'+"D"+'日发货');
        var end_timeStr = moment(item.end_time).format("截团Y年M"+'月'+"D"+'日h点m分');
        // var end_time = moment(groupItem.ship_time).format("预计Y年M"+'月'+"D"+'号发货');

        return(
            <View style={{width:width,height:100,flexDirection:'row',justifyContent:'flex-start',backgroundColor:'white',marginTop:10}}>
                <View style={{flex:90}}>
                    <Image style={{marginTop:10,marginLeft:10,width:80,height:80}} source={this.disPlayIcon(item)}></Image>
                </View>
                <View style={{flex:285,flexDirection:'column',justifyContent:'flex-start',marginLeft:15}}>
                    <View style={{flex:1}}>
                        <Text style={{marginTop:10,marginRight:10,textAlign:'left',lineHeight:20}} numberOfLines={2}>{this.disPlayClassName(item.classify_name)}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
                        <View style={{flex:20}}>
                            <Text style={{marginTop:8,fontSize:12,fontFamily:'PingFangSC-Regular',color:'rgb(117,117,117)'}}>{end_timeStr}</Text>
                            <Text style={{fontSize:12,fontFamily:'PingFangSC-Regular',color:'rgb(117,117,117)'}}>{ship_timeStr}</Text>
                        </View>
                        <TouchableOpacity style={{height:26,width:80,borderWidth:1,borderRadius:20,borderColor:'rgb(234,107,16)',marginRight:5,marginTop:16}} onPress={this.onSharePress.bind(this,item)}>
                            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'rgb(234,107,16)',marginTop:5}}>分享接龙</Text>

                            </View>
                        </TouchableOpacity>

                    </View>

                </View>
            </View>
        )
    }

    render() {




        return (
            <View style={styles.container}>
                <NavBar
                    title='分享接龙'
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)}
                   />
                <ListView style={{}}
                            dataSource={this.state.dataSource}
                        renderRow={this.renderItem}
                          contentContainerStyle={styles.list}
                          initialListSize={21}
                          pageSize={10}
                          scrollRenderAheadDistance={500}
                          removeClippedSubviews={false}>

                </ListView>



            </View>




        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        // alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    list:{

    }




})