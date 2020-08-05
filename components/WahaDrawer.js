import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { connect } from 'react-redux'
import AvatarImage from '../components/AvatarImage'
import DrawerItem from '../components/DrawerItem'
import SmallDrawerItem from '../components/SmallDrawerItem'
import { colors, scaleMultiplier } from '../constants'
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
          <AvatarImage
            style={{ backgroundColor: colors.athens }}
            emoji={props.activeGroup.emoji}
            size={120}
          />
        </View>
        <Text
          style={[styles.groupName, { fontFamily: props.font + '-black' }]}
          numberOfLines={2}
        >
          {props.activeGroup.name}
        </Text>
        <View style={styles.pencilIconContainer}>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('EditGroup', {
                groupName: props.activeGroup.name
              })
            }
          >
            <Icon
              name='pencil'
              size={25 * scaleMultiplier}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ backgroundColor: colors.white, flex: 1 }}>
        <View style={{ flex: 1 }}>
          <DrawerItem
            iconName='group'
            text={props.translations.groups.header}
            onPress={() => props.navigation.navigate('Groups')}
          />
          <DrawerItem
            iconName='security'
            text='Security Mode'
            onPress={() => props.navigation.navigate('Security')}
          />
          <DrawerItem
            iconName='boat'
            text={props.translations.mobilization_tools.header}
            onPress={() => props.navigation.navigate('MT')}
          />
          <DrawerItem
            iconName='storage'
            text={props.translations.storage.header}
            onPress={() =>
              props.navigation.navigate('Storage', {
                isRTL: props.isFetching ? null : props.isRTL
              })
            }
          />
          <DrawerItem
            iconName='bug'
            text={props.translations.general.bug_report}
            onPress={() =>
              openBrowser('https://airtable.com/shrGQY4b3FSPprzmt')
            }
          />
        </View>
        <SafeAreaView
          style={[
            styles.smallDrawerItemsContainer,
            {
              flexDirection:
                Dimensions.get('window').height < 550
                  ? props.isRLT
                    ? 'row-reverse'
                    : 'row'
                  : 'column'
            }
          ]}
        >
          <SmallDrawerItem
            onPress={() =>
              openBrowser(
                'https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif'
              )
            }
            label={props.translations.general.privacy}
          />
          <SmallDrawerItem
            onPress={() =>
              openBrowser(
                'https://media.giphy.com/media/C4msBrFb6szHG/giphy.gif'
              )
            }
            label={props.translations.general.credits}
          />
          <View
            style={{
              justifyContent: 'center',
              paddingHorizontal: 10,
              marginVertical: 5
            }}
          >
            <Text
              style={[
                styles.versionText,
                {
                  fontFamily: props.font + '-regular',
                  textAlign: props.isRTL ? 'right' : 'left'
                }
              ]}
            >
              v0.5.0.2
            </Text>
          </View>
        </SafeAreaView>
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
    height: 225 * scaleMultiplier,
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 35
  },
  groupIconContainer: {
    alignItems: 'center',
    marginVertical: 10
  },
  groupName: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 25 * scaleMultiplier
  },
  pencilIconContainer: {
    alignSelf: 'flex-end',
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
    height: '100%'
  },
  smallDrawerItemsContainer: {
    width: '100%',
    justifyContent: 'center'
  },
  versionText: {
    fontSize: 10 * scaleMultiplier,
    color: colors.chateau,
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
