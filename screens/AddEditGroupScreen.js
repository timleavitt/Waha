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
import AvatarImage from '../components/AvatarImage'
import BackButton from '../components/BackButton'
import {
  colors,
  groupIcons,
  groupIconSources,
  scaleMultiplier
} from '../constants'
import {
  changeActiveGroup,
  createGroup,
  deleteGroup,
  editGroup,
  resetProgress
} from '../redux/actions/groupsActions'

function AddEditGroupScreen (props) {
  //// STATE

  // keeps track of the group name text input value
  const [groupName, setGroupName] =
    props.route.name === 'AddGroup'
      ? useState('')
      : useState(props.route.params.groupName)

  // the group that is being edited
  const [editingGroup, setEditingGroup] = useState(
    props.groups.filter(item => item.name === props.route.params.groupName)[0]
  )

  // keeps track of the source for the avatar image
  const [emoji, setEmoji] =
    props.route.name === 'AddGroup'
      ? useState('default')
      : useState(editingGroup.emoji)

  // keeps track of whether the group being editted is currently the active group
  const [isActive, setIsActive] = useState(
    props.activeGroup.name === props.route.params.groupName
  )

  //// CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [props.isRTL, groupName, emoji])

  //// NAV OPTIONS

  function getNavOptions () {
    return {
      headerRight: props.isRTL
        ? () => (
            <BackButton
              onPress={() => {
                if (props.route.name === 'EditGroup') {
                  if (!checkForDuplicate()) editGroup()
                }
                props.navigation.goBack()
              }}
            />
          )
        : () => <View></View>,
      headerLeft: props.isRTL
        ? () => <View></View>
        : () => (
            <BackButton
              onPress={() => {
                if (props.route.name === 'EditGroup') {
                  if (!checkForDuplicate() && !checkForBlank()) editGroup()
                } else props.navigation.goBack()
              }}
            />
          )
    }
  }

  //// FUNCTIONS

  function checkForDuplicate () {
    var isDuplicate = false
    if (props.route.name === 'AddGroup') {
      props.groups.forEach(group => {
        if (group.name === groupName) {
          Alert.alert(
            props.translations.groups.add_edit_group.duplicate_group_name_title,
            props.translations.groups.add_edit_group
              .duplicate_group_name_message,
            [{ text: props.translations.general.ok, onPress: () => {} }]
          )
          isDuplicate = true
        }
      })
    } else {
      props.groups.forEach(group => {
        if (
          group.name === groupName &&
          props.route.params.groupName !== groupName
        ) {
          Alert.alert(
            props.translations.groups.add_edit_group.duplicate_group_name_title,
            props.translations.groups.add_edit_group
              .duplicate_group_name_message,
            [{ text: props.translations.general.ok, onPress: () => {} }]
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
        props.translations.groups.add_edit_group.blank_group_name_title,
        props.translations.groups.add_edit_group.blank_group_name_message,
        [{ text: props.translations.general.ok, onPress: () => {} }]
      )
      return true
    }
    return false
  }

  // adds a group to redux if it passes all error checking
  function addNewGroup () {
    if (checkForDuplicate() || checkForBlank()) return

    props.createGroup(groupName, props.route.params.languageID, emoji)
    props.changeActiveGroup(groupName)
    props.navigation.goBack()
  }

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
    <View
      style={[
        styles.buttonContainer,
        { borderWidth: 1, borderColor: colors.chateau, borderRadius: 10 }
      ]}
    >
      <Text
        style={[
          styles.cantDeleteText,
          {
            textAlign: props.isRTL ? 'right' : 'left',
            fontFamily: props.font + '-regular'
          }
        ]}
      >
        {props.translations.add_edit_group.cant_delete_group_text}
      </Text>
    </View>
  ) : (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          backgroundColor: colors.red
        }
      ]}
      onPress={() => {
        props.deleteGroup(props.route.params.groupName)
        props.navigation.goBack()
      }}
    >
      <Text
        style={[
          styles.buttonText,
          {
            textAlign: props.isRTL ? 'right' : 'left',
            fontFamily: props.font + '-regular',
            color: colors.white
          }
        ]}
      >
        {props.translations.add_edit_group.delete_group_button_label}
      </Text>
    </TouchableOpacity>
  )

  var editControls =
    props.route.name === 'EditGroup' ? (
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          flex: 1,
          flexDirection:
            Dimensions.get('window').height < 550
              ? props.isRTL
                ? 'row-reverse'
                : 'row'
              : 'column'
        }}
      >
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            {
              borderWidth: 1,
              borderColor: colors.red
            }
          ]}
          onPress={() =>
            Alert.alert(
              props.translations.add_edit_group.reset_progress_title,
              props.translations.add_edit_group.reset_progress_message,
              [
                {
                  text: props.translations.general.cancel,
                  onPress: () => {}
                },
                {
                  text: props.translations.general.ok,
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
              styles.buttonText,
              {
                textAlign: props.isRTL ? 'right' : 'left',
                fontFamily: props.font + '-regular',
                color: colors.red
              }
            ]}
          >
            {props.translations.add_edit_group.reset_progress_button_label}
          </Text>
        </TouchableOpacity>
        <View style={{ width: 20, height: '100%' }} />
        {deleteButton}
      </View>
    ) : null

  var saveButton =
    props.route.name === 'AddGroup' ? (
      <TouchableOpacity
        style={[
          styles.saveButtonContainer,
          { alignSelf: props.isRTL ? 'flex-start' : 'flex-end' }
        ]}
        onPress={addNewGroup}
      >
        <Text
          style={[
            styles.saveButtonText,
            { fontFamily: props.font + '-medium' }
          ]}
        >
          {props.translations.add_edit_group.save_button_label}
        </Text>
      </TouchableOpacity>
    ) : null

  return (
    <View style={styles.screen}>
      <View>
        <View style={styles.photoContainer}>
          <AvatarImage
            style={{ backgroundColor: colors.chateau }}
            emoji={emoji}
            size={120}
            isChangeable={true}
          />
        </View>
        <View
          style={{
            marginHorizontal: 20
          }}
        >
          <Text
            style={{
              textAlign: props.isRTL ? 'right' : 'left',
              fontFamily: props.font + '-regular',
              fontSize: 14 * scaleMultiplier,
              color: colors.chateau
            }}
          >
            {props.translations.add_edit_group.group_name_form_label}
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
            placeholder={
              props.translations.add_edit_group.group_name_form_placeholder
            }
            placeholderTextColor={colors.chateau}
            maxLength={50}
            returnKeyType='done'
          />
        </View>
        <Text
          style={{
            fontSize: 14 * scaleMultiplier,
            color: colors.chateau,
            textAlign: props.isRTL ? 'right' : 'left',
            fontFamily: props.font + '-regular',
            marginHorizontal: 20,
            marginTop: 20,
            marginBottom: 5
          }}
        >
          {props.translations.add_edit_group.icon_form_label}
        </Text>
        <View
          style={{
            alignItems: 'center',
            height: 150 * scaleMultiplier,
            padding: 5,
            borderWidth: 2,
            borderRadius: 10,
            marginHorizontal: 20,
            borderColor: colors.athens
          }}
        >
          <FlatList
            data={groupIcons}
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
              (Dimensions.get('window').width - 40) / (50 * scaleMultiplier)
            )}
          />
        </View>
        {editControls}
      </View>
      {saveButton}
    </View>
  )
}

