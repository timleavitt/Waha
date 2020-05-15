import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import Icon from '../assets/fonts/icons'
import SVG from '../assets/svg.js'

function SetItem (props) {
  //// STATE

  // keeps track of the number of completed lessons in this set
  const [numCompleted, setNumCompleted] = useState(0)

  // keeps track of the number of total lessons in a set
  const [numLessons, setNumLessons] = useState(1)

  // keeps track of whether the set is fully completed or not
  const [fullyCompleted, setFullyCompleted] = useState(false)

  // dynamic set components
  const [icon, setIcon] = useState()
  const [info, setInfo] = useState()
  const [action, setAction] = useState()

  //// CONSTRUCTOR

  useEffect(() => {
    setProgress()

    switch (props.mode) {
      case 'shown':
        setIcon(
          <View style={styles.iconContainer}>
            <AnimatedCircularProgress
              size={85 * scaleMultiplier}
              width={8 * scaleMultiplier}
              fill={(numCompleted / numLessons) * 100}
              tintColor={
                fullyCompleted ? props.primaryColor + '50' : props.primaryColor
              }
              rotation={0}
              backgroundColor='#FFFFFF'
            >
              {() => (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <SVG
                    // name={'set' + props.thisSet.index}
                    name={''}
                    width={70 * scaleMultiplier}
                    height={70 * scaleMultiplier}
                    fill={fullyCompleted ? '#9FA5AD' : '#1D1E20'}
                  />
                </View>
              )}
            </AnimatedCircularProgress>
            <View style={styles.percentageTextContainer}>
              <Text
                style={[
                  styles.percentageText,
                  { fontFamily: props.font + '-regular' }
                ]}
              >
                {Math.round((numCompleted / numLessons) * 100)}%
              </Text>
            </View>
          </View>
        )
        setAction(
          fullyCompleted ? (
            <View style={styles.actionContainer}>
              <Icon
                name='check-outline'
                size={30 * scaleMultiplier}
                color='#828282'
              />
            </View>
          ) : (
            <View style={styles.actionContainer}>
              <Icon
                name={props.isRTL ? 'triangle-left' : 'triangle-right'}
                size={37 * scaleMultiplier}
                color='#828282'
              />
            </View>
          )
        )
        break
      case 'small':
        setIcon(
          <View style={styles.iconContainer}>
            <AnimatedCircularProgress
              size={70 * scaleMultiplier}
              width={5 * scaleMultiplier}
              fill={(numCompleted / numLessons) * 100}
              tintColor={
                fullyCompleted ? props.primaryColor + '50' : props.primaryColor
              }
              rotation={0}
              backgroundColor='#FFFFFF'
            >
              {() => (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <SVG
                    // name={'set' + props.thisSet.index}
                    name={''}
                    width={60 * scaleMultiplier}
                    height={60 * scaleMultiplier}
                    fill={fullyCompleted ? '#9FA5AD' : '#1D1E20'}
                  />
                </View>
              )}
            </AnimatedCircularProgress>
            <View style={styles.percentageTextContainer}>
              <Text
                style={[
                  styles.percentageText,
                  { fontFamily: props.font + '-regular' }
                ]}
              >
                {Math.round((numCompleted / numLessons) * 100)}%
              </Text>
            </View>
          </View>
        )
        setAction(null)
        break
      case 'hidden':
        setIcon(
          <View style={[styles.iconContainer, { backgroundColor: '#1D1E20' }]}>
            <SVG
              // name={'set' + props.thisSet.index}
              name={''}
              width={101 * scaleMultiplier}
              height={101 * scaleMultiplier}
              fill='#FFFFFF'
            />
          </View>
        )
        setAction(
          <View style={styles.actionContainer}>
            <Icon
              name='playlist-add'
              size={30 * scaleMultiplier}
              color={props.primaryColor}
            />
          </View>
        )
        break
      case 'folder':
        setIcon(
          <View style={[styles.iconContainer, { backgroundColor: '#1D1E20' }]}>
            <SVG
              // name={'set' + props.thisSet.index}
              name={''}
              width={101 * scaleMultiplier}
              height={101 * scaleMultiplier}
              fill='#FFFFFF'
            />
          </View>
        )
        setAction(
          <View style={styles.actionContainer}>
            <Icon
              name={props.isRTL ? 'arrow-left' : 'arrow-right'}
              size={40 * scaleMultiplier}
              color={props.primaryColor}
            />
          </View>
        )
        break
    }
  }, [numCompleted, fullyCompleted])

  useEffect(() => {
    setProgress()
  }, [props.activeProgress])

  //// FUNCTIONS

  function setProgress () {
    for (const set of props.activeDatabase.sets) {
      if (set.id === props.thisSet.id) {
        setNumLessons(set.length)
      }
    }

    setNumCompleted(0)
    for (const lessonIndex of props.activeProgress) {
      if (
        props.activeDatabase.lessons.filter(
          lesson => lesson.index === lessonIndex
        )[0].setid === props.thisSet.id
      ) {
        setNumCompleted(numCompleted => numCompleted + 1)
      }
    }
    if (numCompleted === numLessons) {
      setFullyCompleted(true)
    } else {
      setFullyCompleted(false)
    }
  }

  //// RENDER

  return (
    <TouchableOpacity
      style={[
        styles.studySetItem,
        { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
      ]}
      onPress={props.onSetSelect}
    >
      {icon}
      <View style={styles.titleContainer}>
        <Text
          style={{
            color: fullyCompleted ? '#9FA5AD' : '#1D1E20',
            textAlign: props.isRTL ? 'right' : 'left',
            fontSize: props.isSmall
              ? 14 * scaleMultiplier
              : 12 * scaleMultiplier,
            textAlignVertical: 'center',
            flexWrap: 'wrap',
            fontFamily: props.font + '-regular'
          }}
        >
          {props.thisSet.subtitle}
        </Text>
        <Text
          style={{
            color: fullyCompleted ? '#9FA5AD' : '#3A3C3F',
            textAlign: props.isRTL ? 'right' : 'left',
            fontSize: props.isSmall
              ? 24 * scaleMultiplier
              : 18 * scaleMultiplier,
            textAlignVertical: 'center',
            flexWrap: 'wrap',
            fontFamily: props.font + '-black'
          }}
        >
          {props.thisSet.title}
        </Text>
      </View>
      {action}
    </TouchableOpacity>
  )
}

//// STYLES

const styles = StyleSheet.create({
  studySetItem: {
    flexDirection: 'row',
    flex: 1,
    height: 101 * scaleMultiplier,
    marginHorizontal: 5,
    marginTop: 10,
    justifyContent: 'center'
  },
  iconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 5
  },
  percentageTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5
  },
  percentageText: {
    color: '#9FA5AD',
    fontSize: 10
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 5
  },
  actionContainer: {
    justifyContent: 'center',
    marginRight: 15
  }
})

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    activeProgress: activeGroup.progress,
    isRTL: state.database[activeGroup.language].isRTL,
    activeDatabase: state.database[activeGroup.language],
    primaryColor: state.database[activeGroup.language].primaryColor,
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(SetItem)
