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
import {CachedImage} from "react-native-img-cache";
import Banner from 'react-native-banner';
import Dimensions from 'Dimensions';
import Grid from 'react-native-grid-component';


import px2dp from '../../common/util'

const isIOS = Platform.OS == "ios"
import NavBar from '../../common/NavBar'
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;



export default class GroupOrderDetailView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            gbDetail: { classify: { name: '', icon: '' }, goods: [] }
        }
    }


    clickBack() {
        this.props.navigator.pop()
    }

    componentDidMount() {

        this.setState({
            gbDetail: this.props.gbDetail
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={this.state.gbDetail.classify.name}
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.clickBack.bind(this)} />
                {this.renderGroupOrderListView()}

            </View>
        )
    }

    onItemClick(prouductItems) {

    }

    renderGroupOrderListView() {
        return (<ScrollView
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps={false}
            style={[styles.mainStyle, { height: height - 220 }]}>
            {this.renderProductCategoryView()}
        </ScrollView>)
    }

    renderProductCategoryView() {
        var categoryDataAry = this.state.gbDetail.goods;
        var displayCategoryAry = [];

        // for (var i = 0; i < categoryDataAry.length; i++) {
        displayCategoryAry.push(
            <View style={{ margin: 0 }}>
                {this.renderCategorysView(categoryDataAry)}
            </View>
        );
        // }
        return displayCategoryAry;
    }

    renderItemInfo(item, w, h) {

        return (<View style={{
            resizeMode: 'contain', alignItems: 'center', width: w, height: h,
            justifyContent: 'center', paddingLeft: 20, paddingRight: 10, flexDirection: "row", backgroundColor: '#f7f7f7',
            flex: 1
        }}>
            <View style={{ flex: 2 }}>
                <CachedImage style={{
                    resizeMode: 'contain', alignItems: 'center', width: 80, height: 80,
                    justifyContent: 'center',
                }} source={{ uri: item.goods.images[0].image }} />
            </View>
            <View style={{
                height: h,
                alignItems: 'flex-start',
                flex: 6
            }}>
                <Text style={{ marginLeft: 30, marginTop: 10, numberOfLines: 2, ellipsizeMode: 'tail', fontSize: 14, color: "#1c1c1c", }}>{item.goods.name}</Text>
                <Text style={{ marginLeft: 30, alignItems: 'center', justifyContent: 'center', fontSize: 12, color: "#757575", }}>{item.brief_dec}</Text>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 30, paddingBottom: 10, position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                    <Text style={{ alignItems: 'center', justifyContent: 'center', fontSize: 16, color: "#fb7210", }}>S$ {item.price}</Text>
                    <Text style={{alignItems: 'center', textAlign: 'right', flex: 9, justifyContent: 'center', fontSize: 12, color: "#757575",fontFamily:'PingFangSC-Regular' }}>已购：{item.purchased}件</Text>
                </View>
            </View>

        </View>)


    }

    renderCategorysView(prouductItems) {
        const w = width, h = 120

        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h-10, marginTop: 5, marginRight: 5, marginBottom: 0 }, styles.toolsItem]}>
                                    {this.renderItemInfo(item, w, h)}
                                    {/*<View style={{ width: width, backgroundColor: '#d5d5d5', height: 0.5 }}></View>*/}
                                </View>
                            )
                            return (
                                <TouchableOpacity style={{ width: w, height: h }} key={i} onPress={() => { this.onItemClick(prouductItems) }}>{render}</TouchableOpacity>
                            )
                        })
                    }
                </View>
            )
        }
        return (
            renderSwipeView(prouductItems)
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

    thumb: {
        width: 60,
        height: 60,
        marginRight: 10
    },
    line1: {
        height: 1,
        backgroundColor: '#dadce2'
    },
    line10: {
        height: 10,
        backgroundColor: '#ebeef1'
    },
    brandLabelContainer:
    {
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    line: {
        height: 1,
        backgroundColor: '#eef0f3',
    },
    row: {
        flexDirection: 'row',
    },
});
