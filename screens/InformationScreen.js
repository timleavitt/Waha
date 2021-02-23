import React from 'react'
import { StyleSheet, View } from 'react-native'
import { colors } from '../styles/colors'

function InformationScreen ({}) {
  return <View style={styles.screen}></View>
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.aquaHaze
  }
})

export default InformationScreen
