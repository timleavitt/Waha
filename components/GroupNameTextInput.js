import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
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
    activeGroup: activeGroupSelector(state),
    activeDatabase: activeDatabaseSelector(state),
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),

    t: activeDatabaseSelector(state).translations
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

/**
 *
 */
const GroupNameTextInput = ({
  // Props passed from a parent component.
  groupNameInput,
  setGroupNameInput,
  groupNameInputRef = null,
  isDuplicate = false,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  isRTL,
  font,
  t
}) => {
  console.log(isDuplicate)
  return (
    <View style={styles.groupNameAreaContainer}>
      <Text
        style={StandardTypography(
          { font, isRTL },
          'p',
          'Regular',
          'left',
          colors.chateau
        )}
      >
        {t.groups && t.groups.group_name}
      </Text>
      <View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          width: '100%',
          alignItems: 'center'
        }}
      >
        <TextInput
          ref={groupNameInputRef}
          style={[
            styles.groupNameTextInputContainer,
            StandardTypography(
              { font, isRTL },
              'h3',
              'Regular',
              'left',
              colors.shark
            )
          ]}
          onChangeText={text => setGroupNameInput(text)}
          value={groupNameInput}
          autoCapitalize='words'
          autoCorrect={false}
          placeholder={t.groups && t.groups.group_name_here}
          placeholderTextColor={colors.chateau}
          maxLength={50}
          returnKeyType='done'
        />
        {isDuplicate && (
          <View
            style={{
              width: 50 * scaleMultiplier,
              height: 50 * scaleMultiplier,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Icon
              name='cancel'
              color={colors.red}
              size={45 * scaleMultiplier}
            />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  groupNameAreaContainer: {
    width: '100%',
    paddingHorizontal: 20,
    maxWidth: 500
  },
  groupNameTextInputContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: colors.athens,
    borderWidth: 2,
    height: 50 * scaleMultiplier,
    fontSize: 18 * scaleMultiplier,
    marginTop: 5,
    alignItems: 'center',
    flex: 1
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupNameTextInput)
