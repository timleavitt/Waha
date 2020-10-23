import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import React from 'react'
import { Alert, Share, View } from 'react-native'
import { connect } from 'react-redux'
import ModalButton from '../components/ModalButton'
import OptionsModal from '../components/OptionsModal'
import Separator from '../components/Separator'
import {
  logShareApp,
  logShareAudio,
  logShareText
} from '../redux/LogEventFunctions'

function ShareModal (props) {
  // opens the share sheet to share a chapter of a lesson
  function share (type) {
    switch (type) {
      // share the link to Waha itself
      case 'app':
        logShareApp(props.lesson)
        Share.share({
          message: 'https://waha.ck.page'
          // getSetInfo('category', props.set.id) === 'mt'
          //   ? Platform.OS === 'ios'
          //     ? 'https://waha.ck.page' +
          //       ' ' +
          //       props.translations.general.share_toolkit_unlock_code
          //     : 'https://waha.ck.page' +
          //       ' ' +
          //       props.translations.general.share_toolkit_unlock_code
          //   : Platform.OS === 'ios'
          //   ? 'www.waha.app'
          //   : 'www.waha.app'
        }).then(() => {
          props.hideModal()
        })
        break
      // share the passage text for this lesson
      case 'text':
        logShareText(props.lesson)
        var scriptureString = ''
        props.lesson.scripture.forEach((scripturePiece, index) => {
          scriptureString += scripturePiece.header + '\n' + scripturePiece.text
          if (index !== props.lesson.scripture.length - 1)
            scriptureString += '\n'
        })
        Share.share({
          message: scriptureString
        }).then(() => {
          props.hideModal()
        })
        break
      // share the audio file for this lesson
      case 'audio':
        logShareAudio(props.lesson)
        FileSystem.getInfoAsync(
          FileSystem.documentDirectory + props.lesson.id + '.mp3'
        ).then(({ exists }) => {
          exists
            ? Sharing.shareAsync(
                FileSystem.documentDirectory + props.lesson.id + '.mp3'
              ).then(() => {
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
      <ModalButton
        title={props.translations.general.share_app}
        onPress={() => share('app')}
      />
      {props.lessonType.includes('q') ? (
        <View>
          <Separator />
          <ModalButton
            title={props.translations.general.share_passage_text}
            onPress={() => share('text')}
          />
        </View>
      ) : null}
      {props.lessonType.includes('a') && !props.downloads[props.lesson.id] ? (
        <View>
          <Separator />
          <ModalButton
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
          <ModalButton
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
    downloads: state.downloads
  }
}

export default connect(mapStateToProps)(ShareModal)
