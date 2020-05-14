import React, { useEffect } from 'react'
import { View, FlatList, StyleSheet, Image, AsyncStorage } from 'react-native'
import * as FileSystem from 'expo-file-system'
import SetItem from '../components/SetItem'
import AvatarImage from '../components/AvatarImage'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { resumeDownload } from '../redux/actions/downloadActions'

function CoreStorySetsScreen (props) {
  //// STUFF FOR TESTING

  // FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(contents => {
  //   console.log(contents)
  // })
  // console.log(scaleMultiplier)

  //// CONSTRUCTOR

  useEffect(() => {}, [])

  //// NAV OPTIONS

  //// RENDER

  function renderStudySetItem (setList) {
    return (
      <SetItem
        thisSet={setList.item}
        isSmall={false}
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
        data={props.activeDatabase.sets}
        renderItem={renderStudySetItem}
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

export default connect(mapStateToProps, mapDispatchToProps)(CoreStorySetsScreen)
