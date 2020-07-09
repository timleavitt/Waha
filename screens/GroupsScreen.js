import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  Alert
} from 'react-native'
import BackButton from '../components/BackButton'
import { scaleMultiplier } from '../constants'
import { connect } from 'react-redux'
import GroupListHeader from '../components/GroupListHeader'

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
                  ? props.translations.labels.done
                  : props.translations.labels.edit}
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
                  ? props.translations.labels.done
                  : props.translations.labels.edit}
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
              onPress={
                props.isConnected
                  ? () =>
                      props.navigation.navigate('AddNewLanguage', {
                        installedLanguageInstances: getInstalledLanguageInstances()
                      })
                  : () =>
                      Alert.alert(
                        props.translations.alerts.addLanguageNoInternet.header,
                        props.translations.alerts.addLanguageNoInternet.text,
                        [
                          {
                            text: props.translations.alerts.options.ok,
                            onPress: () => {}
                          }
                        ]
                      )
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
                {props.translations.labels.newLanguage}
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
    backgroundColor: '#EFF2F4'
  },
  languageList: {
    flex: 1
  },
  addNewLanguageContainer: {
    height: 80 * scaleMultiplier,
    justifyContent: 'center',
    borderTopColor: '#EFF2F4',
    paddingHorizontal: 20
  },
  addNewLanguageText: {
    fontSize: 18 * scaleMultiplier,
    color: '#9FA5AD'
  },
  editButtonContainer: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  editButtonText: {
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
