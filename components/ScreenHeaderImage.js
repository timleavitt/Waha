import * as FileSystem from 'expo-file-system'
import React from 'react'
import { Image } from 'react-native'
import { connect } from 'react-redux'
import { activeGroupSelector } from '../redux/reducers/activeGroup'

function mapStateToProps (state) {
  return {
    activeGroup: activeGroupSelector(state),
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
