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
    TouchableHighlight,
    ListView,
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

import Dimensions from 'Dimensions';
import Grid from 'react-native-grid-component';
import NavBar from '../common/NavBar'
import px2dp from '../common/util'
import ProductDetail from './ProductDetail'
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import LoginView from '../Login/LoginView'


export default class ProductCatagoryListView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state={
            goods:{description:''},
            dataSource:ds,
        }
    }


    onItemClick(prouduct){

    }


    renderProductView() {
         var categoryDataAry = [];
         var displayCategoryAry = [];

          categoryDataAry.push({id:'meat',name:'品质水果',prouductItems:toolsData,countdown:'201123232'},);

            for (var i = 0; i<categoryDataAry.length; i++) {
                displayCategoryAry.push(
                        <View style={{margin:5}}>
                        <View style = {styles.brandLabelContainer}>
                            {/* <Image style={{resizeMode:'contain', alignItems:'center',
                  justifyContent:'center'}} source={require('../images/login_wechat.png')}/> */}
                            <Text style={{fontSize:16,color:'#1b1b1b'}}>
                                {categoryDataAry[i].name}
                            </Text>
                            </View>
                        {this.renderCategorysView(categoryDataAry[i].prouductItems)}
                        <View style = {{flex:1,justifyContent:'flex-end',alignItems: 'flex-end',marginRight:5}}>

                        </View>
                        </View>
            );
            }
            return displayCategoryAry;
    }




    componentDidMount() {
        var prouduct = this.props.prouduct;
        this.setState({
          goods: prouduct,
        });
        this._fetchGoods(prouduct.spec_id);
    }

    _fetchGoods(spec_id) {

    var thiz = this;
    // Util.post(API.GOODSDETAIL,{'spec_id':spec_id},function (ret){
    //   if(ret.code==0){
    //     thiz.setState({
    //       goods: ret.data,
    //     });
    //   }else{
    //     alert(ret.msg);
    //   }
    // });
    this.onFetch();
    }

    clickBack() {
     this.props.navigator.pop()
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title="品质水果"
                leftIcon={require('../images/back.png')}
                leftPress={this.clickBack.bind(this)}/>
                {this.renderProductCategoryView()}
            </View>
        )
    }


    sleep = (time) => {
       return new Promise(resolve => {
           setTimeout(() => resolve(), time);
       })
   };

   onFetch = async(page = 1, startFetch, abortFetch) => {
       try {
           //This is required to determinate whether the first loading list is all loaded.
           let pageLimit = 24;
           pageLimit = 60;
           let skip = (page - 1) * pageLimit;

           //Generate dummy data
           let rowData = Array.from({length: pageLimit}, (value, index) => `item -> ${index + skip}`);

           //Simulate the end of the list if there is no more data returned from the server
           if (page === 10) {
               rowData = [];
           }
           this.setState({
                   dataSource: this.state.dataSource.cloneWithRows(rowData),
                   isLoading: false,
               });
           //Simulate the network loading in ES7 syntax (async/await)
           await this.sleep(2000);
           startFetch(rowData, pageLimit);
       } catch (err) {
           abortFetch(); //manually stop the refresh or pagination if it encounters network error
           console.log(err);
       }
   };

   renderItem = (item, sectionID, rowID) => {
       //write your own layout in list view
       let w = (width - 20) / 2
       return(<TouchableHighlight underlayColor="#dad9d7" style={[styles.row]} onPress={this.onPress.bind(this)}>
              <View style={[styles.row]}>

                   <Image style={{resizeMode:'contain', alignItems:'center',
                   justifyContent:'center',width:w,
                   flex:2}}
                   source={{uri:'http://img1.3lian.com/2015/a1/53/d/198.jpg'}}
                   />
                   <Text style={{resizeMode:'contain', alignItems:'center',
                   justifyContent:'center',margin:2,
                   flex:1}}>山东烟台大樱桃新鲜水果 露天车厘子美早红灯黑珍珠</Text>
               </View>
               </TouchableHighlight>
           )
   };

   onPress = (index, item) => {
       this.props.navigator.push({
          component: ProductDetail,
           props: {
               prouduct:item,
              }
      })
   };

    renderProductCategoryView() {
        var goods = this.state.goods;
        // if(!goods){
        //     return <Loading loadingtext='正在加载商品...'/>
        // }
        var htmlContent = goods.description||"";
        return (
            <ScrollView>
                <View style={styles.container}>
                <ListView
                      contentContainerStyle={styles.list}
                      dataSource={this.state.dataSource}
                      initialListSize={21}
                      pageSize={3}
                      scrollRenderAheadDistance={500}
                      renderRow={this.renderItem}
                      removeClippedSubviews={false}
                    />
                </View>
            </ScrollView>
        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },

    thumb: {
        width: 60,
        height: 60,
        marginRight: 10
    },
    list: {
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    row: {
        justifyContent: 'center',
        padding: 5,
        margin: 3,
        width: (width-20)/2,
        height: 160,
        backgroundColor: '#F6F6F6',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#CCC'
    },
    line1:{
        height:1,
        backgroundColor:'#dadce2'
    },
    line10:{
        height:10,
        backgroundColor:'#ebeef1'
    },
    textprimary:{
        fontSize:18,
        color:'#4a4d52',
    },
    textsecond:{
        fontSize:18,
        color:'#929aa2',
    },
    textPrice:{
        fontSize:18,
        color:'#fb7e00',
    },
    marginTop10:{
        marginTop:15,
    },
    paddingLeftRight:{
        paddingLeft:10,
        paddingRight:10,
    },
    scrollSpinner: {
        marginVertical: 20,
    },
    rowSeparator: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height: 10,
    },
    rowSeparatorHide: {
        opacity: 0.0,
    },
    line:{
        height:1,
        backgroundColor: '#eef0f3',
    },

});
