import React from 'react'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import OptionsModalButton from '../components/OptionsModalButton'
import Separator from '../components/standard/Separator'
import { scaleMultiplier } from '../constants'
import OptionsModal from '../modals/OptionsModal'
import {
  setSecurityEnabled,
  setTimeoutDuration
} from '../redux/actions/securityActions'
import { activeDatabaseSelector } from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'

function mapStateToProps (state) {
  return {
    translations: activeDatabaseSelector(state).translations,
    security: state.security
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setSecurityEnabled: toSet => dispatch(setSecurityEnabled(toSet)),
    setTimeoutDuration: ms => dispatch(setTimeoutDuration(ms))
  }
}

/**
 * A modal that allows the user to change the security timeout. Displays a list of options using the OptionsModal component.
 * @param {boolean} isVisible - Whether the modal should be visible or not.
 * @param {Function} hideModal - Function to hide the modal.
 */
const SecurityTimeoutPickerModal = ({
  isVisible,
  hideModal,
  // Props passed from redux.
  translations,
  security,
  setSecurityEnabled,
  setTimeoutDuration
}) => {
  return (
    <OptionsModal
      isVisible={isVisible}
      hideModal={hideModal}
      closeText={translations.general.cancel}
    >
      {/* Button to set the timeout duration to instant. */}
      <OptionsModalButton
        title={translations.security.instant_label}
        onPress={() => {
          setTimeoutDuration(0), hideModal()
        }}
      >
        {security.timeoutDuration === 0 ? (
          <Icon
            name='check'
            color={colors.apple}
            size={30 * scaleMultiplier}
            style={styles.checkIcon}
          />
        ) : null}
      </OptionsModalButton>
      <Separator />
      {/* Button to set the timeout duration to 1 minute. */}
      <OptionsModalButton
        title={translations.security.one_minute_label}
        onPress={() => {
          setTimeoutDuration(60000), hideModal()
        }}
      >
        {security.timeoutDuration === 60000 ? (
          <Icon
            name='check'
            color={colors.apple}
            size={30 * scaleMultiplier}
            style={styles.checkIcon}
          />
        ) : null}
      </OptionsModalButton>
      <Separator />
      {/* Button to set the timeout duration to 5 minutes. */}
      <OptionsModalButton
        title={translations.security.five_minutes_label}
        onPress={() => {
          setTimeoutDuration(300000), hideModal()
        }}
      >
        {security.timeoutDuration === 300000 ? (
          <Icon
            name='check'
            color={colors.apple}
            size={30 * scaleMultiplier}
            style={styles.checkIcon}
          />
        ) : null}
      </OptionsModalButton>
      <Separator />
      {/* Button to set the timeout duration to 15 minutes. */}
      <OptionsModalButton
        title={translations.security.fifteen_minutes_label}
        onPress={() => {
          setTimeoutDuration(900000), hideModal()
        }}
      >
        {security.timeoutDuration === 900000 ? (
          <Icon
            name='check'
            color={colors.apple}
            size={30 * scaleMultiplier}
            style={styles.checkIcon}
          />
        ) : null}
      </OptionsModalButton>
      <Separator />
      {/* Button to set the timeout duration to 1 hour. */}
      <OptionsModalButton
        title={translations.security.one_hour_label}
        onPress={() => {
          setTimeoutDuration(3600000), hideModal()
        }}
      >
        {security.timeoutDuration === 3600000 ? (
          <Icon
            name='check'
            color={colors.apple}
            size={30 * scaleMultiplier}
            style={styles.checkIcon}
          />
        ) : null}
      </OptionsModalButton>
    </OptionsModal>
  )
}

const styles = StyleSheet.create({
  checkIcon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingHorizontal: 20
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SecurityTimeoutPickerModal)
