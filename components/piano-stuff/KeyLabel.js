import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { colors } from '../../constants'
import { BrandTypography } from '../../styles/typography'
function KeyLabel (props) {
  // RENDER

  return (
    <View
      style={[
        styles.circle,
        { backgroundColor: props.backgroundColor },
        props.style
      ]}
    >
      <Text
        style={BrandTypography(
          { font: 'roboto' },
          'h2',
          'medium',
          'center',
          colors.shark
        )}
      >
        {props.number}
      </Text>
    </View>
  )
}

// STYLES

const styles = StyleSheet.create({
  circle: {
    width: Dimensions.get('window').width / 12,
    height: Dimensions.get('window').width / 12,
    borderRadius: Dimensions.get('window').width / 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    zIndex: 3,
    marginBottom: 10
  }
})

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(KeyLabel)
