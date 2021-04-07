import React, { useState } from 'react'
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { groupIcons, groupIconSources } from '../assets/groupIcons/_groupIcons'
import GroupAvatar from '../components/GroupAvatar'
import { scaleMultiplier } from '../constants'
import ModalScreen from '../modals/ModalScreen'
import { changeActiveGroup } from '../redux/actions/activeGroupActions'
import { incrementGlobalGroupCounter } from '../redux/actions/databaseActions'
import {
  createGroup,
  editGroup,
  resetProgress
} from '../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    groups: state.groups,
    isRTL: activeDatabaseSelector(state).isRTL,
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    activeGroup: activeGroupSelector(state),
    globalGroupCounter: state.database.globalGroupCounter,
    areMobilizationToolsUnlocked: state.areMobilizationToolsUnlocked
  }
}

function mapDispatchToProps (dispatch) {
  return {
    editGroup: (oldGroupName, newGroupName, emoji) =>
      dispatch(editGroup(oldGroupName, newGroupName, emoji)),
    createGroup: (groupName, language, emoji, groupID, groupNumber) =>
      dispatch(createGroup(groupName, language, emoji, groupID, groupNumber)),
    changeActiveGroup: groupName => dispatch(changeActiveGroup(groupName)),
    resetProgress: name => {
      dispatch(resetProgress(name))
    },
    incrementGlobalGroupCounter: () => dispatch(incrementGlobalGroupCounter())
  }
}

/**
 * Modal that allows the user to add or edit a group. Uses the <ModalScreen /> component under the hood.
 * @param {boolean} isVisible - Whether the modal is visible or not.
 * @param {Function} hideModal - Function to hide the modal.
 * @param {string} type - Whether the user is editing an existing group or adding a new group. Possible options are 'EditGroup' or 'AddGroup'.
 * @param {Object} thisGroup - If editing a group, this is the object for that group. Otherwise, it defaults to null.
 * @param {string} languageID - If creating a new group, we need the langaugeID for when we call the CreateGroup() redux function. Otherwise, langaugeID is null.
 */
