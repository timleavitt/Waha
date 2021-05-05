import NetInfo from '@react-native-community/netinfo'
import { Audio } from 'expo-av'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { languageT2S } from '../assets/languageT2S/_languageT2S'
import LanguageItem from '../components/LanguageItem'
import WahaButton from '../components/WahaButton'
import WahaSeparator from '../components/WahaSeparator'
import { getSystemIsRTL, groupNames, scaleMultiplier } from '../constants'
import db from '../firebase/db'
import { languages } from '../languages'
import { changeActiveGroup } from '../redux/actions/activeGroupActions'
import {
  deleteLanguageData,
  downloadLanguageCoreFiles,
  incrementGlobalGroupCounter,
  setHasFetchedLanguageData,
  setRecentActiveGroup,
  storeLanguageData,
  storeLanguageSets
} from '../redux/actions/databaseActions'
import { createGroup, deleteGroup } from '../redux/actions/groupsActions'
import { setIsInstallingLanguageInstance } from '../redux/actions/isInstallingLanguageInstanceActions'
import { storeDownloads } from '../redux/actions/storedDownloadsActions'
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
  var activeGroup = state.activeGroup ? activeGroupSelector(state) : null
  return {
    groups: state.groups,
    database: state.database,
    activeGroup: activeGroup
  }
}

function mapDispatchToProps (dispatch) {
  return {
    downloadLanguageCoreFiles: languageInstanceID =>
      dispatch(downloadLanguageCoreFiles(languageInstanceID)),
    storeLanguageData: (data, languageInstanceID) =>
      dispatch(storeLanguageData(data, languageInstanceID)),
    setIsInstallingLanguageInstance: toSet =>
      dispatch(setIsInstallingLanguageInstance(toSet)),
    storeDownloads: downloads => dispatch(storeDownloads(downloads)),
    setHasFetchedLanguageData: hasFetchedLanguageData =>
      dispatch(setHasFetchedLanguageData(hasFetchedLanguageData)),
    storeLanguageSets: (sets, languageInstanceID) =>
      dispatch(storeLanguageSets(sets, languageInstanceID)),
    deleteLanguageData: languageInstanceID =>
      dispatch(deleteLanguageData(languageInstanceID)),
    deleteGroup: groupName => dispatch(deleteGroup(groupName)),
    incrementGlobalGroupCounter: () => dispatch(incrementGlobalGroupCounter()),
    createGroup: (groupName, language, emoji, groupID, groupNumber) =>
      dispatch(createGroup(groupName, language, emoji, groupID, groupNumber)),
    changeActiveGroup: name => {
      dispatch(changeActiveGroup(name))
    },
    setRecentActiveGroup: groupName => {
      dispatch(setRecentActiveGroup(groupName))
    }
  }
}

/**
 * A screen that displays a list of language instances to install. This appears as the first screen the user sees when they open the app for the first time, as well as later if they want to install another language instance.
 * @param {string} routeName - The name of the screen variant. In this case, can either be "InitialLanguageInstanceInstall" or "SubsequentLanguageInstanceInstall" since this screen component is used twice.
 * @param {Object[]} installedLanguageInstances - (Optional) An array of languages instances that are currently installed. Defaults to null since there aren't any installed language instances when the user opens the app for the first time. This variable is only relevant when the user is installing a subsequent language instance.
 * @param {string} installedLanguageInstances[].languageID - The ID of the language.
 * @param {string} installedLanguageInstances[].languageName - The name of the language.
 */
