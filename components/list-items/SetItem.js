// import SvgUri from 'expo-svg-uri'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { connect } from 'react-redux'
import Icon from '../../assets/fonts/icon_font_config'
import { getSetInfo, itemHeights, scaleMultiplier } from '../../constants'
import MessageModal from '../../modals/MessageModal'
import { addSet } from '../../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../../redux/reducers/activeGroup'
import { colors } from '../../styles/colors'
import { getLanguageFont, StandardTypography } from '../../styles/typography'
import SVG from '../SVG.js'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    activeDatabase: activeDatabaseSelector(state),
    primaryColor: activeDatabaseSelector(state).primaryColor,
    font: getLanguageFont(activeGroupSelector(state).language),
    activeGroup: activeGroupSelector(state),
    translations: activeDatabaseSelector(state).translations
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addSet: (groupName, groupID, set) => {
      dispatch(addSet(groupName, groupID, set))
    }
  }
}

/**
 * A component that displays a set. Used on a variety of screens and displayed in a variety of ways depending on the mode prop.
 * @param {Object} thisSet - The object for the set to display.
 * @param {string} screen - The screen that the SetItem is used on. The set item is rendered slightly different on all the different screens it's used in. The options are: 1) Sets, 2) Lessons, 3) AddSet, and 4) SetInfo. The varieties used on each screen are described below.
 * @param {Function} onSetSelect - A function to fire when the set item is pressed. Can be null to make the item non-pressable.
 */
