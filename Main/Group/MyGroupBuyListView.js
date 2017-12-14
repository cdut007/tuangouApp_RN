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
    ListView,
    RefreshControl,
    DeviceEventEmitter,//引入监听事件
}   from 'react-native';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class MyGroupBuyListView extends Component{
    constructor (props){
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {

            group_list:[],
            dataSourceArr:[],
            isRefreshing:false,
            isNoMoreData: false,
            cachedData:[],
            currentPage:1,
            dataSource:ds,


        }
    }

    back(){

        this.props.navigator.pop();
    }
    componentDidMount() {
        this.fetchData();
        DeviceEventEmitter.addListener('ChangeGroupBuyListViewUI',(dic)=>{
            //接收到新建商品页发送的通知，刷新商品类别页的数据，刷新UI
            console.log('ChangeProductManagerUI:11')
            this.fetchData();
            // let param = {pageSize:20,currentPage:1}
            //
            // HttpRequest.get('/v2','/admin.goods.set', param, this.onGetCategorySuccess.bind(this),
            //     (e) => {
            //         console.log(' error:' + e);
            //         Alert.alert('提示','获取商品类别失败，请稍后再试。')
            //     })
        });
    }

    fetchData() {



        this.state.currentPage = 1;
        let param = {currentPage:this.state.currentPage,pageSize:10}

        HttpRequest.get('/v2','/admin.merchant.groupbuying.list', param, this.onGetGroupListSuccess.bind(this),
            (e) => {
                console.log(' error:' + e)
                Alert.alert('提示','获取接龙失败，请稍后再试。')
            })

    }
    fetchMoreData(){

        console.log(' fetchMoreData12:' + this.state.currentPage);

        let param = {currentPage:this.state.currentPage,pageSize:10}

        HttpRequest.get('/v2','/admin.merchant.groupbuying.list', param, this.onGetMoreGroupListSuccess.bind(this),
            (e) => {
                console.log(' error:' + e)
                Alert.alert('提示','获取接龙失败，请稍后再试。')
            })

    }
    _endReached = () => {

        if (this.state.isNoMoreData){
            console.log('_endReached1')
        }else {
            this.state.currentPage  += 1
            console.log('_endReached2')
            console.log('_endReached3:'+this.state.currentPage)
            // 获取数据
            this.fetchMoreData();
        }


    }
    reloadData(){


        this.setState({isNoMoreData: false});
        setTimeout(() => {
            this.fetchData();
        }, 2000);
    }
    onGetGroupListSuccess(response){
        console.log('onGetGroupListSuccess:'+JSON.stringify(response))
        if (response.code == 1){

            this.state.dataSourceArr = []
            let rowData = response.data.groupbuying_list
            if (response.data.groupbuying_list.length == 0){

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(rowData),
                    dataSourceArr:rowData

                })
            }else {

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(rowData),

                    dataSourceArr:rowData
                });
            }
        }
    }
    onGetMoreGroupListSuccess(response){
        console.log('onGetGroupListSuccess:'+JSON.stringify(response))
        if (response.code == 1){
            console.log('group_list')


            if(response.data.groupbuying_list.length < 10) {
                this.setState({
                    isNoMoreData: true
                });
            }else {
                this.setState({
                    isNoMoreData: false
                });
            }
            this.state.cachedData = []
            this.state.cachedData = response.data.groupbuying_list;
            console.log('onGetMoreCategorySuccess332:'+JSON.stringify(this.state.cachedData))
            let testArr =  this.state.dataSourceArr.concat(this.state.cachedData)

            this.state.dataSourceArr = testArr
            console.log('onGetMoreCategorySuccess334:'+JSON.stringify(this.state.dataSourceArr))
            this.setState({

                dataSource:this.state.dataSource.cloneWithRows(this.state.dataSourceArr)
            });
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
    renderItem = (item, sectionID, rowID) => {
        var imageUri ='';
        var jielongStr='';
        var jielongColor ='';
        if (item.status =='1'){
            jielongStr='待分享';
            jielongColor ='rgb(235,29,24)';


        }else if (item.status =='2'){
            jielongStr='接龙中';
            jielongColor ='rgb(234,107,16)';
        }else {
            jielongStr='已截团';
            jielongColor ='rgb(117,117,117)';
        }

        if ( item.image ==''){
            imageUri =require('../../images/me_bj.jpg')
        } else if (item.image == null){
            imageUri =require('../../images/me_bj.jpg')
        }else {
            imageUri = {uri: item.image};
            {/*imageUri =require('../../images/me_bj.jpg')*/}
            console.log('imageUri12:'+JSON.stringify(imageUri))
        }
        return(
            <View style={{marginTop:10,backgroundColor:'white',borderRadius:6}}>
                <View style={{flexDirection:'row',justifyContent:'flex-start',height:136,width:width-20}}>
                    <View style={{flexDirection:'column',justifyContent:'flex-start',paddingLeft:10,position: 'absolute', top: 0, left: 0,bottom: 0}}>
                        <View style={styles.classifyListTitleContainer}>
                            <Text style={styles.classifyListTitle} >{item.name}</Text>
                        </View>
                        <View style={styles.classifyListDescContainer}>

                                <Text style={styles.classifyListDesc} numberOfLines={3}>{item.desc}</Text>
                                <Image style={styles.classifyListImg} source={imageUri}></Image>

                        </View>
                    </View>
                    <View style={{flexDirection:'column',justifyContent:'flex-start',width:75,position: 'absolute', top: 10, right: 10,bottom: 10}}>
                        <Text style={{color:jielongColor,position: 'absolute', top: 0, right: 0}}>{jielongStr}</Text>
                        <TouchableOpacity style={{position: 'absolute', bottom: 0, right: 0}} onPress={this.onEditGroupPress.bind(this,item)}>
                            <Image style={{width:30,height:30}} source={require('../../images/edit1Icon.png')}></Image>
                        </TouchableOpacity>

                    </View>
                </View>


            </View>
        )
    }
    renderClassifyScrollView(classListArr){
        var displayClassListArr =[];
        var timetitle ='';
        // var groupProductNum = this.state.groupProductArr.length
        for (var i = 0;i < classListArr.length;i++){
            var classItem = classListArr[i];

            displayClassListArr.push(
               )
        }

        return displayClassListArr;
    }
    render() {


        // let classifyCount = this.state.dataSourceArr.length
        // var scrollViewHeight = 146 *classifyCount
        // if (146*classifyCount > height - 49){
        //     scrollViewHeight = height - 116
        // }else {
        //
        // }
        console.log('rendergroup_list:'+JSON.stringify(this.state.dataSourceArr))
        return (
            <View style={styles.container}>
                <NavBar
                    title="我发起的接龙"
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)} />

                <View>


                    <ListView style={{backgroundColor:'rgb(242,242,242)',marginRight:10,marginLeft:10,height:height-120}}
                              dataSource={this.state.dataSource}
                              renderRow={this.renderItem}
                              showsHorizontalScrollIndicator={false}
                              showsVerticalScrollIndicator={false}
                              initialListSize={10}
                              pageSize={10}
                              scrollRenderAheadDistance={500}
                              removeClippedSubviews={false}
                              refreshControl={
                                  <RefreshControl
                                      refreshing={this.state.isRefreshing}
                                      onRefresh={this.reloadData.bind(this)}
                                  />}
                              onEndReached={() => this._endReached()}
                              onEndReachedThreshold={20}>

                    </ListView>
                </View>


                <TouchableOpacity style={{position:'absolute',bottom:0,flex:3}} onPress={this.OnNewGroupPress.bind(this)}>
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

        width:width-90,
        // backgroundColor:'blue',


    },
    classifyListTitle:{
        marginTop:10,
        color: 'black',
        fontSize:16,
        fontFamily:'PingFangSC-Regular',
        textAlign:'left',
        lineHeight:22

    },
    classifyListDescContainer:{

        flexDirection:'row',
        justifyContent:'flex-start',
        backgroundColor:'white',
        marginTop:10,
        marginRight:10,
        width:width-100,
        // backgroundColor:'gray'


    },
    classifyListDesc:{
        // backgroundColor:'red',
        color: 'rgb(120,120,120)',
        fontSize:14,
        fontFamily:'PingFangSC-Regular',
        textAlign:'left',
        marginRight:10,
        lineHeight:20,
        width:width-160,

    },
    classifyListImg:{

        width:50,
        height:50,

    },
    list:{


    },




})