const AddEditGroupModal = ({
  // Props passed from a parent component.
  isVisible,
  hideModal,
  type,
  thisGroup = null,
  languageID = null,
  // Props passed from redux.
  groups,
  isRTL,
  translations,
  font,
  activeGroup,
  globalGroupCounter,
  areMobilizationToolsUnlocked,
  editGroup,
  createGroup,
  changeActiveGroup,
  deleteGroup,
  resetProgress,
  incrementGlobalGroupCounter
}) => {
  /** Keeps track of the user input for the group name <TextInput />. */
  const [groupNameInput, setGroupNameInput] = useState('')

  /** Keeps track of the user selection for the group emoji. */
  const [emojiInput, setEmojiInput] = useState('default')

  /** If editing a group, keeps track of whether that group is the active group or not. */
  const [isActive, setIsActive] = useState(
    type === 'EditGroup' ? activeGroup.name === thisGroup.name : false
  )

  /**
   * Checks if a user-inputted group name is a duplicate of another group. The process for checking is different if we're editing vs. adding a group.
   * @return {boolean} - Whether the group name is a duplicate or not.
   */
  function checkForDuplicate () {
    var isDuplicate = false

    // If we're adding a new group, simply check if the group name already exists in another group.
    if (type === 'AddGroup') {
      groups.forEach(group => {
        if (group.name === groupNameInput) {
          Alert.alert(
            translations.add_edit_group.popups.duplicate_group_name_title,
            translations.add_edit_group.popups.duplicate_group_name_message,
            [{ text: translations.general.ok, onPress: () => {} }]
          )
          isDuplicate = true
        }
      })
      // If we're editing a group, check if any group has the same name but obvously don't count it as a duplicate for itself.
    } else {
      groups.forEach(group => {
        if (
          group.name === groupNameInput &&
          thisGroup.name !== groupNameInput
        ) {
          Alert.alert(
            translations.add_edit_group.popups.duplicate_group_name_title,
            translations.add_edit_group.popups.duplicate_group_name_message,
            [{ text: translations.general.ok, onPress: () => {} }]
          )
          isDuplicate = true
        }
      })
    }
    return isDuplicate
  }

  /**
   * Checks if a user-inputted group name is blank.
   * @return {boolean} - Whether the group name is blank or not.
   */
  function checkForBlank () {
    if (groupNameInput === '') {
      Alert.alert(
        translations.add_edit_group.popups.blank_group_name_title,
        translations.add_edit_group.popups.blank_group_name_message,
        [{ text: translations.general.ok, onPress: () => {} }]
      )
      return true
    }
    return false
  }

  /** Creates a new group and sets it as the active group. */
  function createGroupHandler () {
    // If the name of the new group is a duplicate or blank, don't continue.
    if (checkForDuplicate() || checkForBlank()) return

    // Call createGroup() redux function.
    createGroup(
      groupNameInput,
      languageID,
      emojiInput,
      globalGroupCounter + 1,
      groups.length + 1
    )

    // Change the active group to the newly created group.
    changeActiveGroup(groupNameInput)

    // Increment the global group counter redux variable.
    incrementGlobalGroupCounter()

    // Hide this modal.
    hideModal()
  }

  /** Edits a group and sets it as the active group. */
  function editGroupHandler () {
    // If the name of the new group is a duplicate or blank, don't continue.
    if (checkForDuplicate() || checkForBlank()) return

    // Change the active group to the newly edited group.
    if (thisGroup.name === activeGroup.name) changeActiveGroup(groupNameInput)

    // Call editGroup() redux function.
    editGroup(thisGroup.name, groupNameInput, emojiInput)

    // Hide this modal.
    hideModal()
  }

  /** Renders an emoji for the emoji select <FlatList />. */
  const renderEmoji = ({ item }) => (
    <TouchableOpacity
      style={{
        width: 50 * scaleMultiplier,
        height: 50 * scaleMultiplier,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        borderWidth: item === emojiInput ? 2 : 0,
        borderColor: item === emojiInput ? colors.blue : null,
        borderRadius: 10,
        backgroundColor: item === emojiInput ? colors.blue + '38' : null
      }}
      onPress={() => setEmojiInput(item)}
    >
      <Image
        style={{
          width: 40 * scaleMultiplier,
          height: 40 * scaleMultiplier
        }}
        source={groupIconSources[item]}
      />
    </TouchableOpacity>
  )

  return (
    <ModalScreen
      isVisible={isVisible}
      hideModal={hideModal}
      topRightComponent={
        <TouchableOpacity
          onPress={type === 'AddGroup' ? createGroupHandler : editGroupHandler}
          style={{
            width: 45 * scaleMultiplier,
            height: 45 * scaleMultiplier
          }}
        >
          <Icon name='check' size={40 * scaleMultiplier} color={colors.oslo} />
        </TouchableOpacity>
      }
      onCancelPress={() => {
        // Clear out the inputs when we close the modal.
        setGroupNameInput('')
        setEmojiInput('default')
      }}
      onModalWillShow={
        type === 'AddGroup'
          ? () => {
              setGroupNameInput('')
              setEmojiInput('default')
            }
          : () => {
              // If we're editing a group, populate our state with the name and emoji of that group.
              setGroupNameInput(thisGroup.name)
              setEmojiInput(thisGroup.emoji)
            }
      }
      title={
        type === 'AddGroup'
          ? translations.add_edit_group.header_add
          : translations.add_edit_group.header_edit
      }
    >
      <View style={styles.groupAvatarContainer}>
        <GroupAvatar
          style={{ backgroundColor: colors.athens }}
          emoji={emojiInput}
          size={120}
        />
      </View>
      <View style={styles.groupNameAreaContainer}>
        <Text
          style={StandardTypography(
            { font, isRTL },
            'p',
            'Regular',
            'left',
            colors.chateau
          )}
        >
          {translations.add_edit_group.group_name_form_label}
        </Text>
        <TextInput
          style={[
            styles.groupNameTextInputContainer,
            StandardTypography(
              { font, isRTL },
              'h3',
              'Regular',
              'left',
              colors.shark
            )
          ]}
          onChangeText={text => setGroupNameInput(text)}
          value={groupNameInput}
          autoCapitalize='words'
          autoCorrect={false}
          placeholder={translations.add_edit_group.group_name_form_placeholder}
          placeholderTextColor={colors.chateau}
          maxLength={50}
          returnKeyType='done'
        />
      </View>
      <Text
        style={[
          StandardTypography(
            { font, isRTL },
            'p',
            'Regular',
            'left',
            colors.chateau
          ),
          {
            marginHorizontal: 20,
            marginTop: 20 * scaleMultiplier,
            marginBottom: 5
          }
        ]}
      >
        {translations.add_edit_group.icon_form_label}
      </Text>
      <View
        style={{
          alignItems: 'center',
          // If phone screen is large, don't make the emoji select take up the whole rest of the screen.
          height:
            Dimensions.get('window').height > 700
              ? 250 * scaleMultiplier
              : null,
          flex: Dimensions.get('window').height > 700 ? null : 1,
          paddingHorizontal: 5,
          borderWidth: 2,
          borderRadius: 10,
          marginHorizontal: 20,
          borderColor: colors.athens,
          marginBottom: 20
        }}
      >
        <FlatList
          data={groupIcons}
          nestedScrollEnabled
          renderItem={renderEmoji}
          keyExtractor={item => item}
          numColumns={Math.floor(
            (Dimensions.get('window').width - 50) / (50 * scaleMultiplier)
          )}
        />
      </View>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between'
  },
  groupAvatarContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20 * scaleMultiplier
  },
  groupNameAreaContainer: { marginHorizontal: 20 },
  groupNameTextInputContainer: {
    borderBottomColor: colors.athens,
    borderBottomWidth: 2,
    height: 50 * scaleMultiplier,
    fontSize: 18 * scaleMultiplier
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddEditGroupModal)

