import React, { useEffect, useState } from 'react'
import {
  Clipboard,
  FlatList,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import SnackBar from 'react-native-snackbar-component'
import { connect } from 'react-redux'
import GroupItemMT from '../components/GroupItemMT'
import WahaBackButton from '../components/WahaBackButton'
import WahaBlurb from '../components/WahaBlurb'
import WahaHero from '../components/WahaHero'
import WahaItem from '../components/WahaItem'
import WahaSeparator from '../components/WahaSeparator'
import { scaleMultiplier } from '../constants'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'
function mapStateToProps (state) {
  return {
    database: state.database,
    isRTL: activeDatabaseSelector(state).isRTL,
    t: activeDatabaseSelector(state).translations,
    font: getLanguageFont(activeGroupSelector(state).language),

    areMobilizationToolsUnlocked: state.areMobilizationToolsUnlocked,
    groups: state.groups
  }
}

/**
 * Screen that shows information about the Mobilization Tools and a button to unlock them.
 */
const MobilizationToolsScreen = ({
  // Props passed from navigation.
  navigation: { setOptions, goBack, navigate },
  // Props passed from redux.
  database,
  isRTL,
  t,
  font,

  areMobilizationToolsUnlocked,
  groups
}) => {
  const [showSnackbar, setShowSnackbar] = useState(false)

  /** useEffect function that sets the navigation options for this screen. */
  useEffect(() => {
    setOptions({
      headerRight: isRTL
        ? () => <WahaBackButton onPress={() => goBack()} />
        : () => <View></View>,
      headerLeft: isRTL
        ? () => <View></View>
        : () => <WahaBackButton onPress={() => goBack()} />
    })
  }, [])

  // /**
  //  * Renders the GroupItemMT component used for the Groups SectionList item.
  //  * @param {Object} group - The object for the group to render.
  //  * @return {Component} - The GroupItemMT component.
  //  */
  function renderGroupItem ({ item }) {
    return <GroupItemMT thisGroup={item} />
  }

  return (
    <View style={styles.screen}>
      <WahaHero source={require('../assets/lotties/mob_tools_unlocked.json')} />
      <WahaBlurb
        text={
          areMobilizationToolsUnlocked
            ? t.mobilization_tools && t.mobilization_tools.blurb_post_unlock
            : t.mobilization_tools && t.mobilization_tools.blurb_pre_unlock
        }
      />
      {areMobilizationToolsUnlocked ? (
        <FlatList
          bounces={false}
          data={groups
            .sort((a, b) => a.groupID < b.groupID)
            .sort(
              (a, b) =>
                database[a.language].installTime >
                database[b.language].installTime
            )}
          renderItem={renderGroupItem}
          style={{ width: '100%' }}
          ListHeaderComponent={() => (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 25 * scaleMultiplier
                }}
              >
                <TouchableOpacity
                  style={{
                    borderRadius: 15,
                    // borderWidth: 1.5,
                    // backgroundColor: colors.porcelain,
                    overflow: 'hidden'
                  }}
                  onPress={() => {
                    setShowSnackbar(true)
                    setTimeout(() => setShowSnackbar(false), 1500)
                    Clipboard.setString(
                      `${t.mobilization_tools &&
                        t.mobilization_tools
                          .share_message_1}\n${t.mobilization_tools &&
                        t.mobilization_tools
                          .share_message_2}\n${t.mobilization_tools &&
                        t.mobilization_tools
                          .share_message_3}\n${t.mobilization_tools &&
                        t.mobilization_tools
                          .share_message_4}\n${t.mobilization_tools &&
                        t.mobilization_tools.share_message_5}`
                    )
                  }}
                >
                  <View
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      // height: '100%',
                      // width: '100%',
                      backgroundColor: colors.porcelain,
                      borderBottomWidth: 4,
                      borderBottomColor: colors.geyser
                    }}
                  >
                    <Text
                      style={StandardTypography(
                        { font, isRTL },
                        'h4',
                        'Regular',
                        'center',
                        colors.shark
                      )}
                    >
                      {t.mobilization_tools && t.mobilization_tools.unlock_code}
                    </Text>
                    <Text
                      style={StandardTypography(
                        { font, isRTL },
                        'h1',
                        'Bold',
                        'center',
                        colors.shark
                      )}
                    >
                      2 8 1 8 2 0
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center'
                    // position: 'absolute',
                    // right: -35 * scaleMultiplier
                  }}
                  onPress={() =>
                    Share.share({
                      message: `${t.mobilization_tools &&
                        t.mobilization_tools
                          .share_message_1}\n${t.mobilization_tools &&
                        t.mobilization_tools
                          .share_message_2}\n${t.mobilization_tools &&
                        t.mobilization_tools
                          .share_message_3}\n${t.mobilization_tools &&
                        t.mobilization_tools
                          .share_message_4}\n${t.mobilization_tools &&
                        t.mobilization_tools.share_message_5}`
                    })
                  }
                >
                  <Icon
                    name={Platform.OS === 'ios' ? 'share-ios' : 'share-android'}
                    color={colors.tuna}
                    size={30 * scaleMultiplier}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  StandardTypography(
                    { font, isRTL },
                    'h2',
                    'Bold',
                    'left',
                    colors.shark
                  ),
                  {
                    paddingHorizontal: 20,
                    marginBottom: 10,
                    fontSize: 22 * scaleMultiplier
                  }
                ]}
              >
                Show Mobilization Tab
              </Text>
              <WahaSeparator />
            </View>
          )}
          keyExtractor={item => item.name}
          ListFooterComponent={() => <WahaSeparator />}
          ItemSeparatorComponent={() => <WahaSeparator />}
        />
      ) : (
        <View style={{ width: '100%' }}>
          <WahaSeparator />
          <WahaItem
            title={
              t.mobilization_tools &&
              t.mobilization_tools.unlock_mobilization_tools
            }
            onPress={() => navigate('MobilizationToolsUnlock')}
          >
            <Icon
              name={isRTL ? 'arrow-left' : 'arrow-right'}
              color={colors.tuna}
              size={50 * scaleMultiplier}
            />
          </WahaItem>
          <WahaSeparator />
        </View>
      )}
      <SnackBar
        visible={showSnackbar}
        textMessage={t.general && t.general.copied_to_clipboard}
        messageStyle={{
          color: colors.white,
          fontSize: 24 * scaleMultiplier,
          fontFamily: font + '-Black',
          textAlign: 'center'
        }}
        backgroundColor={colors.apple}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze,
    alignItems: 'center'
  }
})

export default connect(mapStateToProps)(MobilizationToolsScreen)
