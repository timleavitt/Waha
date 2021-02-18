import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import React from 'react'
import { Alert, Share, View } from 'react-native'
import { connect } from 'react-redux'
import OptionsModalButton from '../components/OptionsModalButton'
import Separator from '../components/standard/Separator'
import {
  logShareApp,
  logShareAudio,
  logShareText
} from '../redux/LogEventFunctions'
import OptionsModal from './OptionsModal'

function ShareModal (props) {
  // opens the share sheet to share a chapter of a lesson
  function share (type) {
    switch (type) {
      // share the link to Waha itself
      case 'app':
        Share.share({
          message:
            'iOS: https://apps.apple.com/us/app/waha-discover-gods-story/id1530116294\n\nAndroid: https://play.google.com/store/apps/details?id=com.kingdomstrategies.waha'
        }).then(() => {
          logShareApp(props.activeGroup.name)
          props.hideModal()
        })
        break
      // share the passage text for this lesson
      case 'text':
        var scriptureString = ''
        props.lesson.scripture.forEach((scripturePiece, index) => {
          scriptureString += scripturePiece.header + '\n' + scripturePiece.text
          if (index !== props.lesson.scripture.length - 1)
            scriptureString += '\n'
        })
        Share.share({
          message: scriptureString
        }).then(() => {
          logShareText(props.lesson, props.activeGroup.name)
          props.hideModal()
        })
        break
      // share the audio file for this lesson
      case 'audio':
        FileSystem.getInfoAsync(
          FileSystem.documentDirectory + props.lesson.id + '.mp3'
        ).then(({ exists }) => {
          exists
            ? Sharing.shareAsync(
                FileSystem.documentDirectory + props.lesson.id + '.mp3'
              ).then(() => {
                logShareAudio(props.lesson, props.activeGroup.name)
                props.hideModal()
              })
            : Alert.alert(
                props.translations.general.popups
                  .share_undownloaded_lesson_title,
                props.translations.general.popups
                  .share_undownloaded_lesson_message,
                [
                  {
                    text: props.translations.general.ok,
                    onPress: () => {}
                  }
                ]
              )
        })
        break
      // share the video link for this lesson
      case 'video':
        Share.share({
          message: props.lesson.videoShareLink
        }).then(() => {
          props.hideModal()
        })
        break
    }
  }
  //+ RENDER
  return (
    <OptionsModal
      isVisible={props.isVisible}
      hideModal={props.hideModal}
      closeText={props.closeText}
    >
      <OptionsModalButton
        title={props.translations.general.share_app}
        onPress={() => share('app')}
      />
      {props.lessonType.includes('q') ? (
        <View>
          <Separator />
          <OptionsModalButton
            title={props.translations.general.share_passage_text}
            onPress={() => share('text')}
          />
        </View>
      ) : null}
      {props.lessonType.includes('a') && !props.downloads[props.lesson.id] ? (
        <View>
          <Separator />
          <OptionsModalButton
            title={props.translations.general.share_passage_audio}
            onPress={() => share('audio')}
          />
        </View>
      ) : null}
      {props.lessonType.includes('v') &&
      props.lesson.videoShareLink &&
      !props.downloads[props.lesson.id] ? (
        <View>
          <Separator />
          <OptionsModalButton
            title={props.translations.general.share_video_link}
            onPress={() => share('video')}
          />
        </View>
      ) : null}
    </OptionsModal>
  )
}

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

export default connect(mapStateToProps)(ShareModal)
