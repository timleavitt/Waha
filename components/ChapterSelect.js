import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
import Typography from '../styles/typography'

// chapter select on play screen
//  1. allows switching of lessons
//  2. shows what your current chapter is
function ChapterSelect (props) {
  // order of chapters is
  //  1. fellowship
  //  2. story
  //  3. (if applicable) training, which is always a video
  //  4. application

  // RENDER

  // render story icon conditionally based off if it's not active, active, or completed
  var storyIcon
  if (props.activeChapter === 'fellowship') {
    storyIcon = 'number-2-filled'
  } else if (props.activeChapter === 'story') {
    storyIcon = 'number-2-outline'
  } else {
    storyIcon = 'check-filled'
  }

  // render training button based on a lot of factors
  var trainingButton

  // if our lesson type shows that we have a video, render the video button
  // otherwise, render nothing for training button
  if (props.lessonType === 'qav' || props.lessonType === 'qv') {
    // if we're not connected to the internet, and the video is not downloaded,
    //  then show a cloud slash icon. the user cannot play the video in this
    //    case, so it's not touchable
    if (!props.isConnected && !props.isDownloaded) {
      trainingButton = (
        <View
          style={[
            styles.chapterSelect,
            {
              borderColor: colors.chateau,
              backgroundColor: colors.athens
            }
          ]}
        >
          <Icon
            name='cloud-slash'
            size={25 * scaleMultiplier}
            color={colors.chateau}
          />
          <Text style={Typography(props, 'b', 'black', 'center', colors.shark)}>
            {props.translations.play.training}
          </Text>
        </View>
      )
      // if the video is currently downloading, show the progress bar
    } else if (
      props.downloads[props.lessonID + 'v'] &&
      props.downloads[props.lessonID + 'v'] < 1
    ) {
      trainingButton = (
        <View
          style={[
            styles.chapterSelect,
            {
              borderColor: colors.chateau,
              backgroundColor: colors.athens
            }
          ]}
        >
          <AnimatedCircularProgress
            size={20 * scaleMultiplier}
            width={4}
            fill={props.downloads[props.lessonID + 'v'] * 100}
            tintColor={props.primaryColor}
            rotation={0}
            backgroundColor={colors.white}
            style={{ margin: 5 }}
          />
          <Text
            style={Typography(props, 'p', 'black', 'center', colors.chateau)}
          >
            {props.translations.play.training}
          </Text>
        </View>
      )
      // if our video is downloaded or we have the internet to stream it, then
      //  show the button as normal
    } else {
      trainingButton = (
        <TouchableOpacity
          style={[
            styles.chapterSelect,
            {
              borderColor: props.primaryColor,
              backgroundColor:
                props.activeChapter === 'training'
                  ? props.primaryColor
                  : colors.athens
            }
          ]}
          onPress={() => props.onPress('training')}
        >
          <Icon
            name={
              props.activeChapter === 'application'
                ? 'check-filled'
                : props.activeChapter === 'training'
                ? 'number-3-outline'
                : 'number-3-filled'
            }
            size={25 * scaleMultiplier}
            color={
              props.activeChapter === 'training'
                ? colors.white
                : props.primaryColor
            }
          />
          <Text
            style={Typography(
              props,
              'p',
              'black',
              'center',
              props.activeChapter === 'training'
                ? colors.white
                : props.primaryColor
            )}
          >
            {props.translations.play.training}
          </Text>
        </TouchableOpacity>
      )
    }
  } else {
    trainingButton = null
  }

  // render chapter 2 button based on a lot of factors
  var storyButton

  // if our lesson type shows we have an audio source, and we are not connected
  //  and the lesson isn't downloaded, show the cloud slash icon. the user
  //  can't listen to the audio, so it's not touchable
  if (
    (props.lessonType === 'qa' || props.lessonType === 'qav') &&
    !props.isConnected &&
    !props.isDownloaded
  )
    storyButton = (
      <View
        style={[
          styles.chapterSelect,
          {
            borderColor: Colors.darkGrey1,
            backgroundColor: Colors.lightGray3
          }
        ]}
      >
        <Icon
          name='cloud-slash'
          size={25 * scaleMultiplier}
          color={colors.chateau}
        />
        <Text style={Typography(props, 'p', 'black', 'center', colors.chateau)}>
          {props.translations.play.story}
        </Text>
      </View>
    )
  // if the audio is downloading, show the progress
  else if (
    props.downloads[props.lessonID] &&
    props.downloads[props.lessonID] < 1
  )
    storyButton = (
      // if the lesson is downloading, show the progress in the chapter button
      <View
        style={[
          styles.chapterSelect,
          {
            borderColor: colors.chateau,
            backgroundColor: colors.athens
          }
        ]}
      >
        <AnimatedCircularProgress
          size={20 * scaleMultiplier}
          width={4}
          fill={props.downloads[props.lessonID] * 100}
          tintColor={props.primaryColor}
          rotation={0}
          backgroundColor={colors.white}
          style={{ margin: 5 }}
        />
        <Text style={Typography(props, 'p', 'black', 'center', colors.chateau)}>
          {props.translations.play.story}
        </Text>
      </View>
    )
  // otherwise, show the button as normal
  else
    storyButton = (
      <TouchableOpacity
        style={[
          styles.chapterSelect,
          {
            borderColor: props.primaryColor,
            backgroundColor:
              props.activeChapter === 'story'
                ? props.primaryColor
                : colors.athens
          }
        ]}
        onPress={() => props.onPress('story')}
      >
        <Icon
          name={storyIcon}
          size={25 * scaleMultiplier}
          color={
            props.activeChapter === 'story' ? colors.white : props.primaryColor
          }
        />
        <Text
          style={Typography(
            props,
            'p',
            'black',
            'center',
            props.activeChapter === 'story' ? colors.white : props.primaryColor
          )}
        >
          {props.translations.play.story}
        </Text>
      </TouchableOpacity>
    )

  // other 2 buttons are always rendered, so they aren't dynamic
  return (
    <View style={styles.chapterSelectContainer}>
      {/* fellowship button */}
      <TouchableOpacity
        style={[
          styles.chapterSelect,
          {
            borderColor: props.primaryColor,
            backgroundColor:
              props.activeChapter === 'fellowship'
                ? props.primaryColor
                : colors.athens
          }
        ]}
        onPress={() => props.onPress('fellowship')}
      >
        <Icon
          name={
            props.activeChapter === 'fellowship'
              ? 'number-1-outline'
              : 'check-filled'
          }
          size={25 * scaleMultiplier}
          color={
            props.activeChapter === 'fellowship'
              ? colors.white
              : props.primaryColor
          }
        />
        <Text
          style={Typography(
            props,
            'p',
            'black',
            'center',
            props.activeChapter === 'fellowship'
              ? colors.white
              : props.primaryColor
          )}
        >
          {props.translations.play.fellowship}
        </Text>
      </TouchableOpacity>

      {/* story button (defined earlier) */}
      {storyButton}

      {/* training button (defined earlier) */}
      {trainingButton}

      {/* application button */}
      <TouchableOpacity
        style={[
          styles.chapterSelect,
          {
            borderColor: props.primaryColor,
            backgroundColor:
              props.activeChapter === 'application'
                ? props.primaryColor
                : colors.athens
          }
        ]}
        onPress={() => props.onPress('application')}
      >
        <Icon
          name={
            props.lessonType === 'qav' || props.lessonType === 'qv'
              ? props.activeChapter === 'application'
                ? 'number-4-outline'
                : 'number-4-filled'
              : props.activeChapter === 'application'
              ? 'number-3-outline'
              : 'number-3-filled'
          }
          size={25 * scaleMultiplier}
          color={
            props.activeChapter === 'application'
              ? colors.white
              : props.primaryColor
          }
        />
        <Text
          style={Typography(
            props,
            'p',
            'black',
            'center',
            props.activeChapter === 'application'
              ? colors.white
              : props.primaryColor
          )}
        >
          {props.translations.play.application}
        </Text>
      </TouchableOpacity>
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
  },
  chapterSelectText: {
    fontSize: 14 * scaleMultiplier
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
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font,
    isConnected: state.network.isConnected
  }
}

export default connect(mapStateToProps)(ChapterSelect)
