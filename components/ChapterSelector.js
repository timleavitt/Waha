import React from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { chapters, lessonTypes } from '../constants'
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

/**
 * Component that displays the various 3 or 4 chapter buttons on the PlayScreen.
 * @param {string} activeChapter - The currently active chapter. See chapters in constants.js.
 * @param {Function} changeChapter - Changes the active chapter.
 * @param {boolean} isFullyDownloaded - Whether a lesson has all of its media downloaded or not. Includes video files for lessons that require them.
 * @param {string} lessonType - The type of the current lesson. See lessonTypes in constants.js.
 * @param {string} lessonID - The ID for the active lesson.
 */
const ChapterSelector = ({
  // Props passed from a parent component.
  activeChapter,
  changeChapter,
  isFullyDownloaded,
  lessonType,
  lessonID,
  // Props passed from redux.
  primaryColor,
  downloads,
  isConnected
}) => {
  return (
    <View style={styles.chapterSelectContainer}>
      <ChapterButton
        chapter={chapters.FELLOWSHIP}
        activeChapter={activeChapter}
        lessonType={lessonType}
        changeChapter={changeChapter}
      />
      <ChapterSeparator />
      <ChapterButton
        chapter={chapters.STORY}
        activeChapter={activeChapter}
        changeChapter={changeChapter}
        lessonType={lessonType}
        lessonID={lessonID}
        isFullyDownloaded={isFullyDownloaded}
      />
      {/* For DMC lessons, we need an extra 'Training' chapter button. */}
      {lessonType === lessonTypes.STANDARD_DMC ? <ChapterSeparator /> : null}
      {lessonType === lessonTypes.STANDARD_DMC ? (
        <ChapterButton
          chapter={chapters.TRAINING}
          activeChapter={activeChapter}
          changeChapter={changeChapter}
          lessonType={lessonType}
          lessonID={lessonID}
          isFullyDownloaded={isFullyDownloaded}
        />
      ) : null}
      <ChapterSeparator />
      <ChapterButton
        chapter={chapters.APPLICATION}
        activeChapter={activeChapter}
        changeChapter={changeChapter}
        lessonType={lessonType}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  chapterSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default connect(mapStateToProps)(ChapterSelector)
