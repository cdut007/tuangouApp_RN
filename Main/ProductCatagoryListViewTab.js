import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Alert
} from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

import Dimensions from 'Dimensions';

import NavBar from '../common/NavBar'
import ProductCatagoryListView from './ProductCatagoryListView'
import HttpRequest from '../HttpRequest/HttpRequest'
var width = Dimensions.get('window').width;

export default class ProductCatagoryListViewTab extends Component {


    _handleChangeTab = index => this.setState({ index });

    _renderHeader = props => <TabBar {...props}
        scrollEnabled
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        tabStyle={styles.tab}
        labelStyle={styles.label}
    />;

    state = {
        index: 0,
        routes: [
        ],
        allGbDetail: {},
        gbList: {}
    };

    clickBack() {
        this.props.navigator.pop()
    }

    componentDidMount() {
        this.setState({
            product: this.props.prouduct
        })

        let param = { classify: this.props.prouduct.index }
        HttpRequest.get('/group_buy_list', param, this.onGroupBuyListSuccess.bind(this),
            (e) => {
                Alert.alert('提示','获取团购列表失败，请稍后再试。')
                console.log(' error:' + e)
            })
    }

    onGroupBuyListSuccess(response) {
        var tabTitle = []
        for (var i = 0; i < response.data.group_buy.length; i++) {
            let item = response.data.group_buy[i]
            tabTitle.push({ key: '' + i, title: item.start_time })
        }
        this.setState({
            gbList: response.data,
            routes: tabTitle
        })

        if (response.data.group_buy.length) {
            var paramBody = { group_buy: response.data.group_buy[0].id }
            HttpRequest.get('/group_buy_detail', paramBody, this.onGroupBuyDetailSuccess.bind(this),
                (e) => {
                    Alert.alert('提示','获取团购详情失败，请稍重试。')

                    console.log(' error:' + e)
                })
        }

    }


    onGroupBuyDetailSuccess(response) {
        let gbData = this.state.allGbDetail
        gbData[response.data.id] = response.data

        this.setState({
            allGbDetail: gbData
        })
    }

    createProdcutCategoryList(gbDetail) {
        ProductRoute = () => <View style={[styles.container, { backgroundColor: '#ff4081' }]}
        >
            <ProductCatagoryListView groupBuyDetail= {gbDetail} navigator= {this.props.navigator}></ProductCatagoryListView>
        </View>

        return ProductRoute
    }

    onSenceItem() {
        var scence = {}
        this.state.routes.map((item, n) => {
            let index = Number(item.key)
            let key = this.state.gbList.group_buy[index].id
            let gbDetail = this.state.allGbDetail[key]
            scence[item.key] = this.createProdcutCategoryList(gbDetail)
        })

        return scence
    }
    // _renderScene = SceneMap(this.onSenceItem());

    renderTabView() {
        if (this.state.gbList.group_buy && this.state.gbList.group_buy.length) {
            return (<TabViewAnimated
                style={styles.container}
                navigationState={this.state}
                renderScene={SceneMap(this.onSenceItem())}
                renderHeader={this._renderHeader}
                onRequestChangeTab={this._handleChangeTab}
                removeClippedSubviews={false}
            />)
        }
        else {
            return (<View />)
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={this.state.gbList.name}
                    leftIcon={require('../images/back.png')}
                    leftPress={this.clickBack.bind(this)} />
                {this.renderTabView()}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabbar: {
        height: 44,
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: '#ffffff',
    },
    tab: {
        width: width / 2,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    indicator: {
        backgroundColor: '#ea6b10',
    },
    label: {
        color: '#ea6b10',
    },
});
