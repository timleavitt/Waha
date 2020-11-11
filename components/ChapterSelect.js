import React from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import ChapterButton from '../components/ChapterButton'
import { scaleMultiplier } from '../constants'
import ChapterSeparator from './ChapterSeparator'

function ChapterSelect (props) {
  // order of chapters is
  //  1. fellowship
  //  2. story
  //  3. (if applicable) training, which is always a video
  //  4. application

  // RENDER

  function getActiveNumber () {
    switch (props.activeChapter) {
      case 'fellowship':
        return 1
        break
      case 'story':
        return 2
        break
      case 'training':
        return 3
        break
      case 'application':
        if (props.lessonType === 'qav' || props.lessonType === 'qv') return 4
        else return 3
        break
    }
  }

  return (
    <View style={styles.chapterSelectContainer}>
      <ChapterButton
        name='fellowship'
        mode={props.activeChapter === 'fellowship' ? 'active' : 'inactive'}
        number={1}
        activeNumber={getActiveNumber()}
        onPress={props.onPress}
      />
      <ChapterSeparator />
      <ChapterButton
        name='story'
        mode={
          (props.lessonType === 'qa' || props.lessonType === 'qav') &&
          !props.isConnected &&
          !props.isDownloaded
            ? 'disabled'
            : props.downloads[props.lessonID] &&
              props.downloads[props.lessonID].progress < 1
            ? 'downloading'
            : props.activeChapter === 'story'
            ? 'active'
            : 'inactive'
        }
        number={2}
        activeNumber={getActiveNumber()}
        onPress={props.onPress}
        downloadProgress={
          props.downloads[props.lessonID]
            ? props.downloads[props.lessonID].progress
            : null
        }
      />
      {props.lessonType === 'qav' || props.lessonType === 'qv' ? (
        <ChapterSeparator />
      ) : null}
      {props.lessonType === 'qav' || props.lessonType === 'qv' ? (
        <ChapterButton
          name='training'
          mode={
            !props.isConnected && !props.isDownloaded
              ? 'disabled'
              : props.downloads[props.lessonID + 'v'] &&
                props.downloads[props.lessonID + 'v'].progress < 1
              ? 'downloading'
              : props.activeChapter === 'training'
              ? 'active'
              : 'inactive'
          }
          number={3}
          activeNumber={getActiveNumber()}
          onPress={props.onPress}
          downloadProgress={
            props.downloads[props.lessonID + 'v']
              ? props.downloads[props.lessonID + 'v'].progress
              : null
          }
        />
      ) : null}
      <ChapterSeparator />
      <ChapterButton
        name='application'
        mode={props.activeChapter === 'application' ? 'active' : 'inactive'}
        number={props.lessonType === 'qav' || props.lessonType === 'qv' ? 4 : 3}
        activeNumber={getActiveNumber()}
        onPress={props.onPress}
      />
    </View>
  )
}

// STYLES

const styles = StyleSheet.create({
  chapterSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  chapterSelect: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    height: 55 * scaleMultiplier,
    justifyContent: 'center',
    borderWidth: 2
  }
})

// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    primaryColor: state.database[activeGroup.language].primaryColor,
    downloads: state.downloads,
    isConnected: state.network.isConnected
  }
}

export default connect(mapStateToProps)(ChapterSelect)
