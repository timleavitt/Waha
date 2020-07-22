import React from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { scaleMultiplier } from '../constants'

function ChapterSelect (props) {
  // RENDER

  // render chapter 2 icon conditionally based off if it's not active, active, or completed
  var storyIcon
  if (props.activeChapter === 'fellowship') {
    storyIcon = 'number-2-filled'
  } else if (props.activeChapter === 'story') {
    storyIcon = 'number-2-outline'
  } else {
    storyIcon = 'check-filled'
  }

  var trainingButton
  if (props.lessonType === 'qav' || props.lessonType === 'qv') {
    if (
      (props.lessonType === 'qav' || props.lessonType === 'qv') &&
      !props.isConnected &&
      !props.isDownloaded
    ) {
      trainingButton = (
        <View
          style={[
            styles.chapterSelect,
            {
              borderColor: '#82868D',
              backgroundColor: '#EFF2F4'
            }
          ]}
        >
          <Icon
            name='cloud-slash'
            size={25 * scaleMultiplier}
            color='#82868D'
          />
          <Text
            style={[
              styles.chapterSelectText,
              {
                color: '#82868D',
                fontFamily: props.font + '-black'
              }
            ]}
          >
            {props.translations.play.training}
          </Text>
        </View>
      )
    } else if (
      props.downloads[props.lessonID + 'v'] &&
      props.downloads[props.lessonID + 'v'] < 1
    ) {
      trainingButton = (
        // if the video is downloading, show the progress in the chapter button
        <View
          style={[
            styles.chapterSelect,
            {
              borderColor: '#82868D',
              backgroundColor: '#EFF2F4'
            }
          ]}
        >
          <AnimatedCircularProgress
            size={20 * scaleMultiplier}
            width={4}
            fill={props.downloads[props.lessonID + 'v'] * 100}
            tintColor={props.primaryColor}
            rotation={0}
            backgroundColor='#FFFFFF'
            style={{ margin: 5 }}
          />
          <Text
            style={[
              styles.chapterSelectText,
              {
                color: '#82868D',
                fontFamily: props.font + '-black'
              }
            ]}
          >
            {props.translations.play.training}
          </Text>
        </View>
      )
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
                  : '#EFF2F4'
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
              props.activeChapter === 'training' ? 'white' : props.primaryColor
            }
          />
          <Text
            style={[
              styles.chapterSelectText,
              {
                color:
                  props.activeChapter === 'training'
                    ? 'white'
                    : props.primaryColor,
                fontFamily: props.font + '-black'
              }
            ]}
          >
            {props.translations.play.training}
          </Text>
        </TouchableOpacity>
      )
    }
  } else {
    trainingButton = null
  }

  // render chapter 2 button
  var storyButton
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
            borderColor: '#82868D',
            backgroundColor: '#EFF2F4'
          }
        ]}
      >
        <Icon name='cloud-slash' size={25 * scaleMultiplier} color='#82868D' />
        <Text
          style={[
            styles.chapterSelectText,
            {
              color: '#82868D',

              fontFamily: props.font + '-black'
            }
          ]}
        >
          {props.translations.play.story}
        </Text>
      </View>
    )
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
            borderColor: '#82868D',
            backgroundColor: '#EFF2F4'
          }
        ]}
      >
        <AnimatedCircularProgress
          size={20 * scaleMultiplier}
          width={4}
          fill={props.downloads[props.lessonID] * 100}
          tintColor={props.primaryColor}
          rotation={0}
          backgroundColor='#FFFFFF'
          style={{ margin: 5 }}
        />
        <Text
          style={[
            styles.chapterSelectText,
            {
              color: '#82868D',
              fontFamily: props.font + '-black'
            }
          ]}
        >
          {props.translations.play.story}
        </Text>
      </View>
    )
  else
    storyButton = (
      <TouchableOpacity
        style={[
          styles.chapterSelect,
          {
            borderColor: props.primaryColor,
            backgroundColor:
              props.activeChapter === 'story' ? props.primaryColor : '#EFF2F4'
          }
        ]}
        onPress={() => props.onPress('story')}
      >
        <Icon
          name={storyIcon}
          size={25 * scaleMultiplier}
          color={props.activeChapter === 'story' ? 'white' : props.primaryColor}
        />
        <Text
          style={[
            styles.chapterSelectText,
            {
              color:
                props.activeChapter === 'story' ? 'white' : props.primaryColor,
              fontFamily: props.font + '-black'
            }
          ]}
        >
          {props.translations.play.story}
        </Text>
      </TouchableOpacity>
    )

  return (
    <View style={styles.chapterSelectContainer}>
      {/* chapter 1 button */}
      <TouchableOpacity
        style={[
          styles.chapterSelect,
          {
            borderColor: props.primaryColor,
            backgroundColor:
              props.activeChapter === 'fellowship'
                ? props.primaryColor
                : '#EFF2F4'
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
            props.activeChapter === 'fellowship' ? 'white' : props.primaryColor
          }
        />
        <Text
          style={[
            styles.chapterSelectText,
            {
              color:
                props.activeChapter === 'fellowship'
                  ? 'white'
                  : props.primaryColor,
              fontFamily: props.font + '-black'
            }
          ]}
        >
          {props.translations.play.fellowship}
        </Text>
      </TouchableOpacity>

      {/* chapter 2 button (defined earlier) */}
      {storyButton}

      {trainingButton}

      {/* chapter 3 button */}
      <TouchableOpacity
        style={[
          styles.chapterSelect,
          {
            borderColor: props.primaryColor,
            backgroundColor:
              props.activeChapter === 'application'
                ? props.primaryColor
                : '#EFF2F4'
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
            props.activeChapter === 'application' ? 'white' : props.primaryColor
          }
        />
        <Text
          style={[
            styles.chapterSelectText,
            {
              color:
                props.activeChapter === 'application'
                  ? 'white'
                  : props.primaryColor,
              fontFamily: props.font + '-black'
            }
          ]}
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
