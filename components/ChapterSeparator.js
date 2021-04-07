import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { activeDatabaseSelector } from '../redux/reducers/activeGroup'

function mapStateToProps (state) {
  return {
    primaryColor: activeDatabaseSelector(state).primaryColor
  }
}

const ChapterSeparator = ({
  // Props passed from redux.
  primaryColor
}) => {
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
