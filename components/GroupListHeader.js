import * as FileSystem from 'expo-file-system'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { deleteLanguageData } from '../redux/actions/databaseActions'
import { removeDownload } from '../redux/actions/downloadActions'
import { deleteGroup } from '../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    database: state.database,
    activeDatabase: activeDatabaseSelector(state),
    groups: state.groups,
    activeGroup: activeGroupSelector(state),
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language)
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

/**
 * The header for the groups section list used on the Groups screen. Displays the name of the language and the language instance's logo.
 * @param {string} languageName - The name of the language.
 * @param {string} languageID - The ID for the language instance.
 * @param {boolean} isEditing - Whether the Groups screen is in editing mode or not.
 */
const GroupListHeader = ({
  // Props passed from a parent component.
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
}) => {
  /** Keeps track of the animated position of the left icon, in this case the trash can icon. */
  const [leftIconXPos, setLeftIconXPos] = useState(
    new Animated.Value(
      isRTL ? 25 * scaleMultiplier + 20 : -25 * scaleMultiplier - 20
    )
  )

  /** useEffect function used to update the animated value of the left icon position. The default value must update whenever isRTL changes.*/
  useEffect(() => {
    setLeftIconXPos(
      new Animated.Value(
        isRTL ? 25 * scaleMultiplier + 20 : -25 * scaleMultiplier - 20
      )
    )
  }, [isRTL])

  /** Animated the position of the trash icon whenever isEditing changes. This pushes the whole component over to the right. */
  useEffect(() => {
    if (isEditing) {
      Animated.spring(leftIconXPos, {
        toValue: 0
      }).start()
    } else if (!isEditing) {
      Animated.spring(leftIconXPos, {
        toValue: isRTL ? 25 * scaleMultiplier + 20 : -25 * scaleMultiplier - 20
      }).start()
    }
  }, [isEditing])

  /** Deletes an entire language instance. This involves deleting every group, every downloaded file, and all data stored in redux for a language instance. Triggered by pressing the trash can icon next to the langauge's name in editing mode. */
  function deleteLanguageInstance () {
    // Delete every group for this language instance.
    groups.map(group => {
      if (group.language === languageID) {
        deleteGroup(group.name)
      }
    })

    // Delete all downloaded files for this language instance.
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

    // Delete redux data for this language instance.
    deleteLanguageData(languageID)
  }

  // The trash button shows up next to the name of the language in editing mode only. Only language instance's that don't contain the currently active group have this button.
  if (!(activeGroup.language === languageID))
    var trashButtonComponent = (
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
  // For the language instance that contains the active group, render an empty view for this button so the layout still lines up.
  else if (activeGroup.language === languageID)
    var trashButtonComponent = <View style={{ height: '100%', width: 20 }} />

  return (
    <View
      style={[
        styles.groupListHeaderContainer,
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}
    >
      <Animated.View
        style={{
          transform:
            activeGroup.language === languageID
              ? []
              : [{ translateX: leftIconXPos }],
          flexDirection: isRTL ? 'row-reverse' : 'row',
          flex: 1
        }}
      >
        {trashButtonComponent}
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
            { flex: 1 }
          ]}
        >
          {languageName}
        </Text>
      </Animated.View>
      <Image
        style={styles.languageLogoImage}
        source={{
          uri: FileSystem.documentDirectory + languageID + '-header.png'
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  groupListHeaderContainer: {
    alignItems: 'center',
    width: '100%',
    height: 40 * scaleMultiplier,
    backgroundColor: colors.aquaHaze
  },
  languageLogoImage: {
    resizeMode: 'contain',
    width: 120 * scaleMultiplier,
    height: 16.8 * scaleMultiplier,
    marginHorizontal: 20
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupListHeader)
