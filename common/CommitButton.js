import React, { Component,PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight
 } from 'react-native';

import Dimensions from 'Dimensions'
var width = Dimensions.get('window').width;

 export default class CommitButton extends Component
 {
     static propTypes =
     {
        title: PropTypes.string,
        onPress: PropTypes.func,
    }

    render()
    {
        return(
            <View>
            <TouchableHighlight style= {styles.container} onPress = {this.props.onPress} >
                <Text style= {styles.title}>{this.props.title}</Text>
            </TouchableHighlight>
            </View>
        )
    }
 }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingLeft:10,
        paddingRight:10,
        paddingTop:8,
        backgroundColor:'#ea6b10',
        paddingBottom:8,
        height: 49,
        alignItems: 'center',
    },
    title: {
        justifyContent: 'center',
        textAlign:'center',
        alignItems: 'center',
        fontSize: 18,
        color: "#ffffff"
    },

});
