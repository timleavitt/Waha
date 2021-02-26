import * as FileSystem from 'expo-file-system'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../../redux/reducers/activeGroup'
import { colors } from '../../styles/colors'
import { getLanguageFont, SystemTypography } from '../../styles/typography'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    translations: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),
    database: state.database
  }
}

/**
 * The header for the groups section list used on the Mobilization Tools screen. Displays the name of the language in the active group's language and the language instance's logo.
 * @param {string} languageID - The ID for the language instance.
 */
function GroupListHeaderMT ({
  // Props passed from a parent component.
  languageID,
  // Props passed from redux.
  isRTL,
  translations,
  font,
  database
}) {
  return (
    <View
      style={[
        styles.groupListHeaderMTContainer,
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}
    >
      <View>
        <Text
          style={SystemTypography(
            false,
            'h3',
            'Bold',
            'left',
            colors.chateau,
            getLanguageFont(languageID)
          )}
        >
          {database[languageID].displayName}
        </Text>
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

const styles = StyleSheet.create({
  groupListHeaderMTContainer: {
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
