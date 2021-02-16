import NetInfo from '@react-native-community/netinfo'
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
  setHasFetchedLanguageData,
  setHasOnboarded,
  setLanguageCoreFilesDownloadProgress,
  setTotalLanguageCoreFilesToDownload
} from '../redux/actions/databaseActions'
import { setIsInstallingLanguageInstance } from '../redux/actions/isInstallingLanguageInstanceActions'
import { colors } from '../styles/colors'
import { SystemTypography } from '../styles/typography'
import ar from '../translations/ar.json'
import en from '../translations/en.json'

i18n.translations = {
  en,
  ar
}

function LoadingScreen ({
  navigation,
  // Props passed from redux.
  languageCoreFilesDownloadProgress,
  totalLanguageCoreFilesToDownload,
  hasInstalledFirstLanguageInstance,
  storedDownloads,
  database,
  hasFetchedLanguageData,
  setIsInstallingLanguageInstance,
  setHasOnboarded,
  setTotalLanguageCoreFilesToDownload,
  setLanguageCoreFilesDownloadProgress,
  setHasFetchedLanguageData
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
    setTotalLanguageCoreFilesToDownload(0)
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
      download.pauseAsync().catch(() => console.log('error pausing download'))
    })
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
                backgroundColor: '#e43c44',
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

function mapStateToProps (state) {
  return {
    languageCoreFilesDownloadProgress:
      state.database.languageCoreFilesDownloadProgress,
    totalLanguageCoreFilesToDownload:
      state.database.totalLanguageCoreFilesToDownload,
    hasInstalledFirstLanguageInstance:
      state.database.hasInstalledFirstLanguageInstance,
    storedDownloads: state.storedDownloads,
    database: state.database,
    hasFetchedLanguageData: state.database.hasFetchedLanguageData
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
    setHasFetchedLanguageData: hasFetchedLanguageData =>
      dispatch(setHasFetchedLanguageData(hasFetchedLanguageData))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen)
