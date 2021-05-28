import React from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { analyticsMode, dbMode, reduxMode } from '../modeSwitch'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, SystemTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    font: getLanguageFont(activeGroupSelector(state).language),
    isTablet: state.deviceInfo.isTablet,
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

/**
 * This component displays some simple text that says "TEST MODE" whenever any of the modes in modeSwitch.js are set to "test". This is displayed in the corner on the opposite side of the group avatar on the SetsTabs screen.
 */
const TestModeDisplay = ({
  // Props passed from redux.
  font,
  isTablet,
  isRTL
}) => {
  return (
    <View
      style={{
        backgroundColor: colors.red,
        paddingVertical: 5,
        borderRadius: 15,
        marginHorizontal: 10
      }}
    >
      {dbMode === 'test' || reduxMode === 'test' || analyticsMode === 'test' ? (
        <Text
          style={[
            SystemTypography(false, 'd', 'Bold', 'center', colors.white),
            {
              paddingHorizontal: 10
            }
          ]}
        >
          test
        </Text>
      ) : null}
    </View>
  )
}

export default connect(mapStateToProps)(TestModeDisplay)
