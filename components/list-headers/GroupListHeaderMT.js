import * as FileSystem from 'expo-file-system'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../../constants'
import { colors } from '../../styles/colors'
import { getLanguageFont, StandardTypography } from '../../styles/typography'

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    activeDatabase: state.database[activeGroup.language],
    isRTL: state.database[activeGroup.language].isRTL,
    groups: state.groups,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language)
  }
}

function GroupListHeaderMT ({
  // Props passed from a parent component.
  languageID,
  // Props passed from redux.
  activeDatabase,
  isRTL,
  groups,
  activeGroup,
  translations,
  font
}) {
  //+ FUNCTIONS

  //+ RENDER

  return (
    <View
      style={[
        styles.languageHeaderContainer,
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}
    >
      <View>
        <Text
          style={StandardTypography(
            { font, isRTL },
            'h3',
            'Bold',
            'left',
            colors.chateau
          )}
        >
          {
            translations.general.brands[languageID]
            // +
            //   ' ' +
            //   translations.mobilization_tools.groups_label
          }
        </Text>
        {/* <Text
          style={StandardTypography(
            props,
            'h3',
            'Regular',
            'left',
            colors.chateau
          )}
        >
          {
            translations.mobilization_tools
              .mobilization_tools_status_label
          }
        </Text> */}
      </View>
      <Image
        style={styles.languageLogo}
        source={{
          uri: FileSystem.documentDirectory + languageID + '-header.png'
        }}
      />
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  languageHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55 * scaleMultiplier,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: colors.aquaHaze
  },
  languageLogo: {
    resizeMode: 'contain',
    width: 120 * scaleMultiplier,
    height: 16.8 * scaleMultiplier
  }
})

export default connect(mapStateToProps)(GroupListHeaderMT)
