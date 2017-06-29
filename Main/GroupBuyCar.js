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
    AsyncStorage
} from 'react-native';

import {
    MKIconToggle,
    MKSwitch,
    MKRadioButton,
    MKColor,
    getTheme,
    setTheme,
} from 'react-native-material-kit'
import CheckBox from 'react-native-checkbox'

import Banner from 'react-native-banner';
import Dimensions from 'Dimensions';
import Grid from 'react-native-grid-component';
import NavBar from '../common/NavBar'
import px2dp from '../common/util'
import GroupBuyNowView from './GroupBuyNowView'
import CommitButton from '../common/CommitButton'
import HttpRequest from '../HttpRequest/HttpRequest'
import AddressView from './AddressView'
import GroupBuyAddressView from './GroupBuyAddressView'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import LoginView from '../Login/LoginView'
var Global = require('../common/globals');


export default class GroupBuyCar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            gbDetail: { classify: { name: '', icon: '' }, group_buy_goods: [] }
        }
    }

    componentDidMount() {
        if (Global.gbDetail) {
            this.setState({ gbDetail: Global.gbDetail })
        }
    }

    onGroupBuyNow() {

        // this.props.navigator.push({
        //     component: GroupBuyNowView,
        //     props: {
        //         agent_url: 'adfafdsafdasfda',
        //         image: ''
        //     }
        // })


        var goodsIds = []
        this.state.gbDetail.group_buy_goods.map((item, i) => {
            if (item.selected) {
                goodsIds.push(item.id)
            }
        })
        if (this.state.gbDetail.id == null || !goodsIds.length) {
            alert('请选择需要团购的商品。')
            return
        }

        let param = { goods_ids: goodsIds, group_buy: this.state.gbDetail.id }
        if (!Global.user_address) {
            this.props.navigator.push({
                component: AddressView,
            })
        }
        else {
            this.props.navigator.push({
                component: GroupBuyAddressView,
                props: {
                    api_param: param,
                    image: this.state.gbDetail.classify.image
                }
            })
        }
    }



    clickBack() {
        this.props.navigator.pop()
    }

    renderTopBar() {
        if (this.props.showBack) {
            return (<NavBar title="拼团车"
                leftIcon={require('../images/back.png')}
                leftPress={this.clickBack.bind(this)} />
            )
        } else {
            return (<NavBar title="拼团车" />)
        }
    }


    render() {
        return (
            <View style={styles.container}>
                {this.renderTopBar()}
                <ScrollView
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps={false}
                    style={[styles.mainStyle, { height: height - 220 }]}>
                    {this.renderTopView()}
                    {this.renderProductCategoryView()}
                </ScrollView>
                <View style={{ flex: 1 }}>
                    <View style={{ height: 0.5, width: width, backgroundColor: '#dedede' }}></View>
                    {this.renderProductStartGroupBuyView()}
                </View>

            </View>
        )
    }
    renderProductStartGroupBuyView() {
        let h = width / 6
        let selectedCount = 0
        var categoryDataAry = [this.state.gbDetail];
        for (var i = 0; i < categoryDataAry.length; i++) {
            categoryDataAry[i].group_buy_goods.map((item, n) => {
                if (item.selected) {
                    selectedCount++
                }
            })
        }

        return (<View style={{
            resizeMode: 'contain', alignItems: 'center', width: width, height: h,
            justifyContent: 'center', margin: 0, flexDirection: "row",
            flex: 1
        }}>
            <View style={{
                flex: 1, marginLeft: 20, marginRight: 0, alignItems: 'center',
                justifyContent: 'center',
            }}>
                {this.renderCheckBox(this.state.gbDetail)}
            </View>

            <View style={{
                flex: 1
            }}>
                <Text style={{ alignItems: 'center', justifyContent: 'center', fontSize: 14, color: "#1c1c1c", }}>全选</Text>
            </View>
            <View style={{
                flex: 6
            }}>
                <Text style={{ margin: 10, alignItems: 'center', justifyContent: 'flex-start', fontSize: 14, color: "#757575", }}>合计：{selectedCount}件商品</Text>
            </View>
            <View style={[{ flex: 4, alignItems: 'flex-end', justifyContent: 'flex-end', }]}>
                <CommitButton title={'开始拼团'} onPress={this.onGroupBuyNow.bind(this)}>
                </CommitButton>
            </View>
        </View>)
    }


    renderTopView() {


    }

    onItemClick(prouduct) {

    }
    renderCheckBox(item) {
        if (!item) {
            return ({})
        }

        return (<CheckBox
            label=''
            checkedImage={require('../images/choose_one_click.png')}
            uncheckedImage={require('../images/choose_one.png')}
            checked={item.selected == null ? false : item.selected}
            onChange={(checked) => {
                item.selected = !checked

                if (item.classify && item.group_buy_goods) {
                    item.group_buy_goods.map((subitem, i) => {
                        subitem.selected = item.selected
                    })
                }
                this.setState({ ...this.state })
            }
            }
        />)
    }


    renderProductCategoryView() {
        var categoryDataAry = [this.state.gbDetail];
        var displayCategoryAry = [];

        for (var i = 0; i < categoryDataAry.length; i++) {
            displayCategoryAry.push(
                <View style={{ margin: 5, width: width}}>
                    <View style={styles.brandLabelContainer}>
                        <View style={{ marginLeft: 5, marginRight: 5, alignItems: 'center', justifyContent: 'flex-start', }}>
                            {this.renderCheckBox(categoryDataAry[i])}
                        </View>
                        <Text style={{ fontSize: 16, color: '#1b1b1b' }}>
                            {categoryDataAry[i].classify.name}
                        </Text>
                    </View>
                    {this.renderCategorysView(categoryDataAry[i].group_buy_goods)}
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', marginRight: 5 }}>

                    </View>
                </View>
            );
        }
        return displayCategoryAry;
    }

    renderItemInfo(item, w, h) {

        return (<View style={{
            resizeMode: 'contain', alignItems: 'center', width: w, height: h,
            justifyContent: 'center', paddingLeft: 10, paddingRight: 10, flexDirection: "row", backgroundColor: '#f7f7f7',
            flex: 1
        }}>
            <View style={{
                marginLeft: 5,
                flex: 1, marginRight: 10, alignItems: 'center',
                justifyContent: 'center',
            }}>
                {this.renderCheckBox(item)}
            </View>

            <View style={{
                flex: 2
            }}>
                <Image style={{
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
                    <Text style={{ alignItems: 'center', textAlign: 'right', flex: 9, justifyContent: 'center', fontSize: 12, color: "#757575", }}>库存 {item.stock}</Text>
                </View>
            </View>

        </View>)

    }

    renderCategorysView(prouductItems) {
        const w = width, h = 110

        let renderSwipeView = (types, n) => {
            return (
                <View style={styles.toolsView}>
                    {
                        types.map((item, i) => {
                            let render = (
                                <View style={[{ width: w, height: h, marginTop: 5, marginRight: 5, marginBottom: 5 }, styles.toolsItem]}>
                                    {this.renderItemInfo(item, w, h)}
                                </View>
                            )
                            return (
                                <TouchableOpacity style={{ width: w - 10, height: h }} key={i} onPress={() => { this.onItemClick(item) }}>{render}</TouchableOpacity>
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
    topView: {
        height: 150,
        width: width,
    },
    list:
    {
        flex: 1,
    },
    GroupBuyContainer:
    {

        borderColor: '#e31515',
        borderWidth: 1,
        textAlign: 'center',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    countdownText: {
        color: '#e31515',
        fontSize: 14,
    },
    brandLabelContainer:
    {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    toolsView: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'center',
        alignItems: 'center',
    },
    toolsItem: {
        justifyContent: "center",
        alignItems: "center",
        borderColor: '#e6e6e6',
        borderWidth: 1,
    },
});
