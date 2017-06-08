import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

import Dimensions from 'Dimensions';

import NavBar from '../common/NavBar'
import ProductCatagoryListView from './ProductCatagoryListView'
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
      { key: '1', title: '6月9日拼团' },
      { key: '2', title: '6月13日拼团' },
    ],
  };

  clickBack() {
   this.props.navigator.pop()
  }

  createProdcutCategoryList(){
      const ProductRoute = () => <View style={[ styles.container, { backgroundColor: '#ff4081' } ]}
      >
      <ProductCatagoryListView {...this.props}></ProductCatagoryListView>
      </View>

      return ProductRoute
  }

      _renderScene = SceneMap({
    '1': this.createProdcutCategoryList(),
    '2': this.createProdcutCategoryList(),
    });

  render() {


    return (
        <View style={styles.container}>
        <NavBar title="品质水果"
        leftIcon={require('../images/back.png')}
        leftPress={this.clickBack.bind(this)}/>
        <TabViewAnimated
          style={styles.container}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onRequestChangeTab={this._handleChangeTab}
          removeClippedSubviews={false}
        />
        </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    tabbar: {
        height:44,
        justifyContent: "center",
        alignItems: "center",
      backgroundColor: '#ffffff',
    },
    tab: {
        width: width/2,
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
