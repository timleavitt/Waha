import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { scaleMultiplier } from '../../constants'
import { activeGroupSelector } from '../../redux/reducers/activeGroup'
import { colors } from '../../styles/colors'
import { getLanguageFont, StandardTypography } from '../../styles/typography'

function mapStateToProps (state) {
  return {
    isRTL: state.database[activeGroupSelector(state).language].isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),
    activeGroup: activeGroupSelector(state)
  }
}

/**
 * A pressable item used in Waha's navigation drawer.
 * @param {function} props.onPress - The function to call when the user presses the drawer item.
 * @param {string} props.icon - The name of the icon to display on the drawer item.
 * @param {string} props.label - The label to display on the drawer item.
 */
function DrawerItem ({
  // Props passed from a parent component.
  onPress,
  icon,
  label,
  // Props passed from redux.
  isRTL,
  font,
  activeGroup
}) {
  return (
    <TouchableOpacity
      style={[
        styles.drawerItemContainer,
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Icon name={icon} size={30 * scaleMultiplier} color={colors.tuna} />
      </View>
      <Text
        style={[
          StandardTypography(
            { font, isRTL },
            'h3',
            'Bold',
            'left',
            colors.shark
          ),
          { paddingHorizontal: 10 }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  drawerItemContainer: {
    height: 55 * scaleMultiplier,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50 * scaleMultiplier
  }
})

export default connect(mapStateToProps)(DrawerItem)
