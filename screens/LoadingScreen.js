import NetInfo from '@react-native-community/netinfo'
import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { colors } from '../constants'
import {
  addLanguage,
  setCurrentFetchProgress,
  setFetchError,
  setFinishedInitialFetch,
  setFinishedOnboarding,
  setIsFetching,
  setTotalToDownload
} from '../redux/actions/databaseActions'
import ar from '../translations/ar.json'
// translations import
import en from '../translations/en.json'

function LoadingScreen (props) {
  const [proTipNum, setProTipNum] = useState(1)
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    // if (proTipNum !== 3)
    //   setTimeout(() => setProTipNum(current => current + 1), 8000)
    // else setTimeout(() => setProTipNum(1), 8000)
  }, [proTipNum])

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected)
    })

    return function cleanup () {
      unsubscribe()
    }
  }, [])
  i18n.translations = {
    en,
    ar
  }

  function retry () {
    props.setFetchError(false, null)
    props.addLanguage(props.errorLanguage)
  }

  return props.fetchError ? (
    <View style={styles.screen}>
      <Text
        style={[
          Typography(props, 'h2', '', 'center', colors.shark),
          { padding: 10 }
        ]}
      >
        {i18n.t('errorMessage')}
      </Text>
      <TouchableOpacity onPress={retry} style={styles.button}>
        <Text style={Typography(props, 'h2', '', 'center', colors.white)}>
          {i18n.t('retry')}
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.screen}>
      {/* <View style={{ flex: 2, justifyContent: 'flex-end' }}>
        <Image
          style={{
            resizeMode: 'center',
            width: 200 * scaleMultiplier,
            height: 200 * scaleMultiplier,
            tintColor: '#e43c44'
          }}
          source={require('../assets/icon_transparent.png')}
        />
      </View> */}
      {/* <View style={{ flex: 1 }} /> */}
      <Image
        style={{
          width: Dimensions.get('window').width / 2,
          height: Dimensions.get('window').width / 2,
          tintColor: '#e43c44'
        }}
        source={require('../assets/adaptive-icon-foreground.png')}
        resizeMode='contain'
      />

      {/* <View
        style={{
          flex: 2,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      > */}
      {/* <ActivityIndicator
          size='large'
          color={colors.shark}
          style={{ margin: 5 }}
        /> */}

      {/* <Text style={Typography(props, 'h2', '', 'center', colors.shark)}>
          {i18n.t('loadingMessage')}
        </Text> */}
      <View
        style={{
          width: Dimensions.get('window').width - 40,
          height: 20,
          borderRadius: 20,
          flexDirection: 'row',
          overflow: 'hidden',
          justifyContent: 'center'
        }}
      >
        <View
          style={{
            backgroundColor: '#e43c44',
            height: '100%',
            flex: props.currentFetchProgress,
            borderRadius: 20
          }}
        />
        <View
          style={{
            backgroundColor: colors.white,
            height: '100%',
            flex: props.totalToDownload - props.currentFetchProgress
          }}
        />
      </View>
      <Image
        style={{
          height: 50
        }}
        source={require('../assets/gifs/equalizer.gif')}
        resizeMode='contain'
      />
      {/* <Text style={Typography(props, 'h1', '', 'center', colors.shark)}>
          {props.totalToDownload
            ? props.currentFetchProgress + '/' + props.totalToDownload
            : ''}
        </Text> */}
      {isConnected ? null : <Text>Trying to reconnect...</Text>}
      <TouchableOpacity
        onPress={() => {
          props.setCurrentFetchProgress(0)
          props.setTotalToDownload(0)
          props.setIsFetching(false)
          // only if adding language for the first time
          if (!props.haveFinishedInitialFetch) {
            console.log('go to language select')
            props.setFinishedOnboarding(false)
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'LanguageSelect' }]
            })
          }
          props.storedDownloads.forEach(download => {
            download.pauseAsync()
          })
        }}
        style={{ width: '100%', height: 100, marginVertical: 20 }}
      >
        <Icon name='cancel' size={50} color={colors.shark} />
      </TouchableOpacity>
      {/* </View> */}
      {/* <View style={styles.progressBarContainer}>
        <Progress.Bar
          progress={props.progress}
          width={Dimensions.get('window').width - 50}
          color={colors.chateau}
          borderWidth={2}
          borderColor={colors.shark}
        />
      </View> */}
      {/* <View
        style={{
          paddingHorizontal: 20,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={Typography(props, 'h3', '', 'center', colors.chateau)}>
          {i18n.t('protip' + proTipNum)}
        </Text>
      </View> */}
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white
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
    currentFetchProgress: state.database.currentFetchProgress,
    totalToDownload: state.database.totalToDownload,
    fetchError: state.fetchingStatus.fetchError,
    errorLanguage: state.fetchingStatus.errorLanguage,
    haveFinishedInitialFetch: state.database.haveFinishedInitialFetch,
    storedDownloads: state.storedDownloads,
    database: state.database
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addLanguage: language => {
      dispatch(addLanguage(language))
    },
    setFetchError: (status, language) => {
      dispatch(setFetchError(status, language))
    },
    setIsFetching: status => {
      dispatch(setIsFetching(status))
    },
    setFinishedOnboarding: status => {
      dispatch(setFinishedOnboarding(status))
    },
    setFinishedInitialFetch: status => {
      dispatch(setFinishedInitialFetch(status))
    },
    setTotalToDownload: totalToDownload => {
      dispatch(setTotalToDownload(totalToDownload))
    },
    setCurrentFetchProgress: progress => {
      dispatch(setCurrentFetchProgress(progress))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen)
