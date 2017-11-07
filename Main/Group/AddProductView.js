/**
 * Created by Arlen_JY on 2017/11/7.
 */

import React,{ Component} from 'react';
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions';
import NewGroupView from './NewGroupView'
import NewProductView from './NewProductView'


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
export default class AddProductView extends Component{
    constructor (props){
        super(props)

        this.state = {

            isHaveProductInGroup:false


        }
    }

    back(){

        this.props.navigator.pop();
    }

    OnNewProductPress(){
        this.props.navigator.push({
            component: NewProductView
        })
    }

    renderGroupScrollView(groupArr){

    }
    renderAddProductContent(){
        if (this.state.isHaveProductInGroup){

        }else {
            return (
                <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center'}}>
                    <View style={{flexDirection:'column',justifyContent: 'center',alignItems:'center',height:80,width:width-160,marginTop:height/3}}>
                        <Text style={{color:'rgb(193,193,193)',textAlign:'center',fontSize:14,fontFamily:'PingFangSC-Regular'}}>
                            还未上传任何商品，请先上传商品
                        </Text>
                        <View style={{height:40,width:width-240,backgroundColor:'rgb(234,107,16)',marginTop:10,borderRadius:4}}>
                            <TouchableOpacity style={{flexDirection:'row',justifyContent: 'center',alignItems:'center'}
                            } onPress={this.OnNewProductPress.bind(this)}>
                            <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center'}
                            }>

                                <Text style={{color:'#ffffff',fontSize:30}}>+</Text>
                                <Text style={{color:'#ffffff',fontSize:18,marginLeft:10,marginTop:5}}>上传商品</Text>


                            </View>
                            </TouchableOpacity>


                        </View>
                    </View>
                </View>
            )
        }
    }
    render() {


            return (
                <View style={styles.container}>
                    <NavBar
                        title="添加商品"
                        leftIcon={require('../../images/back.png')}
                        leftPress={this.back.bind(this)} />
                    {this.renderAddProductContent()}



                </View>
            )
        }





}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },



})