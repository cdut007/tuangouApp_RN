import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    AsyncStorage
} from 'react-native';


import MainFirstView from './MainFirstView';
import Navigation from '../common/Navigation';
import TabNavigator from 'react-native-tab-navigator';
import TabView from './TabView'
import WelcomeView from '../Login/Welcome'
var Global = require('../common/globals');

export default class MainView extends Component {

    constructor(props)
    {
        super(props)

        this.state={
            hasGotLogin: false,
            hasLogin: null
        }
        this.getHasLogin()
    }

    getHasLogin()
    {
        var me = this
        AsyncStorage.getItem('k_http_token',function(errs,result)
        {
            if (!errs && result && result.length)
            {
                me.setState({hasLogin: true})
                Global.token = result;
            }
            else
            {
                me.setState({hasLogin: false})
            }
        });


        AsyncStorage.getItem('k_login_info',function(errs,result)
        {
            if (!errs && result && result.length)
            {
                Global.id = JSON.parse(result).id;
                console.log('local user id:' + Global.id)
            }
            else
            {

            }
        });



    }
    setaaa()
    {

    }

    render() {
        if(this.state.hasLogin == null)
        {
            return(<View/>)
        }

        if (this.state.hasLogin)
        {
            return (
                <Navigator
                initialRoute={{component: TabView, name: "MainPage"}}
                configureScene={() => Navigator.SceneConfigs.FloatFromRight}
                renderScene={(route, navigator) => {
                      return <route.component navigator={navigator} {...route.args}/>
                    }
                }
              />
            )
        }
        else {
            return (
                <Navigator
                initialRoute={{component: WelcomeView, name: "WelcomePage", index: this.props.index}}
                configureScene={() => Navigator.SceneConfigs.FloatFromRight}
                renderScene={(route, navigator) => {
                      return <route.component navigator={navigator} {...route.args}/>
                    }
                }
              />
            )
        }


        // return (
        //     <TabNavigator>
        //         <TabNavigator.Item
        //             selected={this.state.selectedTab === 'tab1'}
        //             title="哦到了"
        //             renderIcon={() => <Image source={require('../images/toolbarIconChat.png')} />}
        //             renderSelectedIcon={() => <Image source={require('../images/toolbarIconChatActive.png')} />}
        //             badgeText=""
        //             onPress={() => this.setState({ selectedTab: 'tab1' })}>
        //             {<Navigation component={MainFirstView} title={'哦到了'} />}
        //         </TabNavigator.Item>
        //         <TabNavigator.Item
        //             selected={this.state.selectedTab === 'tab2'}
        //             title="Me"
        //             renderIcon={() => <Image source={require('../images/toolBarIconMe.png')} />}
        //             renderSelectedIcon={() => <Image source={require('../images/toolBarIconMe.png')} />}

        //             onPress={() => this.setState({ selectedTab: 'tab2' })}>
        //             {<View style={styles.container}>
        //                 <Text style={styles.welcome}>
        //                     test view2
        //                 </Text>
        //             </View>}
        //         </TabNavigator.Item>
        //     </TabNavigator>

        // )
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
});
