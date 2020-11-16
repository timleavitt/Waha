import * as WebBrowser from 'expo-web-browser'
import React, { useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { connect } from 'react-redux'
import GroupAvatar from '../components/GroupAvatar'
import DrawerItem from '../components/list-items/DrawerItem'
import SmallDrawerItem from '../components/list-items/SmallDrawerItem'
import { colors, scaleMultiplier } from '../constants'
import AddEditGroupModal from '../modals/AddEditGroupModal'
import { BrandTypography } from '../styles/typography'

function WahaDrawer (props) {
  const [showEditGroupModal, setShowEditGroupModal] = useState(false)

  //+ FUNCTIONS

  // opens a local browser
  async function openBrowser (url) {
    await WebBrowser.openBrowserAsync(url, { dismissButtonStyle: 'cancel' })
  }

  //+ RENDER

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: props.primaryColor }]}
      forceInset={{ top: 'always', bottom: 'never', horizontal: 'never' }}
    >
      <View style={styles.drawerHeaderContainer}>
        <View style={styles.groupIconContainer}>
          <GroupAvatar
            style={{ backgroundColor: colors.athens }}
            emoji={props.activeGroup.emoji}
            size={120}
            onPress={() => setShowEditGroupModal(true)}
          />
        </View>
        <Text
          style={BrandTypography(props, 'h2', 'black', 'center', colors.white)}
          numberOfLines={2}
        >
          {props.activeGroup.name}
        </Text>
        {/* <View style={styles.pencilIconContainer}>
          <TouchableOpacity onPress={() => setShowEditGroupModal(true)}>
            <Icon
              name='pencil'
              size={25 * scaleMultiplier}
              color={colors.white}
            />
          </TouchableOpacity>
        </View> */}
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
            text={props.translations.security.header}
            onPress={() => props.navigation.navigate('Security')}
          />
          <DrawerItem
            iconName='boat'
            text={props.translations.mobilization_tools.header}
            onPress={() => props.navigation.navigate('MobilizationTools')}
          />
          <DrawerItem
            iconName='storage'
            text={props.translations.storage.header}
            onPress={() => props.navigation.navigate('Storage')}
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
                  ? props.isRTL
                    ? 'row-reverse'
                    : 'row'
                  : 'column'
            }
          ]}
        >
          <SmallDrawerItem
            onPress={() => openBrowser('https://waha.app/privacy-policy/')}
            label={props.translations.general.privacy}
          />
          {/* <SmallDrawerItem
            onPress={() =>
              openBrowser(
                'https://media.giphy.com/media/C4msBrFb6szHG/giphy.gif'
              )
            }
            label={props.translations.general.credits}
          /> */}
          <View
            style={{
              justifyContent: 'center',
              paddingHorizontal: 10,
              marginVertical: 5
            }}
          >
            <Text
              style={BrandTypography(
                props,
                'd',
                'regular',
                'left',
                colors.chateau
              )}
            >
              v0.7.0
            </Text>
          </View>
        </SafeAreaView>
      </View>
      <AddEditGroupModal
        isVisible={showEditGroupModal}
        hideModal={() => setShowEditGroupModal(false)}
        type='EditGroup'
        groupName={props.activeGroup.name}
      />
    </SafeAreaView>
  )
}

//+ REDUX

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
    justifyContent: 'space-between'
  }
})

//+ REDUX

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
