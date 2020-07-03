import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native'
import BackButton from '../components/BackButton'
import { scaleMultiplier } from '../constants'
import * as ImagePicker from 'expo-image-picker'
import { connect } from 'react-redux'
import {
  editGroup,
  deleteGroup,
  resetProgress,
  changeActiveGroup,
  setBookmark
} from '../redux/actions/groupsActions'
import OptionsModal from '../components/OptionsModal'
import ModalButton from '../components/ModalButton'
import AvatarImage from '../components/AvatarImage'
import EmojiSelector from 'react-native-emoji-selector'
import Modal from 'react-native-modal'

function EditGroupScreen (props) {
  //// STATE

  // keeps track of the group name text input value (starts as the group being editted's name)
  const [groupName, setGroupName] = useState(props.route.params.groupName)

  // keeps track of whether the group being editted is currently the active group
  const [isActive, setIsActive] = useState(
    props.activeGroup.name === props.route.params.groupName
  )

  // the group that is being edited
  const [editingGroup, setEditingGroup] = useState(
    props.groups.filter(item => item.name === props.route.params.groupName)[0]
  )

  // keeps track of the source for the avatar image (starts as the group being editted's avatar)
  const [emoji, setEmoji] = useState(editingGroup.emoji)
  const [showEmojiPickerModal, setShowEmojiPickerModal] = useState(false)

  //// CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [props.isRTL])

  //// NAV OPTIONS

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

  //// FUNCTIONS

  // edits a group and sets it as active
  function editGroup () {
    if (props.route.params.groupName === props.activeGroup.name)
      props.changeActiveGroup(groupName)
    props.editGroup(props.route.params.groupName, groupName, emoji)
    props.navigation.goBack()
  }

  //// RENDER

  // renders the delete group button conditionally because the currently active group can't be deleted
  var deleteButton = isActive ? (
    <Text
      style={[
        styles.cantDeleteText,
        {
          textAlign: props.isRTL ? 'right' : 'left',
          fontFamily: props.font + '-regular'
        }
      ]}
    >
      {props.translations.labels.cantDeleteGroup}
    </Text>
  ) : (
    <TouchableOpacity
      style={styles.deleteGroupButtonContainer}
      onPress={() => {
        props.deleteGroup(props.route.params.groupName)
        props.navigation.goBack()
      }}
    >
      <Text
        style={[
          styles.deleteGroupButtonText,
          {
            textAlign: props.isRTL ? 'right' : 'left',
            fontFamily: props.font + '-regular'
          }
        ]}
      >
        {props.translations.labels.deleteGroup}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.screen}>
      <View style={styles.photoContainer}>
        <AvatarImage
          emoji={emoji}
          onPress={() => setShowEmojiPickerModal(true)}
          size={120}
          isChangeable={true}
        />
      </View>
      <View style={styles.bottomHalfContainer}>
        <View style={styles.inputContainer}>
          <Text
            style={[
              styles.groupNameLabel,
              {
                textAlign: props.isRTL ? 'right' : 'left',
                fontFamily: props.font + '-regular'
              }
            ]}
          >
            {props.translations.labels.groupName}
          </Text>
          <TextInput
            style={[
              styles.addNewGroupContainer,
              {
                textAlign: props.isRTL ? 'right' : 'left',
                fontFamily: props.font + '-regular'
              }
            ]}
            onChangeText={text => setGroupName(text)}
            value={groupName}
            autoCapitalize='words'
            autoCorrect={false}
            placeholderTextColor='#9FA5AD'
            maxLength={50}
            returnKeyType='done'
          />
          <TouchableOpacity
            style={styles.resetProgressButtonContainer}
            onPress={() =>
              Alert.alert(
                props.translations.alerts.resetProgress.header,
                props.translations.alerts.resetProgress.text,
                [
                  {
                    text: props.translations.alerts.options.cancel,
                    onPress: () => {}
                  },
                  {
                    text: props.translations.alerts.options.ok,
                    onPress: () => {
                      props.resetProgress(props.route.params.groupName)
                      props.navigation.goBack()
                    }
                  }
                ]
              )
            }
          >
            <Text
              style={[
                styles.resetProgressButtonText,
                {
                  textAlign: props.isRTL ? 'right' : 'left',
                  fontFamily: props.font + '-regular'
                }
              ]}
            >
              {props.translations.labels.resetProgress}
            </Text>
          </TouchableOpacity>
          {deleteButton}
        </View>
        <TouchableOpacity
          style={[
            styles.saveButtonContainer,
            { alignSelf: props.isRTL ? 'flex-start' : 'flex-end' }
          ]}
          onPress={editGroup}
        >
          <Text
            style={[
              styles.saveButtonText,
              { fontFamily: props.font + '-medium' }
            ]}
          >
            {props.translations.labels.save}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={showEmojiPickerModal}
        hasBackdrop={true}
        onBackdropPress={() => setShowEmojiPickerModal(false)}
        backdropOpacity={0.3}
        style={{
          justifyContent: 'flex-end',
          backgroundColor: '#FFFFFF',
          borderRadius: 10,
          marginBottom: -20
        }}
      >
        <View>
          <TouchableOpacity onPress={() => setShowEmojiPickerModal(false)}>
            <Icon name='cancel' size={45 * scaleMultiplier} color='#3A3C3F' />
          </TouchableOpacity>
        </View>
        <EmojiSelector
          onEmojiSelected={emoji => {
            setEmoji(emoji)
            setShowEmojiPickerModal(false)
          }}
        />
      </Modal>
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  photoContainer: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomHalfContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  inputContainer: {
    marginHorizontal: 20,
    padding: 3
  },
  groupNameLabel: {
    fontSize: 14 * scaleMultiplier,
    color: '#9FA5AD'
  },
  addNewGroupContainer: {
    borderBottomColor: '#EFF2F4',
    borderBottomWidth: 2,
    height: 40 * scaleMultiplier,
    fontSize: 18 * scaleMultiplier
  },
  resetProgressButtonContainer: {
    width: '100%',
    borderColor: '#FF0800',
    borderWidth: 1,
    borderRadius: 5,
    height: 55 * scaleMultiplier,
    marginVertical: 20,
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  resetProgressButtonText: {
    color: '#FF0800',
    fontSize: 18 * scaleMultiplier
  },
  deleteGroupButtonContainer: {
    width: '100%',
    borderRadius: 5,
    height: 55 * scaleMultiplier,
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#FF0800'
  },
  deleteGroupButtonText: {
    color: '#FFFFFF',
    fontSize: 18 * scaleMultiplier
  },
  cantDeleteText: {
    fontSize: 14 * scaleMultiplier,
    color: '#9FA5AD'
  },
  saveButtonContainer: {
    width: 127 * scaleMultiplier,
    height: 52 * scaleMultiplier,
    borderRadius: 5,
    backgroundColor: '#60C239',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    margin: 20
  },
  saveButtonText: {
    fontSize: 18 * scaleMultiplier,
    color: '#FFFFFF'
  }
})

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    groups: state.groups,
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font,
    activeGroup: activeGroup
  }
}

function mapDispatchToProps (dispatch) {
  return {
    editGroup: (oldGroupName, newGroupName, emoji) =>
      dispatch(editGroup(oldGroupName, newGroupName, emoji)),
    deleteGroup: name => {
      dispatch(deleteGroup(name))
    },
    resetProgress: name => {
      dispatch(resetProgress(name))
    },
    changeActiveGroup: name => {
      dispatch(changeActiveGroup(name))
    },
    setBookmark: groupName => {
      dispatch(setBookmark(groupName))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditGroupScreen)
