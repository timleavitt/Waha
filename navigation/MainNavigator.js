import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { scaleMultiplier } from '../constants'
import WahaDrawer from '../components/WahaDrawer'

import StackNavigator from '../navigation/StackNavigator'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { connect } from 'react-redux'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();



//allows only accessing hamburger swipe from study set screen
function getGestureEnabled(route) {
   // Access the tab navigator's state using `route.state`
   const routeName = route.state
      ? // Get the currently active route name in the tab navigator
      route.state.routes[route.state.index].name
      : // If state doesn't exist, we need to default to `screen` param if available, or the initial screen
      // In our case, it's "Feed" as that's the first screen inside the navigator
      route.params?.screen || 'StudySet';
   if (routeName === 'StudySet')
      return true
   else
      return false
}

//Drawer navigator contains stack navigator as only screen



const styles = StyleSheet.create({
   headerImage: {
      resizeMode: "center",
      width: 120,
      height: 40,
      alignSelf: "center",
   }
})

function MainNavigator(props) {
   var direction = props.isRTL ? 'right' : 'left'
   return (
      <NavigationContainer>
         <Drawer.Navigator 
            drawerPosition={direction} 
            drawerType='back' 
            drawerContent={props => <WahaDrawer {...props} />}
            drawerStyle={{
               width: '80%',
             }}
            edgeWidth={300 * scaleMultiplier}
         >
            <Drawer.Screen options={({ route }) => ({ gestureEnabled: getGestureEnabled(route)})} name="StackNavigator" component={StackNavigator} />
         </Drawer.Navigator>
      </NavigationContainer>
   )
}
function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      isRTL: state.database[activeGroup.language].isRTL,
   }
};

function mapDispatchToProps(dispatch) {
   return {
   }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigator);
