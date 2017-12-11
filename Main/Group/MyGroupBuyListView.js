/**
 * Created by Arlen_JY on 2017/11/29.
 */



import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
import HttpRequest from '../../HttpRequest/HttpRequest';
import CheckBox from 'react-native-checkbox'
import NewClassifyTitleView from './NewClassifyTitleView'
import NewGroupView from './NewGroupView'
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

export default class MyGroupBuyListView extends Component{
    constructor (props){
        super(props)

        this.state = {

            group_list:[]


        }
    }

    back(){

        this.props.navigator.pop();
    }
    componentDidMount() {
        let param = {currentPage:1,pageSize:10}

        HttpRequest.get('/v2','/admin.merchant.groupbuying.list', param, this.onGetGroupListSuccess.bind(this),
            (e) => {
                console.log(' error:' + e)
                Alert.alert('提示','获取接龙失败，请稍后再试。')
            })
        DeviceEventEmitter.addListener('ChangeGroupBuyListViewUI',(dic)=>{
            //接收到新建商品页发送的通知，刷新商品类别页的数据，刷新UI
            console.log('ChangeProductManagerUI:11')

            let param = {currentPage:1,pageSize:10}

            HttpRequest.get('/v2','/admin.merchant.groupbuying.list', param, this.onGetGroupListSuccess.bind(this),
                (e) => {
                    console.log(' error:' + e)
                    Alert.alert('提示','获取接龙失败，请稍后再试。')
                })
            // let param = {pageSize:20,currentPage:1}
            //
            // HttpRequest.get('/v2','/admin.goods.set', param, this.onGetCategorySuccess.bind(this),
            //     (e) => {
            //         console.log(' error:' + e);
            //         Alert.alert('提示','获取商品类别失败，请稍后再试。')
            //     })
        });
    }
    onGetGroupListSuccess(response){
        console.log('onGetGroupListSuccess:'+JSON.stringify(response))
        if (response.code == 1){
            console.log('group_list')
            this.setState({
                group_list:response.data.groupbuying_list
            })
        }
    }
    OnNewGroupPress(){
        this.props.navigator.push({
            component: NewGroupView,
            name: 'NewGroupView',
            props:{
                isCreateNewGroup:true
            }
        })
    }
    onEditGroupPress(classItem){
        console.log('onEditGroupPress11:'+JSON.stringify(classItem))
        this.props.navigator.push({
            component: NewGroupView,
            name: 'NewGroupView',
            props:{
                isCreateNewGroup:false,
                groupItem:classItem
            }
        })
    }
    OnProductManagerPress(){
        this.props.navigator.push({
            component: ProductManager
        })

    }
    OnMemberManagerPress(){

    }
    onEditClassifyTitle(){
        this.props.navigator.push({
            component: NewClassifyTitleView,
            props:{
                isCreateNewClassify:false
            }
        })
    }
    onNewClassifyTitle(){
        this.props.navigator.push({
            component: NewClassifyTitleView,
            props:{
                isCreateNewClassify:true
            }
        })
    }
    renderGroupProductArr(GroupProductArr){
        const w = (width-10)/ 5.6 , h = w
        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (

                                <View style={[{ width: w, height: h}, styles.toolsItem]}>
                                    <Image style={{width: w-5, height: h-5,margin:5}}
                                           source={require('../../images/me_bj.jpg')}
                                    >

                                    </Image>




                                </View>
                            )
                            return (
                                <TouchableOpacity style={{ width: w, height: h }} key={i} onPress={() => { this.onItemClick(item) }}>{render}</TouchableOpacity>
                            )
                        })
                    }
                </View>
            )
        }
        return (
            renderSwipeView(GroupProductArr)
        )
    }
    renderCheckBox() {
        // if (!item) {
        //     return ({})
        // }

        return (<CheckBox

            label=''
            checkedImage={require('../../images/choose_one_click.png')}
            uncheckedImage={require('../../images/choose_one.png')}
            checked={true}

        />)
    }
    renderClassifyScrollView(classListArr){
        var displayClassListArr =[];
        var timetitle ='';
        // var groupProductNum = this.state.groupProductArr.length
        for (var i = 0;i < classListArr.length;i++){
            var classItem = classListArr[i];
            var imageUri ='';
            if ( classItem.image ==''){
                imageUri =require('../../images/me_bj.jpg')
            }else {
                imageUri = {uri: classItem.image};
                {/*imageUri =require('../../images/me_bj.jpg')*/}
                console.log('imageUri12:'+JSON.stringify(imageUri))
            }
            displayClassListArr.push(
                <View style={{marginTop:10,backgroundColor:'white',borderRadius:6}}>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',height:136,width:width-20}}>
                        <View style={{flexDirection:'column',justifyContent:'flex-start',flex:293,paddingLeft:10}}>
                            <View style={styles.classifyListTitleContainer}>
                                <Text style={styles.classifyListTitle}>{classItem.name}</Text>
                            </View>
                            <View style={styles.classifyListDescContainer}>
                                <Text style={styles.classifyListDesc} numberOfLines={3}>{classItem.desc}</Text>
                                <Image style={styles.classifyListImg} source={imageUri}></Image>
                            </View>
                        </View>
                        <View style={{flex:62,flexDirection:'column',justifyContent:'flex-start'}}>

                            <TouchableOpacity style={{position: 'absolute', bottom: 10, right: 10}} onPress={this.onEditGroupPress.bind(this,classItem)}>
                                <Image style={{width:30,height:30}} source={require('../../images/edit1Icon.png')}></Image>
                            </TouchableOpacity>

                        </View>
                    </View>


                </View>)
        }

        return displayClassListArr;
    }
    render() {


        let classifyCount = this.state.group_list.length
        var scrollViewHeight = 146 *classifyCount
        if (146*classifyCount > height - 49){
            scrollViewHeight = height - 116
        }else {

        }

        return (
            <View style={styles.container}>
                <NavBar
                    title="我发起的接龙"
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)} />

                <View style={{}}>
                    <ScrollView
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={false}

                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}



                        style={{width:width-20,backgroundColor:'#f2f2f2',height:scrollViewHeight,marginLeft:10,marginRight:10,}}
                    >
                        {this.renderClassifyScrollView(this.state.group_list)}

                    </ScrollView>

                </View>
                <TouchableOpacity style={{position:'absolute',bottom:0,}} onPress={this.OnNewGroupPress.bind(this)}>
                    <View style={{width:width,height:49,backgroundColor:'rgb(234,107,16)',   justifyContent: 'center',
                        alignItems: 'center',}}>
                        <Text style={{color:'white',fontFamily:'PingFang-SC-Medium',fontSize:18}}>新建接龙</Text>
                    </View>
                </TouchableOpacity>



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
    classifyListTitleContainer:{
        flex:64,



    },
    classifyListTitle:{
        marginTop:6,
        marginRight:5,
        color: 'black',
        fontSize:16,
        fontFamily:'PingFangSC-Regular',
        textAlign:'left',

    },
    classifyListDescContainer:{
        flex:72,
        flexDirection:'row',
        justifyContent:'flex-start',
        backgroundColor:'white',

    },
    classifyListDesc:{
        flex:10,
        color: 'rgb(120,120,120)',
        fontSize:14,
        fontFamily:'PingFangSC-Regular',
        textAlign:'left',
    },
    classifyListImg:{
        flex:2,
        width:50,
        height:50
    },




})