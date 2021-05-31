// import SvgUri from 'expo-svg-uri'
import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'

function mapStateToProps (state) {
  return {
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    font: getLanguageFont(activeGroupSelector(state).language),

    t: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL,
    primaryColor: activeDatabaseSelector(state).primaryColor
  }
}

/**
 *
 */
const LessonTextScrollBar = ({
  // Props passed from a parent component.
  scrollBarPosition,
  scrollBarXPosition,
  scrollBarSize,
  onGestureEvent,
  onHandlerStateChange,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  font,

  t,
  isRTL,
  primaryColor
}) => (
  <PanGestureHandler
    onHandlerStateChange={onHandlerStateChange}
    onGestureEvent={onGestureEvent}
  >
    <Animated.View
      style={{
        transform: [
          { translateY: scrollBarPosition },
          { translateX: scrollBarXPosition }
        ]
      }}
    >
      <View
        style={[
          styles.scrollBar,
          {
            // backgroundColor: primaryColor,
            height: scrollBarSize,
            width: scrollBarSize,
            borderRadius: scrollBarSize / 2,
            flexDirection: isRTL ? 'row-reverse' : 'row',
            marginLeft: 20
            // marginRight: isRTL ? 20 : 0
          }
        ]}
      >
        <View
          style={{
            flex: 1.5,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 5,
              borderLeftColor: 'transparent',
              borderRightWidth: 5,
              borderRightColor: 'transparent',
              borderBottomWidth: 6,
              borderBottomColor: colors.white
            }}
          />
          <View style={{ height: 5 }} />
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 5,
              borderLeftColor: 'transparent',
              borderRightWidth: 5,
              borderRightColor: 'transparent',
              borderTopWidth: 6,
              borderTopColor: colors.white
            }}
          />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </Animated.View>
  </PanGestureHandler>
)

const styles = StyleSheet.create({
  scrollBar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.tuna,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    shadowColor: '#000',
    elevation: 4,

    marginBottom: 20
  }
})

export default connect(mapStateToProps)(LessonTextScrollBar)
