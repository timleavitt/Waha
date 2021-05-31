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
      width: isActive ? 9 * scaleMultiplier : 7 * scaleMultiplier,
      height: isActive ? 9 * scaleMultiplier : 7 * scaleMultiplier,
      borderRadius: isActive ? 4.5 * scaleMultiplier : 3.5 * scaleMultiplier
    }}
  />
)

/**
 * Displays a number of dots corresponding to pages in a PagerView.
 * @param {number} numDots - The number of dots (i.e. number of pages) to display.
 * @param {number} activeDot - The currently active dot (i.e. page).
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
  // Array that holds the many dot components.
  var dots = []

  // Add a dot for each page.
  for (i = 1; i < numDots + 1; i++) {
    dots.push(
      <Dot
        // Whether a dot is active depends on whether the pages go from RTL or LTR. For RTL:
        isActive={isRTL ? numDots - activeDot === i : activeDot + 1 === i}
        key={i}
      />
    )
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
