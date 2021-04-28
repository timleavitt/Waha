import React from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { groupIcons, groupIconSources } from '../assets/groupIcons/_groupIcons'
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
    translations: activeDatabaseSelector(state).translations
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

/**
 *
 */
const EmojiViewer = ({
  // Props passed from a parent component.
  emojiInput,
  setEmojiInput,
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  isRTL,
  font,
  translations
}) => {
  /** Renders an emoji for the emoji select <FlatList />. */
  const renderEmoji = ({ item }) => (
    <TouchableOpacity
      style={{
        width: 50 * scaleMultiplier,
        height: 50 * scaleMultiplier,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        borderWidth: item === emojiInput ? 2 : 0,
        borderColor: item === emojiInput ? colors.blue : null,
        borderRadius: 10,
        backgroundColor: item === emojiInput ? colors.blue + '38' : null
      }}
      onPress={() => setEmojiInput(item)}
    >
      <Image
        style={{
          width: 40 * scaleMultiplier,
          height: 40 * scaleMultiplier
        }}
        source={groupIconSources[item]}
      />
    </TouchableOpacity>
  )
  return (
    <View
      style={{
        width: '100%',
        flex: 1,
        maxHeight: 300 * scaleMultiplier,
        paddingHorizontal: 20
      }}
    >
      <Text
        style={[
          StandardTypography(
            { font, isRTL },
            'p',
            'Regular',
            'left',
            colors.chateau
          ),
          {
            // marginHorizontal: 20,
            marginTop: 20 * scaleMultiplier,
            marginBottom: 5
          }
        ]}
      >
        Avatar
        {/* {translations.add_edit_group.icon_form_label} */}
      </Text>
      <View
        style={{
          alignItems: 'center',
          paddingHorizontal: 5,
          borderWidth: 2,
          borderRadius: 10,
          borderColor: colors.athens,
          marginBottom: 20,
          flex: 1,
          backgroundColor: colors.white
        }}
      >
        <FlatList
          data={groupIcons}
          nestedScrollEnabled
          renderItem={renderEmoji}
          keyExtractor={item => item}
          numColumns={Math.floor(
            (Dimensions.get('window').width - 50) / (50 * scaleMultiplier)
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})

export default connect(mapStateToProps, mapDispatchToProps)(EmojiViewer)
