import React, { useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  Alert,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import GroupItemMT from './GroupItemMT'
import { scaleMultiplier } from '../constants'
import * as FileSystem from 'expo-file-system'

function GroupListHeaderMT (props) {
  //// FUNCTIONS

  useEffect(() => {}, [])

  //// RENDER

  // if our active language has a toolkit, show the list of groups
  var list = props.activeDatabase.hasToolkit ? (
    <FlatList
      data={props.groups.filter(group => group.language === props.languageID)}
      renderItem={renderGroupItem}
      keyExtractor={item => item.name}
    />
  ) : (
    // otherwise, show a message that says MTs are not available for that language
    <View
      style={{
        height: 80 * scaleMultiplier,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        margin: 2,
        justifyContent: 'center'
      }}
    >
      <Text
        style={{
          fontFamily: props.font + '-regular',
          fontSize: 14 * scaleMultiplier,
          color: '#82868D',
          textAlign: 'center'
        }}
      >
        {props.translations.labels.noToolkit}
      </Text>
    </View>
  )

  // renders a group item
  function renderGroupItem (groups) {
    return <GroupItemMT group={groups.item} />
  }

  return (
    <View style={styles.languageHeaderListContainer}>
      <View
        style={[
          styles.languageHeaderContainer,
          { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
        ]}
      >
        <View>
          <Text
            style={{
              textAlign: props.isRTL ? 'right' : 'left',
              fontFamily: props.font + '-medium',
              fontSize: 18 * scaleMultiplier,
              color: '#9FA5AD'
            }}
          >
            {props.languageName + ' ' + props.translations.labels.groups}
          </Text>
          <Text
            style={{
              textAlign: props.isRTL ? 'right' : 'left',
              fontFamily: props.font + '-regular',
              fontSize: 18 * scaleMultiplier,
              color: '#9FA5AD'
            }}
          >
            {props.translations.labels.mtStatus}
          </Text>
        </View>
        <Image
          style={[
            styles.languageLogo,
            {
              tintColor: props.toolkitEnabled ? null : '#DEE3E9'
            }
          ]}
          source={{
            uri: FileSystem.documentDirectory + props.languageID + '-header.png'
          }}
        />
      </View>

      {/* list of groups OR no MTs message */}
      {list}
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  languageHeaderListContainer: {
    width: '100%',
    marginBottom: 15,
    marginTop: 3
  },
  languageHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 45 * scaleMultiplier,
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  languageLogo: {
    resizeMode: 'stretch',
    width: 96 * scaleMultiplier,
    height: 32 * scaleMultiplier,
    alignSelf: 'flex-end'
  }
})

// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    activeDatabase: state.database[activeGroup.language],
    isRTL: state.database[activeGroup.language].isRTL,
    groups: state.groups,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(GroupListHeaderMT)
