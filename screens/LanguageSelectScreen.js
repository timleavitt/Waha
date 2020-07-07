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

function LanguageSelectScreen (props) {
  //// STATE

  // keeps track of language selected in picker (TODO: change default to user's default language)
  const [selectedLanguage, setSelectedLanguage] = useState('')

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
      cancel: 'Cancel',
      // waha language headers
      english: 'English',
      french: 'French',
      arabic: 'Arabic',
      // waha languages
      englishGlobal: 'English (Global)',
      englishUK: 'English (UK)',
      englishAustralia: 'English (Australia)',
      french: 'French',
      darija: 'Darija',
      laarbia: 'Laarbia'
    },
    fr: {
      welcome: 'Bonjour et bienvenue!',
      selectLanguage: 'Veuillez sélectionner votre langue.',
      letsBegin: 'Commençons!',
      noInternet:
        "Erreur: une connexion Internet est requise pour configurer l'application",
      cancel: 'Annuler',
      // waha language headers
      english: 'Anglais',
      french: 'Français',
      arabic: 'Arabe',
      // waha languages
      englishGlobal: 'Anglais (Mondial)',
      englishUK: 'Anglais (Royaume-Uni)',
      englishAustralia: 'Anglais (Australie)',
      french: 'Français',
      darija: 'Accent Marocain',
      laarbia: 'Libyen'
    },
    ar: {
      welcome: 'أهلا ومرحبا!',
      selectLanguage: 'الرجاء اختيار لغتك.',
      letsBegin: 'هيا نبدأ!',
      noInternet: 'خطأ: مطلوب اتصال بالإنترنت لإعداد التطبيق',
      cancel: 'إلغاء',
      // waha language headers
      english: 'الإنجليزية',
      french: 'فرنسي',
      arabic: 'العربية',
      // waha languages
      englishGlobal: 'الإنجليزية (عالميًا)',
      englishUK: 'الإنجليزية (المملكة المتحدة)',
      englishAustralia: 'الإنجليزية (أستراليا)',
      french: 'فرنسي',
      darija: 'اللهجة المغربية',
      laarbia: 'ليبي‎'
    }
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
    i18n.locale = Localization.locale
    i18n.fallbacks = true

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
      onPress={() =>
        props.navigation.navigate('OnboardingSlides', {
          selectedLanguage: selectedLanguage
        })
      }
      style={[styles.button, { backgroundColor: '#60C239' }]}
    >
      <Text style={styles.buttonTitle}>{i18n.t('letsBegin')} </Text>
    </TouchableOpacity>
  ) : (
    <View style={[styles.button, { backgroundColor: '#828282' }]}>
      <Text style={styles.buttonTitle}>{i18n.t('letsBegin')} </Text>
    </View>
  )

  var errorMessage = isConnected ? (
    <View
      style={{ height: 50 * scaleMultiplier, paddingHorizontal: 10 }}
    ></View>
  ) : (
    <View style={{ height: 50 * scaleMultiplier, paddingHorizontal: 10 }}>
      <Text style={styles.errorMessage}>{i18n.t('noInternet')}</Text>
    </View>
  )

  function renderLanguage (item) {
    return (
      <LanguageSelectItem
        nativeName={item.section.data[item.index].nativeName}
        localeName={i18n.t(item.section.data[item.index].i18nName)}
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
          backgroundColor: '#EAEEF0',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginRight: 20
          }}
        >
          <Text>{section.title}</Text>
          <Text>{i18n.t(section.i18nName)}</Text>
        </View>
        <TouchableOpacity onPress={() => playAudio(section.i18nName)}>
          <Icon name='volume' size={30} color='black' />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <View style={{ marginVertical: 20 }}>
        <Text style={styles.title}> {i18n.t('welcome')}</Text>
        <Text style={styles.subtitle}> {i18n.t('selectLanguage')}</Text>
      </View>
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#EAEEF0',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          flex: 1
        }}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: 1
          }}
        >
          <SectionList
            sections={languages}
            keyExtractor={item => item.wahaID}
            renderItem={renderLanguage}
            renderSectionHeader={({ section }) => renderLanguageHeader(section)}
            renderSectionFooter={() => (
              <View style={{ height: 20 * scaleMultiplier, width: '100%' }} />
            )}
          />
          {/* <ModalSelector
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
        </ModalSelector> */}
        </View>
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
    backgroundColor: '#F7F7F7',
    paddingTop: 20 * scaleMultiplier
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
    borderRadius: 5,
    marginVertical: 10
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

export default LanguageSelectScreen
