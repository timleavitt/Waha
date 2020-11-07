import * as FileSystem from 'expo-file-system'
import React, { useEffect } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { colors, scaleMultiplier } from '../../constants'
function GroupListHeaderMT (props) {
  //+ FUNCTIONS

  useEffect(() => {}, [])

  //+ RENDER

  // if our active language has a toolkit, show the list of groups
  // var list = props.activeDatabase.hasToolkit ? (
  //   <FlatList
  //     data={props.groups.filter(group => group.language === props.languageID)}
  //     renderItem={renderGroupItem}
  //     keyExtractor={item => item.name}
  //   />
  // ) : (
  //   // otherwise, show a message that says MTs are not available for that language
  //   <View
  //     style={{
  //       height: 80 * scaleMultiplier,
  //       justifyContent: 'flex-start',
  //       flexDirection: 'row',
  //       alignItems: 'center',
  //       backgroundColor: colors.white,
  //       margin: 2,
  //       justifyContent: 'center'
  //     }}
  //   >
  //     <Text
  //       style={{
  //         fontFamily: props.font + '-regular',
  //         fontSize: 14 * scaleMultiplier,
  //         color: colors.chateau,
  //         textAlign: 'center'
  //       }}
  //     >
  //       {
  //         props.translations.mobilization_tools
  //           .no_mobilization_tools_content_text
  //       }
  //     </Text>
  //   </View>
  // )

  // // renders a group item
  // function renderGroupItem (groups) {
  //   return <GroupItemMT group={groups.item} />
  // }

  return (
    <View
      style={[
        styles.languageHeaderContainer,
        { flexDirection: props.isRTL ? 'row-reverse' : 'row' }
      ]}
    >
      <View>
        <Text style={Typography(props, 'h3', 'medium', 'left', colors.chateau)}>
          {props.languageName +
            ' ' +
            props.translations.mobilization_tools.groups_label}
        </Text>
        <Text
          style={Typography(props, 'h3', 'regular', 'left', colors.chateau)}
        >
          {
            props.translations.mobilization_tools
              .mobilization_tools_status_label
          }
        </Text>
      </View>
      <Image
        style={styles.languageLogo}
        source={{
          uri: FileSystem.documentDirectory + props.languageID + '-header.png'
        }}
      />
    </View>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  languageHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55 * scaleMultiplier,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: colors.aquaHaze
  },
  languageLogo: {
    resizeMode: 'contain',
    width: 120 * scaleMultiplier,
    height: 16.8 * scaleMultiplier
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
