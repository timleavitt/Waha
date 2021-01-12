import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { connect } from 'react-redux'
import Icon from '../../assets/fonts/icons'
import SVG from '../../assets/svg.js'
import {
  colors,
  getLanguageFont,
  getSetInfo,
  itemHeights,
  scaleMultiplier
} from '../../constants'
import MessageModal from '../../modals/MessageModal'
import { addSet } from '../../redux/actions/groupsActions'
import { StandardTypography } from '../../styles/typography'
function SetItem ({
  // passed from parent
  mode,
  thisSet,
  onSetSelect,
  // passed from redux
  isRTL,
  activeDatabase,
  primaryColor,
  font,
  activeGroup,
  translations,
  addSet
}) {
  //+ STATE

  // keeps track of the number of completed lessons in this set
  const [progressPercentage, setProgressPercentage] = useState(0)

  // keeps track of the number of total lessons in a set
  const [numLessons, setNumLessons] = useState(1)

  // keeps track of whether the set is fully completed or not
  const [fullyCompleted, setFullyCompleted] = useState(false)

  const [showUnlockModal, setShowUnlockModal] = useState(false)

  // dynamic set components
  const [icon, setIcon] = useState()
  const [action, setAction] = useState()

  //+ CONSTRUCTOR

  //- sets components of the set items based on the type prop
  useEffect(() => {
    // big switch statement that renders the 2 dynamic components (the big icon,
    // and the action button) of a set item based on mode
    // 1. SHOWN is for sets that have been added to the set screen
    // 2. LESSONLIST is for the set component on the lesson list screen
    // 3. ADDSET is for sets that have not been added and live on the add set screen
    // 4. SETINFO is for the set on the top of the setinfo screen

    switch (mode) {
      case 'shown':
        setProgress()
        setIcon(
          <View style={styles.iconContainer}>
            <AnimatedCircularProgress
              size={78 * scaleMultiplier}
              width={7 * scaleMultiplier}
              fill={progressPercentage * 100}
              tintColor={fullyCompleted ? primaryColor + '50' : primaryColor}
              rotation={0}
              backgroundColor={colors.white}
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
                    name={thisSet.iconName}
                    width={70 * scaleMultiplier}
                    height={70 * scaleMultiplier}
                    fill={fullyCompleted ? colors.chateau : colors.shark}
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
                color={colors.chateau}
              />
            </View>
          ) : (
            <View style={styles.actionContainer}>
              <Icon
                name={
                  thisSet.id === activeGroup.setBookmark
                    ? isRTL
                      ? 'triangle-left'
                      : 'triangle-right'
                    : null
                }
                size={30 * scaleMultiplier}
                color={primaryColor}
              />
            </View>
          )
        )
        break
      case 'lessons_screen':
        setProgress()
        setIcon(
          <View style={styles.iconContainer}>
            <AnimatedCircularProgress
              size={78 * scaleMultiplier}
              width={7 * scaleMultiplier}
              fill={progressPercentage * 100}
              tintColor={fullyCompleted ? primaryColor + '50' : primaryColor}
              rotation={0}
              backgroundColor={colors.white}
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
                    name={thisSet.iconName}
                    width={70 * scaleMultiplier}
                    height={70 * scaleMultiplier}
                    fill={fullyCompleted ? colors.chateau : colors.shark}
                  />
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        )
        setAction(<View style={styles.actionContainer} />)
        break
      case 'addset_screen':
        setIcon(
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.white,
                borderRadius: 14,
                overflow: 'hidden',
                borderWidth: 7,
                borderColor: colors.tuna
              }
            ]}
          >
            <SVG
              name={thisSet.iconName}
              width={80 * scaleMultiplier}
              height={80 * scaleMultiplier}
              fill={colors.tuna}
            />
          </View>
        )
        setAction(
          <View style={styles.actionContainer}>
            <Icon
              name={isRTL ? 'arrow-left' : 'arrow-right'}
              size={30 * scaleMultiplier}
              color={primaryColor}
            />
          </View>
        )
        break
      case 'setinfo_modal':
        setIcon(
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.white,
                borderRadius: 14,
                overflow: 'hidden',
                borderWidth: 7,
                borderColor: colors.tuna
              }
            ]}
          >
            <SVG
              name={thisSet.iconName}
              width={80 * scaleMultiplier}
              height={80 * scaleMultiplier}
              fill={colors.tuna}
            />
          </View>
        )
        setAction(<View style={styles.actionContainer} />)
        break
    }
  }, [
    // need to rerender the sets whenever any progress, bookmarks, or RTL
    //  changes
    progressPercentage,
    fullyCompleted,
    activeGroup.setBookmark,
    activeGroup.addedSets,
    isRTL
  ])

  //- sets the progress through this set
  function setProgress () {
    var setLength = thisSet.lessons.length
    // set the percentage through a set
    setProgressPercentage(
      activeGroup.addedSets.filter(set => set.id === thisSet.id)[0].progress
        .length / setLength
    )
  }

  //- whenever progress changes for a set, handle the changes
  useEffect(() => {
    progressCases()
  }, [progressPercentage])

  //- handles special cases regarding changes in progress
  function progressCases () {
    // if it's fully completed, set fully completed to true, which renders
    // the shown and lessonlist variants as grayed out
    if (progressPercentage === 1) {
      setFullyCompleted(true)
    } else setFullyCompleted(false)

    // get the set AFTER the one that you're setting progress for
    var nextSet = activeDatabase.sets.filter(
      dbSet =>
        getSetInfo('category', dbSet.id) === 'foundational' &&
        getSetInfo('index', dbSet.id) === getSetInfo('index', thisSet.id) + 1
    )[0]

    // we want to automatically add the next set if the next set exists AND
    if (nextSet) {
      if (
        // we've completed 85% of a set AND
        progressPercentage > 0.85 &&
        // this set is a core set AND
        getSetInfo('category', thisSet.id) === 'foundational' &&
        // the next set after this one hasn't already been added AND
        !activeGroup.addedSets.some(addedSet => addedSet.id === nextSet.id)
      ) {
        addSet(
          activeGroup.name,
          activeDatabase.sets
            .filter(set => getSetInfo('category', set.id) === 'foundational')
            .filter(
              set =>
                getSetInfo('index', set.id) ===
                getSetInfo('index', thisSet.id) + 1
            )[0]
        )
        setShowUnlockModal(true)
      }
    }
  }

  //+ RENDER

  return (
    <TouchableOpacity
      style={[
        styles.studySetItem,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          height: itemHeights[font].SetItem
        }
      ]}
      onPress={onSetSelect}
      // disable feedback if there's no onSetSelect
      activeOpacity={onSetSelect ? 0.2 : 1}
    >
      {/* large icon rendered earlier */}
      {icon}

      {/* title and subtitle */}
      <View
        style={[
          styles.titleContainer,
          {
            marginRight: isRTL ? 20 : 0,
            marginLeft: isRTL ? 0 : 20
          }
        ]}
      >
        <Text
          style={[
            StandardTypography(
              { font, isRTL },
              'd',
              'Regular',
              'left',
              fullyCompleted ? colors.chateau : colors.shark
            ),
            {
              textAlignVertical: 'center',
              flexWrap: 'wrap'
            }
          ]}
          numberOfLines={1}
        >
          {thisSet.subtitle}
        </Text>
        <Text
          style={[
            StandardTypography(
              { font, isRTL },
              'h3',
              'Black',
              'left',
              fullyCompleted ? colors.chateau : colors.shark
            ),
            {
              textAlignVertical: 'center',
              flexWrap: 'wrap'
            }
          ]}
          numberOfLines={2}
        >
          {thisSet.title}
        </Text>
      </View>

      {/* action button rendered earlier */}
      {action}
      <MessageModal
        isVisible={showUnlockModal}
        hideModal={() => setShowUnlockModal(false)}
        title={translations.general.popups.new_story_set_unlocked_title}
        body={translations.general.popups.new_story_set_unlocked_message}
        confirmText={translations.general.got_it}
        confirmOnPress={() => setShowUnlockModal(false)}
      >
        <Image
          source={require('../../assets/gifs/new_set.gif')}
          style={{
            height: 200 * scaleMultiplier,
            margin: 20,
            // padding: 20,
            resizeMode: 'contain'
          }}
        />
      </MessageModal>
    </TouchableOpacity>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  studySetItem: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    // height: 100 * scaleMultiplier,
    // aspectRatio: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
    // borderWidth: 1
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

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    activeDatabase: state.database[activeGroup.language],
    primaryColor: state.database[activeGroup.language].primaryColor,
    font: getLanguageFont(activeGroup.language),
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addSet: (groupName, set) => {
      dispatch(addSet(groupName, set))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetItem)
