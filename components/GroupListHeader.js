import React, { useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  Alert,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import GroupItem from './GroupItem'
import { scaleMultiplier } from '../constants'
import { deleteGroup } from '../redux/actions/groupsActions'
import { deleteLanguage } from '../redux/actions/databaseActions'
import * as FileSystem from 'expo-file-system'
import { removeDownload } from '../redux/actions/downloadActions'

function GroupListHeader (props) {
  //// FUNCTIONS

  useEffect(() => {
    // check if there was a failed language add, i.e. if the app crashed/user quit during a fetch
    // and clear out the already downloaded content if there was
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
      contents => {
        if (
          !contents.includes(props.languageID + '-c-t-fellowship.mp3') ||
          !contents.includes(props.languageID + '-c-t-application.mp3') ||
          !contents.includes(props.languageID + '-mt-fellowship.mp3') ||
          !contents.includes(props.languageID + '-mt-application.mp3') ||
          !contents.includes(props.languageID + '-dummy-story.mp3') ||
          !contents.includes(props.languageID + '-header.png')
        ) {
          deleteLanguageInstance()
        }
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

  //// RENDER

  function renderGroupItem (groups) {
    return (
      <GroupItem
        groupName={groups.item.name}
        isEditing={props.isEditing}
        goToEditGroupScreen={props.goToEditGroupScreen}
        emoji={groups.item.emoji}
      />
    )
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
        <Icon name='trash' size={25 * scaleMultiplier} color='#FF0800' />
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
    <View style={styles.languageHeaderListContainer}>
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
            styles.languageHeaderText,
            {
              textAlign: props.isRTL ? 'right' : 'left',
              fontFamily: props.font + '-regular',
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

      {/* list of groups */}
      <FlatList
        data={props.groups.filter(group => group.language === props.languageID)}
        renderItem={renderGroupItem}
        keyExtractor={item => item.name}
      />

      {/* add new group button */}
      <TouchableOpacity
        style={[
          styles.addGroupContainer,
          { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
        ]}
        onPress={props.goToAddNewGroupScreen}
      >
        <View
          style={{
            width: 50 * scaleMultiplier,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 20
          }}
        >
          <Icon name='group-add' size={40 * scaleMultiplier} color='#DEE3E9' />
        </View>
        <Text
          style={[
            styles.addGroupText,
            {
              textAlign: props.isRTL ? 'right' : 'left',
              fontFamily: props.font + '-medium'
            }
          ]}
        >
          {props.translations.groups.new_group_button_label}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  languageHeaderListContainer: {
    width: '100%',
    marginBottom: 15,
    marginTop: 3
  },
  languageHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 30
  },
  languageHeaderText: {
    fontSize: 18 * scaleMultiplier,
    color: '#9FA5AD',
    flex: 1
  },
  languageLogo: {
    resizeMode: 'contain',
    width: 120 * scaleMultiplier,
    height: 40 * scaleMultiplier,
    // alignSelf: 'flex-end',
    marginHorizontal: 20
  },
  addGroupContainer: {
    height: 80 * scaleMultiplier,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFF2F4'
  },
  addGroupText: {
    color: '#2D9CDB',
    fontSize: 18 * scaleMultiplier,
    textAlign: 'left'
  }
})

// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
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
