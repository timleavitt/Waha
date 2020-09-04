import React, { useState } from 'react'
import {
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../constants'

// renders a simple touchable item within the main navigation drawer
function HomeworkItem (props) {
  // RENDER
  const [isChecked, setIsChecked] = useState(false)
  return (
    <View
      style={{
        flexDirection: props.isRTL ? 'row-reverse' : 'row',
        width: '100%',
        marginBottom: 10
      }}
    >
      <TouchableOpacity
        onPress={() => setIsChecked(old => !old)}
        style={{
          width: 30 * scaleMultiplier,
          height: 30 * scaleMultiplier,
          borderWidth: isChecked ? 0 : 2,
          borderColor: colors.tuna,
          borderRadius: 5,
          backgroundColor: isChecked ? colors.blue : null
        }}
      >
        {isChecked ? (
          <Icon name='check' size={30 * scaleMultiplier} color={colors.white} />
        ) : null}
      </TouchableOpacity>
      <View style={{ flex: 1, marginHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 16 * scaleMultiplier,
            color: colors.shark,
            fontFamily: props.font + '-black',
            marginVertical: 5
          }}
        >
          {props.title}
        </Text>
        <Text
          style={{
            fontSize: 14 * scaleMultiplier,
            color: colors.tuna,
            fontFamily: props.font + '-regular'
          }}
        >
          {props.description}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          Share.share({
            message: props.title + '\n' + props.description
          })
        }
      >
        <Icon
          name={Platform.OS === 'ios' ? 'share-ios' : 'share-android'}
          size={35 * scaleMultiplier}
          color={colors.apple}
        />
      </TouchableOpacity>
    </View>
  )
}

// STYLES

const styles = StyleSheet.create({})

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    isRTL: state.database[activeGroup.language].isRTL,
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(HomeworkItem)
