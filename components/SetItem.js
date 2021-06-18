// import SvgUri from 'expo-svg-uri'
import React, { useEffect, useState } from 'react'
import {
  Animated,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { connect } from 'react-redux'
import Icon from '../assets/fonts/icon_font_config'
import {
  isTablet,
  itemHeights,
  scaleMultiplier,
  setItemModes
} from '../constants'
import { addSet } from '../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'
import SVG from './SVG.js'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    activeDatabase: activeDatabaseSelector(state),
    primaryColor: activeDatabaseSelector(state).primaryColor,
    font: getLanguageFont(activeGroupSelector(state).language),
    activeGroup: activeGroupSelector(state),
    t: activeDatabaseSelector(state).translations
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
 * @param {string} mode - The mode of the set item. The set item is rendered slightly different on all the different screens it's used in. See setItemModes in constants.js.
 * @param {Function} onSetSelect - A function to fire when the set item is pressed. Can be null to make the item non-pressable.
 * @param {number} progressPercentage - The percentage of this set that has been completed.
 */
const SetItem = ({
  // Props passed from a parent component.
  thisSet,
  mode,
  onSetSelect,
  progressPercentage = null,
  setIsInInfoMode = null,
  isInInfoMode = null,
  // Props passed from redux.
  isRTL,
  activeDatabase,
  primaryColor,
  font,
  activeGroup,
  t,
  addSet
}) => {
  // console.log(`${Date.now()} Set ${thisSet.id} is re-rendering.`)

  useEffect(() => {
    if (Platform.OS === 'android' && mode === setItemModes.LESSONS_SCREEN) {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true)
      }
    }
  }, [])

  /** Stores the dynamic primary icon portion of the SetItem component. This contains a unique SVG that represents the set and changes between modes. */
  const [primaryIcon, setPrimaryIcon] = useState()

  /** Stores the dynamic secondary icon portion of the SetItem component. This is a smaller icon on the opposite side from the primary icon and changes between modes as well. */
  const [secondaryIcon, setSecondaryIcon] = useState()

  const [iconRotation, setIconRotation] = useState(new Animated.Value(0))

  useEffect(() => {
    if (isInInfoMode)
      Animated.spring(iconRotation, {
        toValue: 1
      }).start()
    else
      Animated.spring(iconRotation, {
        toValue: 0
      }).start()
  }, [isInInfoMode])

  /**
   * useEffect function that sets the dynamic primary and secondary icon components of the set item based on the screen prop. Updated whenever the active group or progress changes.
   */
  useEffect(() => {
    switch (mode) {
      case setItemModes.SETS_SCREEN:
        // Primary icon for the SetItem on the Sets screen is a circular progress bar with the set's SVG inside.
        setPrimaryIcon(
          <View style={styles.primaryIconContainer}>
            <AnimatedCircularProgress
              size={78 * scaleMultiplier}
              width={7 * scaleMultiplier}
              fill={progressPercentage * 100}
              tintColor={
                progressPercentage === 1 ? primaryColor + '50' : primaryColor
              }
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
                    color={
                      progressPercentage === 1 ? colors.chateau : colors.shark
                    }
                  />
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        )
        // Secondary icon for the SetItem on the Sets screen is a checkmark if the set is fully completed, a orange marker if this set is the bookmarked set, or nothing.
        setSecondaryIcon(
          progressPercentage === 1 ? (
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
      case setItemModes.LESSONS_SCREEN:
        // Primary icon for the SetItem on the Lessons screen is the same as on the Sets screen: a circular progress bar with the set's SVG inside.
        setPrimaryIcon(
          <View style={styles.primaryIconContainer}>
            <AnimatedCircularProgress
              size={78 * scaleMultiplier}
              width={7 * scaleMultiplier}
              fill={progressPercentage * 100}
              tintColor={
                progressPercentage === 1 ? primaryColor + '50' : primaryColor
              }
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
                    color={
                      progressPercentage === 1 ? colors.chateau : colors.shark
                    }
                  />
                </View>
              )}
            </AnimatedCircularProgress>
          </View>
        )
        // There is no secondary icon for the SetItem on the Lessons screen.
        setSecondaryIcon(
          <Animated.View
            style={{
              transform: [
                {
                  rotateZ: iconRotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                },
                {
                  // Keeps the rotation centered instead of around a pivot.
                  translateX: 2.5 * scaleMultiplier
                }
                // {
                //   translateY: 20 * scaleMultiplier
                // }
              ]
            }}
          >
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut
                )
                if (isInInfoMode) setIsInInfoMode(false)
                else setIsInInfoMode(true)
              }}
              style={styles.secondaryIconContainer}
            >
              {isInInfoMode ? (
                <Icon
                  name='dropdown'
                  size={35 * scaleMultiplier}
                  color={primaryColor}
                  style={{
                    transform: [{ rotateX: '180deg' }]
                  }}
                />
              ) : (
                <Icon
                  name='info'
                  size={25 * scaleMultiplier}
                  color={colors.tuna}
                />
              )}
            </TouchableOpacity>
          </Animated.View>
        )
        break
      case setItemModes.ADD_SET_SCREEN:
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
      case setItemModes.SET_INFO_MODAL:
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
  }, [progressPercentage, thisSet.id === activeGroup.setBookmark, isInInfoMode])

  return (
    <TouchableOpacity
      style={[
        styles.setItemContainer,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          height: isTablet
            ? itemHeights[font].SetItem + 15
            : itemHeights[font].SetItem
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
              progressPercentage === 1 ? colors.chateau : colors.shark
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
          adjustsFontSizeToFit
          style={[
            StandardTypography(
              { font, isRTL },
              'h3',
              'Black',
              'left',
              progressPercentage === 1 ? colors.chateau : colors.shark
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
    alignItems: 'center',
    width: 40 * scaleMultiplier,
    height: 40 * scaleMultiplier
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column'
  }
})

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.progressPercentage === nextProps.progressPercentage &&
    prevProps.activeGroup.setBookmark === nextProps.activeGroup.setBookmark &&
    prevProps.isInInfoMode === nextProps.isInInfoMode &&
    prevProps.setIsInInfoMode === nextProps.setIsInInfoMode
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(SetItem, areEqual))

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
