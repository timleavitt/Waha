import React from 'react'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import OptionsModalButton from '../components/OptionsModalButton'
import WahaSeparator from '../components/WahaSeparator'
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
    t: activeDatabaseSelector(state).translations,
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
  t,
  security,
  setSecurityEnabled,
  setTimeoutDuration
}) => (
  <OptionsModal
    isVisible={isVisible}
    hideModal={hideModal}
    closeText={t.general && t.general.cancel}
  >
    {/* Button to set the timeout duration to instant. */}
    <OptionsModalButton
      label={t.security && t.security.instant}
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
    <WahaSeparator />
    {/* Button to set the timeout duration to 1 minute. */}
    <OptionsModalButton
      label={t.security && t.security.one_minute}
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
    <WahaSeparator />
    {/* Button to set the timeout duration to 5 minutes. */}
    <OptionsModalButton
      label={t.security && t.security.five_minutes}
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
    <WahaSeparator />
    {/* Button to set the timeout duration to 15 minutes. */}
    <OptionsModalButton
      label={t.security && t.security.fifteen_minutes}
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
    <WahaSeparator />
    {/* Button to set the timeout duration to 1 hour. */}
    <OptionsModalButton
      label={t.security && t.security.one_hour}
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
