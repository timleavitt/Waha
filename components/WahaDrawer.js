import SafeAreaView from 'react-native-safe-area-view'
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import DrawerItem from '../components/DrawerItem'
import SmallDrawerItem from '../components/SmallDrawerItem'
import { scaleMultiplier } from '../constants'
import * as WebBrowser from 'expo-web-browser'
import AvatarImage from '../components/AvatarImage'

function WahaDrawer (props) {
  //// FUNCTIONS

  // opens a local browser
  async function openBrowser (url) {
    await WebBrowser.openBrowserAsync(url)
  }

  //// RENDER

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: props.primaryColor }]}
      forceInset={{ top: 'always', bottom: 'never', horizontal: 'never' }}
    >
      <View style={styles.drawerHeaderContainer}>
        <View style={styles.groupIconContainer}>
          <AvatarImage source={props.activeGroup.imageSource} size={120} />
        </View>
        <Text style={[styles.groupName, { fontFamily: props.font + '-black' }]}>
          {props.activeGroup.name}
        </Text>
        <TouchableOpacity
          style={styles.pencilIconContainer}
          onPress={() =>
            props.navigation.navigate('EditGroup', {
              groupName: props.activeGroup.name
            })
          }
        >
          <Icon name='pencil' size={25 * scaleMultiplier} color='#FFFFFF' />
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
        <View>
          <DrawerItem
            iconName='group'
            text={props.translations.navigation.drawer.groups}
            onPress={() => props.navigation.navigate('Groups')}
          />
          {/* <DrawerItem
               name="security"
               text="Security Mode"
               onPress={() => {}}
            /> */}
          <DrawerItem
            iconName='boat'
            text={props.translations.navigation.drawer.mt}
            onPress={() => props.navigation.navigate('MT')}
          />
          <DrawerItem
            iconName='storage'
            text={props.translations.navigation.drawer.storage}
            onPress={() =>
              props.navigation.navigate('Storage', {
                isRTL: props.isFetching ? null : props.isRTL
              })
            }
          />
        </View>
        <View style={styles.smallDrawerItemsContainer}>
          <SmallDrawerItem
            onPress={() =>
              openBrowser(
                'https://docs.google.com/forms/d/e/1FAIpQLSeUvdc3Ehib_kIOMqkyBgECyqL7Jaj_ztFercRSfMnCXQ6UwA/viewform?usp=sf_link'
              )
            }
            label={props.translations.navigation.drawer.feedback}
          />
          <SmallDrawerItem
            onPress={() =>
              openBrowser(
                'https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif'
              )
            }
            label={props.translations.navigation.drawer.privacy}
          />
          <SmallDrawerItem
            onPress={() =>
              openBrowser(
                'https://media.giphy.com/media/C4msBrFb6szHG/giphy.gif'
              )
            }
            label={props.translations.navigation.drawer.credits}
          />
          <Text
            style={[
              styles.versionText,
              { fontFamily: props.font + '-regular' }
            ]}
          >
            v0.4.2
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

//// REDUX

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  drawerHeaderContainer: {
    width: '100%',
    height: 233 * scaleMultiplier,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 15
  },
  groupIconContainer: {
    alignItems: 'center',
    marginVertical: 10
  },
  groupName: {
    color: 'white',
    textAlign: 'center',
    fontSize: 25 * scaleMultiplier
  },
  pencilIconContainer: {
    alignSelf: 'flex-end'
  },
  smallDrawerItemsContainer: {
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: 20
  },
  versionText: {
    fontSize: 10,
    marginHorizontal: 13,
    color: '#9FA5AD',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    primaryColor: state.database[activeGroup.language].primaryColor,
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(WahaDrawer)
