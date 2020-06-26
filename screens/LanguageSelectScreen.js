import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Picker,
  TouchableOpacity,
  TextInput
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import { scaleMultiplier, languageT2S } from '../constants'
import NetInfo from '@react-native-community/netinfo'
import ModalSelector from 'react-native-modal-selector'
import LanguageSelectItem from '../components/LanguageSelectItem'

function LanguageSelectScreen (props) {
  //// STATE

  // keeps track of language selected in picker (TODO: change default to user's default language)
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.locale)

  // keeps track of whether the uesr has an internet connection
  const [isConnected, setIsConnected] = useState(true)

  // sound for the text to speech

  // translations for language select
  i18n.translations = {
    en: {
      welcome: 'Hello and welcome!',
      selectLanguage: 'Please select your language.',
      letsBegin: "Let's begin!",
      noInternet: 'Error: an internet connection is required to set up the app',
      cancel: 'Cancel'
    },
    te: {
      welcome: 'morbi tristique senectus et!',
      selectLanguage: 'eget nulla facilisi etiam.',
      letsBegin: 'nibh ipsum!',
      noInternet: 'morbi tristique senectus et eget nulla facilisi etiam',
      cancel: 'Lecnac'
    }
  }

  const data = [
    {
      key: 'en',
      label: 'English',
      component: <LanguageSelectItem id='en' label='🇺🇸English' />
    },
    {
      key: 'te',
      label: 'Test',
      component: <LanguageSelectItem id='te' label='⭐️Test' />
    }
  ]

  //// CONSTRUCTOR

  useEffect(() => {
    i18n.locale = Localization.locale
    i18n.fallbacks = true

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected)
    })

    fetch('http://ip-api.com/json/')
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
      })
      .catch(error => {
        console.error(error)
      })

    return function cleanup () {
      unsubscribe()
    }
  }, [])

  //// FUNCTIONS

  // plays text-to-speech audio file of language

  // updates language on picker change
  function onPickerChange (language) {
    setSelectedLanguage(language)
    i18n.locale = language
  }

  //// RENDER

  // render start button conditionally as the user can't start if they don't have internet
  var startButton = isConnected ? (
    <TouchableOpacity
      onPress={() =>
        props.navigation.navigate('OnboardingSlides', {
          selectedLanguage: selectedLanguage
        })
      }
      style={styles.button}
    >
      <Text style={styles.buttonTitle}>{i18n.t('letsBegin')} </Text>
    </TouchableOpacity>
  ) : (
    <View style={[styles.button, { backgroundColor: '#828282' }]}>
      <Text style={styles.buttonTitle}>{i18n.t('letsBegin')} </Text>
    </View>
  )

  var errorMessage = isConnected ? (
    <View style={styles.errorMessageContainer}></View>
  ) : (
    <View style={styles.errorMessageContainer}>
      <Text style={styles.errorMessage}>{i18n.t('noInternet')}</Text>
    </View>
  )

  return (
    <View style={styles.screen}>
      <View>
        <Text style={styles.title}> {i18n.t('welcome')}</Text>
        <Text style={styles.subtitle}> {i18n.t('selectLanguage')}</Text>
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 20
        }}
      >
        <View style={{ flex: 1 }}>
          <ModalSelector
            data={data}
            animationType='fade'
            // initValue={
            //   data.filter(item => item.key === selectedLanguage)[0].value
            // }
            // selectedKey={selectedLanguage}
            onChange={option => {
              onPickerChange(option.key)
            }}
            cancelText={i18n.t('cancel')}
            cancelStyle={{
              height: 70 * scaleMultiplier,
              justifyContent: 'center'
            }}
            backdropPressToClose={true}
          >
            <View
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                backgroundColor: '#FFFFFF',
                height: 80 * scaleMultiplier,
                justifyContent: 'center',
                paddingHorizontal: 20
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 24 * scaleMultiplier
                }}
              >
                {data.filter(item => item.key === selectedLanguage)[0].label}
              </Text>
            </View>
          </ModalSelector>
        </View>
      </View>
      {startButton}
      {errorMessage}
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7'
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
    width: 250 * scaleMultiplier,
    height: 60 * scaleMultiplier,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D1E20',
    borderRadius: 5
  },
  buttonTitle: {
    textAlign: 'center',
    fontSize: 24 * scaleMultiplier,
    color: '#FFFFFF'
  },
  errorMessageContainer: {
    height: '10%',
    width: '100%'
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: 16 * scaleMultiplier,
    color: '#828282',
    marginTop: 10
  }
})

export default LanguageSelectScreen
