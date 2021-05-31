// import SvgUri from 'expo-svg-uri'
import React from 'react'
import { Animated, StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import { gutterSize } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    font: getLanguageFont(activeGroupSelector(state).language),

    t: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

/**
 *
 */
const LessonTextSectionHeader = ({
  // Props passed from a parent component.
  sectionHeaderYTransform,
  sectionHeaderOpacity,
  sectionTitleText,
  sectionSubtitleText,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  font,

  t,
  isRTL
}) => (
  <Animated.View
    style={[
      styles.sectionHeaderContainer,
      {
        flexDirection: isRTL ? 'row-reverse' : 'row',
        opacity: sectionHeaderOpacity,
        transform: [{ translateY: sectionHeaderYTransform }]
      }
    ]}
  >
    <Text>
      <Text
        style={StandardTypography(
          { font, isRTL },
          'h2',
          'Black',
          'left',
          colors.shark
        )}
      >
        {sectionTitleText}
      </Text>
      {sectionSubtitleText !== '' && (
        <Text
          style={[
            StandardTypography(
              { font, isRTL },
              'h3',
              'Regular',
              'left',
              colors.oslo
            )
          ]}
        >
          {` / `}
        </Text>
      )}
      {sectionSubtitleText !== '' && (
        <Text
          style={[
            StandardTypography(
              { font, isRTL },
              'h3',
              'Regular',
              'left',
              colors.oslo
            )
          ]}
        >
          {sectionSubtitleText}
        </Text>
      )}
    </Text>
  </Animated.View>
)

const styles = StyleSheet.create({
  sectionHeaderContainer: {
    width: '100%',
    // backgroundColor: colors.blue,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingHorizontal: gutterSize,
    paddingVertical: 10,
    zIndex: 1
  }
})

export default connect(mapStateToProps)(LessonTextSectionHeader)
