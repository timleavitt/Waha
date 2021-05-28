import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
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
    font: getLanguageFont(activeGroupSelector(state).language),
    isTablet: state.deviceInfo.isTablet,
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

/**
 * A modal component that displays a list of buttons. Very similar to the standard iOS action sheet.
 * @param {boolean} isVisible - Whether the modal is visible.
 * @param {Function} hideModal - Function to hide the modal.
 * @param {string} closeText - The text to display on the button that closes the modal.
 * @param {Component} children - The list of buttons to display in the modal.
 */
const OptionsModal = ({
  // Props passed from a parent component.
  isVisible,
  hideModal,
  closeText,
  children,
  // Props passed from redux.
  font,
  isTablet,
  isRTL
}) => (
  <Modal
    isVisible={isVisible}
    hasBackdrop={true}
    onBackdropPress={hideModal}
    backdropOpacity={0.3}
    style={{ justifyContent: 'flex-end' }}
    onSwipeComplete={hideModal}
    swipeDirection={['down']}
    propagateSwipe={true}
    useNativeDriver
  >
    <View>
      <View style={styles.childrenContainer}>{children}</View>
      <TouchableOpacity onPress={hideModal} style={styles.closeButtonContainer}>
        <Text
          style={StandardTypography(
            { font, isRTL, isTablet },
            'h3',
            'Bold',
            'center',
            colors.red
          )}
        >
          {closeText}
        </Text>
      </TouchableOpacity>
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  childrenContainer: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginVertical: 10
  },
  closeButtonContainer: {
    width: '100%',
    height: 70 * scaleMultiplier,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 20
  }
})

export default connect(mapStateToProps)(OptionsModal)
