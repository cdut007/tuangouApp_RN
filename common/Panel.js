/**
 * Created by Arlen_JY on 2017/9/15.
 */
import React,{Component} from 'react'; //Step 1
import Dimensions from 'Dimensions'
var width = Dimensions.get('window').width;
import CircleImage from '../common/CircleImage';

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
    Animated



} from 'react-native';
class Panel extends Component{
    constructor(props){
        super(props);

        this.icons = {
            'up'    : require('../images/foldIcon@2x.png'),
            'down'  : require('../images/unfoldIcon@2x.png')
        };

        this.state = {
            title       : props.title,
            expanded    : true,
            animation   : new Animated.Value(),
            titleIcon : props.titleIcon,
            ship_time : props.ship_time,
            totalNum : props.totalNum,
            totalPrice : props.totalPrice,

        };
    }

    toggle(){
        let initialValue    = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue      = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState({
            expanded : !this.state.expanded
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    }

    _setMaxHeight(event){
        this.setState({
            maxHeight   : event.nativeEvent.layout.height
        });
    }

    _setMinHeight(event){
        this.setState({
            minHeight   : event.nativeEvent.layout.height
        });
    }

    render(){
        let icon = this.icons['down'];

        if(this.state.expanded){
            icon = this.icons['up'];
        }
        let totalTitle = this.state.totalNum+"件/合计：S$"+this.state.totalPrice
        return (
            <View style={[styles.container]}>
            <Animated.View
                style={[styles.Animatedcontainer,{height: this.state.animation,width:width}]}>
                <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
                    <CircleImage  imageStyle={styles.CircleImage}
                                  src={this._displayIcon()}
                    ></CircleImage>
                    <View style={styles.doubleTitle}>
                        <Text style={styles.title1}>{this.state.title}</Text>
                        <Text style={styles.title2}>{this.state.ship_time}</Text>
                    </View>

                    <TouchableHighlight
                        style={styles.button}
                        onPress={this.toggle.bind(this)}
                        underlayColor="#f1f1f1">
                        <Image
                            style={styles.buttonImage}
                            source={icon}
                        ></Image>
                    </TouchableHighlight>

                </View>
                <View style={{height:0.5,backgroundColor:"rgb(213,213,213)",width:width}}></View>
                <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
                    {this.props.children}
                </View>


            </Animated.View>
                <View style={{height:0.5,backgroundColor:"rgb(213,213,213)",width:width}}></View>
            <View style={styles.totalFooterContainer} >
                <Text style={styles.totalFooterTitle}>{totalTitle}</Text>
                </View>
            </View>
        );
    }
    _displayIcon() {

        if (this.props.titleIcon) {
            return {uri: this.state.titleIcon};
        } else {
            return require('../images/default_head.png');
        }

    }
}

var styles = StyleSheet.create({
    container   : {
        marginTop:10,
        backgroundColor: '#fff',

    },
    Animatedcontainer :{
        // backgroundColor: '#fff',
        margin:0,
        overflow:'hidden'
    },
    titleContainer : {
        flexDirection: 'row',
        height:46
    },
    doubleTitle :{
        width:width - 90
    },
    title1       : {
        flex    : 1,
        marginLeft:5,
        marginTop:5,
        color   :'rgb(28,28,28)',
        fontSize:14,
        fontFamily:'PingFangSC-Regular',


    },
    title2       : {
        flex    : 1,
        marginLeft:5,

        color   :'rgb(130,130,130)',
        fontSize:12,
        fontFamily:'PingFangSC-Regular',


    },
    CircleImage : {
    width: 80,
        height: 36,
        width:36,
        marginTop: 0,
        marginLeft: 10,
        borderRadius: 18,
        alignSelf: 'center',
    },
    button      : {
        marginTop:5,
        marginRight:5,

    },
    buttonImage : {
        width   : 36,
        height  : 36,

    },
    body        : {

        paddingTop  : 0
    },
    totalFooterContainer :{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height:40
    },
    totalFooterTitle :{
        flex    : 1,


        color   :'rgb(234,107,16)',
        fontSize:14,
        fontFamily:'PingFang-SC-Medium',
        textAlign:'center',
    }
});

export default Panel;
