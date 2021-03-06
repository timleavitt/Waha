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
    isRTL: activeDatabaseSelector(state).isRTL
  }
}

const OptionsModal = ({
  // Props passed from a parent component.
  isVisible,
  hideModal,
  closeText,
  children = null,
  // Props passed from redux.
  font,
  isRTL
}) => {
  //+ RENDER
  return (
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
      <View style={{}}>
        <View style={styles.buttonsContainer}>{children}</View>
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity
            onPress={hideModal}
            style={styles.closeButtonContainer}
          >
            <Text
              style={StandardTypography(
                { font, isRTL },
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
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  buttonsContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 10
  },
  closeButtonContainer: {
    width: '100%',
    height: 70 * scaleMultiplier,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 10
    // marginTop: 5
  }
})

export default connect(mapStateToProps)(OptionsModal)
