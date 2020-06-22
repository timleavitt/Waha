import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import Icon from '../assets/fonts/icons'
import SVG from '../assets/svg.js'
import { addSet, setShowToolkit } from '../redux/actions/groupsActions'
import MessageModal from '../components/MessageModal'

function SetItem (props) {
  //// STATE

  // keeps track of the number of completed lessons in this set
  const [progressPercentage, setProgressPercentage] = useState(0)

  // keeps track of the number of total lessons in a set
  const [numLessons, setNumLessons] = useState(1)

  // keeps track of whether the set is fully completed or not
  const [fullyCompleted, setFullyCompleted] = useState(false)

  const [showUnlockModal, setShowUnlockModal] = useState(false)

  // dynamic set components
  const [icon, setIcon] = useState()
  const [info, setInfo] = useState()
  const [action, setAction] = useState()

  //// CONSTRUCTOR

  useEffect(() => {
    // big switch statement that renders the 3 dynamic components (the big icon,
    // the info button, and the action button) of a set item based on props.mode
    // 1. SHOWN is for sets that have been added to the set screen
    // 2. LESSONLIST is for the set component on the lesson list screen
    // 3. HIDDEN is for sets that have not been added and live on the add set screen
    // 4. FOLDER is for set folders in the add set screen

    switch (props.mode) {
      case 'shown':
        setProgress()
        setIcon(
          <View style={styles.iconContainer}>
            <AnimatedCircularProgress
              size={78 * scaleMultiplier}
              width={7 * scaleMultiplier}
              fill={progressPercentage * 100}
              tintColor={
                fullyCompleted ? props.primaryColor + '50' : props.primaryColor
              }
              rotation={0}
              backgroundColor='#FFFFFF'
            >
              {() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <SVG
                    name={props.thisSet.icon}
                    width={70 * scaleMultiplier}
                    height={70 * scaleMultiplier}
                    fill={fullyCompleted ? '#9FA5AD' : '#1D1E20'}
                  />
                </View>
              )}
            </AnimatedCircularProgress>
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
                name={
                  props.thisSet.id === props.activeGroup.setBookmark
                    ? props.isRTL
                      ? 'triangle-left'
                      : 'triangle-right'
                    : null
                }
                size={30 * scaleMultiplier}
                color={props.primaryColor}
              />
            </View>
          )
        )
        break
      case 'lessonlist':
        setProgress()
        setIcon(
          <View style={styles.iconContainer}>
            <AnimatedCircularProgress
              size={78 * scaleMultiplier}
              width={7 * scaleMultiplier}
              fill={progressPercentage * 100}
              tintColor={
                fullyCompleted ? props.primaryColor + '50' : props.primaryColor
              }
              rotation={0}
              backgroundColor='#FFFFFF'
            >
              {() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <SVG
                    name={props.thisSet.icon}
                    width={70 * scaleMultiplier}
                    height={70 * scaleMultiplier}
                    fill={fullyCompleted ? '#9FA5AD' : '#1D1E20'}
                  />
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        )
        setAction(<View style={styles.actionContainer} />)
        break
      case 'hidden':
        setIcon(
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                overflow: 'hidden',
                borderWidth: 7,
                borderColor: '#3A3C3F'
              }
            ]}
          >
            <SVG
              name={props.thisSet.icon}
              width={80 * scaleMultiplier}
              height={80 * scaleMultiplier}
              fill='#3A3C3F'
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
        setInfo()
        // INFO BUTTON (keep for later)
        // <TouchableOpacity
        //   style={[
        //     styles.actionContainer,
        //     {
        //       marginRight: props.isRTL ? 0 : 10,
        //       marginLeft: props.isRTL ? 10 : 0
        //     }
        //   ]}
        //   onPress={() => {}}
        // >
        //   <Icon name='info' size={30 * scaleMultiplier} color='#9FA5AD' />
        // </TouchableOpacity>
        break
      case 'folder':
        setIcon(
          <View style={styles.iconContainer}>
            <SVG
              name={props.thisSet.icon}
              width={80 * scaleMultiplier}
              height={80 * scaleMultiplier}
              fill='#1D1E20'
            />
          </View>
        )
        setAction(
          <View style={styles.actionContainer}>
            <Icon
              name={props.isRTL ? 'arrow-left' : 'arrow-right'}
              size={30 * scaleMultiplier}
              color={props.primaryColor}
            />
          </View>
        )
        setInfo()
        // INFO BUTTON (keep for later)
        // <TouchableOpacity
        //   style={[
        //     styles.actionContainer,
        //     {
        //       marginRight: props.isRTL ? 0 : 10,
        //       marginLeft: props.isRTL ? 10 : 0
        //     }
        //   ]}
        //   onPress={() => {}}
        // >
        //   <Icon name='info' size={30 * scaleMultiplier} color='#9FA5AD' />
        // </TouchableOpacity>
        break
    }
  }, [
    progressPercentage,
    fullyCompleted,
    props.activeGroup.setBookmark,
    props.activeGroup.addedSets,
    props.isRTL
  ])

  //// FUNCTIONS

  useEffect(() => {
    progressCases()
  }, [progressPercentage])

  function progressCases () {
    // if it's fully completed, set fully completed to true, which renders
    // the shown and lessonlist variants as grayed out
    if (progressPercentage === 1) setFullyCompleted(true)
    else setFullyCompleted(false)

    // get the set AFTER the one that you're setting progress for
    var nextSet = props.activeDatabase.sets.filter(
      dbSet =>
        dbSet.category === 'core' && dbSet.index === props.thisSet.index + 1
    )[0]

    // we want to automatically add the next set if the next set exists AND
    if (nextSet) {
      if (
        // we've completed 75% of a set AND
        progressPercentage > 0.85 &&
        // this set is a core set AND
        props.thisSet.category === 'core' &&
        // the next set after this one hasn't already been added AND
        !props.activeGroup.addedSets.some(
          addedSet => addedSet.id === nextSet.id
        )
      ) {
        props.addSet(
          props.activeGroup.name,
          props.activeDatabase.sets
            .filter(set => set.category === 'core')
            .filter(set => set.index === props.thisSet.index + 1)[0].id
        )
        showModal()
      }
    }
  }

  // sets the progress through this set
  function setProgress () {
    // set the percentage through a set
    setProgressPercentage(
      props.activeGroup.addedSets.filter(set => set.id === props.thisSet.id)[0]
        .progress.length / props.thisSet.length
    )
  }

  function showModal () {
    setShowUnlockModal(true)
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
      {/* large icon rendered earlier */}
      {icon}

      {/* title and subtitle */}
      <View
        style={[
          styles.titleContainer,
          {
            marginRight: props.isRTL ? 20 : 0,
            marginLeft: props.isRTL ? 0 : 20
          }
        ]}
      >
        <Text
          style={{
            color: fullyCompleted ? '#9FA5AD' : '#1D1E20',
            textAlign: props.isRTL ? 'right' : 'left',
            fontSize: 12 * scaleMultiplier,
            textAlignVertical: 'center',
            flexWrap: 'wrap',
            fontFamily: props.font + '-regular'
          }}
        >
          {props.thisSet.subtitle}
        </Text>
        <Text
          style={{
            color: fullyCompleted ? '#9FA5AD' : '#1D1E20',
            textAlign: props.isRTL ? 'right' : 'left',
            fontSize: 18 * scaleMultiplier,
            textAlignVertical: 'center',
            flexWrap: 'wrap',
            fontFamily: props.font + '-black'
          }}
        >
          {props.thisSet.title}
        </Text>
      </View>

      {/* info button rendered earlier */}
      {info}

      {/* action button rendered earlier */}
      {action}
      <MessageModal
        isVisible={showUnlockModal}
        hideModal={() => setShowUnlockModal(false)}
        title={props.translations.modals.storySetUnlock.header}
        body={props.translations.modals.storySetUnlock.text}
        imageSource={require('../assets/splash.png')}
      />
    </TouchableOpacity>
  )
}

//// STYLES

const styles = StyleSheet.create({
  studySetItem: {
    flexDirection: 'row',
    flex: 1,
    height: 100 * scaleMultiplier,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  iconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80 * scaleMultiplier,
    height: 80 * scaleMultiplier
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  actionContainer: {
    justifyContent: 'center',
    width: 30 * scaleMultiplier,
    height: 30 * scaleMultiplier
  }
})

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  console.log(activeGroup.addedSets)
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    activeDatabase: state.database[activeGroup.language],
    primaryColor: state.database[activeGroup.language].primaryColor,
    font: state.database[activeGroup.language].font,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addSet: (groupName, setID) => {
      dispatch(addSet(groupName, setID))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetItem)
