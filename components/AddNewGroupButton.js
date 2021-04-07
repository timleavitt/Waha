import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import Separator from '../components/standard/Separator'
import { scaleMultiplier } from '../constants'
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
 * A pressable component that is used to add a new group. It's styled after the Group item component and is rendered as the section footer for the Groups SectionList on the Groups screen.
 * @param {Object} section - The section of the SectionList that this button is being rendered as the footer of.
 * @param {Function} setLanguageID - Sets the languageID state variable on the Groups screen.
 * @param {Function} setShowAddGroupModal - Shows the add group modal.
 */
const AddNewGroupButton = ({
  // Props passed from a parent component.
  section,
  setLanguageID,
  setShowAddGroupModal,
  // Props passed from redux.
  isRTL,
  font,
  translations
}) => {
  return (
    <View>
      <TouchableOpacity
        style={[
          styles.touchableAreaContainer,
          { flexDirection: isRTL ? 'row-reverse' : 'row' }
        ]}
        onPress={() => {
          // When adding a new group, set the languageID so that we can pass that to the CreateGroup function when we actually do create the group.
          setLanguageID(section.languageID)

          // Show the add group modal.
          setShowAddGroupModal(true)
        }}
      >
        <View style={styles.iconContainer}>
          <Icon
            name='group-add'
            size={40 * scaleMultiplier}
            color={colors.chateau}
          />
        </View>
        <Text
          style={StandardTypography(
            { font, isRTL },
            'h3',
            'Bold',
            'left',
            colors.blue
          )}
        >
          {translations.groups.new_group_button_label}
        </Text>
      </TouchableOpacity>
      <Separator />
      <View style={{ height: 20 * scaleMultiplier, width: '100%' }} />
    </View>
  )
}

const styles = StyleSheet.create({
  touchableAreaContainer: {
    height: 80 * scaleMultiplier,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white
  },
  iconContainer: {
    width: 55 * scaleMultiplier,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20
  }
})

export default connect(mapStateToProps)(AddNewGroupButton)
