import * as WebBrowser from 'expo-web-browser'
import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { connect } from 'react-redux'
import GroupAvatar from '../components/GroupAvatar'
import DrawerItem from '../components/list-items/DrawerItem'
import WahaButton from '../components/standard/WahaButton'
import { scaleMultiplier } from '../constants'
import AddEditGroupModal from '../modals/AddEditGroupModal'
import { appVersion } from '../modeSwitch'
import {
  setHasFetchedLanguageData,
  updateLanguageCoreFiles
} from '../redux/actions/databaseActions'
import { setIsInstallingLanguageInstance } from '../redux/actions/isInstallingLanguageInstanceActions'
import { storeDownloads } from '../redux/actions/storedDownloadsActions'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'
import Separator from './standard/Separator'

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    primaryColor: state.database[activeGroup.language].primaryColor,
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language),
    isConnected: state.network.isConnected,
    languageCoreFilesToUpdate: state.database.languageCoreFilesToUpdate
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateLanguageCoreFiles: () => dispatch(updateLanguageCoreFiles()),
    setIsInstallingLanguageInstance: toSet =>
      dispatch(setIsInstallingLanguageInstance(toSet)),
    storeDownloads: downloads => dispatch(storeDownloads(downloads)),
    setHasFetchedLanguageData: hasFetchedLanguageData =>
      dispatch(setHasFetchedLanguageData(hasFetchedLanguageData))
  }
}