//// STYLES

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
    height: 40 * scaleMultiplier,
    fontSize: 18 * scaleMultiplier
  },
  resetProgressButtonContainer: {
    flex: 1,
    borderColor: colors.red,
    borderWidth: 1,
    borderRadius: 10,
    height: 55 * scaleMultiplier,
    marginVertical: 20,
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18 * scaleMultiplier
  },
  buttonContainer: {
    width:
      Dimensions.get('window').height < 550
        ? Dimensions.get('window').width / 2 - 30
        : Dimensions.get('window').width - 40,
    marginVertical: 10,
    borderRadius: 10,
    height: 55 * scaleMultiplier,
    justifyContent: 'center',
    paddingHorizontal: 15,
    alignItems: 'center'
  },
  deleteGroupButtonText: {
    color: colors.white,
    fontSize: 18 * scaleMultiplier
  },
  cantDeleteText: {
    fontSize: 14 * scaleMultiplier,
    color: colors.chateau
  },
  saveButtonContainer: {
    width: 127 * scaleMultiplier,
    height: 52 * scaleMultiplier,
    borderRadius: 10,
    backgroundColor: colors.apple,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    margin: 20
  },
  saveButtonText: {
    fontSize: 18 * scaleMultiplier,
    color: colors.white
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
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font,
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
    deleteGroup: name => {
      dispatch(deleteGroup(name))
    },
    resetProgress: name => {
      dispatch(resetProgress(name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditGroupScreen)

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
