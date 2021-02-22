import * as FileSystem from 'expo-file-system'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../../constants'
import { colors } from '../../styles/colors'
import { getLanguageFont, StandardTypography } from '../../styles/typography'
import Separator from '../standard/Separator'
import WahaButton from '../standard/WahaButton'

function LanguageStorageItem ({
  // Props passed from a parent component.
  languageName,
  languageID,
  megabytes,
  clearDownloads,
  // Props passed from redux.
  font,
  isRTL,
  translations,
  activeGroup
}) {
  return (
    <View style={styles.storageContainer}>
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
          {languageName + ' ' + translations.storage.downloads_label}
        </Text>
        <Image
          style={styles.languageLogo}
          source={{
            uri: FileSystem.documentDirectory + languageID + '-header.png'
          }}
        />
      </View>
      <Separator />
      <View
        style={[
          styles.itemContainer,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }
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
          {megabytes >= 0
            ? megabytes + ' ' + translations.storage.megabyte_label
            : translations.storage.megabyte_label}
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
      <Separator />
    </View>
  )
}

const styles = StyleSheet.create({
  storageContainer: {
    width: '100%'
  },
  itemContainer: {
    width: '100%',
    height: 80 * scaleMultiplier,
    // aspectRatio: 5,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  languageHeaderContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 40 * scaleMultiplier,
    // aspectRatio: 8.7,
    backgroundColor: colors.aquaHaze,
    paddingHorizontal: 20
  },
  languageLogo: {
    resizeMode: 'contain',
    width: 120 * scaleMultiplier,
    height: 16.8 * scaleMultiplier
  },
  storageContainerFlatList: {
    height: 55 * scaleMultiplier,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.chateau,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: getLanguageFont(activeGroup.language),
    isRTL: state.database[activeGroup.language].isRTL,
    translations: state.database[activeGroup.language].translations,
    activeGroup: activeGroup
  }
}

export default connect(mapStateToProps)(LanguageStorageItem)
