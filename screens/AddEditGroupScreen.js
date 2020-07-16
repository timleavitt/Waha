import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  Dimensions
} from 'react-native'
import BackButton from '../components/BackButton'
import { scaleMultiplier, groupIcons, groupIconSources } from '../constants'
import * as ImagePicker from 'expo-image-picker'
import { connect } from 'react-redux'
import {
  createGroup,
  changeActiveGroup,
  editGroup,
  deleteGroup,
  resetProgress
} from '../redux/actions/groupsActions'
import OptionsModal from '../components/OptionsModal'
import ModalButton from '../components/ModalButton'
import AvatarImage from '../components/AvatarImage'
import Modal from 'react-native-modal'

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
            props.translations.alerts.sameGroupName.header,
            props.translations.alerts.sameGroupName.text,
            [{ text: props.translations.alerts.options.ok, onPress: () => {} }]
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
            props.translations.alerts.sameGroupName.header,
            props.translations.alerts.sameGroupName.text,
            [{ text: props.translations.alerts.options.ok, onPress: () => {} }]
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
        props.translations.alerts.blankGroupName.header,
        props.translations.alerts.blankGroupName.text,
        [{ text: props.translations.alerts.options.ok, onPress: () => {} }]
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
        { borderWidth: 1, borderColor: '#9FA5AD', borderRadius: 10 }
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
        {props.translations.labels.cantDeleteGroup}
      </Text>
    </View>
  ) : (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          backgroundColor: '#FF0800'
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
            color: '#FFFFFF'
          }
        ]}
      >
        {props.translations.labels.deleteGroup}
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
              borderColor: '#FF0800'
            }
          ]}
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
              styles.buttonText,
              {
                textAlign: props.isRTL ? 'right' : 'left',
                fontFamily: props.font + '-regular',
                color: '#FF0800'
              }
            ]}
          >
            {props.translations.labels.resetProgress}
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
          {props.translations.labels.save}
        </Text>
      </TouchableOpacity>
    ) : null

  return (
    <View style={styles.screen}>
      <View>
        <View style={styles.photoContainer}>
          <AvatarImage emoji={emoji} size={120} isChangeable={true} />
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
              color: '#9FA5AD'
            }}
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
            placeholder={props.translations.labels.groupNamePlaceholder}
            placeholderTextColor='#9FA5AD'
            maxLength={50}
            returnKeyType='done'
          />
        </View>
        <Text
          style={{
            fontSize: 14 * scaleMultiplier,
            color: '#9FA5AD',
            textAlign: props.isRTL ? 'right' : 'left',
            fontFamily: props.font + '-regular',
            marginHorizontal: 20,
            marginTop: 20,
            marginBottom: 5
          }}
        >
          {props.translations.labels.icon}
        </Text>
        <View
          style={{
            alignItems: 'center',
            height: 150 * scaleMultiplier,
            padding: 5,
            borderWidth: 2,
            borderRadius: 10,
            marginHorizontal: 20,
            borderColor: '#EFF2F4'
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
                  borderColor: item === emoji ? '#2D9CDB' : null,
                  borderRadius: 10,
                  backgroundColor: item === emoji ? '#2D9CDB38' : null
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between'
  },
  photoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20 * scaleMultiplier
  },
  addNewGroupContainer: {
    borderBottomColor: '#EFF2F4',
    borderBottomWidth: 2,
    height: 40 * scaleMultiplier,
    fontSize: 18 * scaleMultiplier
  },
  resetProgressButtonContainer: {
    flex: 1,
    borderColor: '#FF0800',
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
    borderRadius: 10,
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
