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
    translations: activeDatabaseSelector(state).translations
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

/**
 *
 */
function GroupNameTextInput ({
  // Props passed from a parent component.
  groupNameInput,
  setGroupNameInput,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  isRTL,
  font,
  translations
}) {
  return (
    <View style={styles.groupNameAreaContainer}>
      <Text
        style={StandardTypography(
          { font, isRTL },
          'p',
          'Regular',
          'left',
          colors.chateau
        )}
      >
        {translations.add_edit_group.group_name_form_label}
      </Text>
      <TextInput
        style={[
          styles.groupNameTextInputContainer,
          StandardTypography(
            { font, isRTL },
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
        placeholder={translations.add_edit_group.group_name_form_placeholder}
        placeholderTextColor={colors.chateau}
        maxLength={50}
        returnKeyType='done'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  groupNameAreaContainer: {
    width: '100%',
    paddingHorizontal: 20
  },
  groupNameTextInputContainer: {
    borderBottomColor: colors.athens,
    borderBottomWidth: 2,
    height: 50 * scaleMultiplier,
    fontSize: 18 * scaleMultiplier
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupNameTextInput)
