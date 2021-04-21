import * as FileSystem from 'expo-file-system'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'
import WahaButton from './WahaButton'
import WahaSeparator from './WahaSeparator'

function mapStateToProps (state) {
  return {
    font: getLanguageFont(activeGroupSelector(state).language),
    isRTL: activeDatabaseSelector(state).isRTL,
    translations: activeDatabaseSelector(state).translations
  }
}

/**
 * A list item used to display a language and the amount of storage all of its downloaded lessons take up. Used on the StorageScreen.
 * @param {string} languageName - The name of the language.
 * @param {string} languageID - The ID of the language.
 * @param {number} megabytes - The number of megabytes this language's downloaded lessons take up.
 * @param {Function} clearDownloads - Function that clears all of the downloaded lessons for this language.
 */
const LanguageStorageItem = ({
  // Props passed from a parent component.
  languageName,
  languageID,
  megabytes,
  clearDownloads,
  // Props passed from redux.
  font,
  isRTL,
  translations
}) => (
  <View style={styles.languageStorageItemContainer}>
    <View
      style={[
        styles.languageHeaderContainer,
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}
    >
      <Text
        style={StandardTypography(
          { font, isRTL },
          'h3',
          'Regular',
          'left',
          colors.chateau
        )}
      >
        {/* Display the name of the language with "downloads" after it. */}
        {languageName + ' ' + translations.storage.downloads_label}
      </Text>
      <Image
        style={styles.languageLogo}
        source={{
          uri: FileSystem.documentDirectory + languageID + '-header.png'
        }}
      />
    </View>
    <WahaSeparator />
    <View
      style={[
        styles.mainAreaContainer,
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}
    >
      <Text
        style={StandardTypography(
          { font, isRTL },
          'h3',
          'Bold',
          'left',
          colors.tuna
        )}
      >
        {megabytes + ' ' + translations.storage.megabyte_label}
      </Text>
      <Text
        style={[
          StandardTypography(
            { font, isRTL },
            'h3',
            'Regular',
            'left',
            colors.tuna
          ),
          {
            flex: 1,
            paddingHorizontal: 20
          }
        ]}
      >
        {translations.storage.storage_used_label}
      </Text>
      <WahaButton
        type='outline'
        color={colors.red}
        label={translations.storage.clear_button_label}
        width={92 * scaleMultiplier}
        onPress={clearDownloads}
        style={{ height: 45 * scaleMultiplier }}
        textStyle={{ fontFamily: font + '-Regular' }}
      />
    </View>
    <WahaSeparator />
  </View>
)

const styles = StyleSheet.create({
  languageStorageItemContainer: {
    width: '100%'
  },
  languageHeaderContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 40 * scaleMultiplier,
    backgroundColor: colors.aquaHaze,
    paddingHorizontal: 20
  },
  languageLogo: {
    resizeMode: 'contain',
    width: 120 * scaleMultiplier,
    height: 16.8 * scaleMultiplier
  },
  mainAreaContainer: {
    width: '100%',
    height: 80 * scaleMultiplier,
    // aspectRatio: 5,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  }
})

export default connect(mapStateToProps)(LanguageStorageItem)
