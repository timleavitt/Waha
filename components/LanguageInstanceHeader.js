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
import GroupListItem from '../components/GroupListItem'
import { scaleMultiplier } from '../constants'
import { deleteGroup } from '../redux/actions/groupsActions'
import { deleteLanguage } from '../redux/actions/databaseActions'
import * as FileSystem from 'expo-file-system'
import { removeDownload } from '../redux/actions/downloadActions'

function LanguageInstanceHeader (props) {
  //// FUNCTIONS

  useEffect(() => {
    // check if there was a failed language add, i.e. if the app crashed/user quit during a fetch
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(
      contents => {
        console.log(contents)
        if (
          !contents.includes(props.languageID + 'chapter1.mp3') ||
          !contents.includes(props.languageID + 'chapter3.mp3') ||
          !contents.includes(props.languageID + 'lesson1chapter1.mp3') ||
          !contents.includes(props.languageID + 'lesson1chapter3.mp3') ||
          !contents.includes(props.languageID + 'header.png')
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
      <GroupListItem
        groupName={groups.item.name}
        isEditing={props.isEditing}
        goToEditGroupScreen={props.goToEditGroupScreen}
        avatarSource={groups.item.imageSource}
      />
    )
  }

  // render trash button conditionally because it's only shown when editting mode is active
  var trashButton =
    props.isEditing && !(props.activeGroup.language === props.languageID) ? (
      <TouchableOpacity
        style={[
          styles.trashButtonContainer,
          {
            marginRight: props.isRTL ? 15 : -15,
            marginLeft: props.isRTL ? -15 : 15
          }
        ]}
        onPress={() =>
          Alert.alert(
            props.translations.alerts.deleteLanguage.header,
            props.translations.alerts.deleteLanguage.body,
            [
              {
                text: props.translations.alerts.options.cancel,
                onPress: () => {}
              },
              {
                text: props.translations.alerts.options.ok,
                onPress: deleteLanguageInstance
              }
            ]
          )
        }
      >
        <Icon name='trash' size={25 * scaleMultiplier} color='#FF0800' />
      </TouchableOpacity>
    ) : null
  return (
    <View style={styles.languageHeaderListContainer}>
      <View
        style={[
          styles.languageHeaderContainer,
          { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
        ]}
      >
        {trashButton}
        <Text
          style={[
            styles.languageHeaderText,
            {
              textAlign: props.isRTL ? 'right' : 'left',
              fontFamily: props.font + '-regular'
            }
          ]}
        >
          {props.languageName}
        </Text>
        <Image
          style={styles.languageLogo}
          source={{
            uri: FileSystem.documentDirectory + props.languageID + 'header.png'
          }}
        />
      </View>
      <FlatList
        data={props.groups.filter(group => group.language === props.languageID)}
        renderItem={renderGroupItem}
        keyExtractor={item => item.name}
      />
      <TouchableOpacity
        style={[
          styles.addGroupContainer,
          { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
        ]}
        onPress={props.goToAddNewGroupScreen}
      >
        <Icon
          name='group-add'
          size={35 * scaleMultiplier}
          color='#DEE3E9'
          style={{ marginHorizontal: 15 }}
        />
        <Text
          style={[
            styles.addGroupText,
            {
              textAlign: props.isRTL ? 'right' : 'left',
              fontFamily: props.font + '-medium'
            }
          ]}
        >
          {props.translations.labels.newGroup}
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
  trashButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  languageHeaderText: {
    fontSize: 18 * scaleMultiplier,
    color: '#9FA5AD',
    marginHorizontal: 30,
    flex: 1
  },
  languageLogo: {
    resizeMode: 'stretch',
    width: 96 * scaleMultiplier,
    height: 32 * scaleMultiplier,
    alignSelf: 'flex-end',
    marginHorizontal: 10
  },
  addGroupContainer: {
    height: 80 * scaleMultiplier,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 3
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageInstanceHeader)
