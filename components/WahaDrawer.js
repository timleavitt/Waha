import SafeAreaView from 'react-native-safe-area-view';
import { DrawerItems } from 'react-navigation-drawer';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { connect } from 'react-redux'
import { Ionicons } from '@expo/vector-icons';
import DrawerItem from '../components/DrawerItem'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { scaleMultiplier } from '../constants'
import * as WebBrowser from 'expo-web-browser';

function WahaDrawer(props) {
   async function openBrowser(url) {
      await WebBrowser.openBrowserAsync(url);
   }

   return (
      <SafeAreaView
         style={styles.container}
         forceInset={{ top: 'always', horizontal: 'never' }}
      >
         <View style={[styles.drawerHeaderContainer, { backgroundColor: props.colors.primaryColor }]}>
            <View style={styles.groupIconContainer}>
               <Ionicons
                  name="ios-people"
                  size={100}
               />
            </View>
            <Text style={styles.groupName}>{props.activeGroup}</Text>
         </View>
         <View style={styles.bigDrawerItemsContainer}>
            <DrawerItem
               name="ios-people"
               text="Groups & Languages"
               onPress={() => props.navigation.navigate('Groups', { isRTL: props.isFetching ? null : props.isRTL })}
            />
            <DrawerItem
               name="md-glasses"
               text="Incognito Mode (todo)"
            />
            <DrawerItem
               name="ios-mail"
               text="Submit Feedback"
               onPress={() => openBrowser('https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif')}
            />
            <DrawerItem
               name="ios-save"
               text="Storage (todo)"
            />
         </View>
         <View style={styles.smallDrawerItemsContainer}>
            <TouchableOpacity style={styles.smallDrawerItemContainer} onPress={() => { }}>
               <Text style={styles.smallDrawerItemText}>Coaching Tools (todo)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallDrawerItemContainer} onPress={() => openBrowser('https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif')}>
               <Text style={styles.smallDrawerItemText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallDrawerItemContainer} onPress={() => openBrowser('https://media.giphy.com/media/C4msBrFb6szHG/giphy.gif')}>
               <Text style={styles.smallDrawerItemText}>View Credits</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView >
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   drawerHeaderContainer: {
      width: "100%",
      height: 233 * scaleMultiplier,
      justifyContent: "center",
      alignContent: "center",
      padding: 15
   },
   groupIconContainer: {
      alignItems: "center",
   },
   groupName: {
      color: "white",
      textAlign: "center",
      fontFamily: "bold",
      fontSize: 25 * scaleMultiplier
   },
   smallDrawerItemsContainer: {
      justifyContent: "flex-end",
      flex: 1
   },
   smallDrawerItemContainer: {
      margin: 5,
      padding: 5
   },
   smallDrawerItemText: {
      fontFamily: 'medium',
      fontSize: 18 * scaleMultiplier,
      color: '#82868D'
   }
});

/////////////
////REDUX////
/////////////

function mapStateToProps(state) {
   var activeLanguage = state.groups.filter(item => item.name === state.activeGroup)[0].language
   return {
      database: state.database,
      colors: state.database[activeLanguage].colors,
      appProgress: state.appProgress,
      isRTL: state.database[activeLanguage].isRTL,
      activeGroup: state.activeGroup
   }
};

function mapDispatchToProps(dispatch) {
   return {
   }
};

export default connect(mapStateToProps, mapDispatchToProps)(WahaDrawer);