function WahaDrawer ({
  // Props passed from navigation.
  navigation: { navigate },
  // Props passed from redux.
  primaryColor,
  isRTL,
  activeGroup,
  translations,
  font,
  isConnected,
  languageCoreFilesToUpdate,
  updateLanguageCoreFiles,
  storeDownloads,
  setHasFetchedLanguageData
}) {
  const [showEditGroupModal, setShowEditGroupModal] = useState(false)

  //+ FUNCTIONS

  // opens a local browser
  async function openBrowser (url) {
    await WebBrowser.openBrowserAsync(url, { dismissButtonStyle: 'cancel' })
  }

  function onUpdatePress () {
    // Replace our downloads object with an empty array.
    // storeDownloads([])

    // Set setIsInstallingLanguageInstance redux variable to true so that the app knows to switch to the loading screen.
    setIsInstallingLanguageInstance(true)

    // Even though we're not fetching any Firebase data here, set this variable to true anyways just to allow the user to cancel the update if they want.
    setHasFetchedLanguageData(true)

    // Update the language core files.
    updateLanguageCoreFiles()
  }

  //+ RENDER

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: primaryColor }]}
      forceInset={{ top: 'always', bottom: 'never', horizontal: 'never' }}
    >
      <View style={styles.drawerHeaderContainer}>
        <View style={styles.groupIconContainer}>
          <GroupAvatar
            style={{ backgroundColor: colors.athens }}
            emoji={activeGroup.emoji}
            size={120}
            onPress={() => setShowEditGroupModal(true)}
          />
        </View>
        <Text
          style={StandardTypography(
            { font, isRTL },
            'h2',
            'Black',
            'center',
            colors.white
          )}
          numberOfLines={2}
        >
          {activeGroup.name}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: colors.white,
          flex: 1
        }}
      >
        <ScrollView bounces={false} style={{ flex: 1 }}>
          {/* Show an update button if we have any core files to update. */}
          {languageCoreFilesToUpdate.length !== 0 ? (
            <WahaButton
              type={isConnected ? 'filled' : 'inactive'}
              color={isConnected ? colors.apple : colors.geyser}
              onPress={() => {
                Alert.alert(
                  'A new update is available to download.',
                  'Would you like to download it now?',
                  [
                    {
                      text: translations.general.cancel,
                      onPress: () => {}
                    },
                    {
                      text: translations.general.ok,
                      onPress: onUpdatePress
                    }
                  ]
                )
              }}
              label='Download Update'
              extraComponent={
                isConnected ? (
                  <View
                    style={{
                      width: 50 * scaleMultiplier,
                      alignItems: 'center'
                    }}
                  >
                    <Icon
                      name='error-filled'
                      size={30 * scaleMultiplier}
                      color={colors.white}
                    />
                  </View>
                ) : (
                  <View style={{ width: 50 * scaleMultiplier }}>
                    <Icon
                      name='cloud-slash'
                      size={30 * scaleMultiplier}
                      color={colors.chateau}
                    />
                  </View>
                )
              }
              style={{
                marginHorizontal: 5,
                marginTop: 5,
                marginBottom: 0,
                height: 50 * scaleMultiplier,
                flexDirection: isRTL ? 'row' : 'row-reverse',
                justifyContent: 'flex-end',
                paddingHorizontal: 5
              }}
              textStyle={[
                { paddingHorizontal: 10 },
                StandardTypography(
                  { font, isRTL },
                  'h3',
                  'Bold',
                  'center',
                  isConnected ? colors.white : colors.chateau
                )
              ]}
            />
          ) : null}
          <View style={{ width: '100%', height: 5 }} />
          <DrawerItem
            icon='group'
            label={translations.groups.header}
            onPress={() => navigate('Groups')}
          />
          <DrawerItem
            icon='security'
            label={translations.security.header}
            onPress={() => navigate('SecurityMode')}
          />
          <DrawerItem
            icon='boat'
            label={translations.mobilization_tools.header}
            onPress={() => navigate('MobilizationTools')}
          />
          <View style={{ width: '100%', height: 5 }} />
          <Separator />
          <View style={{ width: '100%', height: 5 }} />
          <DrawerItem
            icon='storage'
            label={translations.storage.header}
            onPress={() => navigate('Storage')}
          />
          <DrawerItem
            icon='email'
            label={translations.general.feedback}
            onPress={() =>
              openBrowser('https://coda.io/form/Waha-Bug-Report_dyWvuvL6WTx')
            }
          />
          <DrawerItem
            iconName='language'
            onPress={() =>
              openBrowser(
                'https://kingdomstrategies.givingfuel.com/general-giving'
              )
            }
            text={translations.general.donate_to_waha}
          />
          <DrawerItem
            iconName='info'
            onPress={() => openBrowser('https://waha.app/privacy-policy/')}
            text={translations.general.privacy}
          />
          <View style={{ width: '100%', height: 5 }} />
          <Text
            style={StandardTypography(
              { font, isRTL },
              'd',
              'Regular',
              'center',
              colors.chateau
            )}
          >
            {'v' + appVersion}
          </Text>
          {/* <DrawerItem
            iconName='info'
            text={'You are using ' + appVersion}
            onPress={() => {}}
          /> */}
        </ScrollView>
        {/* <SafeAreaView
          style={[
            styles.smallDrawerItemsContainer,
            {
              flexDirection:
                Dimensions.get('window').height < 550
                  ? isRTL
                    ? 'row-reverse'
                    : 'row'
                  : 'column'
            }
          ]}
        >
          <SmallDrawerItem
            onPress={() =>
              openBrowser(
                'https://kingdomstrategies.givingfuel.com/general-giving'
              )
            }
            label={translations.general.donate_to_waha}
          />
          <SmallDrawerItem
            onPress={() => openBrowser('https://waha.app/privacy-policy/')}
            label={translations.general.privacy}
          />
          <View
            style={{
              justifyContent: 'center',
              paddingHorizontal: 10,
              marginVertical: 5
            }}
          >
            <Text
              style={StandardTypography(
                { font, isRTL },
                'd',
                'Regular',
                'left',
                colors.chateau
              )}
            >
              {appVersion}
            </Text>
          </View>
        </SafeAreaView> */}
      </View>
      <AddEditGroupModal
        isVisible={showEditGroupModal}
        hideModal={() => setShowEditGroupModal(false)}
        type='EditGroup'
        group={activeGroup}
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
    justifyContent: 'space-between',
    alignSelf: 'flex-end'
  }
})

//+ REDUX

export default connect(mapStateToProps, mapDispatchToProps)(WahaDrawer)
