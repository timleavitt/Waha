import React, { useEffect, useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  AsyncStorage,
  Text,
  TouchableOpacity
} from 'react-native'
import * as FileSystem from 'expo-file-system'
import SetItem from '../components/SetItem'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { resumeDownload } from '../redux/actions/downloadActions'
import { getStateFromPath } from '@react-navigation/native'

function SetScreen (props) {
  //// STUFF FOR TESTING

  // FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(contents => {
  //   console.log(contents)
  // })
  // console.log(scaleMultiplier)

  //// STATE

  // shows the add new set modal
  const [addNewSetLabel, setAddNewSetLabel] = useState('')
  const [setCategory, setSetCategory] = useState('')

  //// CONSTRUCTOR

  useEffect(() => {
    // console.log(props.route.name)
    if (props.route.name === 'Core') {
      setAddNewSetLabel(props.translations.labels.addNewCoreStorySet)
      setSetCategory('core')
    } else if (props.route.name === 'Topical') {
      setAddNewSetLabel(props.translations.labels.addNewTopicalSet)
      setSetCategory('topical')
    } else {
      setSetCategory('mt')
    }
  }, [])

  //// NAV OPTIONS

  //// RENDER

  function renderStudySetItem (setList) {
    return (
      <SetItem
        thisSet={setList.item}
        isSmall={false}
        mode='shown'
        onSetSelect={() =>
          props.navigation.navigate('LessonList', {
            thisSet: setList.item
          })
        }
      />
    )
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={
          props.route.name === 'Topical'
            ? // if we're displaying topical sets, display them in the order added
              props.activeDatabase.sets
                .filter(set => set.category === setCategory)
                .filter(set =>
                  props.activeGroup.addedSets.some(
                    addedSet => addedSet.id === set.id
                  )
                )
                .sort(
                  (a, b) =>
                    props.activeGroup.addedSets.indexOf(a.id) -
                    props.activeGroup.addedSets.indexOf(b.id)
                )
            : // otherwise, display them in numerical order
              props.activeDatabase.sets
                .filter(set => set.category === setCategory)
                .filter(set =>
                  props.activeGroup.addedSets.some(
                    addedSet => addedSet.id === set.id
                  )
                )
        }
        renderItem={renderStudySetItem}
        extraData={props.activeGroup}
        ListFooterComponent={
          setCategory === 'mt' ? null : (
            <TouchableOpacity
              style={[
                styles.addNewSetContainer,
                { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
              ]}
              onPress={() =>
                props.navigation.navigate('AddSetStack', {
                  screen: 'AddSet',
                  params: {
                    category: setCategory === 'core' ? 'core' : 'folder'
                  }
                })
              }
            >
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 80 * scaleMultiplier,
                  height: 80 * scaleMultiplier
                }}
              >
                <Icon
                  name='plus-filled'
                  size={60 * scaleMultiplier}
                  color='#9FA5AD'
                  style={styles.addNewSetIcon}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  flexDirection: 'column',
                  marginRight: props.isRTL ? 20 : 0,
                  marginLeft: props.isRTL ? 0 : 20
                }}
              >
                <Text
                  style={{
                    fontFamily: props.font + '-regular',
                    fontSize: 14 * scaleMultiplier,
                    color: '#9FA5AD',
                    textAlign: props.isRTL ? 'right' : 'left'
                  }}
                >
                  {addNewSetLabel}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }
      />
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EAEEF0'
  },
  headerImage: {
    resizeMode: 'contain',
    width: 120,
    height: 40,
    alignSelf: 'center'
  },
  addNewSetContainer: {
    width: '100%',
    height: 80 * scaleMultiplier,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 20
  }
})

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    activeDatabase: state.database[activeGroup.language],
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font,
    activeGroup: activeGroup
  }
}
function mapDispatchToProps (dispatch) {
  return {
    resumeDownload: (lessonID, downloadSnapshotJSON) => {
      dispatch(resumeDownload(lessonID, downloadSnapshotJSON))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetScreen)
