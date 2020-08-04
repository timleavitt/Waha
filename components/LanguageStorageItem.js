import * as FileSystem from 'expo-file-system'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import Separator from '../components/Separator'
import WahaButton from '../components/WahaButton'
import { colors, scaleMultiplier } from '../constants'

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
          style={{
            textAlign: props.isRTL ? 'right' : 'left',
            fontFamily: props.font + '-regular',
            fontSize: 18 * scaleMultiplier,
            color: colors.chateau
          }}
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
          style={{
            fontFamily: props.font + '-medium',
            fontSize: 18 * scaleMultiplier,
            color: colors.tuna
          }}
        >
          {props.megabytes + ' ' + props.translations.storage.megabyte_label}
        </Text>
        <Text
          style={{
            fontFamily: props.font + '-regular',
            fontSize: 18 * scaleMultiplier,
            color: colors.tuna,
            flex: 1,
            paddingHorizontal: 20
          }}
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
          textStyle={{ fontFamily: props.font + '-regular' }}
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
    // height: 80 * scaleMultiplier,
    aspectRatio: 5,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  languageHeaderContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    // height: 40 * scaleMultiplier,
    aspectRatio: 8.7,
    backgroundColor: colors.aquaHaze,
    paddingHorizontal: 20
  },
  languageHeaderText: {
    fontSize: 18 * scaleMultiplier,
    color: colors.chateau,
    flex: 1
  },
  languageLogo: {
    resizeMode: 'contain',
    width: 120 * scaleMultiplier,
    height: 40 * scaleMultiplier
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
  },
  storageUsedText: {
    fontSize: 18,
    color: colors.tuna
  },
  mbText: {
    fontSize: 18,
    color: colors.chateau,
    alignSelf: 'center'
  },
  deleteText: {
    fontSize: 18,
    color: colors.red
  }
})

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font,
    isRTL: state.database[activeGroup.language].isRTL,
    translations: state.database[activeGroup.language].translations
  }
}

export default connect(mapStateToProps)(LanguageStorageItem)
