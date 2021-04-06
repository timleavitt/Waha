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
import { colors } from '../../styles/colors'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { getLanguageFont } from '../styles/typography'

// renders a simple touchable item within the main navigation drawer
const HomeworkItem = props => {
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
            fontFamily: props.font + '-Black',
            marginVertical: 5
          }}
        >
          {props.title}
        </Text>
        <Text
          style={{
            fontSize: 14 * scaleMultiplier,
            color: colors.tuna,
            fontFamily: props.font + '-Regular'
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
  return {
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),
    activeGroup: activeGroupSelector(state)
  }
}

export default connect(mapStateToProps)(HomeworkItem)
