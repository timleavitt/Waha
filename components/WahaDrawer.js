import SafeAreaView from 'react-native-safe-area-view';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import DrawerItem from '../components/DrawerItem'
import SmallDrawerItem from '../components/SmallDrawerItem'
import { scaleMultiplier } from '../constants'
import * as WebBrowser from 'expo-web-browser';
import AvatarImage from '../components/AvatarImage'

function WahaDrawer(props) {

   //// FUNCTIONS

   // opens a local browser 
   async function openBrowser(url) {
      await WebBrowser.openBrowserAsync(url);
   }

   //// RENDER

   return (
      <SafeAreaView style={[styles.container, { backgroundColor: props.colors.primaryColor }]} forceInset={{ top: 'always', bottom: 'never', horizontal: 'never' }}>
         <View style={styles.drawerHeaderContainer}>
            <View style={styles.groupIconContainer}>
               <AvatarImage source={props.activeGroup.imageSource} size={120} />
            </View>
            <Text style={styles.groupName}>{props.activeGroup.name}</Text>
         </View>
         <View style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
            <View>
               <DrawerItem
                  iconName="group"
                  text={props.translations.navigation.drawer.groups}
                  onPress={() => props.navigation.navigate('Groups')}
               />
               {/* <DrawerItem
               name="security"
               text="Security Mode"
               onPress={() => {}}
            /> */}
               <DrawerItem
                  iconName="email"
                  text={props.translations.navigation.drawer.feedback}
                  onPress={() => openBrowser('https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif')}
               />
               <DrawerItem
                  iconName="storage"
                  text={props.translations.navigation.drawer.storage}
                  onPress={() => props.navigation.navigate('Storage', { isRTL: props.isFetching ? null : props.isRTL })}
               />
            </View>
            <View style={styles.smallDrawerItemsContainer}>
               <SmallDrawerItem
                  onPress={() => { }}
                  label={props.translations.navigation.drawer.coaching}
               />
               <SmallDrawerItem
                  onPress={() => openBrowser('https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif')}
                  label={props.translations.navigation.drawer.privacy}
               />
               <SmallDrawerItem
                  onPress={() => openBrowser('https://media.giphy.com/media/C4msBrFb6szHG/giphy.gif')}
                  label={props.translations.navigation.drawer.credits}
               />
               <Text style={styles.versionText}>v0.2.3</Text>
            </View>
         </View>
      </SafeAreaView >
   )
}

//// REDUX

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
   bigDrawerItemsContainer: {
      backgroundColor: "#FFFFFF"
   },
   groupIconContainer: {
      alignItems: "center",
      marginVertical: 10
   },
   groupName: {
      color: "white",
      textAlign: "center",
      fontFamily: "black",
      fontSize: 25 * scaleMultiplier
   },
   smallDrawerItemsContainer: {
      justifyContent: "flex-end",
      flex: 1,
      marginBottom: 20
   },
   versionText: {
      fontFamily: 'light', 
      fontSize: 10, 
      marginHorizontal: 13, 
      color: "#9FA5AD", 
      justifyContent: "center", 
      alignItems: "center"
   }
});

//// REDUX

function mapStateToProps(state) {
   var activeGroup = state.groups.filter(item => item.name === state.activeGroup)[0]
   return {
      colors: state.database[activeGroup.language].colors,
      isRTL: state.database[activeGroup.language].isRTL,
      activeGroup: activeGroup,
      translations: state.database[activeGroup.language].translations
   }
};

export default connect(mapStateToProps)(WahaDrawer);