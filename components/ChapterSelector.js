import React from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { chapters, lessonTypes } from '../constants'
import { activeDatabaseSelector } from '../redux/reducers/activeGroup'
import ChapterButton from './ChapterButton'
import ChapterSeparator from './ChapterSeparator'

function mapStateToProps (state) {
  return {
    primaryColor: activeDatabaseSelector(state).primaryColor
  }
}

/**
 * Component that displays the various 3 or 4 chapter buttons on the PlayScreen.
 * @param {string} activeChapter - The currently active chapter. See chapters in constants.js.
 * @param {Function} changeChapter - Changes the active chapter.
 * @param {boolean} isAudioDownloaded - Whether this lesson has its audio file downloaded or not.
 * @param {boolean} isVideoDownloaded - Whether this lesson has its video file downloaded or not. Only relevant to STANDARD_DMC or VIDEO_ONLY lesson types.
 * @param {string} lessonType - The type of the current lesson. See lessonTypes in constants.js.
 * @param {string} lessonID - The ID for the active lesson.
 */
const ChapterSelector = ({
  // Props passed from a parent component.
  activeChapter,
  changeChapter,
  isAudioDownloaded,
  isVideoDownloaded,
  lessonType,
  lessonID,
  // Props passed from redux.
  primaryColor
}) => (
  <View
    style={[styles.chapterSelectorContainer, { borderColor: primaryColor }]}
  >
    <ChapterButton
      chapter={chapters.FELLOWSHIP}
      activeChapter={activeChapter}
      lessonType={lessonType}
      changeChapter={changeChapter}
    />
    {/* <View style={{ width: 5 }} /> */}
    <ChapterSeparator />
    <ChapterButton
      chapter={chapters.STORY}
      activeChapter={activeChapter}
      changeChapter={changeChapter}
      lessonType={lessonType}
      lessonID={lessonID}
      isAudioDownloaded={isAudioDownloaded}
    />
    {/* For DMC lessons, we need an extra 'Training' chapter button. */}
    {lessonType === lessonTypes.STANDARD_DMC ? (
      // <View style={{ width: 5 }} />
      <ChapterSeparator />
    ) : null}
    {lessonType === lessonTypes.STANDARD_DMC ? (
      <ChapterButton
        chapter={chapters.TRAINING}
        activeChapter={activeChapter}
        changeChapter={changeChapter}
        lessonType={lessonType}
        lessonID={lessonID}
        isVideoDownloaded={isVideoDownloaded}
      />
    ) : null}
    {/* <View style={{ width: 5 }} /> */}
    <ChapterSeparator />
    <ChapterButton
      chapter={chapters.APPLICATION}
      activeChapter={activeChapter}
      changeChapter={changeChapter}
      lessonType={lessonType}
    />
  </View>
)

const styles = StyleSheet.create({
  chapterSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden'
  }
})

export default connect(mapStateToProps)(ChapterSelector)
