import * as FileSystem from 'expo-file-system'
import React, { useEffect } from 'react'
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
import { deleteLanguage } from '../redux/actions/databaseActions'
import { removeDownload } from '../redux/actions/downloadActions'
import { deleteGroup } from '../redux/actions/groupsActions'
function GroupListHeader (props) {
  //+ FUNCTIONS

  useEffect(() => {
    // check if there was a failed language add, i.e. if the app crashed/user quit during a fetch
    // and clear out the already downloaded content if there was
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
      contents => {
        props.activeDatabase.files.forEach(fileName => {
          var tempFileName = fileName.slice(0, -3)
          if (
            !contents.includes(`${props.languageID}-${tempFileName}.mp3`) &&
            !contents.includes(`${props.languageID}-${tempFileName}.png`)
          )
            deleteLanguageInstance()
        })
      }
    )
  }, [])

  // deletes all material for a language
  function deleteLanguageInstance () {
    // delete all groups w/ this language
    props.groups.map(group => {
      if (group.language === props.languageID) {
        props.deleteGroup(group.name)
      }
    })

    // delete all downloaded files for this language
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
      contents => {
        for (const item of contents) {
          if (item.slice(0, 2) === props.languageID) {
            FileSystem.deleteAsync(FileSystem.documentDirectory + item)
            props.removeDownload(item.slice(0, 5))
          }
        }
      }
    )

    // delete section of database for this language
    props.deleteLanguage(props.languageID)
  }

  // render trash button conditionally because it's only shown when editing mode is active
  var trashButton
  // if we're editing and not in the active group, we can delete, so show trash can
  if (props.isEditing && !(props.activeGroup.language === props.languageID)) {
    trashButton = (
      <TouchableOpacity
        style={{
          marginHorizontal: 20,
          justifyContent: 'center',
          alignItems: 'center',
          width: 24 * scaleMultiplier
        }}
        onPress={() =>
          Alert.alert(
            props.translations.groups.popups.delete_language_title,
            props.translations.groups.popups.delete_language_message,
            [
              {
                text: props.translations.general.cancel,
                onPress: () => {}
              },
              {
                text: props.translations.general.ok,
                onPress: deleteLanguageInstance
              }
            ]
          )
        }
      >
        <Icon name='trash' size={25 * scaleMultiplier} color={colors.red} />
      </TouchableOpacity>
    )
    // if we're editing and active, show an empty view
  } else if (
    props.isEditing &&
    props.activeGroup.language === props.languageID
  ) {
    trashButton = <View style={{ height: '100%', width: 20 }} />
    // otherwise, make it nothin
  } else {
    trashButton = null
  }

  return (
    <View
      style={[
        styles.languageHeaderContainer,
        {
          flexDirection: props.isRTL ? 'row-reverse' : 'row'
        }
      ]}
    >
      {trashButton}
      <Text
        style={[
          Typography(props, 'h3', 'regular', 'left', colors.chateau),
          {
            flex: 1,
            marginLeft: props.isRTL ? 0 : props.isEditing ? 0 : 20,
            marginRight: props.isRTL ? (props.isEditing ? 0 : 20) : 0
          }
        ]}
      >
        {props.languageName}
      </Text>
      <Image
        style={styles.languageLogo}
        source={{
          uri: FileSystem.documentDirectory + props.languageID + '-header.png'
        }}
      />
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  languageHeaderContainer: {
    alignItems: 'center',
    width: '100%',
    height: 40 * scaleMultiplier,
    // aspectRatio: 8.7,
    backgroundColor: colors.aquaHaze
  },
  languageLogo: {
    resizeMode: 'contain',
    width: 120 * scaleMultiplier,
    height: 16.8 * scaleMultiplier,
    marginHorizontal: 20
  }
})

// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    activeDatabase: state.database[activeGroup.language],
    groups: state.groups,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font
  }
}

function mapDispatchToProps (dispatch) {
  return {
    deleteGroup: name => {
      dispatch(deleteGroup(name))
    },
    deleteLanguage: language => {
      dispatch(deleteLanguage(language))
    },
    removeDownload: lessonID => {
      dispatch(removeDownload(lessonID))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupListHeader)
