// import { LinearGradient } from 'expo-linear-gradient'
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
 * A component that shows the title of a lesson on the Play Screen. Ticks across the screen if it's long and fades out at the edges of the screen.
 * @param {string} text - The text to display.
 * @param {string} backgroundColor - The color behind the Play Screen title. Important because the "fading out" at the edge of this component has to match the color behind it.
 */
const PlayScreenTitle = ({
  // Props passed from a parent component.
  text,
  backgroundColor,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  isRTL,
  font
}) => {
  console.log(`${Date.now()} Title re-rendering.`)
  return (
    <View style={styles.titleContainer}>
      {/* <View
      style={{
        // height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}
    > */}
      <Text
        style={[
          StandardTypography(
            { font, isRTL },
            'h3',
            'Black',
            'center',
            colors.shark
          ),
          {
            fontSize: 21 * scaleMultiplier
          }
        ]}
      >
        {text}
      </Text>
      {/* </View> */}
      {/* <LinearGradient
        colors={[backgroundColor, backgroundColor + '00']}
        start={[0, 1]}
        end={[1, 1]}
        style={styles.leftGradient}
      />
      <View
        style={[
          styles.leftGradientFiller,
          { backgroundColor: backgroundColor }
        ]}
      />
      <LinearGradient
        colors={[backgroundColor, backgroundColor + '00']}
        start={[1, 0]}
        end={[0, 0]}
        style={styles.rightGradient}
      />
      <View
        style={[
          styles.rightGradientFiller,
          { backgroundColor: backgroundColor }
        ]}
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    // width: Dimensions.get('window').width,
    width: '100%',
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
    // marginVertical: 15 * scaleMultiplier
  },
  rightGradient: {
    position: 'absolute',
    right: 0,
    width: 15,
    height: '100%',
    marginHorizontal: 10
  },
  leftGradient: {
    position: 'absolute',
    left: 0,
    width: 15,
    height: '100%',
    marginHorizontal: 10
  },
  rightGradientFiller: {
    position: 'absolute',
    right: 0,
    width: 10,
    height: '100%',
    backgroundColor: colors.white
  },
  leftGradientFiller: {
    position: 'absolute',
    left: 0,
    width: 10,
    height: '100%',
    backgroundColor: colors.white
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayScreenTitle)
