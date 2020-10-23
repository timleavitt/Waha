import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'
// modal variant that shows some information
function MessageModal (props) {
  var cancelButton = props.cancelText ? (
    <TouchableOpacity
      style={{
        marginVertical: 15
        // marginBottom: 40 * scaleMultiplier,
        // marginTop: 80 * scaleMultiplier
      }}
      onPress={props.cancelOnPress}
    >
      <Text style={Typography(props, 'h2', 'medium', 'left', colors.red)}>
        {props.cancelText}
      </Text>
    </TouchableOpacity>
  ) : null

  //+ RENDER

  return (
    <Modal
      isVisible={props.isVisible}
      hasBackdrop={true}
      onBackdropPress={props.hideModal}
      backdropOpacity={0.3}
      style={{ justifyContent: 'flex-end', flex: 1, margin: 0 }}
    >
      <View style={styles.contentContainer}>
        {props.children}
        <Text
          style={[
            Typography(props, 'h1', 'black', 'center', colors.shark),
            { marginVertical: 10 }
          ]}
        >
          {props.title}
        </Text>
        <Text
          style={[
            Typography(props, 'h3', 'medium', 'center', colors.shark),
            { paddingHorizontal: 20 }
          ]}
        >
          {props.body}
        </Text>

        <TouchableOpacity
          style={{
            // marginVertical: 10,
            width: '100%',
            height: 80 * scaleMultiplier,
            justifyContent: 'center'
            // backgroundColor: 'blue'
          }}
          onPress={props.confirmOnPress}
        >
          <Text
            style={Typography(props, 'h2', 'medium', 'center', colors.apple)}
          >
            {props.confirmText}
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

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(MessageModal)
