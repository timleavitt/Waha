import * as WebBrowser from 'expo-web-browser'
import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../components/standard/BackButton'
import { scaleMultiplier } from '../constants'
import { appVersion } from '../modeSwitch'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),
    translations: activeDatabaseSelector(state).translations
  }
}

function InformationScreen ({
  navigation: { setOptions, goBack },
  // Props passed from redux.
  isRTL,
  font,
  translations
}) {
  function getNavOptions () {
    return {
      headerRight: isRTL
        ? () => <BackButton onPress={() => goBack()} />
        : () => {},
      headerLeft: isRTL
        ? () => {}
        : () => <BackButton onPress={() => goBack()} />
    }
  }

  useEffect(() => {
    setOptions(getNavOptions())
  }, [])

  async function openBrowser (url) {
    await WebBrowser.openBrowserAsync(url, { dismissButtonStyle: 'cancel' })
  }

  return (
    <View style={styles.screen}>
      <TouchableOpacity
        style={[
          styles.informationItem,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }
        ]}
        onPress={() => openBrowser('https://waha.app/privacy-policy/')}
      >
        <Text
          style={StandardTypography(
            { font, isRTL },
            'h3',
            'Bold',
            'left',
            colors.shark
          )}
        >
          {translations.general.privacy}
        </Text>
        <Icon name='launch' color={colors.tuna} size={25 * scaleMultiplier} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.informationItem,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }
        ]}
        onPress={() =>
          openBrowser('https://kingdomstrategies.givingfuel.com/general-giving')
        }
      >
        <Text
          style={StandardTypography(
            { font, isRTL },
            'h3',
            'Bold',
            'left',
            colors.shark
          )}
        >
          {translations.general.donate_to_waha}
        </Text>
        <Icon name='launch' color={colors.tuna} size={25 * scaleMultiplier} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.informationItem,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }
        ]}
      >
        <View>
          <Text
            style={StandardTypography(
              { font, isRTL },
              'h3',
              'Bold',
              'left',
              colors.shark
            )}
          >
            {translations.general.version}
          </Text>
          <Text
            style={StandardTypography(
              { font, isRTL },
              'h4',
              'Bold',
              'left',
              colors.chateau
            )}
          >
            {appVersion}
          </Text>
        </View>
        <Icon name='bug' color={colors.tuna} size={25 * scaleMultiplier} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.aquaHaze
  },
  informationItem: {
    width: '100%',
    height: 60 * scaleMultiplier,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20
  }
})

export default connect(mapStateToProps)(InformationScreen)
