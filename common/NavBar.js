/**
 * @author Lei
 * @repo https://github.com/stoneWeb/elm-react-native
 */
'use strict';

import React, {
  Component,
  PropTypes
} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Image
} from 'react-native'
import Dimensions from 'Dimensions';
import px2dp from './util'
var width = Dimensions.get('window').width;

export default class NavBar extends Component{
    static propTypes = {
        title: PropTypes.string,
        leftIcon: PropTypes.any,
        rightIcon: PropTypes.any,
        rightTitle: PropTypes.string,
        leftTitle:PropTypes.string,
        leftPress: PropTypes.func,
        rightPress: PropTypes.func,
        style: PropTypes.object,
    }
    static topbarHeight = (Platform.OS === 'ios' ? 64 : 44)
    renderBtn(pos){
      let render = (obj) => {
        const { name, onPress } = obj

          if (pos=="left" && this.props.leftIcon || pos == 'right' && this.props.rightIcon) {
              if(Platform.OS === 'android'){
              return (
                <TouchableNativeFeedback onPress={onPress} style={styles.btn}>
                  <Image source={name} style={{width: px2dp(26), height: px2dp(26),resizeMode:'contain'}}/>
                </TouchableNativeFeedback>
              )
            }else{
              return (
                <TouchableOpacity onPress={onPress} style={styles.btn}>
                  <Image source={name} style={{width: px2dp(26), height: px2dp(26),resizeMode:'contain'}}/>
                </TouchableOpacity>
              )
            }
        }else if (pos=="left" && this.props.leftTitle ){
              if(Platform.OS === 'android'){
                  return (
                      <TouchableNativeFeedback onPress={onPress} >
                          <Text style={styles.leftBtnLabel}>{name}</Text>
                      </TouchableNativeFeedback>
                  )
              }else{
                  return (
                      <TouchableOpacity onPress={onPress} style={styles.btnLabel}>
                          <Text style={styles.leftBtnLabel}>{name}</Text>
                      </TouchableOpacity>
                  )
              }
          }else if (pos == 'right' && this.props.rightTitle){
              if(Platform.OS === 'android'){
                  return (
                      <TouchableNativeFeedback onPress={onPress} >
                          <Text style={styles.rightBtnLabel}>{name}</Text>
                      </TouchableNativeFeedback>
                  )
              }else{
                  return (
                      <TouchableOpacity onPress={onPress} style={styles.btnLabel}>
                          <Text style={styles.rightBtnLabel}>{name}</Text>
                      </TouchableOpacity>
                  )
              }
          } else{
            if(Platform.OS === 'android'){
            return (
              <TouchableNativeFeedback onPress={onPress} >
                <Text style={styles.rightBtnLabel}>{name}</Text>
              </TouchableNativeFeedback>
            )
          }else{
            return (
              <TouchableOpacity onPress={onPress} style={styles.btnLabel}>
                <Text style={styles.rightBtnLabel}>{name}</Text>
              </TouchableOpacity>
            )
          }
        }
      }
      if(pos == "left"){
        if(this.props.leftIcon){
          return render({
            name: this.props.leftIcon,
            onPress: this.props.leftPress
          })
      } else if (this.props.leftTitle) {
            return render({
              name: this.props.leftTitle,
              onPress: this.props.leftPress
            })
        }else{
          return (<View style={styles.btn}></View>)
        }
      }else if(pos == "right"){
        if(this.props.rightIcon){
          return render({
            name: this.props.rightIcon,
            onPress: this.props.rightPress
          })
      } else if (this.props.rightTitle) {
          return render({
            name: this.props.rightTitle,
            onPress: this.props.rightPress
          })
      }else{
          return (<View style={styles.btn}></View>)
        }
      }
    }
    render(){
        return(
            <View>

            <View style={[styles.topbar, this.props.style]}>
                {this.renderBtn("left")}
                <Animated.Text numberOfLines={1} style={[styles.title, this.props.titleStyle]}>{this.props.title}</Animated.Text>
                {this.renderBtn("right")}
            </View>
            <View style={{height:0.5,width:width,backgroundColor:'#d6d6d6'}}>
            </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    topbar: {
        alignSelf: 'stretch',
        height: NavBar.topbarHeight,
        backgroundColor: "#ffffff",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        // paddingHorizontal: px2dp(10)
    },
    btn: {
      width: 34,
      height: 34,
      justifyContent: 'center',
      alignItems: 'center'
    },
    leftBtnLabel: {
      color: "rgb(117,117,117)",
      fontSize: 16,
      justifyContent: 'center',
      alignItems: 'center'
    },
    rightBtnLabel: {
        color: "#ea6b10",
        fontSize: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title:{
        color: "#1b1b1b",
        fontSize: 18,
        marginLeft: 5,
    }
});
