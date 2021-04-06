import React, { useEffect } from 'react'
import { Alert, Clipboard, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../components/standard/BackButton'
import Blurb from '../components/standard/Blurb'
import Hero from '../components/standard/Hero'
import Separator from '../components/standard/Separator'
import WahaItem from '../components/standard/WahaItem'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont } from '../styles/typography'

function mapStateToProps (state) {
  return {
    database: state.database,
    isRTL: activeDatabaseSelector(state).isRTL,
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    areMobilizationToolsUnlocked: state.areMobilizationToolsUnlocked,
    groups: state.groups
  }
}

/**
 * Screen that shows information about the Mobilization Tools and a button to unlock them.
 */
const MobilizationToolsScreen = ({
  // Props passed from navigation.
  navigation: { setOptions, goBack, navigate },
  // Props passed from redux.
  database,
  isRTL,
  translations,
  font,
  areMobilizationToolsUnlocked,
  groups
}) => {
  /** useEffect function that sets the navigation options for this screen. */
  useEffect(() => {
    setOptions({
      headerRight: isRTL
        ? () => <BackButton onPress={() => goBack()} />
        : () => <View></View>,
      headerLeft: isRTL
        ? () => <View></View>
        : () => <BackButton onPress={() => goBack()} />
    })
  }, [])

  return (
    <View style={styles.screen}>
      <Hero source={require('../assets/gifs/unlock_mob_tools.gif')} />
      <Blurb
        text={
          areMobilizationToolsUnlocked
            ? translations.mobilization_tools.mobilization_tools_vision
            : translations.mobilization_tools.mobilization_tools_pre_unlock
        }
      />
      <Separator />
      <WahaItem
        title={
          areMobilizationToolsUnlocked
            ? translations.mobilization_tools.view_code_button_label
            : translations.mobilization_tools.unlock_mt_button_label
        }
        onPress={
          areMobilizationToolsUnlocked
            ? () =>
                Alert.alert(
                  translations.mobilization_tools.mt_code_title,
                  '281820',
                  [
                    {
                      text: translations.general.copy_to_clipboard,
                      onPress: () => Clipboard.setString('281820')
                    },
                    {
                      text: translations.general.close,
                      onPress: () => {}
                    }
                  ]
                )
            : () => navigate('MobilizationToolsUnlock')
        }
      >
        <Icon
          name={isRTL ? 'arrow-left' : 'arrow-right'}
          color={colors.tuna}
          size={50 * scaleMultiplier}
        />
      </WahaItem>
      <Separator />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze,
    alignItems: 'center'
  }
})

export default connect(mapStateToProps)(MobilizationToolsScreen)
