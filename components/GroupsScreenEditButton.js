import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),
    translations: activeDatabaseSelector(state).translations
  }
}

/**
 * The edit button that is displayed in the header on the Groups screen. Switches editingMode on or off when pressed.
 */
const GroupsScreenEditButton = ({
  // Props passed from a parent component.
  onPress,
  isEditing,
  // Props passed from redux.
  isRTL,
  font,
  translations
}) => {
  return (
    <TouchableOpacity style={styles.editButtonContainer} onPress={onPress}>
      <Text
        style={[
          StandardTypography(
            { font, isRTL },
            'h3',
            isEditing ? 'Bold' : 'Regular',
            'center',
            isEditing ? colors.white : colors.blue
          ),
          {
            // Underline the text for this button if we're in editing mode. This is standard for header buttons in material design.
            textDecorationLine: isEditing ? 'underline' : null
          }
        ]}
      >
        {isEditing
          ? translations.groups.done_button_label
          : translations.groups.edit_button_label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  editButtonContainer: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default connect(mapStateToProps)(GroupsScreenEditButton)
