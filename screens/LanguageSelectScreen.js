import NetInfo from '@react-native-community/netinfo'
import { Audio } from 'expo-av'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'
import { Alert, SectionList, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import LanguageSelectItem from '../components/LanguageSelectItem'
import Separator from '../components/Separator'
import WahaButton from '../components/WahaButton'
import { colors, languages, languageT2S, scaleMultiplier } from '../constants'
import { addLanguage } from '../redux/actions/databaseActions'
import ar from '../translations/ar.json'
// translations import
import en from '../translations/en.json'
import fr from '../translations/fr.json'

function LanguageSelectScreen (props) {
  //// STATE

  // keeps track of language selected in picker (TODO: change default to user's default language)
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [isListEmpty, setIsListEmpty] = useState(false)

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
  var startButton = isListEmpty ? (
    <WahaButton
      type='inactive'
      color={colors.chateau}
      style={{
        marginHorizontal: 20,
        height: 68 * scaleMultiplier
      }}
      label={i18n.t('noMoreLanguages')}
    />
  ) : isConnected ? (
    <WahaButton
      type='filled'
      color={colors.apple}
      onPress={
        selectedLanguage
          ? props.route.name === 'LanguageSelect'
            ? () =>
                props.navigation.navigate('OnboardingSlides', {
                  selectedLanguage: selectedLanguage
                })
            : () => props.addLanguage(selectedLanguage)
          : () =>
              Alert.alert(
                i18n.t('pleaseSelectLanguageTitle'),
                i18n.t('pleaseSelectLanguageMessage'),
                [{ text: i18n.t('ok'), onPress: () => {} }]
              )
      }
      label={
        props.route.name === 'LanguageSelect'
          ? i18n.t('letsBegin')
          : i18n.t('addLanguage') + ' '
      }
      style={{
        marginHorizontal: 20,
        height: 68 * scaleMultiplier
      }}
    />
  ) : (
    <WahaButton
      type='inactive'
      color={colors.chateau}
      style={{
        marginHorizontal: 20,
        height: 68 * scaleMultiplier
      }}
      label={i18n.t('noInternet')}
    />
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
          // height: 40 * scaleMultiplier,
          aspectRatio: 8.7,
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
        <Text style={{ color: colors.chateau, fontSize: 18 * scaleMultiplier }}>
          {i18n.t(section.i18nName)}
        </Text>
      </View>
    )
  }

  return (
    <View
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
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40 * scaleMultiplier
  },
  title: {
    color: colors.shark,
    textAlign: 'center',
    fontSize: 36 * scaleMultiplier,
    fontWeight: 'bold',
    margin: 5
  },
  subtitle: {
    color: colors.shark,
    textAlign: 'center',
    fontSize: 24 * scaleMultiplier
  },
  buttonTitle: {
    textAlign: 'center',
    fontSize: 24 * scaleMultiplier,
    color: colors.white
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: 16 * scaleMultiplier,
    color: colors.oslo
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
