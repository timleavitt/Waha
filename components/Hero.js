import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import Separator from '../components/Separator'
import { colors, scaleMultiplier } from '../constants'

function Hero (props) {
  return (
    <View style={{ width: '100%' }}>
      <Separator />
      <View style={styles.topPortion}>
        <Image style={styles.topImage} source={props.source} />
      </View>
      <Separator />
    </View>
  )
}

const styles = StyleSheet.create({
  topPortion: {
    backgroundColor: colors.white,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  topImage: {
    resizeMode: 'contain',
    height: 170 * scaleMultiplier,
    alignSelf: 'center'
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font,
    isRTL: state.database[activeGroup.language].isRTL
  }
}

export default connect(mapStateToProps)(Hero)
