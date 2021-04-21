import * as WebBrowser from 'expo-web-browser'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { connect } from 'react-redux'
import DownloadUpdateButton from '../components/DownloadUpdateButton'
import GroupAvatar from '../components/GroupAvatar'
import DrawerItem from '../components/list-items/DrawerItem'
import { scaleMultiplier } from '../constants'
import AddEditGroupModal from '../modals/AddEditGroupModal'
import {
  setHasFetchedLanguageData,
  updateLanguageCoreFiles
} from '../redux/actions/databaseActions'
import { setIsInstallingLanguageInstance } from '../redux/actions/isInstallingLanguageInstanceActions'
import { storeDownloads } from '../redux/actions/storedDownloadsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'
import Separator from './standard/Separator'

function mapStateToProps (state) {
  return {
    primaryColor: activeDatabaseSelector(state).primaryColor,
    isRTL: activeDatabaseSelector(state).isRTL,
    activeGroup: activeGroupSelector(state),
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
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

const WahaDrawer = ({
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
  setIsInstallingLanguageInstance,
  storeDownloads,
  setHasFetchedLanguageData
}) => {
  const [showEditGroupModal, setShowEditGroupModal] = useState(false)

  //+ FUNCTIONS

  // opens a local browser
  async function openBrowser (url) {
    await WebBrowser.openBrowserAsync(url, {
      dismissButtonStyle: 'close'
    })
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
      <ScrollView
        bounces={false}
        style={{ backgroundColor: colors.white, flex: 1 }}
      >
        {/* Show an update button if we have any core files to update. */}
        {languageCoreFilesToUpdate.length !== 0 && (
          <DownloadUpdateButton onUpdatePress={onUpdatePress} />
        )}
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
        <Text
          style={[
            StandardTypography(
              { font, isRTL },
              'p',
              'Regular',
              'left',
              colors.chateau
            ),
            {
              marginHorizontal: 20,
              marginTop: 20 * scaleMultiplier,
              marginBottom: 15 * scaleMultiplier
            }
          ]}
        >
          {translations.general.other}
        </Text>
        <DrawerItem
          icon='storage'
          label={translations.storage.header}
          onPress={() => navigate('Storage')}
        />
        <DrawerItem
          icon='email'
          label={translations.contact_us && translations.contact_us.header}
          onPress={() => navigate('ContactUs')}
        />
        <DrawerItem
          icon='info'
          onPress={() => navigate('Information')}
          label={translations.information && translations.information.header}
        />
      </ScrollView>
      <AddEditGroupModal
        isVisible={showEditGroupModal}
        hideModal={() => setShowEditGroupModal(false)}
        type='EditGroup'
        thisGroup={activeGroup}
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
