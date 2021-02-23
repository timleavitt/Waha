import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
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
    font: getLanguageFont(activeGroupSelector(state).language),
    isRTL: activeDatabaseSelector(state).isRTL,
    activeGroup: activeGroupSelector(state)
  }
}

// button rendered on the options modal component
function OptionsModalButton ({
  onPress,
  style,
  title,
  children = null,
  font,
  isRTL,
  activeGroup
}) {
  return (
    <TouchableOpacity style={styles.modalButtonStyle} onPress={onPress}>
      <Text
        style={[
          style,
          StandardTypography(
            { font, isRTL },
            'h3',
            'Regular',
            'center',
            colors.shark
          )
        ]}
      >
        {title}
      </Text>
      {children}
    </TouchableOpacity>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  modalButtonStyle: {
    width: '100%',
    height: 70 * scaleMultiplier,
    justifyContent: 'center',
    borderBottomColor: colors.athens,
    alignItems: 'center'
  }
})

export default connect(mapStateToProps)(OptionsModalButton)
