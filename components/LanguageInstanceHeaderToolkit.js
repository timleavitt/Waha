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
import GroupListItemToolkit from '../components/GroupListItemToolkit'
import { scaleMultiplier } from '../constants'
import { deleteGroup } from '../redux/actions/groupsActions'
import { deleteLanguage } from '../redux/actions/databaseActions'
import * as FileSystem from 'expo-file-system'
import { removeDownload } from '../redux/actions/downloadActions'

function LanguageInstanceHeaderToolkit (props) {
  //// FUNCTIONS

  useEffect(() => {}, [])

  //// RENDER

  var list = props.activeDatabase.hasToolkit ? (
    <FlatList
      data={props.groups.filter(group => group.language === props.languageID)}
      renderItem={renderGroupItem}
      keyExtractor={item => item.name}
    />
  ) : (
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

  function renderGroupItem (groups) {
    return <GroupListItemToolkit group={groups.item} />
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
          style={styles.languageLogo}
          source={{
            uri: FileSystem.documentDirectory + props.languageID + '-header.png'
          }}
        />
      </View>
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
  },
  addGroupContainer: {
    height: 80 * scaleMultiplier,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 3
  },
  addGroupText: {
    color: '#2D9CDB',
    fontSize: 18 * scaleMultiplier,
    textAlign: 'left'
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

function mapDispatchToProps (dispatch) {
  return {
    deleteGroup: name => {
      dispatch(deleteGroup(name))
    },
    deleteLanguage: language => {
      dispatch(deleteLanguage(language))
    },
    removeDownload: lessonID => {
      dispatch(removeDownload(lessonID))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageInstanceHeaderToolkit)
