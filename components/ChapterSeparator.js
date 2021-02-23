import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    primaryColor: state.database[activeGroup.language].primaryColor
  }
}

function ChapterSeparator ({
  // Props passed from redux.
  primaryColor
}) {
  return (
    <View
      style={{
        height: '100%',
        width: 2,
        backgroundColor: primaryColor
      }}
    />
  )
}

export default connect(mapStateToProps)(ChapterSeparator)
