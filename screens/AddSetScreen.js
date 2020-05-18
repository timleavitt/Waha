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

function WahaModal (props) {
  const [setItemMode, setSetItemMode] = useState('')
  const [onPress, setOnPress] = useState(() => {})

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [])

  function getNavOptions () {
    return {
      title:
        props.route.params.category === 'core'
          ? props.translations.labels.addNewCoreStorySet
          : props.translations.labels.addNewTopicalSet
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
          props.route.params.category === 'folder'
            ? () =>
                props.navigation.navigate('AddSetFolder', {
                  category: 'topical',
                  folder: setList.item.subcategory
                })
            : () => {
                props.addSet(props.activeGroup.name, setList.item.id)
                props.navigation.goBack()
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
                .filter(set => !props.activeGroup.addedSets.includes(set.id))
            : props.activeDatabase.sets
                .filter(set => set.category === props.route.params.category)
                .filter(set => !props.activeGroup.addedSets.includes(set.id))
        }
        renderItem={renderStudySetItem}
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

export default connect(mapStateToProps, mapDispatchToProps)(WahaModal)
