import React, { useEffect } from 'react'
import { View, FlatList, StyleSheet, Image, AsyncStorage } from 'react-native'
import * as FileSystem from 'expo-file-system'
import SetItem from '../components/SetItem'
import AvatarImage from '../components/AvatarImage'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import { resumeDownload } from '../redux/actions/downloadActions'

function SetScreen (props) {
  //// STUFF FOR TESTING

  FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(contents => {
    console.log(contents)
  })
  // console.log(scaleMultiplier)

  //// CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [props.isRTL, props.activeGroup])

  //// NAV OPTIONS

  function getNavOptions () {
    return {
      headerTitle: () => (
        <Image
          style={styles.headerImage}
          source={{
            uri:
              FileSystem.documentDirectory +
              props.activeGroup.language +
              '-header.png'
          }}
        />
      ),
      headerLeft: props.isRTL
        ? () => <View></View>
        : () => (
            <AvatarImage
              source={props.activeGroup.imageSource}
              size={40}
              onPress={() => props.navigation.toggleDrawer()}
              isActive={true}
            />
          ),
      headerRight: props.isRTL
        ? () => (
            <AvatarImage
              source={props.activeGroup.imageSource}
              size={40}
              onPress={() => props.navigation.toggleDrawer()}
              isActive={true}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(SetScreen)
