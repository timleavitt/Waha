import React, { useEffect, useState } from 'react'
import {
  Clipboard,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import SnackBar from 'react-native-snackbar-component'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import Blurb from '../components/Blurb'
import Hero from '../components/Hero'
import Separator from '../components/Separator'
import WahaItem from '../components/WahaItem'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

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
  const [showSnackbar, setShowSnackbar] = useState(false)

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
      {areMobilizationToolsUnlocked ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              paddingHorizontal: 30,
              borderRadius: 20,
              // borderWidth: 1.5,
              backgroundColor: colors.porcelain,
              borderColor: colors.geyser,
              borderBottomWidth: 4
            }}
            onPress={() => {
              setShowSnackbar(true)
              setTimeout(() => setShowSnackbar(false), 1500)
              Clipboard.setString('281820')
            }}
          >
            <Text
              style={StandardTypography(
                { font, isRTL },
                'h4',
                'Regular',
                'center',
                colors.shark
              )}
            >
              {translations.mobilization_tools.unlock_code_label}
            </Text>
            <Text
              style={StandardTypography(
                { font, isRTL },
                'h1',
                'Bold',
                'center',
                colors.shark
              )}
            >
              2 8 1 8 2 0
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: -35 * scaleMultiplier
            }}
            onPress={() =>
              Share.share({
                message:
                  translations.mobilization_tools
                    .mobilization_tools_share_message
              })
            }
          >
            <Icon
              name={Platform.OS === 'ios' ? 'share-ios' : 'share-android'}
              color={colors.tuna}
              size={30 * scaleMultiplier}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ width: '100%' }}>
          <Separator />
          <WahaItem
            title={translations.mobilization_tools.unlock_mt_button_label}
            onPress={() => navigate('MobilizationToolsUnlock')}
          >
            <Icon
              name={isRTL ? 'arrow-left' : 'arrow-right'}
              color={colors.tuna}
              size={50 * scaleMultiplier}
            />
          </WahaItem>
          <Separator />
        </View>
      )}
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
