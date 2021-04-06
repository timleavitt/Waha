import React from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { activeDatabaseSelector } from '../redux/reducers/activeGroup'
import ChapterButton from './ChapterButton'
import ChapterSeparator from './ChapterSeparator'

function mapStateToProps (state) {
  return {
    primaryColor: activeDatabaseSelector(state).primaryColor,
    downloads: state.downloads,
    isConnected: state.network.isConnected
  }
}

const ChapterSelector = ({
  // Props passed from a parent component.
  activeChapter,
  lessonID,
  onPress,
  lessonType,
  isDownloaded,
  // Props passed from redux.
  primaryColor,
  downloads,
  isConnected
}) => {
  // order of chapters is
  //  1. fellowship
  //  2. story
  //  3. (if applicable) training, which is always a video
  //  4. application

  // RENDER

  function getActiveNumber () {
    switch (activeChapter) {
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
        if (lessonType === 'qav' || lessonType === 'qv') return 4
        else return 3
        break
    }
  }

  return (
    <View style={styles.chapterSelectContainer}>
      <ChapterButton
        name='fellowship'
        mode={activeChapter === 'fellowship' ? 'active' : 'inactive'}
        number={1}
        activeNumber={getActiveNumber()}
        onPress={onPress}
      />
      <ChapterSeparator />
      <ChapterButton
        name='story'
        mode={
          (lessonType === 'qa' || lessonType === 'qav') &&
          !isConnected &&
          !isDownloaded
            ? 'disabled'
            : downloads[lessonID] && downloads[lessonID].progress < 1
            ? 'downloading'
            : activeChapter === 'story'
            ? 'active'
            : 'inactive'
        }
        number={2}
        activeNumber={getActiveNumber()}
        onPress={onPress}
        downloadProgress={
          downloads[lessonID] ? downloads[lessonID].progress : null
        }
      />
      {lessonType === 'qav' || lessonType === 'qv' ? (
        <ChapterSeparator />
      ) : null}
      {lessonType === 'qav' || lessonType === 'qv' ? (
        <ChapterButton
          name='training'
          mode={
            !isConnected && !isDownloaded
              ? 'disabled'
              : downloads[lessonID + 'v'] &&
                downloads[lessonID + 'v'].progress < 1
              ? 'downloading'
              : activeChapter === 'training'
              ? 'active'
              : 'inactive'
          }
          number={3}
          activeNumber={getActiveNumber()}
          onPress={onPress}
          downloadProgress={
            downloads[lessonID + 'v']
              ? downloads[lessonID + 'v'].progress
              : null
          }
        />
      ) : null}
      <ChapterSeparator />
      <ChapterButton
        name='application'
        mode={activeChapter === 'application' ? 'active' : 'inactive'}
        number={lessonType === 'qav' || lessonType === 'qv' ? 4 : 3}
        activeNumber={getActiveNumber()}
        onPress={onPress}
      />
    </View>
  )
}

// STYLES

const styles = StyleSheet.create({
  chapterSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default connect(mapStateToProps)(ChapterSelector)
