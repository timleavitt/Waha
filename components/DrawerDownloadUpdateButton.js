import React from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    translations: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),
    isConnected: state.network.isConnected,
    languageCoreFilesToUpdate: state.database.languageCoreFilesToUpdate
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

/**
 * Button that prompts the user to download new language core files should they be available/needed.
 * @param {Function} updateHandler - Handles the updating of language core files.
 */
const DrawerDownloadUpdateButton = ({
  // Props passed from a parent component.
  updateHandler,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  translations,
  isRTL,
  font,
  isConnected,
  languageCoreFilesToUpdate
}) => (
  <TouchableOpacity
    style={styles.drawerDownloadUpdateButtonContainer}
    onPress={() => {
      Alert.alert(
        translations.general.download_update_title,
        translations.general.download_update_message,
        [
          {
            text: translations.general.cancel,
            onPress: () => {}
          },
          {
            text: translations.general.ok,
            onPress: updateHandler
          }
        ]
      )
    }}
    activeOpacity={isConnected ? 0.2 : 1}
  >
    <View
      style={[
        styles.innerContainer,
        {
          backgroundColor: isConnected ? colors.apple : colors.geyser,
          flexDirection: isRTL ? 'row' : 'row-reverse',
          borderBottomColor: isConnected
            ? colors.appleShadow
            : colors.geyserShadow
        }
      ]}
    >
      <Text
        style={[
          { paddingHorizontal: 10 },
          StandardTypography(
            { font, isRTL },
            'h3',
            'Bold',
            'center',
            isConnected ? colors.white : colors.chateau
          )
        ]}
      >
        {translations.general.download_update}
      </Text>
      {isConnected ? (
        <View style={styles.iconContainer}>
          <Icon
            name='error-filled'
            size={30 * scaleMultiplier}
            color={colors.white}
          />
        </View>
      ) : (
        <View style={styles.iconContainer}>
          <Icon
            name='cloud-slash'
            size={30 * scaleMultiplier}
            color={colors.chateau}
          />
        </View>
      )}
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  drawerDownloadUpdateButtonContainer: {
    overflow: 'hidden',
    borderRadius: 20,
    marginHorizontal: 5,
    marginTop: 5,
    marginBottom: 0,
    height: 50 * scaleMultiplier
  },
  innerContainer: {
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    borderBottomWidth: 4,
    paddingHorizontal: 5
  },
  iconContainer: {
    width: 50 * scaleMultiplier,
    alignItems: 'center'
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerDownloadUpdateButton)
