import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native'
import Modal from 'react-native-modal'
import SetItem from '../components/SetItem'
import { scaleMultiplier } from '../constants'
import { connect } from 'react-redux'
import { addSet } from '../redux/actions/groupsActions'
import BackButton from '../components/BackButton'
import SnackBar from 'react-native-snackbar-component'

function AddSetScreen (props) {
  const [setItemMode, setSetItemMode] = useState('')
  const [onPress, setOnPress] = useState(() => {})
  const [showSnackbar, setShowSnackbar] = useState(false)

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [])

  function getNavOptions () {
    return {
      title:
        props.route.params.category === 'core'
          ? props.translations.labels.addNewCoreStorySet
          : props.translations.labels.addNewTopicalSet,
      headerLeft:
        props.route.params.category === 'topical'
          ? props.isRTL
            ? () => <View></View>
            : () => <BackButton onPress={() => props.navigation.goBack()} />
          : props.isRTL
          ? () => <View></View>
          : () => (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  width: 100,
                  justifyContent: props.isRTL ? 'flex-end' : 'flex-start'
                }}
                onPress={() => props.navigation.goBack()}
              >
                <Icon
                  name='cancel-filled'
                  size={45 * scaleMultiplier}
                  color='#3A3C3F'
                />
              </TouchableOpacity>
            ),
      headerRight:
        props.route.params.category === 'topical'
          ? props.isRTL
            ? () => <BackButton onPress={() => props.navigation.goBack()} />
            : () => <View></View>
          : props.isRTL
          ? () => (
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <Icon
                  name='cancel-filled'
                  size={45 * scaleMultiplier}
                  color='#3A3C3F'
                />
              </TouchableOpacity>
            )
          : () => <View></View>
    }
  }

  //// RENDER
  function renderStudySetItem (setList) {
    return (
      <SetItem
        thisSet={setList.item}
        isSmall={false}
        mode={props.route.params.category === 'folder' ? 'folder' : 'hidden'}
        onSetSelect={
          // if we're in a folder, we want to navigate to the sets within that folder
          props.route.params.category === 'folder'
            ? () =>
                props.navigation.navigate('AddSetFolder', {
                  category: 'topical',
                  folder: setList.item.subcategory
                })
            : // otherwise, add the set
              () => {
                props.addSet(props.activeGroup.name, setList.item.id)
                setShowSnackbar(true)
                setTimeout(() => setShowSnackbar(false), 2000)
              }
        }
      />
    )
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={
          props.route.params.category === 'topical'
            ? props.activeDatabase.sets
                .filter(set => set.category === 'topical')
                .filter(set => set.folder === props.route.params.folder)
                .filter(
                  set =>
                    !props.activeGroup.addedSets.some(
                      addedSet => addedSet.id === set.id
                    )
                )
            : props.activeDatabase.sets
                .filter(set => set.category === props.route.params.category)
                .filter(
                  set =>
                    !props.activeGroup.addedSets.some(
                      addedSet => addedSet.id === set.id
                    )
                )
        }
        renderItem={renderStudySetItem}
        ListEmptyComponent={
          <View style={{ width: '100%', margin: 10 }}>
            <Text
              style={{
                fontFamily: props.font + '-regular',
                color: '#9FA5AD',
                fontSize: 14 * scaleMultiplier,
                textAlign: 'center'
              }}
            >
              {props.translations.labels.noMoreSets}
            </Text>
          </View>
        }
      />
      <SnackBar
        visible={showSnackbar}
        textMessage={props.translations.labels.setAdded}
        messageStyle={{
          color: '#FFFFFF',
          fontSize: 24 * scaleMultiplier,
          fontFamily: props.font + '-black',
          textAlign: 'center'
        }}
        backgroundColor='#60C239'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFFFFF',
    flex: 1
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font,
    translations: state.database[activeGroup.language].translations,
    isRTL: state.database[activeGroup.language].isRTL,
    activeDatabase: state.database[activeGroup.language],
    activeGroup: activeGroup
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addSet: (groupName, setID) => {
      dispatch(addSet(groupName, setID))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSetScreen)
