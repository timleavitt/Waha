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
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state'
])

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
      headerLeft: props.isRTL
        ? () => <View></View>
        : () => (
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Icon name='cancel' size={45 * scaleMultiplier} color='#3A3C3F' />
            </TouchableOpacity>
          ),
      headerRight: props.isRTL
        ? () => (
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Icon name='cancel' size={45 * scaleMultiplier} color='#3A3C3F' />
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
        mode='addset'
        onSetSelect={() => {
          props.navigation.navigate('SetInfo', {
            category: props.route.params.category,
            thisSet: setList.item,
            showSnackbar: () => {
              setShowSnackbar(true)
              setTimeout(() => setShowSnackbar(false), 2000)
            }
          })
        }}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={
          props.activeDatabase.sets
            .filter(set => set.category === props.route.params.category)
            .filter(
              set =>
                !props.activeGroup.addedSets.some(
                  addedSet => addedSet.id === set.id
                )
            )
          // NOT USED: for folders
          // // if we're displaying topical sets:
          // // 1. filter by all sets that are topical,
          // // 2. filter by topical sets in the specified folder, and then
          // // 3. filter to only display sets that haven't already been added
          // props.route.params.category === 'topical'
          //   ? props.activeDatabase.sets
          //       .filter(set => set.category === 'topical')
          //       .filter(set => set.folder === props.route.params.folder)
          //       .filter(
          //         set =>
          //           !props.activeGroup.addedSets.some(
          //             addedSet => addedSet.id === set.id
          //           )
          //       )
          //   : // if we're displaying core or folders:
          //     // 1. filter by cateogry (core or folder)
          //     // 2. filter to only display sets that haven't already been added
          //     props.activeDatabase.sets
          //       .filter(set => set.category === props.route.params.category)
          //       .filter(
          //         set =>
          //           !props.activeGroup.addedSets.some(
          //             addedSet => addedSet.id === set.id
          //           )
          //       )
        }
        ItemSeparatorComponent={() => (
          <View
            style={{ backgroundColor: '#DEE3E9', height: 1, width: '100%' }}
          />
        )}
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
