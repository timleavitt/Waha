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
    translations: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL
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
  translations,
  isRTL
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
            height: scrollBarSize,
            width: scrollBarSize,
            borderRadius: scrollBarSize / 2
          }
        ]}
      >
        <View
          style={{
            flex: 1,
            position: 'absolute',
            top: scrollBarSize / 6,
            left: scrollBarSize / 6,
            transform: [{ rotateZ: '270deg' }]
          }}
        >
          <Icon
            size={scrollBarSize / 2.5}
            name='triangle-right'
            color={colors.white}
          />
        </View>
        <View
          style={{
            flex: 1,
            position: 'absolute',
            bottom: scrollBarSize / 6,
            left: scrollBarSize / 6,
            transform: [{ rotateZ: '90deg' }]
          }}
        >
          <Icon
            size={scrollBarSize / 2.5}
            name='triangle-right'
            color={colors.white}
          />
        </View>
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
    marginLeft: 20,
    marginBottom: 20
  }
})

export default connect(mapStateToProps)(LessonTextScrollBar)
