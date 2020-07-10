import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Picker,
  TouchableOpacity,
  TextInput,
  SectionList,
  Dimensions
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import { scaleMultiplier, languageT2S, languages } from '../constants'
import NetInfo from '@react-native-community/netinfo'
import ModalSelector from 'react-native-modal-selector'
import LanguageSelectItem from '../components/LanguageSelectItem'
import { FlatList } from 'react-native-gesture-handler'
import { Audio } from 'expo-av'
import { connect } from 'react-redux'
import { addLanguage } from '../redux/actions/databaseActions'
import BackButton from '../components/BackButton'

// translations import
import en from '../translations/en.json'
import fr from '../translations/fr.json'
import ar from '../translations/ar.json'

function LanguageSelectScreen (props) {
  //// STATE

  // keeps track of language selected in picker (TODO: change default to user's default language)
  const [selectedLanguage, setSelectedLanguage] = useState('')

  // keeps track of whether the uesr has an internet connection
  const [isConnected, setIsConnected] = useState(true)

  i18n.locale = Localization.locale
  i18n.fallbacks = true

  // sound for the text to speech

  // translations for language select
  i18n.translations = {
    en,
    fr,
    ar
  }

  const soundObject = new Audio.Sound()

  async function playAudio (key) {
    soundObject.unloadAsync()
    await soundObject.loadAsync(languageT2S[key]).then(() => {
      soundObject.playAsync()
    })
  }

  //// CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected)
    })

    fetch('http://ip-api.com/json/')
      .then(response => response.json())
      .then(responseJson => {
        // console.log(responseJson)
      })
      .catch(error => {
        // console.error(error)
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

  //// FUNCTIONS

  // plays text-to-speech audio file of language

  // updates language on picker change
  function onPickerChange (language) {
    setSelectedLanguage(language)
  }

  //// RENDER

  // render start button conditionally as the user can't start if they don't have internet
  var startButton = isConnected ? (
    <TouchableOpacity
      onPress={
        props.route.name === 'LanguageSelect'
          ? () =>
              props.navigation.navigate('OnboardingSlides', {
                selectedLanguage: selectedLanguage
              })
          : () => props.addLanguage(selectedLanguage)
      }
      style={[styles.button, { backgroundColor: '#60C239' }]}
    >
      <Text style={styles.buttonTitle}>
        {props.route.name === 'LanguageSelect'
          ? i18n.t('letsBegin')
          : i18n.t('addLanguage')}{' '}
      </Text>
    </TouchableOpacity>
  ) : (
    <View style={[styles.button, { backgroundColor: '#828282' }]}>
      <Text style={styles.buttonTitle}>{i18n.t('letsBegin')} </Text>
    </View>
  )

  var errorMessage = isConnected ? null : (
    <View style={{ height: 50 * scaleMultiplier, paddingHorizontal: 10 }}>
      <Text style={styles.errorMessage}>{i18n.t('noInternet')}</Text>
    </View>
  )

  var headerText =
    props.route.name === 'LanguageSelect' ? (
      <View style={{ marginVertical: 40 * scaleMultiplier }}>
        <Text style={styles.title}> {i18n.t('welcome')}</Text>
        <Text style={styles.subtitle}> {i18n.t('selectLanguage')}</Text>
      </View>
    ) : null

  function renderLanguage (item) {
    return (
      <LanguageSelectItem
        nativeName={item.section.data[item.index].nativeName}
        localeName={i18n.t(item.section.data[item.index].i18nName)}
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
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          backgroundColor: '#F7F9FA'
        }}
      >
        <Text>{i18n.t(section.i18nName)}</Text>
      </View>
    )
  }

  return (
    <View style={styles.screen}>
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
          keyExtractor={item => item.wahaID}
          renderItem={renderLanguage}
          renderSectionHeader={({ section }) => renderLanguageHeader(section)}
          renderSectionFooter={() => (
            <View style={{ height: 20 * scaleMultiplier, width: '100%' }} />
          )}
        />
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: 130 * scaleMultiplier
        }}
      >
        {startButton}
        {errorMessage}
      </View>
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F9FA',
    paddingTop: 40 * scaleMultiplier
  },
  title: {
    textAlign: 'center',
    fontSize: 36 * scaleMultiplier,
    fontWeight: 'bold',
    margin: 5
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 24 * scaleMultiplier
  },
  button: {
    height: 60 * scaleMultiplier,
    width: Dimensions.get('window').width - 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D1E20',
    borderRadius: 10
  },
  buttonTitle: {
    textAlign: 'center',
    fontSize: 24 * scaleMultiplier,
    color: '#FFFFFF'
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: 16 * scaleMultiplier,
    color: '#828282'
  }
})

////REDUX

function mapStateToProps (state) {
  return {
    isFetching: state.database.isFetching
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addLanguage: language => dispatch(addLanguage(language))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelectScreen)
