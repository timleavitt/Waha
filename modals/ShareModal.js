import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import React from 'react'
import { Alert, Share, View } from 'react-native'
import { connect } from 'react-redux'
import OptionsModalButton from '../components/OptionsModalButton'
import Separator from '../components/standard/Separator'
import { logShareApp, logShareAudio, logShareText } from '../LogEventFunctions'
import OptionsModal from './OptionsModal'

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    translations: state.database[activeGroup.language].translations,
    downloads: state.downloads,
    activeGroup: activeGroup
  }
}

function ShareModal ({
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
}) {
  // opens the share sheet to share a chapter of a lesson
  function share (type) {
    switch (type) {
      // share the link to Waha itself
      case 'app':
        Share.share({
          message:
            'iOS: https://apps.apple.com/us/app/waha-discover-gods-story/id1530116294\n\nAndroid: https://play.google.com/store/apps/details?id=com.kingdomstrategies.waha'
        }).then(() => {
          logShareApp(activeGroup.id)
          hideModal()
        })
        break
      // share the passage text for this lesson
      case 'text':
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
      // share the audio file for this lesson
      case 'audio':
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
      // share the video link for this lesson
      case 'video':
        Share.share({
          message: lesson.videoShareLink
        }).then(() => {
          hideModal()
        })
        break
    }
  }
  //+ RENDER
  return (
    <OptionsModal
      isVisible={isVisible}
      hideModal={hideModal}
      closeText={closeText}
    >
      <OptionsModalButton
        title={translations.general.share_app}
        onPress={() => share('app')}
      />
      {lessonType.includes('q') ? (
        <View>
          <Separator />
          <OptionsModalButton
            title={translations.general.share_passage_text}
            onPress={() => share('text')}
          />
        </View>
      ) : null}
      {lessonType.includes('a') && !downloads[lesson.id] ? (
        <View>
          <Separator />
          <OptionsModalButton
            title={translations.general.share_passage_audio}
            onPress={() => share('audio')}
          />
        </View>
      ) : null}
      {lessonType.includes('v') &&
      lesson.videoShareLink &&
      !downloads[lesson.id] ? (
        <View>
          <Separator />
          <OptionsModalButton
            title={translations.general.share_video_link}
            onPress={() => share('video')}
          />
        </View>
      ) : null}
    </OptionsModal>
  )
}

export default connect(mapStateToProps)(ShareModal)
