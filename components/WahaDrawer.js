import * as WebBrowser from 'expo-web-browser'
import React, { useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { connect } from 'react-redux'
import GroupAvatar from '../components/GroupAvatar'
import DrawerItem from '../components/list-items/DrawerItem'
import SmallDrawerItem from '../components/list-items/SmallDrawerItem'
import { scaleMultiplier } from '../constants'
import AddEditGroupModal from '../modals/AddEditGroupModal'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function WahaDrawer ({
  // Props passed from navigation.
  navigation: { navigate },
  // Props passed from redux.
  primaryColor,
  isRTL,
  activeGroup,
  translations,
  font
}) {
  const [showEditGroupModal, setShowEditGroupModal] = useState(false)

  //+ FUNCTIONS

  // opens a local browser
  async function openBrowser (url) {
    await WebBrowser.openBrowserAsync(url, { dismissButtonStyle: 'cancel' })
  }

  //+ RENDER

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: primaryColor }]}
      forceInset={{ top: 'always', bottom: 'never', horizontal: 'never' }}
    >
      <View style={styles.drawerHeaderContainer}>
        <View style={styles.groupIconContainer}>
          <GroupAvatar
            style={{ backgroundColor: colors.athens }}
            emoji={activeGroup.emoji}
            size={120}
            onPress={() => setShowEditGroupModal(true)}
          />
        </View>
        <Text
          style={StandardTypography(
            { font, isRTL },
            'h2',
            'Black',
            'center',
            colors.white
          )}
          numberOfLines={2}
        >
          {activeGroup.name}
        </Text>
        {/* <View style={styles.pencilIconContainer}>
          <TouchableOpacity onPress={() => setShowEditGroupModal(true)}>
            <Icon
              name='pencil'
              size={25 * scaleMultiplier}
              color={colors.white}
            />
          </TouchableOpacity>
        </View> */}
      </View>
      <View style={{ backgroundColor: colors.white, flex: 1 }}>
        <View style={{ flex: 1 }}>
          <DrawerItem
            iconName='group'
            text={translations.groups.header}
            onPress={() => navigate('Groups')}
          />
          <DrawerItem
            iconName='security'
            text={translations.security.header}
            onPress={() => navigate('SecurityMode')}
          />
          <DrawerItem
            iconName='boat'
            text={translations.mobilization_tools.header}
            onPress={() => navigate('MobilizationTools')}
          />
          <DrawerItem
            iconName='storage'
            text={translations.storage.header}
            onPress={() => navigate('Storage')}
          />
          <DrawerItem
            iconName='email'
            text={translations.general.feedback}
            onPress={() =>
              openBrowser('https://coda.io/form/Waha-Bug-Report_dyWvuvL6WTx')
            }
          />
        </View>
        <SafeAreaView
          style={[
            styles.smallDrawerItemsContainer,
            {
              flexDirection:
                Dimensions.get('window').height < 550
                  ? isRTL
                    ? 'row-reverse'
                    : 'row'
                  : 'column'
            }
          ]}
        >
          <SmallDrawerItem
            onPress={() =>
              openBrowser(
                'https://kingdomstrategies.givingfuel.com/general-giving'
              )
            }
            label={translations.general.donate_to_waha}
          />
          <SmallDrawerItem
            onPress={() => openBrowser('https://waha.app/privacy-policy/')}
            label={translations.general.privacy}
          />
          <View
            style={{
              justifyContent: 'center',
              paddingHorizontal: 10,
              marginVertical: 5
            }}
          >
            <Text
              style={StandardTypography(
                { font, isRTL },
                'd',
                'Regular',
                'left',
                colors.chateau
              )}
            >
              v1.0.4
            </Text>
          </View>
        </SafeAreaView>
      </View>
      <AddEditGroupModal
        isVisible={showEditGroupModal}
        hideModal={() => setShowEditGroupModal(false)}
        type='EditGroup'
        groupName={activeGroup.name}
      />
    </SafeAreaView>
  )
}

//+ REDUX

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  drawerHeaderContainer: {
    width: '100%',
    height: 225 * scaleMultiplier,
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 35
  },
  groupIconContainer: {
    alignItems: 'center',
    marginVertical: 10
  },
  pencilIconContainer: {
    alignSelf: 'flex-end',
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
    height: '100%'
  },
  smallDrawerItemsContainer: {
    width: '100%',
    justifyContent: 'space-between'
  }
})

//+ REDUX

function mapStateToProps (state) {
  var activeGroup = state.groups.filter(
    item => item.name === state.activeGroup
  )[0]
  return {
    primaryColor: state.database[activeGroup.language].primaryColor,
    isRTL: state.database[activeGroup.language].isRTL,
    activeGroup: activeGroup,
    translations: state.database[activeGroup.language].translations,
    font: getLanguageFont(activeGroup.language),
    isConnected: state.network.isConnected
  }
}

export default connect(mapStateToProps)(WahaDrawer)
