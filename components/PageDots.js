import React from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
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
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),
    primaryColor: activeDatabaseSelector(state).primaryColor
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

const Dot = ({ isActive, primaryColor }) => (
  <View
    style={{
      marginHorizontal: 5,
      backgroundColor: isActive ? colors.tuna : colors.chateau,
      width: isActive ? 14 * scaleMultiplier : 7 * scaleMultiplier,
      height: isActive ? 9 * scaleMultiplier : 7 * scaleMultiplier,
      borderRadius: isActive ? 4.5 * scaleMultiplier : 3.5 * scaleMultiplier
    }}
  />
)

/**
 *
 */
const PageDots = ({
  // Props passed from a parent component.
  numDots,
  activeDot,
  // Props passed from redux
  activeGroup,
  activeDatabase,
  isRTL,
  font,
  primaryColor
}) => {
  var dots = []

  console.log(activeDot)

  for (i = 1; i < numDots + 1; i++) {
    dots.push(<Dot isActive={activeDot === i} key={i} />)
  }
  return (
    <View
      style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center'
      }}
    >
      {dots}
    </View>
  )
}

const styles = StyleSheet.create({})

export default connect(mapStateToProps, mapDispatchToProps)(PageDots)
