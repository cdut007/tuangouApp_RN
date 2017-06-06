import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    BackAndroid
} from 'react-native';


import MainFirstView from './MainFirstView';
import MainSecondView from './MainSecondView';
import Navigation from '../common/Navigation';
import TabNavigator from 'react-native-tab-navigator';

export default class TabView extends Component
{
    state =
    {
        selectedTab: 'tab1'
    }

    componentWillMount(){
        var me = this;
        BackAndroid.addEventListener('harwardBackPress', () => {
            const routers = me.props.navigator.getCurrentRoutes();
            if (routers.length > 1) {
                me.props.navigator.pop();
                return true;
            } else {
                    if (routers[0].name == 'MainPage') {
                      BackAndroid.exitApp();
                      return true;
                    } else {
                      _navigator.pop();
                      return true;
                    }

                  }
                  return false;
      });
    }


      componentWillUnmount() {
                BackAndroid.removeEventListener('hardwareBackPress');
            }

    render()
    {
        return (
            <TabNavigator>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'tab1'}
                    title="哦到了"
                    renderIcon={() => <Image source={require('../images/toolbarIconChat.png')} />}
                    renderSelectedIcon={() => <Image source={require('../images/toolbarIconChatActive.png')} />}
                    badgeText=""
                    selectedTitleStyle={styles.tabBarTintColor}
                    onPress={() => this.setState({ selectedTab: 'tab1' })}>
                    {<MainFirstView {...this.props}/>}
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'tab2'}
                    title="我的"
                    renderIcon={() => <Image source={require('../images/toolBarIconMe.png')} />}
                    renderSelectedIcon={() => <Image source={require('../images/toolbar_icon_me_active.png')} />}
                    selectedTitleStyle={styles.tabBarTintColor}
                    onPress={() => this.setState({ selectedTab: 'tab2' })}>
                    {<MainSecondView {...this.props}/>}
                </TabNavigator.Item>
            </TabNavigator>

        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    tabBarTintColor: {

      color: '#1a8eaf'
    },

});
