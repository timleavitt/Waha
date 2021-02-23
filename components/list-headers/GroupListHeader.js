import * as FileSystem from 'expo-file-system'
import React from 'react'
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../../constants'
import { deleteLanguageData } from '../../redux/actions/databaseActions'
import { removeDownload } from '../../redux/actions/downloadActions'
import { deleteGroup } from '../../redux/actions/groupsActions'
import { colors } from '../../styles/colors'
import { getLanguageFont, StandardTypography } from '../../styles/typography'

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    database: state.database,
    activeDatabase: state.database[activeGroup.language],
    groups: state.groups,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    deleteGroup: name => {
      dispatch(deleteGroup(name))
    },
    deleteLanguageData: language => {
      dispatch(deleteLanguageData(language))
    },
    removeDownload: lessonID => {
      dispatch(removeDownload(lessonID))
    }
  }
}

function GroupListHeader ({
  // Props passed from a parent component.s
  languageName,
  languageID,
  isEditing,
  // Props passed from redux.
  isRTL,
  database,
  activeDatabase,
  groups,
  activeGroup,
  translations,
  font,
  deleteGroup,
  deleteLanguageData,
  removeDownload
}) {
  // deletes all material for a language
  function deleteLanguageInstance () {
    // delete all groups w/ this language
    groups.map(group => {
      if (group.language === languageID) {
        deleteGroup(group.name)
      }
    })

    // delete all downloaded files for this language
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
      contents => {
        for (const item of contents) {
          if (item.slice(0, 2) === languageID) {
            FileSystem.deleteAsync(FileSystem.documentDirectory + item)
            removeDownload(item.slice(0, 5))
          }
        }
      }
    )

    // delete section of database for this language
    deleteLanguageData(languageID)
  }

  // render trash button conditionally because it's only shown when editing mode is active
  var trashButton
  // if we're editing and not in the active group, we can delete, so show trash can
  if (isEditing && !(activeGroup.language === languageID)) {
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
            translations.groups.popups.delete_language_title,
            translations.groups.popups.delete_language_message,
            [
              {
                text: translations.general.cancel,
                onPress: () => {}
              },
              {
                text: translations.general.ok,
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
  } else if (isEditing && activeGroup.language === languageID) {
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
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }
      ]}
    >
      {trashButton}
      <Text
        style={[
          StandardTypography(
            {
              font: getLanguageFont(languageID),
              isRTL: isRTL
            },
            'h3',
            'Regular',
            'left',
            colors.chateau
          ),
          {
            flex: 1,
            marginLeft: isRTL ? 0 : isEditing ? 0 : 20,
            marginRight: isRTL ? (isEditing ? 0 : 20) : 0
          }
        ]}
      >
        {languageName}
      </Text>
      <Image
        style={styles.languageLogo}
        source={{
          uri: FileSystem.documentDirectory + languageID + '-header.png'
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupListHeader)