// Someday we'll let the user set a custom photo as their group avatar...until then this code will remain sad and neglected.

// async function openImageLibraryHandler () {
//   var permissionGranted = false
//   await ImagePicker.getCameraRollPermissionsAsync().then(
//     permissionResponse => {
//       if (permissionResponse.status !== 'granted') {
//         ImagePicker.requestCameraRollPermissionsAsync().then(
//           permissionResponse => {
//             if (permissionResponse.status === 'granted') {
//               openImageLibraryHandler()
//             }
//           }
//         )
//       } else {
//         permissionGranted = true
//       }
//     }
//   )
//   if (permissionGranted) {
//     ImagePicker.launchImageLibraryAsync({}).then(returnObject => {
//       if (returnObject.cancelled !== true) {
//         setAvatarSource(returnObject.uri)
//       }
//       setShowImagePickerModal(false)
//     })
//   }
// }

// async function openCameraHandler () {
//   var permissionGranted = false
//   await ImagePicker.getCameraPermissionsAsync().then(permissionResponse => {
//     if (permissionResponse.status !== 'granted') {
//       ImagePicker.requestCameraPermissionsAsync().then(permissionResponse => {
//         if (permissionResponse.status === 'granted') {
//           openCameraHandler()
//         }
//       })
//     } else {
//       permissionGranted = true
//     }
//   })
//   if (permissionGranted) {
//     ImagePicker.launchCameraAsync({}).then(returnObject => {
//       if (returnObject.cancelled !== true) {
//         setAvatarSource(returnObject.uri)
//       }
//       setShowImagePickerModal(false)
//     })
//   }
// }
