import React from 'react'
import { Dimensions, SafeAreaView, StyleSheet, Text } from 'react-native'
import { connect } from 'react-redux'
import WahaButton from '../components/standard/WahaButton'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language)
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

/**
 *
 */
function MTUnlockSuccessfulScreen ({
  navigation: { navigate },
  activeGroup,
  activeDatabase,
  isRTL,
  font
}) {
  return (
    <SafeAreaView style={styles.screen}>
      {/* <Image
        source={require('../assets/gifs/unlock_mob_tools.gif')}
        style={{
          height: 200 * scaleMultiplier,
          margin: 20,
          resizeMode: 'contain',
          borderRadius: 20,
          overflow: 'hidden'
        }}
      /> */}
      <Icon name='lock-open' size={200} color={colors.tuna} />
      <Text
        style={[
          StandardTypography(
            { font, isRTL },
            'h2',
            'Black',
            'center',
            colors.shark
          ),
          { marginVertical: 10 }
        ]}
      >
        Mobilization Tools unlocked successfully!
      </Text>
      <WahaButton
        type='filled'
        color={colors.apple}
        onPress={() => navigate('SetsTabs', { screen: 'MobilizationTools' })}
        label='Check it out'
        style={{
          width: Dimensions.get('window').width - 40,
          marginHorizontal: 20,
          height: 68 * scaleMultiplier,
          bottom: 0,
          position: 'absolute'
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.porcelain,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MTUnlockSuccessfulScreen)
