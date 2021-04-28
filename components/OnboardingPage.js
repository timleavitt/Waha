import React, { useEffect, useState } from 'react'
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
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language)
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

/**
 *
 */
function OnboardingPage ({
  // Props passed from a parent component.
  title,
  message,
  children,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  isRTL,
  font
}) {
  const [state, setState] = useState()
  useEffect(() => {}, [])
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <View style={styles.textContainer}>
        <Text
          style={[
            StandardTypography(
              { font, isRTL },
              'h2',
              'Bold',
              'center',
              colors.shark
            ),
            {
              fontSize: 24
            }
          ]}
        >
          {title}
        </Text>
        <View style={{ height: 20 * scaleMultiplier }} />
        <Text
          style={StandardTypography(
            { font, isRTL },
            'h3',
            'Regular',
            'center',
            colors.chateau
          )}
        >
          {message}
        </Text>
      </View>
      {/* <View style={styles.childrenContainer}>
        <View style={{ width: '100%', backgroundColor: 'blue' }}> */}
      {children}
      {/* </View>
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
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
    // maxHeight: Dimensions.get('window').width - 60,
    backgroundColor: 'green'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingPage)
