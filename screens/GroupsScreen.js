import React, { useEffect, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../components/BackButton'
import GroupListHeader from '../components/GroupListHeader'
import { colors, scaleMultiplier } from '../constants'
function GroupsScreen (props) {
  //// STATE

  const [isEditing, setIsEditing] = useState(false)

  //// CONSTRUCTOR

  useEffect(() => {
    props.navigation.setOptions(getNavOptions())
  }, [isEditing, props])

  //// NAV OPTIONS

  function getNavOptions () {
    return {
      headerRight: props.isRTL
        ? () => <BackButton onPress={() => props.navigation.goBack()} />
        : () => (
            <TouchableOpacity
              style={styles.editButtonContainer}
              onPress={() => setIsEditing(old => !old)}
            >
              <Text
                style={[
                  styles.editButtonText,
                  {
                    fontFamily: props.font + '-regular'
                  }
                ]}
              >
                {isEditing
                  ? props.translations.groups.done_button_label
                  : props.translations.groups.edit_button_label}
              </Text>
            </TouchableOpacity>
          ),
      headerLeft: props.isRTL
        ? () => (
            <TouchableOpacity
              style={styles.editButtonContainer}
              onPress={() => setIsEditing(old => !old)}
            >
              <Text
                style={[
                  styles.editButtonText,
                  {
                    fontFamily: props.font + '-regular'
                  }
                ]}
              >
                {isEditing
                  ? props.translations.groups.done_button_label
                  : props.translations.groups.edit_button_label}
              </Text>
            </TouchableOpacity>
          )
        : () => <BackButton onPress={() => props.navigation.goBack()} />
    }
  }

  //// FUNCTIONS

  function getInstalledLanguageInstances () {
    var installedLanguageInstances = []
    for (key in props.database) {
      if (key.length === 2) {
        var languageObject = {}
        languageObject['languageName'] = props.database[key].displayName
        languageObject['languageID'] = key
        installedLanguageInstances.push(languageObject)
      }
    }
    return installedLanguageInstances
  }

  //// RENDER

  function renderLanguageInstanceItem (languageInstances) {
    return (
      <GroupListHeader
        languageName={languageInstances.item.languageName}
        languageID={languageInstances.item.languageID}
        goToAddNewGroupScreen={() =>
          props.navigation.navigate('AddGroup', {
            languageID: languageInstances.item.languageID
          })
        }
        goToEditGroupScreen={groupName =>
          props.navigation.navigate('EditGroup', { groupName: groupName })
        }
        isEditing={isEditing}
      />
    )
  }

  return (
    <View style={styles.screen}>
      <View style={styles.languageList}>
        <FlatList
          data={getInstalledLanguageInstances()}
          renderItem={renderLanguageInstanceItem}
          keyExtractor={item => item.languageID}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.addNewLanguageContainer}
              onPress={() =>
                props.navigation.navigate('AddLanguage', {
                  installedLanguageInstances: getInstalledLanguageInstances()
                })
              }
            >
              <Text
                style={[
                  styles.addNewLanguageText,
                  {
                    textAlign: props.isRTL ? 'right' : 'left',
                    fontFamily: props.font + '-medium'
                  }
                ]}
              >
                {props.translations.groups.new_language_button_label}
              </Text>
            </TouchableOpacity>
          }
        />
      </View>
    </View>
  )
}

//// STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.athens
  },
  languageList: {
    flex: 1
  },
  addNewLanguageContainer: {
    height: 80 * scaleMultiplier,
    justifyContent: 'center',
    borderTopColor: colors.athens,
    paddingHorizontal: 20
  },
  addNewLanguageText: {
    fontSize: 18 * scaleMultiplier,
    color: colors.chateau
  },
  editButtonContainer: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  editButtonText: {
    color: colors.shark,
    fontSize: 18 * scaleMultiplier
  }
})

//// REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    database: state.database,
    isRTL: state.database[activeGroup.language].isRTL,
    translations: state.database[activeGroup.language].translations,
    isConnected: state.network.isConnected,
    font: state.database[activeGroup.language].font
  }
}

export default connect(mapStateToProps)(GroupsScreen)
