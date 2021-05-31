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

    activeGroup: activeGroupSelector(state),
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

/**
 * A modal component that shows an image, a title, a message, and a button to dismiss.
 * @param {boolean} isVisible - Whether the modal is visible.
 * @param {Function} hideModal - Function to hide the modal.
 * @param {string} title - Text to display as the title.
 * @param {string} message - Text to display as the message.
 * @param {string} confirmText - Text to display on the button to close the modal.
 * @param {Function} confirmOnPress - Function to fire when the user presses the button to close the modal.
 * @param {Component} children - Component to show at the top of the modal. Usualy an image/gif.
 */
const MessageModal = ({
  // Props passed from a parent component.
  isVisible,
  hideModal,
  title,
  message,
  confirmText,
  confirmOnPress,
  children,
  // Props passed from redux.
  font,

  activeGroup,
  isRTL
}) => (
  <Modal
    isVisible={isVisible}
    hasBackdrop={true}
    onBackdropPress={hideModal}
    backdropOpacity={0.3}
    style={styles.modalContainer}
    onSwipeComplete={hideModal}
    swipeDirection={['down']}
    propagateSwipe={true}
  >
    <View style={styles.contentContainer}>
      {children}
      <Text
        style={[
          StandardTypography(
            { font, isRTL },
            'h2',
            'Black',
            'center',
            colors.shark
          ),
          { marginVertical: 10 }
        ]}
      >
        {title}
      </Text>
      <Text
        style={StandardTypography(
          { font, isRTL },
          'h4',
          'Bold',
          'center',
          colors.shark
        )}
      >
        {message}
      </Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={confirmOnPress}>
        <Text
          style={StandardTypography(
            { font, isRTL },
            'h2',
            'Bold',
            'center',
            colors.apple
          )}
        >
          {confirmText}
        </Text>
      </TouchableOpacity>
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  modalContainer: { justifyContent: 'flex-end', flex: 1, margin: 0 },
  contentContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  buttonContainer: {
    width: '100%',
    height: 80 * scaleMultiplier,
    justifyContent: 'center'
  }
})

export default connect(mapStateToProps)(MessageModal)