function LanguageInstanceInstallScreen ({
  // Props passed from navigation.
  navigation: { setOptions, goBack, reset, navigate },
  route: {
    name: routeName,
    // Props passed from previous screen.
    params: { installedLanguageInstances } = {
      installedLanguageInstances: null
    }
  },
  // Props passed from redux.
  groups,
  database,
  activeGroup,
  downloadLanguageCoreFiles,
  storeLanguageData,
  setIsInstallingLanguageInstance,
  storeDownloads,
  setHasFetchedLanguageData,
  storeLanguageSets,
  deleteLanguageData,
  deleteGroup,
  incrementGlobalGroupCounter,
  createGroup,
  changeActiveGroup,
  setRecentActiveGroup
}) {
  // Set the i18n locale to the locale of the user's phone.
  i18n.locale = Localization.locale

  // Setting fallbacks to true means that if the user's phone language isn't in i18n, it defaults to English.
  i18n.fallbacks = true

  /** Keeps track of the language that is currently selected. */
  const [selectedLanguage, setSelectedLanguage] = useState('')

  /** Keeps track of whether the list of languages to install is empty. */
  const [isListEmpty, setIsListEmpty] = useState(false)

  /** Keeps track of whether the user is connected to the internet. Note: we don't use the redux isConnected variable because if this is the first time the user has opened the app, that redux variable hasn't been created yet. */
  const [isConnected, setIsConnected] = useState(true)

  /** Keeps track of the Y position of the start button for animating. */
  const [buttonYPos, setButtonYPos] = useState(
    new Animated.Value(68 * scaleMultiplier + 20)
  )

  /** The sound object for playing the language text-to-speech files. */
  const [audio, setAudio] = useState(new Audio.Sound())

  const [searchTextInput, setSearchTextInput] = useState('')

  const [isFetchingFirebaseData, setIsFetchingFirebaseData] = useState(false)

  /** useEffect function that sets the navigation options for this screen. */
  useEffect(() => {
    setOptions(
      routeName === 'SubsequentlLanguageInstanceInstall'
        ? {
            headerTitle: i18n.t('newLanguage')
          }
        : null
    )
  }, [])

  /** useEffect function sets the isConnected state with the status of the user's internet connection. */
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected)
    })

    return function cleanup () {
      unsubscribe()
    }
  }, [])

  /**
   * Plays the text-to-speech audio file for a language.
   * @param {string} languageID - The ID of the language to play.
   */
  async function playAudio (languageID) {
    audio.unloadAsync()
    await audio.loadAsync(languageT2S[languageID]).then(() => {
      audio.playAsync()
    })
  }

  /**
   * Fetches all the data for a language from Firebase. This includes the various Story Sets from the 'sets' collection and the language info from the 'languages' collection. It's an async function and doesn't resolve until all the information has been fetched and stored. If any fetch fails, it throws an error.
   * @param {string} language - The language to fetch the firebase data for.
   */
  const fetchFirebaseData = async language => {
    // Set the installingLanguageInstance redux variable to true since we're now installing a language instance.
    setIsInstallingLanguageInstance(true)

    // Set the isFetchingFirebaseData local state to true so that the continue button shows the activity indicator.
    setIsFetchingFirebaseData(true)

    // Fetch all the Story Sets whith the language ID of the selected language and store them in redux.
    await db
      .collection('sets')
      .where('languageID', '==', language)
      .get()
      .then(response => {
        var sets = []
        response.forEach(set => {
          sets.push({
            id: set.id,
            ...set.data()
          })
        })
        storeLanguageSets(sets, language)
      })
      .catch(error => {
        console.log(error)
        throw error
      })

    // Fetch the language info for the selected language and store it in redux.
    await db
      .collection('languages')
      .doc(language)
      .get()
      .then(async doc => {
        if (doc.exists) {
          storeLanguageData(doc.data(), language)
        }
      })
      .catch(error => {
        console.log(error)
        throw error
      })

    return
  }

  /** Handles the user pressing the start button after they select a language instance to install. Involves fetching the necessary Firebase data, setting the hasFetchedLanguageData to true, and starting the download of the language core files. If this is the first language instance they've installed, we want to nagivate to the onboarding slides too. */
  function onStartPress () {
    fetchFirebaseData(selectedLanguage)
      .then(() => {
        // Set the hasFetchedLanguageData redux variable to true since we're done fetching from Firebase.
        setHasFetchedLanguageData(true)

        // If we're adding a subsequent language instance, then we need to store the active group's language
        if (activeGroup) setRecentActiveGroup(activeGroup.name)

        // Start downloading the core files for this language.
        downloadLanguageCoreFiles(selectedLanguage)

        // Create a new group using the default group name stored in constants.js, assuming a group hasn't already been created with the same name. We don't want any duplicates.
        if (
          !groups.some(group => group.name === groupNames[selectedLanguage])
        ) {
          incrementGlobalGroupCounter()

          createGroup(
            groupNames[selectedLanguage],
            selectedLanguage,
            'default',
            database.globalGroupCounter,
            groups.length + 1
          )
        }

        // Change the active group to the new group we just created.
        changeActiveGroup(groupNames[selectedLanguage])

        // Set the local isFetchingFirebaseData state to false.
        setIsFetchingFirebaseData(false)

        // Navigate to the onboarding slides if this is the first language instance install.
        if (routeName === 'InitialLanguageInstanceInstall') {
          navigate('WahaOnboardingSlides', {
            selectedLanguage: selectedLanguage
          })
        }
      })
      .catch(error => {
        console.log(error)

        // If we get an error, reset the isFetching state, delete any data that might have still come through, and show the user an alert that there was an error.
        setIsFetchingFirebaseData(false)
        deleteLanguageData(selectedLanguage)

        Alert.alert(i18n.t('fetchErrorTitle'), i18n.t('fetchErrorMessage'), [
          {
            text: i18n.t('ok'),
            onPress: () => {}
          }
        ])
      })
  }

  /**
   * Gets a list of all the languages and language families available in Waha. These are stored in the languages.js file.
   * @return {Object[]} - An array of language family objects.
   */
  function getLanguageData () {
    // Sort the languages to put the language family of the phone's current locale at the top.
    const sortByLocale = (a, b) => {
      if (i18n.locale.includes(a.languageCode)) return -1
      else if (i18n.locale.includes(b.languageCode)) return 1
      else return 0
    }

    // If search text matches with a language family name, show the whole language family. If it doesn't, show the specific languages it matches with.
    const filterBySearch = languageFamily => {
      if (
        languageFamily.i18nName
          .toLowerCase()
          .includes(searchTextInput.toLowerCase())
      )
        return languageFamily
      else
        return {
          ...languageFamily,
          data: languageFamily.data.filter(
            language =>
              language.nativeName
                .toLowerCase()
                .includes(searchTextInput.toLowerCase()) ||
              i18n
                .t(language.i18nName)
                .toLowerCase()
                .includes(searchTextInput.toLowerCase()) ||
              language.brandName
                .toLowerCase()
                .includes(searchTextInput.toLowerCase())
          )
        }
    }

    // Filter out language instances that are already installed. Only on SubsequentLanguageInstanceInstallScreen.
    const filterInstalledLanguages = languageFamily => ({
      ...languageFamily,
      data: languageFamily.data.filter(language => {
        if (
          installedLanguageInstances.some(
            installedLanguage =>
              installedLanguage.languageID === language.wahaID
          )
        ) {
          return false
        } else {
          return true
        }
      })
    })

    // Filter our language families that are empty.
    const filterEmptyLanguages = languageFamily => {
      if (languageFamily.data.length !== 0) return true
      else return false
    }

    // Create our sections array.
    var sections

    // Only difference between Initial and Subsequent language instance installs is that in subsequent, we want to filter out installed languages.
    if (routeName === 'InitialLanguageInstanceInstall')
      sections = languages
        .sort(sortByLocale)
        .map(filterBySearch)
        .filter(filterEmptyLanguages)
    else
      sections = languages
        .sort(sortByLocale)
        .map(filterInstalledLanguages)
        .map(filterBySearch)
        .filter(filterEmptyLanguages)

    // If, after all of our filtering, the list is empty, we've installed every language instance and want to set isListEmpty to true.
    if (sections.length === 0 && !isListEmpty) setIsListEmpty(true)

    // Finally, return the sorted and filtered array of languages.
    return sections
  }

  /**
   * Renders a LanguageSelectItem component used for the Languages SectionList item.
   * @param {Object} language - The object for the language to render.
   * @param {Object} languageFamily - The object for the language family that this language is a part of.
   * @return {Component} - The LanguageSelectItem component.
   */
  function renderLanguageItem (language, languageFamily) {
    return (
      <LanguageItem
        nativeName={language.nativeName}
        localeName={i18n.t(language.i18nName)}
        font={languageFamily.font}
        logoSource={language.logoSource}
        onPress={() => {
          if (!selectedLanguage) {
            Animated.spring(buttonYPos, {
              toValue: 0
            }).start()
          }
          setSelectedLanguage(language.wahaID)
        }}
        isSelected={selectedLanguage === language.wahaID ? true : false}
        playAudio={() => playAudio(language.wahaID)}
      />
    )
  }

  /**
   * Renders a component used for the Languages SectionList header.
   * @param {Object} language - The object for the language to render.
   * @param {Object} languageFamily - The object for the language family that this language is a part of.
   * @return {Component} - The LanguageSelectItem component.
   */
  function renderLanguageHeader (languageFamily) {
    return (
      <View
        style={[
          styles.languageHeaderContainer,
          {
            backgroundColor:
              routeName === 'InitialLanguageInstanceInstall'
                ? colors.aquaHaze
                : colors.white
          }
        ]}
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
          {i18n.t(languageFamily.i18nName)}
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
            routeName === 'InitialLanguageInstanceInstall'
              ? colors.aquaHaze
              : colors.white
        }
      ]}
    >
      {routeName === 'InitialLanguageInstanceInstall' && (
        <View style={styles.headerTextContainer}>
          <Text
            style={[
              SystemTypography(false, 'h2', 'Bold', 'center', colors.shark),
              { fontSize: 28 * scaleMultiplier }
            ]}
          >
            {i18n.t('welcome')}
          </Text>
          <View style={{ height: 5 }} />
          <Text
            style={SystemTypography(
              false,
              'h3',
              'Regular',
              'center',
              colors.shark
            )}
          >
            {i18n.t('selectLanguage')}
          </Text>
        </View>
      )}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchIconContainer}>
          <Icon
            name='search'
            size={25 * scaleMultiplier}
            color={colors.chateau}
          />
        </View>
        <TextInput
          style={[
            SystemTypography(false, 'h3', 'Regular', 'left', colors.shark),
            {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }
          ]}
          onChangeText={text => setSearchTextInput(text)}
          autoCorrect={false}
          autoCapitalize='none'
          placeholder='Search'
          placeholderTextColor={colors.chateau}
        />
      </View>
      <View style={styles.languageListContainer}>
        <SectionList
          style={{ height: '100%' }}
          sections={getLanguageData()}
          ItemSeparatorComponent={() => <WahaSeparator />}
          SectionSeparatorComponent={() => <WahaSeparator />}
          ListEmptyComponent={
            searchTextInput
              ? null
              : () => (
                  <View>
                    <View
                      style={{
                        width: '100%',
                        marginBottom: 18 * scaleMultiplier
                      }}
                    >
                      <Text
                        style={SystemTypography(
                          false,
                          'p',
                          'Regular',
                          'center',
                          colors.chateau
                        )}
                      >
                        {i18n.t('noMoreLanguages')}
                      </Text>
                    </View>
                    <WahaSeparator />
                  </View>
                )
          }
          keyExtractor={item => item.wahaID}
          renderItem={({ item, section }) => renderLanguageItem(item, section)}
          renderSectionHeader={({ section }) => renderLanguageHeader(section)}
          renderSectionFooter={() => (
            <View style={{ height: 20 * scaleMultiplier, width: '100%' }} />
          )}
          ListFooterComponent={() => (
            <View style={{ width: '100%', height: 100 * scaleMultiplier }} />
          )}
        />
      </View>
      <Animated.View
        style={[
          styles.startButtonContainer,
          { transform: [{ translateY: buttonYPos }] }
        ]}
      >
        <WahaButton
          type={isConnected ? 'filled' : 'inactive'}
          color={isConnected ? colors.apple : colors.geyser}
          onPress={isConnected && !isFetchingFirebaseData ? onStartPress : null}
          label={
            isConnected
              ? isFetchingFirebaseData
                ? ''
                : routeName === 'InitialLanguageInstanceInstall'
                ? 'Continue'
                : i18n.t('addLanguage') + ' '
              : ''
          }
          style={{
            width: Dimensions.get('window').width - 40,
            marginHorizontal: 20,
            height: 68 * scaleMultiplier
          }}
          useDefaultFont={true}
          extraComponent={
            isConnected ? (
              isFetchingFirebaseData ? (
                <ActivityIndicator color={colors.white} />
              ) : null
            ) : (
              <Icon name='cloud-slash' size={40} color={colors.chateau} />
            )
          }
        />
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  headerTextContainer: {
    marginTop: 20 * scaleMultiplier,
    paddingHorizontal: 20
  },
  startButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  languageHeaderContainer: {
    height: 40 * scaleMultiplier,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  searchBarContainer: {
    width: Dimensions.get('window').width - 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.porcelain,
    height: 50 * scaleMultiplier,
    backgroundColor: colors.athens,
    paddingHorizontal: 5,
    flexDirection: getSystemIsRTL() ? 'row-reverse' : 'row',
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 25 * scaleMultiplier
  },
  searchIconContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  },
  languageListContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageInstanceInstallScreen)
