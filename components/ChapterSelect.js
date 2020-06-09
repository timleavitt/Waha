import React from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { scaleMultiplier } from '../constants'

function ChapterSelect (props) {
  // RENDER

  // render chapter 2 icon conditionally based off if it's not active, active, or completed
  var chapter2IconName
  if (props.activeChapter === 'fellowship') {
    chapter2IconName = 'number-2-filled'
  } else if (props.activeChapter === 'passage') {
    chapter2IconName = 'number-2-outline'
  } else {
    chapter2IconName = 'check-filled'
  }

  // render chapter 2 button
  var chapter2Button =
    props.downloads[props.lessonID] && props.downloads[props.lessonID] < 1 ? (
      // if the lesson is downloading, show the progress in the chapter button
      <View
        style={[
          styles.chapterSelect,
          {
            flexDirection: 'row',
            borderColor: '#82868D',
            backgroundColor: '#EFF2F4'
          }
        ]}
      >
        <AnimatedCircularProgress
          size={20}
          width={4}
          filled={props.downloads[props.lessonID] * 100}
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
          {props.translations.labels.passage}
        </Text>
      </View>
    ) : (
      // otherwise, show the button as normal
      <TouchableOpacity
        style={[
          styles.chapterSelect,
          {
            borderColor: props.primaryColor,
            backgroundColor:
              props.activeChapter === 'passage' ? props.primaryColor : '#EFF2F4'
          }
        ]}
        onPress={
          props.hasAudioSource
            ? () => props.onPress('passage')
            : () => {
                props.onPress('passage')
                props.goToScripture()
              }
        }
      >
        <Icon
          name={chapter2IconName}
          size={25}
          color={
            props.activeChapter === 'passage' ? 'white' : props.primaryColor
          }
        />
        <Text
          style={[
            styles.chapterSelectText,
            {
              color:
                props.activeChapter === 'passage'
                  ? 'white'
                  : props.primaryColor,
              fontFamily: props.font + '-black'
            }
          ]}
        >
          {props.translations.labels.passage}
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
          size={25}
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
          {props.translations.labels.fellowship}
        </Text>
      </TouchableOpacity>

      {/* chapter 2 button (defined earlier) */}
      {chapter2Button}

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
            props.activeChapter === 'application'
              ? 'number-3-outline'
              : 'number-3-filled'
          }
          size={25}
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
          {props.translations.labels.application}
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
    flexDirection: 'row',
    alignItems: 'center',
    height: 50 * scaleMultiplier,
    justifyContent: 'center',
    borderWidth: 2
  },
  chapterSelectText: {
    fontSize: 16 * scaleMultiplier
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
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(ChapterSelect)