function SetItem ({
  // Props passed from a parent component.
  thisSet,
  screen,
  onSetSelect,
  // Props passed from redux.
  isRTL,
  activeDatabase,
  primaryColor,
  font,
  activeGroup,
  translations,
  addSet
}) {
  /** Stores the dynamic primary icon portion of the SetItem component. This contains a unique SVG that represents the set and changes between modes. */
  const [primaryIcon, setPrimaryIcon] = useState()

  /** Stores the dynamic secondary icon portion of the SetItem component. This is a smaller icon on the opposite side from the primary icon and changes between modes as well. */
  const [secondaryIcon, setSecondaryIcon] = useState()

  /** Keeps track of the user's progress through this set. */
  const [thisSetProgress, setThisSetProgress] = useState(0)

  /** Keeps track of whether this set is fully completed or not. */
  const [fullyCompleted, setFullyCompleted] = useState(false)

  /** Keeps track of whether the unlock modal is visible. */
  const [showUnlockModal, setShowUnlockModal] = useState(false)

  /**
   * useEffect function that sets the dynamic primary and secondary icon components of the set item based on the screen prop. Updated whenever the active group or progress changes.
   */
  useEffect(() => {
    switch (screen) {
      case 'Sets':
        updateThisSetProgress()
        // Primary icon for the SetItem on the Sets screen is a circular progress bar with the set's SVG inside.
        setPrimaryIcon(
          <View style={styles.primaryIconContainer}>
            <AnimatedCircularProgress
              size={78 * scaleMultiplier}
              width={7 * scaleMultiplier}
              fill={thisSetProgress * 100}
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
                    color={fullyCompleted ? colors.chateau : colors.shark}
                  />
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        )
        // Secondary icon for the SetItem on the Sets screen is a checkmark if the set is fully completed, a orange marker if this set is the bookmarked set, or nothing.
        setSecondaryIcon(
          fullyCompleted ? (
            <View style={styles.secondaryIconContainer}>
              <Icon
                name='check-outline'
                size={30 * scaleMultiplier}
                color={colors.chateau}
              />
            </View>
          ) : (
            <View style={styles.secondaryIconContainer}>
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
      case 'Lessons':
        updateThisSetProgress()
        // Primary icon for the SetItem on the Lessons screen is the same as on the Sets screen: a circular progress bar with the set's SVG inside.
        setPrimaryIcon(
          <View style={styles.primaryIconContainer}>
            <AnimatedCircularProgress
              size={78 * scaleMultiplier}
              width={7 * scaleMultiplier}
              fill={thisSetProgress * 100}
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
                    color={fullyCompleted ? colors.chateau : colors.shark}
                  />
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        )
        // There is no secondary icon for the SetItem on the Lessons screen.
        setSecondaryIcon(<View style={styles.secondaryIconContainer} />)
        break
      case 'AddSet':
        // Primary icon for the SetItem on the AddSet screen is a slightly altered version of the set's SVG without any progress shown.
        setPrimaryIcon(
          <View
            style={[
              styles.primaryIconContainer,
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
              color={colors.tuna}
            />
          </View>
        )
        // Secondary icon for the SetItem on the AddSet screen is a small sideways arrow inviting the user to click on the item to open up a new screen in order to add it.
        setSecondaryIcon(
          <View style={styles.secondaryIconContainer}>
            <Icon
              name={isRTL ? 'arrow-left' : 'arrow-right'}
              size={30 * scaleMultiplier}
              color={primaryColor}
            />
          </View>
        )
        break
      case 'SetInfo':
        // Primary icon for the SetItem on the SetInfo modal screen is similar to the one on the AddSet screen, with some slightly style variations.
        setPrimaryIcon(
          <View
            style={[
              styles.primaryIconContainer,
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
              color={colors.tuna}
            />
          </View>
        )
        // There is no secondary icon for the SetItem on the SetInfo modal screen.
        setSecondaryIcon(<View style={styles.secondaryIconContainer} />)
        break
    }
  }, [thisSetProgress, fullyCompleted, activeGroup])

  /**
   * Updates the thisSetProgress state.
   */
  function updateThisSetProgress () {
    setThisSetProgress(
      activeGroup.addedSets.filter(set => set.id === thisSet.id)[0].progress
        .length / thisSet.lessons.length
    )
  }

  /** useEffect function that updates whenever this set's progress changes and handles the changes appropriately. */
  useEffect(() => {
    // If this set is fully completed, set the fullyCompleted state to true. This makes the set components grayed out.
    if (thisSetProgress === 1) setFullyCompleted(true)
    else setFullyCompleted(false)

    /* 
    Next, we want to see if we need to automatically add the next set. The criteria for this happening is: 
      1) The Foundational set after this one exists
      2) This set is 85% or more complete
      3) This set is Foundational
      4) The Foundational set after this one hasn't already been added
    */

    // Firstly, we need to get the set after this one before we can do anything else.
    var nextSet = activeDatabase.sets.filter(
      dbSet =>
        getSetInfo('category', dbSet.id) === 'foundational' &&
        getSetInfo('index', dbSet.id) === getSetInfo('index', thisSet.id) + 1
    )[0]

    // If all of the above criteria are met, add the next set and show a modal notifying the user.
    if (nextSet) {
      if (
        thisSetProgress > 0.85 &&
        getSetInfo('category', thisSet.id) === 'foundational' &&
        !activeGroup.addedSets.some(addedSet => addedSet.id === nextSet.id)
      ) {
        addSet(
          activeGroup.name,
          activeGroup.id,
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
  }, [thisSetProgress])

  return (
    <TouchableOpacity
      style={[
        styles.setItemContainer,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          height: itemHeights[font].SetItem
        }
      ]}
      onPress={onSetSelect}
      // Disable the touch feedback if there's no onSetSelect function.
      activeOpacity={onSetSelect ? 0.2 : 1}
    >
      {primaryIcon}
      <View
        style={[
          styles.textContainer,
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
      {secondaryIcon}
      {/* Modals */}
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
            resizeMode: 'contain'
          }}
        />
      </MessageModal>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  setItemContainer: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  primaryIconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80 * scaleMultiplier,
    height: 80 * scaleMultiplier
  },
  secondaryIconContainer: {
    justifyContent: 'center',
    width: 30 * scaleMultiplier,
    height: 30 * scaleMultiplier
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SetItem)

/* <SvgUri
source={{
  uri: ''
}}
width={70 * scaleMultiplier}
height={70 * scaleMultiplier}
// fill={fullyCompleted ? colors.chateau : colors.shark}
fill={colors.chateau}
fillAll
/>  */
