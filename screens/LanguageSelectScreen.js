import NetInfo from '@react-native-community/netinfo'
import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Dimensions,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import LanguageSelectItem from '../components/list-items/LanguageSelectItem'
import Separator from '../components/standard/Separator'
import WahaButton from '../components/standard/WahaButton'
import { colors, languages, languageT2S, scaleMultiplier } from '../constants'
import db from '../firebase/db'
import {
  deleteLanguageData,
  downloadLanguageCoreFiles,
  setHasFetchedLanguageData,
  storeLanguageData,
  storeLanguageSets
} from '../redux/actions/databaseActions'
import { deleteGroup } from '../redux/actions/groupsActions'
import { setIsInstallingLanguageInstance } from '../redux/actions/isInstallingLanguageInstanceActions'
import { storeDownloads } from '../redux/actions/storedDownloadsActions'
import { SystemTypography } from '../styles/typography'
import ar from '../translations/ar.json'
import en from '../translations/en.json'

i18n.translations = {
  en,
  ar
}

function LanguageSelectScreen (props) {
  //+ STATE

  // keeps track of language selected in picker (TODO: change default to user's default language)
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [isListEmpty, setIsListEmpty] = useState(false)

  // keeps track of whether the uesr has an internet connection
  const [isConnected, setIsConnected] = useState(true)

  i18n.locale = Localization.locale
  i18n.fallbacks = true

  // sound for the text to speech

  const soundObject = new Audio.Sound()

  async function playAudio (key) {
    soundObject.unloadAsync()
    await soundObject.loadAsync(languageT2S[key]).then(() => {
      soundObject.playAsync()
    })
  }

  //+ CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())

    // Clear out the database and downloaded files in case we somehow come back to the Language Select screen after installing anything.
    if (props.route.name === 'LanguageSelect') {
      props.groups.forEach(group => props.deleteGroup(group.name))

      Object.keys(props.database).forEach(key => {
        if (key.length === 2) {
          props.deleteLanguageData(key)
          FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
            contents => {
              for (const item of contents) {
                if (item.slice(0, 2) === key) {
                  FileSystem.deleteAsync(FileSystem.documentDirectory + item)
                }
              }
            }
          )
        }
      })
    }

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected)
    })

    return function cleanup () {
      unsubscribe()
    }
  }, [])

  function getNavOptions () {
    return props.route.name === 'AddLanguage'
      ? {
          headerTitle: i18n.t('newLanguage')
        }
      : null
  }

  //+ FUNCTIONS

  async function fetchFirebaseData () {
    props.storeDownloads([])
    props.setIsInstallingLanguageInstance(true)
    //- get sets first

    await db
      .collection('sets')
      .where('languageID', '==', selectedLanguage)
      .get()
      .then(response => {
        var sets = []
        response.forEach(set => {
          sets.push({
            id: set.id,
            ...set.data()
          })
        })
        props.storeLanguageSets(sets, selectedLanguage)
      })
      .catch(error => {
        console.log(error)
        throw error
      })

    //- then get language object from database and throw all of it in redux
    await db
      .collection('languages')
      .doc(selectedLanguage)
      .get()
      .then(async doc => {
        if (doc.exists) {
          props.storeLanguageData(doc.data(), selectedLanguage)
        }
      })
      .catch(error => {
        console.log(error)
        throw error
      })
    return
  }

  function onStartPress () {
    if (selectedLanguage) {
      fetchFirebaseData()
        .then(() => {
          props.setHasFetchedLanguageData(true)
          props.downloadLanguageCoreFiles(selectedLanguage)
        })
        .catch(error => {
          Alert.alert(i18n.t('fetchErrorTitle'), i18n.t('fetchErrorMessage'), [
            {
              text: i18n.t('ok'),
              onPress: () => {
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'LanguageSelect' }]
                })
              }
            }
          ])
        })
      if (props.route.name === 'LanguageSelect') {
        props.navigation.navigate('OnboardingSlides', {
          selectedLanguage: selectedLanguage
        })
      }
    } else {
      Alert.alert(
        i18n.t('pleaseSelectLanguageTitle'),
        i18n.t('pleaseSelectLanguageMessage'),
        [
          {
            text: i18n.t('ok'),
            onPress: () => {}
          }
        ]
      )
    }
  }

  // updates language on picker change
  function onPickerChange (language) {
    setSelectedLanguage(language)
  }

  //+ RENDER

  // render start button conditionally as the user can't start if they don't have internet
  var startButton = isListEmpty ? (
    <WahaButton
      type='inactive'
      color={colors.aquaHaze}
      style={{
        marginHorizontal: 20,
        height: 68 * scaleMultiplier
      }}
      label={i18n.t('noMoreLanguages')}
      useDefaultFont={true}
    />
  ) : isConnected ? (
    <WahaButton
      type='filled'
      color={colors.apple}
      onPress={onStartPress}
      label={
        props.route.name === 'LanguageSelect'
          ? i18n.t('letsBegin')
          : i18n.t('addLanguage') + ' '
      }
      style={{
        width: Dimensions.get('window').width - 40,
        marginHorizontal: 20,
        height: 68 * scaleMultiplier
      }}
      useDefaultFont={true}
    />
  ) : (
    <WahaButton
      type='inactive'
      color={colors.geyser}
      style={{
        width: Dimensions.get('window').width - 40,
        height: 68 * scaleMultiplier
      }}
      label={''}
      useDefaultFont={true}
      extraComponent={
        <View>
          <Icon name='cloud-slash' size={40} color={colors.chateau} />
        </View>
      }
    />
  )

  var headerText =
    props.route.name === 'LanguageSelect' ? (
      <View
        style={{
          marginVertical: 20 * scaleMultiplier,
          paddingHorizontal: 20
        }}
      >
        <Text
          style={[
            SystemTypography(false, 'h1', 'Bold', 'center', colors.shark)
          ]}
        >
          {i18n.t('welcome')}
        </Text>
        <Text
          style={SystemTypography(
            false,
            'h2',
            'Regular',
            'center',
            colors.shark
          )}
        >
          {i18n.t('selectLanguage')}
        </Text>
      </View>
    ) : (
      <View style={{ width: '100%', height: 20 * scaleMultiplier }} />
    )

  function renderLanguage (item) {
    return (
      <LanguageSelectItem
        nativeName={item.section.data[item.index].nativeName}
        localeName={i18n.t(item.section.data[item.index].i18nName)}
        font={item.section.font}
        logoSource={item.section.data[item.index].logoSource}
        onPress={() =>
          setSelectedLanguage(item.section.data[item.index].wahaID)
        }
        isSelected={
          selectedLanguage === item.section.data[item.index].wahaID
            ? true
            : false
        }
        playAudio={() => playAudio(item.section.data[item.index].wahaID)}
      />
    )
  }

  function renderLanguageHeader (section) {
    return (
      <View
        style={{
          height: 40 * scaleMultiplier,
          // aspectRatio: 8.7,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          backgroundColor:
            props.route.name === 'LanguageSelect'
              ? colors.aquaHaze
              : colors.white
        }}
      >
        <Text
          style={SystemTypography(
            false,
            'h3',
            'Regular',
            'left',
            colors.chateau
          )}
        >
          {i18n.t(section.i18nName)}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView
      style={[
        styles.screen,
        {
          backgroundColor:
            props.route.name === 'LanguageSelect'
              ? colors.aquaHaze
              : colors.white
        }
      ]}
    >
      {headerText}
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flex: 1
        }}
      >
        <SectionList
          // sort sections to put brands associated with phone language at the
          //  top
          style={{ height: '100%' }}
          sections={
            props.route.name === 'LanguageSelect'
              ? languages.sort((a, b) => {
                  if (i18n.locale.includes(a.languageCode)) return -1
                  else if (i18n.locale.includes(b.languageCode)) return 1
                  else return 0
                })
              : languages
                  // sort based on closeness to phone language
                  .sort((a, b) => {
                    if (i18n.locale.includes(a.languageCode)) return -1
                    else if (i18n.locale.includes(b.languageCode)) return 1
                    else return 0
                  })
                  // filter out languages that are already installed
                  .map(languageFamily => {
                    return {
                      ...languageFamily,
                      // filter out languages that are in
                      //  installedLanguageInstances which came from previous
                      //  screen
                      data: languageFamily.data.filter(language => {
                        if (
                          props.route.params.installedLanguageInstances.some(
                            installedLanguage =>
                              installedLanguage.languageID === language.wahaID
                          )
                        ) {
                          return false
                        } else {
                          return true
                        }
                      })
                    }
                  })
                  // if a language family has every language installed, don't
                  //  show it
                  .filter(languageFamily => {
                    if (languageFamily.data.length !== 0) return true
                    else return false
                  })
          }
          ItemSeparatorComponent={() => <Separator />}
          SectionSeparatorComponent={() => <Separator />}
          ListEmptyComponent={() => {
            setIsListEmpty(true)
            return null
          }}
          keyExtractor={item => item.wahaID}
          renderItem={renderLanguage}
          renderSectionHeader={({ section }) => renderLanguageHeader(section)}
          renderSectionFooter={() => (
            <View style={{ height: 20 * scaleMultiplier, width: '100%' }} />
          )}
        />
      </View>
      {startButton}
    </SafeAreaView>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
    // paddingTop: 40 * scaleMultiplier
  },
  buttonContainer: {
    borderRadius: 10,
    width: Dimensions.get('window').width - 40,
    marginVertical: 20 * scaleMultiplier,
    marginHorizontal: 20,
    height: 65 * scaleMultiplier,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  }
})

//+ REDUX

function mapStateToProps (state) {
  return {
    database: state.database,
    groups: state.groups
  }
}

function mapDispatchToProps (dispatch) {
  return {
    downloadLanguageCoreFiles: languageInstanceID =>
      dispatch(downloadLanguageCoreFiles(languageInstanceID)),
    storeLanguageData: (data, languageInstanceID) =>
      dispatch(storeLanguageData(data, languageInstanceID)),
    deleteLanguageData: languageInstanceID =>
      dispatch(deleteLanguageData(languageInstanceID)),
    storeLanguageSets: (sets, languageInstanceID) =>
      dispatch(storeLanguageSets(sets, languageInstanceID)),
    setIsInstallingLanguageInstance: toSet =>
      dispatch(setIsInstallingLanguageInstance(toSet)),
    storeDownloads: downloads => dispatch(storeDownloads(downloads)),
    setHasFetchedLanguageData: hasFetchedLanguageData =>
      dispatch(setHasFetchedLanguageData(hasFetchedLanguageData)),
    deleteGroup: groupName => dispatch(deleteGroup(groupName))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelectScreen)
