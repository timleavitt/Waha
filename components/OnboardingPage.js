import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),
    isTablet: state.deviceInfo.isTablet
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

/**
 * A component that's used for a single onboarding page in the various onboarding slides used in Waha.
 * @param {string} title - The title to display on the page.
 * @param {string} message - The message to display on the page.
 * @param {Component} children - Child components to render on the page.
 */
const OnboardingPage = ({
  // Props passed from a parent component.
  title,
  message,
  children,
  // Props passed from redux.
  isRTL,
  font,
  isTablet
}) => (
  <View style={styles.onboardingPageContainer}>
    <View style={styles.textContainer}>
      <Text
        style={[
          StandardTypography(
            { font, isRTL, isTablet },
            'h2',
            'Bold',
            'center',
            colors.shark
          ),
          { fontSize: 24 * scaleMultiplier }
        ]}
      >
        {title}
      </Text>
      <View style={{ height: 15 * scaleMultiplier }} />
      <Text
        style={StandardTypography(
          { font, isRTL, isTablet },
          'h3',
          'Regular',
          'center',
          colors.chateau
        )}
      >
        {message}
      </Text>
    </View>
    {children}
  </View>
)

const styles = StyleSheet.create({
  onboardingPageContainer: {
    // flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.aquaHaze
  },
  textContainer: {
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25 * scaleMultiplier
  },
  childrenContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'green'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingPage)
