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
import { createGroup } from '../redux/actions/groupsActions'
import OptionsModal from '../components/OptionsModal'
import ModalButton from '../components/ModalButton'
import AvatarImage from '../components/AvatarImage'

function AddNewGroupScreen (props) {
  //// STATE

  // keeps track of the group name text input value
  const [groupName, setGroupName] = useState('')

  // keeps track of the source for the avatar image
  const [avatarSource, setAvatarSource] = useState('')

  // shows the image picker modal
  const [showImagePickerModal, setShowImagePickerModal] = useState(false)

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

  // adds a group to redux if it passes all error checking
  function addNewGroup () {
    var isDuplicate = false

    props.groups.map(group => {
      if (group.name === groupName) {
        isDuplicate = true
        return
      }
      return
    })

    if (isDuplicate) {
      Alert.alert(
        props.translations.alerts.sameGroupName.header,
        props.translations.alerts.sameGroupName.body,
        [{ text: props.translations.alerts.options.ok, onPress: () => {} }]
      )
      return
    }

    if (groupName === '') {
      Alert.alert(
        props.translations.alerts.blankGroupName.header,
        props.translations.alerts.blankGroupName.body,
        [{ text: props.translations.alerts.options.ok, onPress: () => {} }]
      )
      return
    }

    props.createGroup(groupName, props.route.params.languageID, avatarSource)
    props.navigation.goBack()
  }

  // opens image library after checking for permission, then set the avatarSource state
  // to the uri of the image the user selected
  async function openImageLibraryHandler () {
    var permissionGranted = false
    await ImagePicker.getCameraRollPermissionsAsync().then(
      permissionResponse => {
        if (permissionResponse.status !== 'granted') {
          ImagePicker.requestCameraRollPermissionsAsync().then(
            permissionResponse => {
              if (permissionResponse.status === 'granted') {
                openImageLibraryHandler()
              }
            }
          )
        } else {
          permissionGranted = true
        }
      }
    )
    if (permissionGranted) {
      ImagePicker.launchImageLibraryAsync({}).then(returnObject => {
        if (returnObject.cancelled !== true) {
          setAvatarSource(returnObject.uri)
        }
        setShowImagePickerModal(false)
      })
    }
  }

  // opens camera  after checking for permission, then set the avatarSource state
  // to the uri of the picture the user takes
  async function openCameraHandler () {
    var permissionGranted = false
    await ImagePicker.getCameraPermissionsAsync().then(permissionResponse => {
      if (permissionResponse.status !== 'granted') {
        ImagePicker.requestCameraPermissionsAsync().then(permissionResponse => {
          if (permissionResponse.status === 'granted') {
            openCameraHandler()
          }
        })
      } else {
        permissionGranted = true
      }
    })
    if (permissionGranted) {
      ImagePicker.launchCameraAsync({}).then(returnObject => {
        if (returnObject.cancelled !== true) {
          setAvatarSource(returnObject.uri)
        }
        setShowImagePickerModal(false)
      })
    }
  }

  //// RENDER

  return (
    <View style={styles.screen}>
      <View style={styles.photoContainer}>
        <AvatarImage
          source={avatarSource}
          onPress={() => setShowImagePickerModal(true)}
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
            placeholder={props.translations.labels.groupNamePlaceholder}
            placeholderTextColor='#9FA5AD'
            maxLength={50}
            returnKeyType='done'
          />
        </View>
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
      </View>
      <OptionsModal
        isVisible={showImagePickerModal}
        hideModal={() => setShowImagePickerModal(false)}
        closeText={props.translations.modals.cameraOptions.cancel}
      >
        <ModalButton
          title={props.translations.modals.cameraOptions.takePhoto}
          onPress={openCameraHandler}
        />
        <ModalButton
          isLast={true}
          title={props.translations.modals.cameraOptions.chooseFromLibrary}
          onPress={openImageLibraryHandler}
        />
      </OptionsModal>
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
    marginHorizontal: 25,
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
  saveButtonContainer: {
    width: 127 * scaleMultiplier,
    height: 52 * scaleMultiplier,
    borderRadius: 5,
    backgroundColor: '#60C239',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2
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
    font: state.database[activeGroup.language].font
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createGroup: (groupName, language, imageSource) =>
      dispatch(createGroup(groupName, language, imageSource))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewGroupScreen)
