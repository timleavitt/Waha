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
import AvatarImage from '../components/AvatarImage'
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
  //// CONSTRUCTOR

  useEffect(() => {
    // console.log(props.route.name)
    if (props.route.name === 'core') {
      setAddNewSetLabel(props.translations.labels.addNewCoreStorySet)
    } else if (props.route.name === 'topical') {
      setAddNewSetLabel(props.translations.labels.addNewTopicalSet)
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
        data={props.activeDatabase.sets
          .filter(set => set.category === props.route.name)
          .filter(set => props.activeGroup.addedSets.includes(set.id))}
        renderItem={renderStudySetItem}
        ListFooterComponent={
          <TouchableOpacity
            style={[
              styles.addNewSetContainer,
              { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
            ]}
            onPress={() =>
              props.navigation.navigate('AddSetNavigator', {
                screen: 'AddSet',
                params: {
                  category: props.route.name === 'core' ? 'core' : 'folder'
                }
              })
            }
          >
            <Icon
              name='plus-filled'
              size={50 * scaleMultiplier}
              color='#9FA5AD'
              style={styles.addNewSetIcon}
            />
            <Text
              style={[
                styles.addNewSetText,
                { fontFamily: props.font + '-regular' }
              ]}
            >
              {addNewSetLabel}
            </Text>
          </TouchableOpacity>
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
    flexDirection: 'row'
  },
  addNewSetIcon: {
    marginHorizontal: 25
  },
  addNewSetText: {
    fontSize: 14 * scaleMultiplier,
    color: '#9FA5AD'
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
