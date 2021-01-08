import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import { colors, getLanguageFont, scaleMultiplier } from '../constants'
import { StandardTypography } from '../styles/typography'
function OptionsModal (props) {
  //+ RENDER
  return (
    <Modal
      isVisible={props.isVisible}
      hasBackdrop={true}
      onBackdropPress={props.hideModal}
      backdropOpacity={0.3}
      style={{ justifyContent: 'flex-end' }}
    >
      <View style={{}}>
        <View style={styles.buttonsContainer}>{props.children}</View>
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity
            onPress={props.hideModal}
            style={styles.closeButtonContainer}
          >
            <Text
              style={StandardTypography(
                props,
                'h3',
                'Bold',
                'center',
                colors.red
              )}
            >
              {props.closeText}
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

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: getLanguageFont(activeGroup.language),
    activeGroup: activeGroup
  }
}

export default connect(mapStateToProps)(OptionsModal)
