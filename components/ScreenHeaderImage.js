import * as FileSystem from 'expo-file-system'
import React from 'react'
import { Image } from 'react-native'
import { connect } from 'react-redux'

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    activeGroup: activeGroup,
    database: state.database
  }
}

function ScreenHeaderImage ({
  // Props passed from redux.
  activeGroup,
  database
}) {
  return (
    <Image
      style={{
        resizeMode: 'contain',
        width: 150,
        flex: 1,
        alignSelf: 'center'
      }}
      source={{
        uri: FileSystem.documentDirectory + activeGroup.language + '-header.png'
      }}
    />
  )
}

export default connect(mapStateToProps)(ScreenHeaderImage)
