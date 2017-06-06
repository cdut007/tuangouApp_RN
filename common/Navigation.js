import React, { Component } from 'react';
import {
    View,
    Navigator,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';


var NavigationBarRouteMapper = {  
  //设置导航栏左按钮  
  LeftButton: function(route,navigator,index,navState) {  
    if(index === 0){  
      return null;  
    }else{  
      return(  
        <TouchableOpacity style={styles.navBarLeftButton} onPress={()=>{try{navigator.jumpBack();}catch(error){}}}>  
          <Text style={[styles.navBarText, styles.navBarButtonText]}>Back</Text>  
        </TouchableOpacity>  
      );  
    }  
  },  
  
  //设置导航栏标题  
  Title: function(route,navigator,index,navState) {  
    //   console.log('~~~~~~~'+JSON.stringify(route))
    return (<Text style={[styles.navBarText, styles.navBarTitleText]}>{route.name}</Text>);  
  },  
    
  //设置导航栏右按钮  
  RightButton: function(route,navigator,index,navState) {  
    if(index === navState.routeStack.length - 1)
    {  
      return null;  
    }
    /*else
    {  
       return(  
         <TouchableOpacity style={styles.navBarRightButton} onPress={()=>{navigator.jumpForward();}}>  
           <Text style={[styles.navBarText, styles.navBarButtonText]}>Next</Text>  
         </TouchableOpacity>  
       );  
    }  */
  }  
};  

export default class Navigation extends Component 
{
    constructor(props)
    {
        super(props)
    }

    render() 
    {
        return (
            <Navigator
                initialRoute={{ name: this.props.title, component: this.props.component, index: 0 }}
                configureScene={() => { return Navigator.SceneConfigs.PushFromRight; }}
                navigationBar={<Navigator.NavigationBar style={styles.navBar} routeMapper={NavigationBarRouteMapper}/>} 
                renderScene={(route, navigator) => {
                    let Component = route.component;
                    return (
                        <View style={{ flex: 1, marginTop: 20 }}>
                            <Component navigator={navigator} route={route} {...route.passProps} />
                        </View>
                    );
                }} />
        );
    }

}

var styles = StyleSheet.create(
{  
  navBar: {  
    backgroundColor: '#3281DD',  
  },  
  navBarText: {  
    fontSize: 16,  
    marginVertical: 10,
  },  
  navBarTitleText: {  
    color: 'white',  
    fontWeight: '500',  
    marginVertical: 9,  
    // marginLeft: 103,  
  },  
  navBarLeftButton: {  
    paddingLeft: 10,  
  },  
  navBarRightButton: {  
    paddingRight: 10,  
  },  
  navBarButtonText: {  
    color: 'white',  
  },  
}); 