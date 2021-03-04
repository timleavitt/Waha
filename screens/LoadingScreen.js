import NetInfo from '@react-native-community/netinfo'
import * as FileSystem from 'expo-file-system'
import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import {
  deleteLanguageData,
  setHasFetchedLanguageData,
  setHasOnboarded,
  setLanguageCoreFilesDownloadProgress,
  setTotalLanguageCoreFilesToDownload
} from '../redux/actions/databaseActions'
import { deleteGroup } from '../redux/actions/groupsActions'
import { setIsInstallingLanguageInstance } from '../redux/actions/isInstallingLanguageInstanceActions'
import { activeGroupSelector } from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { SystemTypography } from '../styles/typography'
import ar from '../translations/ar.json'
import en from '../translations/en.json'

i18n.translations = {
  en,
  ar
}

function mapStateToProps (state) {
  var activeGroup = state.activeGroup
    ? state.groups.filter(item => item.name === state.activeGroup)[0]
    : null
  return {
    languageCoreFilesDownloadProgress:
      state.database.languageCoreFilesDownloadProgress,
    totalLanguageCoreFilesToDownload:
      state.database.totalLanguageCoreFilesToDownload,
    hasInstalledFirstLanguageInstance:
      state.database.hasInstalledFirstLanguageInstance,
    storedDownloads: state.storedDownloads,
    database: state.database,
    hasFetchedLanguageData: state.database.hasFetchedLanguageData,
    actingLanguageID: state.database.actingLanguageID,
    activeGroup: activeGroupSelector(state),
    groups: state.groups
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setIsInstallingLanguageInstance: status => {
      dispatch(setIsInstallingLanguageInstance(status))
    },
    setHasOnboarded: status => {
      dispatch(setHasOnboarded(status))
    },
    setTotalLanguageCoreFilesToDownload: totalLanguageCoreFilesToDownload => {
      dispatch(
        setTotalLanguageCoreFilesToDownload(totalLanguageCoreFilesToDownload)
      )
    },
    setLanguageCoreFilesDownloadProgress: progress => {
      dispatch(setLanguageCoreFilesDownloadProgress(progress))
    },
    setHasFetchedLanguageData: hasFetchedLanguageData => {
      dispatch(setHasFetchedLanguageData(hasFetchedLanguageData))
    },
    deleteLanguageData: language => {
      dispatch(deleteLanguageData(language))
    },
    deleteGroup: groupName => dispatch(deleteGroup(groupName))
  }
}

function LoadingScreen ({
  navigation,
  // Props passed from redux.
  languageCoreFilesDownloadProgress,
  totalLanguageCoreFilesToDownload,
  hasInstalledFirstLanguageInstance,
  storedDownloads,
  database,
  actingLanguageID,
  activeGroup,
  groups,
  hasFetchedLanguageData,
  setIsInstallingLanguageInstance,
  setHasOnboarded,
  setTotalLanguageCoreFilesToDownload,
  setLanguageCoreFilesDownloadProgress,
  setHasFetchedLanguageData,
  deleteLanguageData,
  deleteGroup
}) {
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected)
    })

    return function cleanup () {
      unsubscribe()
    }
  }, [])

  function cancelDownloads () {
    setLanguageCoreFilesDownloadProgress(0)
    setTotalLanguageCoreFilesToDownload(1)
    setIsInstallingLanguageInstance(false)
    setHasFetchedLanguageData(false)

    // only if adding language for the first time
    if (!hasInstalledFirstLanguageInstance) {
      setHasOnboarded(false)
      navigation.reset({
        index: 0,
        routes: [{ name: 'InitialLanguageInstanceInstall' }]
      })
    }
    storedDownloads.forEach(download => {
      download.pauseAsync().catch(() => console.log('Error pausing a download'))
    })

    console.log(actingLanguageID)

    if (
      actingLanguageID !== null &&
      (!activeGroup || activeGroup.language !== actingLanguageID)
    ) {
      console.log(
        'Cancelled a language instance installation. Removing language data from redux and deleting any files for that language instance.'
      )
      groups.forEach(group => {
        if (group.language === actingLanguageID) {
          deleteGroup(group.name)
        }
      })
      deleteLanguageData(actingLanguageID)
      FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
        contents => {
          for (const item of contents) {
            if (item.slice(0, 2) === actingLanguageID) {
              FileSystem.deleteAsync(FileSystem.documentDirectory + item)
            }
          }
        }
      )
    }

    // if (condition that distinguishes updating from downloading is downloading AND language isn't the active group AND language isn't the only language installed)
    //  delete the language from the db and remove all files

    // // delete all groups w/ this language
    // groups.map(group => {
    //   if (group.language === languageID) {
    //     deleteGroup(group.name)
    //   }
    // })

    // // delete all downloaded files for this language
    // FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
    //   contents => {
    //     for (const item of contents) {
    //       if (item.slice(0, 2) === languageID) {
    //         FileSystem.deleteAsync(FileSystem.documentDirectory + item)
    //         removeDownload(item.slice(0, 5))
    //       }
    //     }
    //   }
    // )

    // // delete section of database for this language
    // deleteLanguageData(languageID)
  }

  return (
    <View style={styles.screen}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 40 * scaleMultiplier
        }}
      >
        <Image
          style={{
            width: Dimensions.get('window').width / 2,
            height: Dimensions.get('window').width / 2
          }}
          source={require('../assets/gifs/waha_loading.gif')}
          resizeMode='contain'
        />
        <View
          style={{
            width: Dimensions.get('window').width - 60,
            height: 40 * scaleMultiplier,
            borderRadius: 30,
            flexDirection: 'row',
            overflow: 'hidden',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: colors.porcelain
          }}
        >
          {languageCoreFilesDownloadProgress ? (
            <View
              style={{
                backgroundColor: '#E63946',
                height: '100%',
                flex: languageCoreFilesDownloadProgress,
                borderRadius: 20
              }}
            />
          ) : null}
          {languageCoreFilesDownloadProgress ? (
            <View
              style={{
                backgroundColor: '#F1FAEE',
                height: '100%',
                flex:
                  totalLanguageCoreFilesToDownload -
                  languageCoreFilesDownloadProgress
              }}
            />
          ) : null}
        </View>
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 60 * scaleMultiplier,
            paddingHorizontal: 20,
            justifyContent: 'center',
            flexDirection: 'row'
          }}
        >
          {isConnected ? null : (
            <Text
              style={SystemTypography(false, 'h4', '', 'center', colors.shark)}
            >
              {i18n.t('lostConnection')}
            </Text>
          )}
        </View>
      </View>
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            width: '100%',
            height: 100,
            marginVertical: 20,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {hasFetchedLanguageData ? (
            <TouchableOpacity
              onPress={cancelDownloads}
              style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Icon name='cancel' color={colors.shark} size={50} />
              <Text>{i18n.t('cancel')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1FAEE'
  },
  progressBarContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.aquaHaze,
    borderRadius: 10
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen)
