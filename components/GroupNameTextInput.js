import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
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
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),
    isTablet: state.deviceInfo.isTablet,
    t: activeDatabaseSelector(state).translations
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

/**
 *
 */
const GroupNameTextInput = ({
  // Props passed from a parent component.
  groupNameInput,
  setGroupNameInput,
  groupNameInputRef,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  isRTL,
  font,
  isTablet,
  t
}) => (
  <View style={styles.groupNameAreaContainer}>
    <Text
      style={StandardTypography(
        { font, isRTL, isTablet },
        'p',
        'Regular',
        'left',
        colors.chateau
      )}
    >
      {t.groups && t.groups.group_name}
    </Text>
    <TextInput
      ref={groupNameInputRef}
      style={[
        styles.groupNameTextInputContainer,
        StandardTypography(
          { font, isRTL, isTablet },
          'h3',
          'Regular',
          'left',
          colors.shark
        )
      ]}
      onChangeText={text => setGroupNameInput(text)}
      value={groupNameInput}
      autoCapitalize='words'
      autoCorrect={false}
      placeholder={t.groups && t.groups.group_name_here}
      placeholderTextColor={colors.chateau}
      maxLength={50}
      returnKeyType='done'
    />
  </View>
)

const styles = StyleSheet.create({
  groupNameAreaContainer: {
    width: '100%',
    paddingHorizontal: 20
  },
  groupNameTextInputContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: colors.athens,
    borderWidth: 2,
    height: 50 * scaleMultiplier,
    fontSize: 18 * scaleMultiplier,
    marginTop: 5,
    alignItems: 'center'
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupNameTextInput)
