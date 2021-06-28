import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import EmojiViewer from '../components/EmojiViewer'
import GroupAvatar from '../components/GroupAvatar'
import GroupNameTextInput from '../components/GroupNameTextInput'
import { scaleMultiplier } from '../constants'
import ModalScreen from '../modals/ModalScreen'
import { changeActiveGroup } from '../redux/actions/activeGroupActions'
import { incrementGlobalGroupCounter } from '../redux/actions/databaseActions'
import {
  createGroup,
  editGroup,
  resetProgress,
  setShouldShowMobilizationToolsTab
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
    t: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),

    activeGroup: activeGroupSelector(state),
    globalGroupCounter: state.database.globalGroupCounter,
    areMobilizationToolsUnlocked: state.areMobilizationToolsUnlocked
  }
}

function mapDispatchToProps (dispatch) {
  return {
    editGroup: (
      oldGroupName,
      newGroupName,
      emoji,
      shouldShowMobilizationToolsTab
    ) =>
      dispatch(
        editGroup(
          oldGroupName,
          newGroupName,
          emoji,
          shouldShowMobilizationToolsTab
        )
      ),
    createGroup: (
      groupName,
      language,
      emoji,
      shouldShowMobilizationToolsTab,
      groupID,
      groupNumber
    ) =>
      dispatch(
        createGroup(
          groupName,
          language,
          emoji,
          shouldShowMobilizationToolsTab,
          groupID,
          groupNumber
        )
      ),
    changeActiveGroup: groupName => dispatch(changeActiveGroup(groupName)),
    resetProgress: name => {
      dispatch(resetProgress(name))
    },
    incrementGlobalGroupCounter: () => dispatch(incrementGlobalGroupCounter()),
    setShouldShowMobilizationToolsTab: (groupName, toSet) => {
      dispatch(setShouldShowMobilizationToolsTab(groupName, toSet))
    }
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
  t,
  font,
  activeGroup,
  globalGroupCounter,
  areMobilizationToolsUnlocked,
  editGroup,
  createGroup,
  changeActiveGroup,
  deleteGroup,
  resetProgress,
  incrementGlobalGroupCounter,
  setShouldShowMobilizationToolsTab
}) => {
  /** Keeps track of the user input for the group name <TextInput />. */
  const [groupNameInput, setGroupNameInput] = useState('')

  /** Keeps track of the user selection for the group emoji. */
  const [emojiInput, setEmojiInput] = useState('default')

  const [shouldShowMTTabInput, setShouldShowMTTabInput] = useState(
    areMobilizationToolsUnlocked ? false : true
  )

  /** If editing a group, keeps track of whether that group is the active group or not. */
  const [isActive, setIsActive] = useState(
    type === 'EditGroup' ? activeGroup.name === thisGroup.name : false
  )

  const [isGroupNameBlank, setIsGroupNameBlank] = useState(
    type === 'EditGroup' ? false : true
  )

  const [isGroupNameDuplicate, setIsGroupNameDuplicate] = useState(false)

  useEffect(() => {
    checkForDuplicate()
    checkForBlank()
  }, [groupNameInput])

  /**
   * Checks if a user-inputted group name is a duplicate of another group. The process for checking is different if we're editing vs. adding a group.
   * @return {boolean} - Whether the group name is a duplicate or not.
   */
  const checkForDuplicate = () => {
    // If we're adding a new group, simply check if the group name already exists in another group.
    if (type === 'AddGroup')
      if (groups.some(group => group.name === groupNameInput))
        setIsGroupNameDuplicate(true)
      else setIsGroupNameDuplicate(false)
    // If we're editing a group, check if any group has the same name but obvously don't count it as a duplicate for itself.
    else if (
      groups.some(
        group =>
          group.name === groupNameInput && thisGroup.name !== groupNameInput
      )
    )
      setIsGroupNameDuplicate(true)
    else setIsGroupNameDuplicate(false)
  }

  /**
   * Checks if a user-inputted group name is blank.
   * @return {boolean} - Whether the group name is blank or not.
   */
  const checkForBlank = () => {
    if (groupNameInput === '') setIsGroupNameBlank(true)
    else setIsGroupNameBlank(false)
  }

  /** Creates a new group and sets it as the active group. */
  const createGroupHandler = () => {
    // If the name of the new group is a duplicate or blank, don't continue.
    if (checkForDuplicate() || checkForBlank()) return

    // Call createGroup() redux function.
    createGroup(
      groupNameInput,
      languageID,
      emojiInput,
      shouldShowMTTabInput,
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
  const editGroupHandler = () => {
    // If the name of the new group is a duplicate or blank, don't continue.
    if (checkForDuplicate() || checkForBlank()) return

    // Change the active group to the newly edited group.
    if (thisGroup.name === activeGroup.name) changeActiveGroup(groupNameInput)

    // Call editGroup() redux function.
    editGroup(thisGroup.name, groupNameInput, emojiInput, shouldShowMTTabInput)

    // Hide this modal.
    hideModal()
  }

  return (
    <ModalScreen
      isVisible={isVisible}
      hideModal={hideModal}
      topRightComponent={
        !isGroupNameBlank &&
        !isGroupNameDuplicate && (
          <TouchableOpacity
            onPress={
              type === 'AddGroup' ? createGroupHandler : editGroupHandler
            }
            style={{
              width: 45 * scaleMultiplier,
              height: 45 * scaleMultiplier
            }}
          >
            <Icon
              name='check'
              size={40 * scaleMultiplier}
              color={colors.oslo}
            />
          </TouchableOpacity>
        )
      }
      onCancelPress={() => {
        // Clear out the inputs when we close the modal.
        setGroupNameInput('')
        setEmojiInput('default')
        setShouldShowMTTabInput(false)
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
              setShouldShowMTTabInput(thisGroup.shouldShowMobilizationToolsTab)
            }
      }
      title={
        type === 'AddGroup'
          ? t.groups && t.groups.new_group
          : t.groups && t.groups.edit_group
      }
    >
      <View style={styles.groupAvatarContainer}>
        <GroupAvatar
          style={{ backgroundColor: colors.athens }}
          emoji={emojiInput}
          size={120}
        />
      </View>
      <GroupNameTextInput
        groupNameInput={groupNameInput}
        setGroupNameInput={setGroupNameInput}
        isDuplicate={isGroupNameDuplicate}
      />
      {areMobilizationToolsUnlocked && (
        <View
          style={[
            styles.shouldShowMTTabInputContainer,
            { flexDirection: isRTL ? 'row-reverse' : 'row' }
          ]}
        >
          <Text
            style={StandardTypography(
              { font, isRTL },
              'h3',
              'Regular',
              'left',
              colors.shark
            )}
          >
            {t.mobilization_tools && t.mobilization_tools.show_mobilization_tab}
          </Text>
          <Switch
            trackColor={{ false: colors.chateau, true: colors.apple }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.chateau}
            onValueChange={() => setShouldShowMTTabInput(current => !current)}
            value={shouldShowMTTabInput}
            disabled={areMobilizationToolsUnlocked ? false : true}
          />
        </View>
      )}
      <EmojiViewer emojiInput={emojiInput} setEmojiInput={setEmojiInput} />
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  groupAvatarContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20 * scaleMultiplier
  },
  shouldShowMTTabInputContainer: {
    width: Dimensions.get('window').width - 40,
    paddingHorizontal: 10,
    height: 60 * scaleMultiplier,
    maxWidth: 500,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.athens,
    backgroundColor: colors.white,
    marginTop: 20 * scaleMultiplier
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
