'use strict';
import React, {
  Component,
  PropTypes
} from 'react'
import {
    Image,
    View,
    StyleSheet,
      Platform,
} from 'react-native'



var CircleImage = React.createClass({

    getInitialState() {
      return {
        icon_url:null,
        contactName:null,
      };
    },

 getIconUrl(icon_url){
 if (typeof icon_url == 'undefined' || icon_url == null ) {
     return icon_url;
 }
 if ( typeof icon_url == 'string') {
     var check = icon_url.indexOf("http:");
     if (check>=0) {
          return icon_url;
     }else{
         var url =  serverUrl + icon_url;
         return url;
     }
 }else if (typeof icon_url == 'object') {
     if (icon_url.uri == null) {
         return icon_url;
     }
     var check = icon_url.uri.indexOf("http:");
     if (check>=0) {
          return icon_url;
     }else{
         var url =  serverUrl + icon_url.uri;
         icon_url.uri = url;
         return icon_url;
     }
 }else if (typeof icon_url == 'number'){
     console.log("icon_url.sss:"+icon_url);
     return icon_url;
 }else {
     console.log("icon_url.notfound:"+typeof(icon_url ));
     return icon_url;
 }

 },
renderImage(){
    if (this.props.contactName == this.state.contactName && this.state.icon_url!=null && typeof(this.state.icon_url) != "undefined") {

        return {uri:this.state.icon_url};
    }{

    }
       return require('../images/default_head.png');
},
  render(){

      if (this.props.contactName!=null) {

        if (Platform.OS === 'ios')
        {

          return(
            <Image source={this.renderImage()} style ={[this.props.imageStyle]}/>
          );
        }else{
          return (

          <Image source={this.renderImage()} style ={[styles.circle, this.props.circleStyle,this.props.imageStyle]}/>

          );
        }
      }else {
        //var url = this.getIconUrl(this.props.src);
        if (Platform.OS === 'ios')
        {
          return(
            <Image source={this.props.src} style ={[this.props.imageStyle]}/>
          );
        }else{
          return (

          <Image source={this.props.src} style ={[styles.circle, this.props.circleStyle,this.props.imageStyle]}/>

          );
        }
      }


  }
});

var styles = StyleSheet.create({
  circle:{
    borderWidth:1,
    borderColor : 'white',
    backgroundColor : '#00000000',
    borderRadius : 100,
    padding: 0,

  },
  circle_ios:{
    borderWidth:1,
    borderColor : 'white',
    backgroundColor : '#00000000',
    // borderRadius : 8,
    padding: 0,

  },
  text:{
    fontSize : 20
  }

});

module.exports = CircleImage;
