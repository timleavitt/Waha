import * as FileSystem from 'expo-file-system'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, getLanguageFont, scaleMultiplier } from '../../constants'
import { StandardTypography } from '../../styles/typography'
import Separator from '../standard/Separator'
import WahaButton from '../standard/WahaButton'

function LanguageStorageItem (props) {
  return (
    <View style={styles.storageContainer}>
      <View
        style={[
          styles.languageHeaderContainer,
          { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
        ]}
      >
        <Text
          style={StandardTypography(
            props,
            'h3',
            'Regular',
            'left',
            colors.chateau
          )}
        >
          {props.languageName +
            ' ' +
            props.translations.storage.downloads_label}
        </Text>
        <Image
          style={styles.languageLogo}
          source={{
            uri: FileSystem.documentDirectory + props.languageID + '-header.png'
          }}
        />
      </View>
      <Separator />
      <View
        style={[
          styles.itemContainer,
          {
            flexDirection: props.isRTL ? 'row-reverse' : 'row'
          }
        ]}
      >
        <Text
          style={StandardTypography(props, 'h3', 'Bold', 'left', colors.tuna)}
        >
          {props.megabytes >= 0
            ? props.megabytes + ' ' + props.translations.storage.megabyte_label
            : props.translations.storage.megabyte_label}
        </Text>
        <Text
          style={[
            StandardTypography(props, 'h3', 'Regular', 'left', colors.tuna),
            {
              flex: 1,
              paddingHorizontal: 20
            }
          ]}
        >
          {props.translations.storage.storage_used_label}
        </Text>
        <WahaButton
          type='outline'
          color={colors.red}
          label={props.translations.storage.clear_button_label}
          width={92 * scaleMultiplier}
          onPress={props.clearDownloads}
          style={{ height: 45 * scaleMultiplier }}
          textStyle={{ fontFamily: props.font + '-Regular' }}
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
