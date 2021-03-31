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
    createGroup: (
      groupName,
      language,
      emoji,
      groupID,
      groupNumber,
      areMobilizationToolsUnlocked
    ) =>
      dispatch(
        createGroup(
          groupName,
          language,
          emoji,
          groupID,
          groupNumber,
          areMobilizationToolsUnlocked
        )
      ),
    changeActiveGroup: groupName => dispatch(changeActiveGroup(groupName)),
    resetProgress: name => {
      dispatch(resetProgress(name))
    },
    incrementGlobalGroupCounter: () => dispatch(incrementGlobalGroupCounter())
  }
}

function AddEditGroupModal ({
  // Props passed from a parent component.
  isVisible,
  hideModal,
  type,
  group = null,
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
}) {
  //+ STATE

  // keeps track of the group name text input value
  const [groupNameInput, setGroupNameInput] = useState('')

  // keeps track of the source for the avatar image
  const [emojiInput, setEmojiInput] = useState('default')

  // keeps track of whether the group being editted is currently the active group
  const [isActive, setIsActive] = useState(
    type === 'EditGroup' ? activeGroup.name === group.name : false
  )

  //+ FUNCTIONS

  function checkForDuplicate () {
    var isDuplicate = false
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
    } else {
      groups.forEach(storedGroup => {
        if (
          storedGroup.name === groupNameInput &&
          group.name !== groupNameInput
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

  // adds a group to redux if it passes all error checking
  function createGroupHandler () {
    if (checkForDuplicate() || checkForBlank()) return

    createGroup(
      groupNameInput,
      languageID,
      emojiInput,
      globalGroupCounter + 1,
      groups.length + 1,
      areMobilizationToolsUnlocked
    )
    changeActiveGroup(groupNameInput)

    // Increment the global group counter redux variable.
    incrementGlobalGroupCounter()

    hideModal()
  }

  // edits a group and sets it as active
  function editGroupHandler () {
    if (checkForDuplicate() || checkForBlank()) return

    if (group.name === activeGroup.name) changeActiveGroup(groupNameInput)
    editGroup(group.name, groupNameInput, emojiInput)
    hideModal()
  }

  //+ RENDER

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
              setGroupNameInput(group.name)
              setEmojiInput(group.emoji)
            }
      }
      title={
        type === 'AddGroup'
          ? translations.add_edit_group.header_add
          : translations.add_edit_group.header_edit
      }
    >
      <View style={styles.photoContainer}>
        <GroupAvatar
          style={{ backgroundColor: colors.athens }}
          emoji={emojiInput}
          size={120}
        />
      </View>
      <View
        style={{
          marginHorizontal: 20
        }}
      >
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
            styles.addNewGroupContainer,
            StandardTypography(
              { font, isRTL },
              'h3',
              'Regular',
              'left',
              colors.shark
            )
            // {
            //   textAlign: isRTL ? 'right' : 'left',
            //   fontFamily: font + '-Regular'
            // }
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
          renderItem={({ item }) => (
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
          )}
          keyExtractor={item => item}
          numColumns={Math.floor(
            (Dimensions.get('window').width - 50) / (50 * scaleMultiplier)
          )}
        />
      </View>
    </ModalScreen>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between'
  },
  photoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20 * scaleMultiplier
  },
  addNewGroupContainer: {
    borderBottomColor: colors.athens,
    borderBottomWidth: 2,
    height: 50 * scaleMultiplier,
    fontSize: 18 * scaleMultiplier
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddEditGroupModal)

// opens image library after checking for permission, then set the avatarSource state
// to the uri of the image the user selected
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

// opens camera  after checking for permission, then set the avatarSource state
// to the uri of the picture the user takes
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
