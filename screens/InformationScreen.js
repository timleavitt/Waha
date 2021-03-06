import * as WebBrowser from 'expo-web-browser'
import React, { useEffect, useState } from 'react'
import {
  Clipboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import SnackBar from 'react-native-snackbar-component'
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

const InformationScreen = ({
  navigation: { setOptions, goBack },
  // Props passed from redux.
  isRTL,
  font,
  translations
}) => {
  /** Keeps track of whether the snackbar that pops up is visible or not.  */
  const [showSnackbar, setShowSnackbar] = useState(false)

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
    await WebBrowser.openBrowserAsync(url, { dismissButtonStyle: 'close' })
  }

  return (
    <SafeAreaView style={styles.screen}>
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
          {translations.information && translations.information.privacy}
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
          {translations.information && translations.information.donate_to_waha}
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
        onPress={
          Platform.OS === 'ios'
            ? () =>
                openBrowser(
                  'https://apps.apple.com/us/app/waha-discover-gods-story/id1530116294'
                )
            : openBrowser(
                'https://play.google.com/store/apps/details?id=com.kingdomstrategies.waha'
              )
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
          {translations.information && translations.information.rate_waha}
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
        onPress={() => {
          setShowSnackbar(true)
          setTimeout(() => setShowSnackbar(false), 2000)
          Clipboard.setString(appVersion)
        }}
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
            {translations.information && translations.information.version}
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
        <Icon
          name='clipboard'
          color={colors.tuna}
          size={25 * scaleMultiplier}
        />
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 3
          }}
        >
          <Text
            style={[
              StandardTypography(
                { font, isRTL },
                'd',
                'Regular',
                'center',
                colors.geyser
              ),
              {
                marginHorizontal: 2
              }
            ]}
          >
            Made with
          </Text>
          <Icon name='heart' size={15} color={colors.geyser} />
          <Text
            style={[
              StandardTypography(
                { font, isRTL },
                'd',
                'Regular',
                'center',
                colors.geyser
              ),
              {
                marginHorizontal: 2
              }
            ]}
          >
            by the Waha team
          </Text>
        </View>
      </View>
      <SnackBar
        visible={showSnackbar}
        textMessage={
          translations.information &&
          translations.information.copied_to_clipboard
        }
        messageStyle={{
          color: colors.white,
          fontSize: 24 * scaleMultiplier,
          fontFamily: font + '-Black',
          textAlign: 'center'
        }}
        backgroundColor={colors.apple}
      />
    </SafeAreaView>
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
