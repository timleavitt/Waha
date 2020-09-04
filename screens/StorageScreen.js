import * as FileSystem from 'expo-file-system'
import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, FlatList, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import LanguageStorageItem from '../components/LanguageStorageItem'
import WahaButton from '../components/WahaButton'
import { colors } from '../constants'
import { removeDownload } from '../redux/actions/downloadActions'

function StorageScreen (props) {
  //+ STATE

  // keeps track of storage size of each language's downloaded chapter 2s
  const [storageObject, setStorageObject] = useState({})

  // keeps track of total storage for all downloaded chapter 2s
  const [totalStorage, setTotalStorage] = useState(0)

  //+ CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
    getAllStorageUsed()
  }, [])

  //+ NAV OPTIONS

  function getNavOptions () {
    return {
      headerRight: props.isRTL
        ? () => <BackButton onPress={() => props.navigation.goBack()} />
        : () => <View></View>,
      headerLeft: props.isRTL
        ? () => <View></View>
        : () => <BackButton onPress={() => props.navigation.goBack()} />
    }
  }

  //+ FUNCTIONS

  // gets the storage size in megabytes for all the downloaded chapter 2s for a specific language
  async function getStorageUsedByLanguage (language) {
    var storageUsed = 0
    var regex = new RegExp('[a-z]{2}[0-9]{3}..*')
    return await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      .then(async contents => {
        for (const item of contents) {
          var hasMatch = regex.exec(item)
          if (hasMatch) {
            if (item.slice(0, 2) === language) {
              await FileSystem.getInfoAsync(
                FileSystem.documentDirectory + item,
                {}
              ).then(({ size }) => {
                storageUsed += Math.round(size / 1000000)
              })
            }
          }
        }
      })
      .then(() => {
        return storageUsed
      })
  }

  // get the storage size in megabytes of all downloaded chapter 2s
  function getAllStorageUsed () {
    setTotalStorage(0)
    setStorageObject({})
    var languages = getInstalledLanguageInstances()
    for (const language of languages) {
      getStorageUsedByLanguage(language.languageID).then(storageUsed => {
        setTotalStorage(oldStorage => oldStorage + storageUsed)
        setStorageObject(oldObject => ({
          ...oldObject,
          [language.languageID]: storageUsed
        }))
      })
    }
  }

  // deletes all downloaded chapter 2s for a specific language
  // note: if no language specified, deletes all chapter 2s
  async function deleteDownloadedLessons (language) {
    await FileSystem.readDirectoryAsync(FileSystem.documentDirectory)
      .then(contents => {
        var regex = new RegExp('[a-z]{2}[0-9]{3}..*')
        for (const item of contents) {
          var hasMatch = regex.exec(item)
          if (hasMatch) {
            if (!language) {
              FileSystem.deleteAsync(FileSystem.documentDirectory + item)
              props.removeDownload(item.slice(0, 5))
            } else if (item.slice(0, 2) === language) {
              FileSystem.deleteAsync(FileSystem.documentDirectory + item)
              props.removeDownload(item.slice(0, 5))
            }
          }
        }
      })
      .then(() => {
        getAllStorageUsed()
      })
  }

  // gets all the installed languages
  function getInstalledLanguageInstances () {
    var installedLanguageInstances = []
    for (key in props.database) {
      if (key.length === 2) {
        var languageObject = {}
        languageObject['languageName'] = props.database[key].displayName
        languageObject['languageID'] = key
        installedLanguageInstances.push(languageObject)
      }
    }
    return installedLanguageInstances
  }

  //+ RENDER

  function renderLanguageStorageItem (languageList) {
    return (
      <LanguageStorageItem
        languageName={languageList.item.languageName}
        languageID={languageList.item.languageID}
        megabytes={storageObject[languageList.item.languageID]}
        clearDownloads={() => {
          Alert.alert(
            props.translations.storage.popups
              .clear_all_downloaded_lessons_for_a_language_title,
            props.translations.storage.popups
              .clear_all_downloaded_lessons_for_a_language_message,
            [
              {
                text: props.translations.general.cancel,
                onPress: () => {}
              },
              {
                text: props.translations.general.ok,
                onPress: () =>
                  deleteDownloadedLessons(languageList.item.languageID)
              }
            ]
          )
        }}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <FlatList
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
        label={
          props.translations.storage.clear_all_downloaded_lessons_button_label +
          ' (' +
          totalStorage +
          ' ' +
          props.translations.storage.megabyte_label +
          ')'
        }
        width={Dimensions.get('window').width - 40}
        onPress={() =>
          Alert.alert(
            props.translations.storage.popups
              .clear_all_downloaded_lessons_title,
            props.translations.storage.popups
              .clear_all_downloaded_lessons_message,
            [
              {
                text: props.translations.general.cancel,
                onPress: () => {}
              },
              {
                text: props.translations.general.ok,
                onPress: () => deleteDownloadedLessons()
              }
            ]
          )
        }
        style={{ alignSelf: 'center' }}
      />
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze
  }
})

//+REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    database: state.database,
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font
  }
}

function mapDispatchToProps (dispatch) {
  return {
    removeDownload: lessonID => {
      dispatch(removeDownload(lessonID))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageScreen)
