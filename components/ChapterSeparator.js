import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

function ChapterSeparator (props) {
  return (
    <View
      style={{
        height: '100%',
        width: 2,
        backgroundColor: props.primaryColor
      }}
    />
  )
}

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    primaryColor: state.database[activeGroup.language].primaryColor
  }
}

export default connect(mapStateToProps)(ChapterSeparator)
