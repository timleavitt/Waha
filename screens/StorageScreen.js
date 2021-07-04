import * as FileSystem from 'expo-file-system'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'
import LanguageStorageItem from '../components/LanguageStorageItem'
import WahaBackButton from '../components/WahaBackButton'
import WahaButton from '../components/WahaButton'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    database: state.database,
    t: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language)
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

// Regular expression that checks whether a file name is for a lesson mp3 or mp4.
const isLessonFile = new RegExp('[a-z]{2}.[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,2}.*')

/**
 * A screen that contains storage size information for each language instance and the ability to delete downloaded files.
 */
const StorageScreen = ({
  // Props passed from navigation.
  navigation: { setOptions, goBack },
  // Props passed from redux.
  isRTL,
  database,
  t,
  font
}) => {
  /** Keeps track of the amount of storage each language's downloaded Story and Training chapter mp3s and mp4s take up. */
  const [languageStorageSizes, setLanguageSizes] = useState({})

  /** Keeps track of the total storage for all downloaded Story and Training chapter mp3s and mp4s across all languages. */
  const [totalStorage, setTotalStorage] = useState(0)

  /** useEffect function that sets the navigation options for this screen. */
  useEffect(() => {
    setOptions({
      headerRight: isRTL
        ? () => <WahaBackButton onPress={() => goBack()} />
        : () => <View></View>,
      headerLeft: isRTL
        ? () => <View></View>
        : () => <WahaBackButton onPress={() => goBack()} />
    })
  }, [])

  /** useEffect function that gets all the storage used for all the different languages. */
  useEffect(() => {
    getTotalStorageAndLanguageSizes()
  }, [])

  /**
   * Gets the megabytes that the downloaded Story and Training chapter mp3s and mp4s take up for a single language.
   * @param {string} language - The language to get the storage size of.
   * @return {number} - The size that the language takes up.
   */
  const getLanguageStorageSize = async language => {
    // Stores the size of this language.
    var languageStorageSize = 0

    // Read the contents of the FileSystem directory.
    return await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      .then(async contents => {
        for (const item of contents) {
          // If a file is a lesson...
          if (isLessonFile.exec(item)) {
            // ...and it's for the language we're currently checking...
            if (item.slice(0, 2) === language) {
              // ...get its size...
              await FileSystem.getInfoAsync(
                FileSystem.documentDirectory + item,
                {}
              ).then(({ size }) => {
                // ...and add it to our storage size variable. Note: we divide by 1000000 because we want it to be in megabytes.
                languageStorageSize += Math.round(size / 1000000)
              })
            }
          }
        }
      })
      .then(() => languageStorageSize)
  }

  /** Gets all of the individual language storage sizes and the total storage size. */
  const getTotalStorageAndLanguageSizes = () => {
    // Reset states to empty.
    setTotalStorage(0)
    setLanguageSizes({})

    // Get the currently installed langauges.
    var languages = getInstalledLanguageInstances()

    // Go through each language and get its storage size.
    languages.forEach(language =>
      getLanguageStorageSize(language.languageID).then(storageUsed => {
        setTotalStorage(oldStorage => oldStorage + storageUsed)
        setLanguageSizes(oldObject => ({
          ...oldObject,
          [language.languageID]: storageUsed
        }))
      })
    )
  }

  // deletes all downloaded chapter 2s for a specific language
  // note: if no language specified, deletes all chapter 2s

  /**
   * Deletes all of the Story and Training mp3s and mp4s for a specific language. If no language is specified, deletes them for all languages.
   * @param {string} language - (Optional) The language to delete the downloaded content for.
   */
  const deleteDownloadedLessons = async language => {
    await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      .then(contents => {
        for (const item of contents) {
          // If a file is a lesson...
          if (isLessonFile.exec(item)) {
            // If a language hasn't been specificied, delete any lesson file.
            if (!language)
              FileSystem.deleteAsync(FileSystem.documentDirectory + item)
            // Otherwise, delete it only if it matches with the specified language.
            else if (item.slice(0, 2) === language)
              FileSystem.deleteAsync(FileSystem.documentDirectory + item)
          }
        }
      })
      // After we finish, get the storage used again.
      .then(() => getTotalStorageAndLanguageSizes())
  }

  /**
   * Gets an array of the currently installed language instances.
   * @return {Object[]} - The currently installed language instances.
   */
  const getInstalledLanguageInstances = () => {
    var installedLanguageInstances = []
    for (key in database) {
      if (key.length === 2) {
        var languageObject = {}
        languageObject['languageName'] = database[key].displayName
        languageObject['languageID'] = key
        installedLanguageInstances.push(languageObject)
      }
    }
    return installedLanguageInstances
  }

  /**
   * Renders a <LanguageStorageItem />.
   * @param {Object} item - The language instance to render.
   */
  const renderLanguageStorageItem = ({ item }) => (
    <LanguageStorageItem
      languageName={item.languageName}
      languageID={item.languageID}
      megabytes={languageStorageSizes[item.languageID]}
      clearDownloads={() => {
        Alert.alert(
          t.storage &&
            t.storage.clear_all_downloaded_lessons_for_a_language_title,
          t.storage &&
            t.storage.clear_all_downloaded_lessons_for_a_language_message,
          [
            {
              text: t.general && t.general.cancel,
              onPress: () => {},
              style: 'cancel'
            },
            {
              text: t.general && t.general.ok,
              onPress: () => deleteDownloadedLessons(item.languageID),
              style: 'destructive'
            }
          ]
        )
      }}
    />
  )

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        style={{ flex: 1 }}
        data={getInstalledLanguageInstances()}
        renderItem={renderLanguageStorageItem}
        keyExtractor={item => item.languageID}
        ItemSeparatorComponent={() => (
          <View style={{ height: 20, width: '100%' }} />
        )}
        ListHeaderComponent={() => (
          <View style={{ height: 10, width: '100%' }} />
        )}
      />
      <WahaButton
        type='filled'
        color={colors.red}
        label={`${t.storage &&
          t.storage
            .clear_all_downloaded_lessons} (${totalStorage} ${t.storage &&
          t.storage.megabyte})`}
        width={Dimensions.get('window').width - 40}
        onPress={() =>
          Alert.alert(
            t.storage && t.storage.clear_all_downloaded_lessons_title,
            t.storage && t.storage.clear_all_downloaded_lessons_message,
            [
              {
                text: t.general && t.general.cancel,
                onPress: () => {},
                style: 'cancel'
              },
              {
                text: t.general && t.general.ok,
                onPress: () => deleteDownloadedLessons(),
                style: 'destructive'
              }
            ]
          )
        }
        style={{ alignSelf: 'center' }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(StorageScreen)
