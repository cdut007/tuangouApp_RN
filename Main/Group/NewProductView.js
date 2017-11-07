/**
 * Created by Arlen_JY on 2017/11/6.
 */
import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import CommitButton from '../../common/CommitButton'
import Dimensions from 'Dimensions';
import CheckBox from 'react-native-checkbox'
import {
    StyleSheet,
    View,
    Text,
    Alert,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity
}   from 'react-native';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
export default class NewProductView extends Component{
            constructor (props){
                super(props)

                this.state = {
                    productImgArr :[1,2,3,4,5,6,7],
                    productName :'',
                    productPrice:'',
                    productTypeDetail:'',
                    productStock:'',
                    DetailsDescription:'',
                    isSGD: true,
                    SGDColor:'#1b1b1b',
                    RMBColor:'rbg(174,174,174)'



                }
            }

            back(){

                this.props.navigator.pop();
            }
    onItemClick(){

    }
             renderProductImgView(productImgArr){
                 const w = (width-10)/ 4 , h = w
                 let renderSwipeView = (types, n) => {
                     return (
                         <View style={styles.toolsView}>
                             {
                                 types.map((item, i) => {
                                     let render = (

                                         <View style={[{ width: w, height: h}, styles.toolsItem]}>
                                             <Image style={{width: w-10, height: h-10,margin:10}}
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
                     renderSwipeView(productImgArr)
                 )

               }

             saveGroupBuy(){


     }
            render() {
                const ItemW = (width-10)/4, ItemH = (width-50)/4* 1.5

                if (this.state.isSGD){
                   this.state.SGDColor = '#1b1b1b';
                    this.state.RMBColor ='rbg(174,174,174)';
                }else {
                    this.state.SGDColor = 'rbg(174,174,174)';
                    this.state.RMBColor ='#1b1b1b';
                }

                  return (
                         <View style={styles.container}>
                              <NavBar
                                 title="新建商品"
                                   leftIcon={require('../../images/back.png')}
                                  leftPress={this.back.bind(this)} />
                             <View style={{backgroundColor:'#f2f2f2'}}>
                                 <ScrollView
                                     keyboardDismissMode='on-drag'
                                     keyboardShouldPersistTaps={false}
                                     horizontal={true}
                                     showsHorizontalScrollIndicator={false}
                                     showsVerticalScrollIndicator={false}


                                     contentContainerStyle={{width:ItemW*this.state.productImgArr.length+1,height:ItemH}}
                                     style={{width:width,height:ItemH}}
                                 >

                                     {this.renderProductImgView(this.state.productImgArr)}
                                 </ScrollView>

                             </View>
                             <View style={{}}>
                                 <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 }}>
                                     <Text style={[ { width: 70, marginRight: 15, color: '#1b1b1b', fontSize: 16, }]}>
                                         商品名称:
                                     </Text>
                                     <TextInput style={{
                        marginLeft: 0, fontSize: 16, flex: 20,
                        textAlign: 'left', color: '#1c1c1c',
                    }}  keyboardType={'default'}
                                                editable={true}

                                                onChangeText={(text) => this.setState({ productName: text })}
                                                value= {this.state.productName}
                                                returnKeyType={'done'}
                                     ></TextInput>

                                 </View>
                                 <View style={{marginLeft:10,marginRight:10,height:0.5,backgroundColor:'rbg(219,219,219)'}}></View>
                                 <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 }}>
                                     <Text style={[ { width: 70, marginRight: 15, color: '#1b1b1b', fontSize: 16, }]}>
                                         商品价格:
                                     </Text>
                                     <TextInput style={{
                        marginLeft: 0, fontSize: 16, flex: 20,
                        textAlign: 'left', color: '#1c1c1c',
                    }}  keyboardType={'numeric'}
                                                placeholder ='0.00'
                                                editable={true}
                                                returnKeyType={'done'}
                                                onChangeText={(text) => this.setState({ productPrice: text })}
                                                value= {this.state.productPrice}
                                     ></TextInput>
                                     <CheckBox

                                         label=''
                                         checkedImage={require('../../images/chooseOneClickCopy@2x.png')}
                                         uncheckedImage={require('../../images/choose_one.png')}
                                         checked={this.state.isSGD == null ? true : this.state.isSGD}
                                         onChange={(checked) => {
                                                this.state.isSGD = ! this.state.isSGD ;
                                                  if (this.state.isSGD){
                   this.state.SGDColor = '#1b1b1b';
                    this.state.RMBColor ='rbg(174,174,174)';
                }else {
                    this.state.SGDColor = 'rbg(174,174,174)';
                    this.state.RMBColor ='#1b1b1b';
                }
                                                 this.setState({ ...this.state });
            }
            }
                                     />
                                     <Text style={[ { width: 70, marginRight: 15, color: this.state.SGDColor, fontSize: 14, }]}>
                                         S$
                                     </Text>
                                     <CheckBox

                                         label=''
                                         checkedImage={require('../../images/chooseOneClickCopy@2x.png')}
                                         uncheckedImage={require('../../images/choose_one.png')}
                                         checked={this.state.isSGD == null ? false : !this.state.isSGD}
                                         onChange={(checked) => {
                                                this.state.isSGD = ! this.state.isSGD ;
                                                  if (this.state.isSGD){
                   this.state.SGDColor = '#1b1b1b';
                    this.state.RMBColor ='rbg(174,174,174)';
                }else {
                    this.state.SGDColor = 'rbg(174,174,174)';
                    this.state.RMBColor ='#1b1b1b';
                }
                                                 this.setState({ ...this.state });
            }
            }
                                     />
                                     <Text style={[ { width: 70, marginRight: 15, color: this.state.RMBColor, fontSize: 16 }]}>
                                         ¥
                                     </Text>

                                 </View>
                             </View>

                             <View style={{marginTop: 10}}>
                                 <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 }}>
                                     <Text style={[ { width: 70, marginRight: 15, color: '#1b1b1b', fontSize: 16}]}>
                                         单位详情:
                                     </Text>
                                     <TextInput style={{
                        marginLeft: 0, fontSize: 16, flex: 20,
                        textAlign: 'left', color: '#1c1c1c',
                    }}  keyboardType={'default'}
                                                placeholder ='1kg／件'
                                                editable={true}
                                                returnKeyType={'done'}
                                                onChangeText={(text) => this.setState({ productTypeDetail: text })}
                                                value= {this.state.productTypeDetail}
                                     ></TextInput>

                                 </View>
                                 <View style={{marginLeft:10,marginRight:10,height:0.5,backgroundColor:'rbg(219,219,219)'}}></View>
                                 <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#ffffff', height: 50, paddingLeft: 10, paddingRight: 10 }}>
                                     <Text style={[ { width: 70, marginRight: 15, color: '#1b1b1b', fontSize: 16, }]}>
                                         商品库存:
                                     </Text>
                                     <TextInput style={{
                        marginLeft: 0, fontSize: 16, flex: 20,
                        textAlign: 'left', color: '#1c1c1c',
                    }}  keyboardType={'numeric'}
                                                editable={true}
                                                returnKeyType={'done'}
                                                onChangeText={(text) => this.setState({ productStock: text })}
                                                value= {this.state.productStock}
                                     ></TextInput>


                                 </View>
                             </View>
                             <View style={{marginTop:10,flexDirection: 'column', justifyContent: 'flex-start',backgroundColor: '#ffffff',height:200}}>
                                 <View style={{height: 46, paddingLeft: 10, paddingRight: 10 ,paddingTop: 15}}>
                                     <Text style={[ { width: 70, marginRight: 15, color: '#1b1b1b', fontSize: 16, }]}>
                                         详情描述:
                                     </Text>



                                 </View>
                                 <View style={{flexDirection: 'column', justifyContent: 'flex-start'}}>
                                     <TextInput style={{
                        marginLeft: 10,marginRight:10, fontSize: 16,height:100,
                        textAlign: 'left', color: '#1c1c1c',
                    }}  keyboardType={'default'}
                                                blurOnSubmit ={true}
                                                multiline={true}
                                                editable={true}
                                                returnKeyType={'done'}
                                                onChangeText={(text) => this.setState({ DetailsDescription: text })}
                                                value= {this.state.DetailsDescription}
                                     ></TextInput>
                                 </View>

                             </View>

                             <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 ,paddingTop:0}}><CommitButton title={'保存商品'} onPress={this.saveGroupBuy.bind(this)}></CommitButton></View>
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
    toolsView: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'flex-start',
        // alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    toolsItem: {
        justifyContent: "flex-start",
        // alignItems: "center",
        backgroundColor:'#f2f2f2'

    },


})