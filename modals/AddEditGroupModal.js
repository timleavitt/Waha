import React, { useEffect, useState } from 'react'
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
import { groupIcons, groupIconSources } from '../assets/groupIcons/groupIcons'
import GroupAvatar from '../components/GroupAvatar'
import { scaleMultiplier } from '../constants'
import ModalScreen from '../modals/ModalScreen'
import {
  changeActiveGroup,
  createGroup,
  editGroup,
  resetProgress
} from '../redux/actions/groupsActions'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function AddEditGroupModal ({
  // passed from parent
  isVisible,
  hideModal,
  type,
  groupName: currentGroupName = null,
  languageID = null,
  // passed from redux
  groups,
  isRTL,
  translations,
  font,
  activeGroup,
  editGroup,
  createGroup,
  changeActiveGroup,
  deleteGroup,
  resetProgress
}) {
  //+ STATE

  // keeps track of the group name text input value
  const [groupName, setGroupName] = useState('')

  // the group that is being edited
  const [editingGroup, setEditingGroup] = useState({})

  // keeps track of the source for the avatar image
  const [emoji, setEmoji] = useState('default')

  // keeps track of whether the group being editted is currently the active group
  const [isActive, setIsActive] = useState(
    activeGroup.name === currentGroupName
  )

  //+ CONSTRUCTOR

  useEffect(() => {
    // navigation.setOptions(getNavOptions())
    setEditingGroup(groups.filter(item => item.name === currentGroupName)[0])
  }, [activeGroup])

  //+ FUNCTIONS

  function checkForDuplicate () {
    var isDuplicate = false
    if (type === 'AddGroup') {
      groups.forEach(group => {
        if (group.name === groupName) {
          Alert.alert(
            translations.add_edit_group.popups.duplicate_group_name_title,
            translations.add_edit_group.popups.duplicate_group_name_message,
            [{ text: translations.general.ok, onPress: () => {} }]
          )
          isDuplicate = true
        }
      })
    } else {
      groups.forEach(group => {
        if (group.name === groupName && currentGroupName !== groupName) {
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
    if (groupName === '') {
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

    createGroup(groupName, languageID, emoji)
    changeActiveGroup(groupName)
    hideModal()
  }

  // edits a group and sets it as active
  function editGroupHandler () {
    if (checkForDuplicate() || checkForBlank()) return

    if (currentGroupName === activeGroup.name) changeActiveGroup(groupName)
    editGroup(currentGroupName, groupName, emoji)
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
        setGroupName('')
        setEmoji('default')
      }}
      onModalWillShow={
        type === 'AddGroup'
          ? () => {
              setGroupName('')
              setEmoji('default')
            }
          : () => {
              setGroupName(currentGroupName)
              setEmoji(editingGroup.emoji)
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
          emoji={emoji}
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
          onChangeText={text => setGroupName(text)}
          value={groupName}
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
                borderWidth: item === emoji ? 2 : 0,
                borderColor: item === emoji ? colors.blue : null,
                borderRadius: 10,
                backgroundColor: item === emoji ? colors.blue + '38' : null
              }}
              onPress={() => setEmoji(item)}
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

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    groups: state.groups,
    isRTL: state.database[activeGroup.language].isRTL,
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language),
    activeGroup: activeGroup
  }
}

function mapDispatchToProps (dispatch) {
  return {
    editGroup: (oldGroupName, newGroupName, emoji) =>
      dispatch(editGroup(oldGroupName, newGroupName, emoji)),
    createGroup: (groupName, language, emoji) =>
      dispatch(createGroup(groupName, language, emoji)),
    changeActiveGroup: groupName => dispatch(changeActiveGroup(groupName)),
    resetProgress: name => {
      dispatch(resetProgress(name))
    }
  }
}

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
