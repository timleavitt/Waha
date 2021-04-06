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

// modal variant that shows some information
const MessageModal = ({
  // Props passed from a parent component.s
  isVisible,
  hideModal,
  title,
  body,
  confirmText,
  confirmOnPress,
  cancelText = '',
  children = null,
  // Props passed from redux.
  font,
  activeGroup,
  isRTL
}) => {
  var cancelButton = cancelText ? (
    <TouchableOpacity
      style={{
        marginVertical: 15
        // marginBottom: 40 * scaleMultiplier,
        // marginTop: 80 * scaleMultiplier
      }}
      onPress={cancelOnPress}
    >
      <Text
        style={StandardTypography(
          { font, isRTL },
          'h2',
          'Bold',
          'left',
          colors.red
        )}
      >
        {cancelText}
      </Text>
    </TouchableOpacity>
  ) : null

  //+ RENDER

  return (
    <Modal
      isVisible={isVisible}
      hasBackdrop={true}
      onBackdropPress={hideModal}
      backdropOpacity={0.3}
      style={{ justifyContent: 'flex-end', flex: 1, margin: 0 }}
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
          style={[
            StandardTypography(
              { font, isRTL },
              'h4',
              'Bold',
              'center',
              colors.shark
            ),
            { paddingHorizontal: 20 }
          ]}
        >
          {body}
        </Text>

        <TouchableOpacity
          style={{
            // marginVertical: 10,
            width: '100%',
            height: 80 * scaleMultiplier,
            justifyContent: 'center'
            // backgroundColor: 'blue'
          }}
          onPress={confirmOnPress}
        >
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
        {cancelButton}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10
  }
})

export default connect(mapStateToProps)(MessageModal)
