import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import React from 'react'
import { Alert, Share, View } from 'react-native'
import { connect } from 'react-redux'
import OptionsModalButton from '../components/OptionsModalButton'
import WahaSeparator from '../components/WahaSeparator'
import { logShareApp, logShareAudio, logShareText } from '../LogEventFunctions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import OptionsModal from './OptionsModal'

function mapStateToProps (state) {
  return {
    translations: activeDatabaseSelector(state).translations,
    downloads: state.downloads,
    activeGroup: activeGroupSelector(state)
  }
}

const shareTypes = {
  APP: 1,
  TEXT: 2,
  AUDIO: 3,
  VIDEO: 4
}

/**
 * A modal component that gives the user options to share various parts of a lesson.
 * @param {boolean} isVisible - Whether the modal is visible.
 * @param {Function} hideModal - Function to hide the modal.
 * @param {string} closeText - The text to display on the button that closes the modal.
 * @param {Object} lesson - The object for the lesson that we're sharing.
 * @param {string[]} lessonType - The type of the lesson that we're sharing. See lessonTypes in constants.js.
 * @param {Object} set - The object for the set that the lesson that we're sharing is a part of.
 */
const ShareModal = ({
  // Props passed from a parent component.s
  isVisible,
  hideModal,
  closeText,
  lesson,
  lessonType,
  set,
  // Props passed from redux.
  translations,
  downloads,
  activeGroup
}) => {
  /**
   * Opens the share sheet to share a piece of content from a lesson.
   * @param {number} type - The type of content to share. See shareTypes at the top of this page.
   */
  const shareLessonContent = type => {
    switch (type) {
      // Share links to Waha's app store pages.
      case shareTypes.APP:
        Share.share({
          message:
            'iOS: https://apps.apple.com/us/app/waha-discover-gods-story/id1530116294\n\nAndroid: https://play.google.com/store/apps/details?id=com.kingdomstrategies.waha'
        }).then(() => {
          logShareApp(activeGroup.id)
          hideModal()
        })
        break
      // Share the Scripture text for a lesson if it has it.
      case shareTypes.TEXT:
        var scriptureString = ''
        lesson.scripture.forEach((scripturePiece, index) => {
          scriptureString += scripturePiece.header + '\n' + scripturePiece.text
          if (index !== lesson.scripture.length - 1) scriptureString += '\n'
        })
        Share.share({
          message: scriptureString
        }).then(() => {
          logShareText(lesson, activeGroup.id)
          hideModal()
        })
        break
      // Share the Scripture audio for a lesson if it exists.
      case shareTypes.AUDIO:
        FileSystem.getInfoAsync(
          FileSystem.documentDirectory + lesson.id + '.mp3'
        ).then(({ exists }) => {
          exists
            ? Sharing.shareAsync(
                FileSystem.documentDirectory + lesson.id + '.mp3'
              ).then(() => {
                logShareAudio(lesson, activeGroup.id)
                hideModal()
              })
            : Alert.alert(
                translations.general.popups.share_undownloaded_lesson_title,
                translations.general.popups.share_undownloaded_lesson_message,
                [
                  {
                    text: translations.general.ok,
                    onPress: () => {}
                  }
                ]
              )
        })
        break
      // Share a link to the video for this lesson if there is one.
      case shareTypes.VIDEO:
        Share.share({
          message: lesson.videoShareLink
        }).then(() => {
          hideModal()
        })
        break
    }
  }

  return (
    // The share modal uses the <OptionsModal/> component.
    <OptionsModal
      isVisible={isVisible}
      hideModal={hideModal}
      closeText={closeText}
    >
      <OptionsModalButton
        label={translations.general.share_app}
        onPress={() => shareLessonContent(shareTypes.APP)}
      />
      {/* Include a "Share Text" button if a lesson has questions. If it has questions, then it also has Scripture text. */}
      {lessonType.includes('Questions') ? (
        <View>
          <WahaSeparator />
          <OptionsModalButton
            label={translations.general.share_passage_text}
            onPress={() => shareLessonContent(shareTypes.TEXT)}
          />
        </View>
      ) : null}
      {/* Include a "Share Audio" button if a lesson has audio and it's not currently downloading. */}
      {lessonType.includes('Audio') && !downloads[lesson.id] && (
        <View>
          <WahaSeparator />
          <OptionsModalButton
            label={translations.general.share_passage_audio}
            onPress={() => shareLessonContent(shareTypes.AUDIO)}
          />
        </View>
      )}
      {/* Include a "Share Video" button if a lesson has video, the link to share it exists, and it's not currently downloading. */}
      {lessonType.includes('Video') &&
        lesson.videoShareLink &&
        !downloads[lesson.id] && (
          <View>
            <WahaSeparator />
            <OptionsModalButton
              label={translations.general.share_video_link}
              onPress={() => shareLessonContent(shareTypes.VIDEO)}
            />
          </View>
        )}
    </OptionsModal>
  )
}

export default connect(mapStateToProps)(ShareModal)
