/**
 * Created by Arlen_JY on 2017/11/28.
 */
/**
 * Created by Arlen_JY on 2017/11/27.
 */


import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
import HttpRequest from '../../HttpRequest/HttpRequest';
import CheckBox from 'react-native-checkbox'



import {
    StyleSheet,
    View,
    Text,
    Alert,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter,//引入监听事件
}   from 'react-native';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class NewClassifyTitleView extends Component{
    constructor (props){
        super(props)

        this.state = {
            page_Title:'',
            classify_list:[1,2,3,4,5],
            classify_title:'',
            classify_desc:'',


        }
        if (this.props.isCreateNewClassify){
            this.state.page_Title = '新建接龙标题'
        }else {
            this.state.page_Title = '编辑接龙标题';
            this.state.classify_title = this.props.classItem.name;
            this.state.classify_desc = this.props.classItem.desc;
        }
    }

    back(){

        this.props.navigator.pop();
    }
    componentDidMount() {
        if (this.props.isCreateNewClassify){

        }else {

        }

    }
    onGetClassifyListSuccess(response){
        console.log('onGetClassifyListSuccess:'+JSON.stringify(response))
        if (response.code == 1){
            console.log('onGetClassifyListSuccess12')
            this.setState({
                classify_list:response.data.classify_list
            })
        }
    }


    saveClassifyTitle(){
        if (this.state.classify_title == ''){
            Alert.alert('提示','接龙标题不可为空。')
            return
        }
        if (this.state.classify_desc == ''){
            Alert.alert('提示','接龙描述不可为空。')
            return
        }
        if (this.props.isCreateNewClassify){
            let param = {name:this.state.classify_title,desc:this.state.classify_desc}

            HttpRequest.post('/v2','/admin.classify.create', param, this.onNewClassifyTitleSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                    Alert.alert('提示','保存接龙标题失败，请稍后再试。')
                })
        }else {
            let param = {name:this.state.classify_title,desc:this.state.classify_desc,id:this.props.classItem.id}

            HttpRequest.post('/v2','/admin.classify.update', param, this.onUpdateClassifyTitleSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                    Alert.alert('提示','修改接龙标题失败，请稍后再试。')
                })
        }


    }
    onNewClassifyTitleSuccess(response){
        console.log('onNewClassifyTitleSuccess11:'+JSON.stringify(response))

            DeviceEventEmitter.emit('ChangeClassifyListViewUI');
            this.props.navigator.pop();



    }
    onUpdateClassifyTitleSuccess(response){
        console.log('onUpdateClassifyTitleSuccess11:'+JSON.stringify(response))
        DeviceEventEmitter.emit('ChangeClassifyListViewUI');
        this.props.navigator.pop();
    }
    render() {



        let page_title = this.state.page_Title
        return (
            <View style={styles.container}>
                <NavBar
                    title={page_title}
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)}
                    rightTitle={'保存'}
                    rightPress={this.saveClassifyTitle.bind(this)}/>

                <View style={{}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 }}>
                        <Text style={[ { width: 70, marginRight: 15, color: '#1b1b1b', fontSize: 16, }]}>
                            接龙标题:
                        </Text>
                        <TextInput style={{
                            marginLeft: 0, fontSize: 16, flex: 20,
                            textAlign: 'left', color: '#1c1c1c',fontFamily:'PingFangSC-Regular'
                        }}  keyboardType={'default'}
                                   editable={true}
                                   placeholder ='请输入接龙标题'
                                   underlineColorAndroid='transparent'
                                   returnKeyType={'done'}
                                   maxLength={26}
                                   numberOfLines={2}
                                   onChangeText={(text) => this.setState({ classify_title: text })}
                                   value= {this.state.classify_title}
                        ></TextInput>


                    </View>
                </View>
                <View style={{marginLeft:10,marginRight:10,height:1,backgroundColor:'rbg(219,219,219)'}}></View>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start',backgroundColor: '#ffffff',height:200}}>
                    <View style={{flex:79, paddingLeft: 10,paddingTop: 15}}>
                        <Text style={[ { width: 70, color: '#1b1b1b', fontSize: 16, }]}>
                            接龙描述:
                        </Text>



                    </View>
                    <View style={{flexDirection: 'column', justifyContent: 'flex-start',flex:286}}>
                        <TextInput style={{
                           marginRight:10, fontSize: 16,height:height-510,marginTop: 10,
                            textAlign: 'left', color: '#1c1c1c',fontFamily:'PingFangSC-Regular'
                        }}  keyboardType={'default'}
                                   blurOnSubmit ={true}
                                   multiline={true}
                                   editable={true}
                                   numberOfLines={4}
                                   underlineColorAndroid='transparent'
                                   placeholder ='请输入对本次接龙主要商品的描述'
                                   returnKeyType={'done'}
                                   maxLength={40}
                                   onChangeText={(text) => this.setState({ classify_desc: text })}
                                   value= {this.state.classify_desc}
                        ></TextInput>
                    </View>

                </View>


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






})