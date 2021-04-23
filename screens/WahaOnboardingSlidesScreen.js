import React, { useRef, useState } from 'react'
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import PagerView from 'react-native-pager-view'
import { connect } from 'react-redux'
import EmojiViewer from '../components/EmojiViewer'
import GroupNameTextInput from '../components/GroupNameTextInput'
import OnboardingPage from '../components/OnboardingPage'
import PageDots from '../components/PageDots'
import WahaButton from '../components/WahaButton'
import { groupNames, scaleMultiplier } from '../constants'
import { changeActiveGroup } from '../redux/actions/activeGroupActions'
import { setHasOnboarded } from '../redux/actions/databaseActions'
import { editGroup } from '../redux/actions/groupsActions'
import {
  activeDatabaseSelector,
  activeGroupSelector
} from '../redux/reducers/activeGroup'
import { colors } from '../styles/colors'
import { getLanguageFont, StandardTypography } from '../styles/typography'

function mapStateToProps (state) {
  console.log(state.activeGroup)
  return {
    translations: activeDatabaseSelector(state).translations,
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setHasOnboarded: toSet => dispatch(setHasOnboarded(toSet)),
    editGroup: (oldGroupName, newGroupName, emoji) =>
      dispatch(editGroup(oldGroupName, newGroupName, emoji)),
    changeActiveGroup: groupName => dispatch(changeActiveGroup(groupName))
  }
}

const numPages = 4

const WahaOnboardingSlidesScreen = ({
  // Props passed from navigation.
  navigation: { navigate },
  route: {
    // Props passed from previous screen.
    params: { selectedLanguage }
  },
  // Props passed from redux.
  translations,
  isRTL,
  font,
  setHasOnboarded,
  editGroup,
  changeActiveGroup
}) => {
  const pagerRef = useRef()
  const [activePage, setActivePage] = useState(1)

  const [emojiInput, setEmojiInput] = useState('default')
  /** Keeps track of the user input for the group name <TextInput />. */
  const [groupNameInput, setGroupNameInput] = useState('')

  // tells redux that we're ready to go to loading screen once onboarding is finished
  function finishOnboarding () {}

  /** Edits a group and sets it as the active group. */
  function finishOnboarding () {
    // If the name of the new group is a duplicate or blank, don't continue.
    if (checkForBlank()) return

    // Change the active group to the newly edited group.
    changeActiveGroup(groupNameInput)

    // Call editGroup() redux function.
    editGroup(groupNames[selectedLanguage], groupNameInput, emojiInput)
    setHasOnboarded(true)
    navigate('Loading', {
      selectedLanguage: selectedLanguage
    })
  }

  /**
   * Checks if a user-inputted group name is blank.
   * @return {boolean} - Whether the group name is blank or not.
   */
  function checkForBlank () {
    if (groupNameInput === '') {
      Alert.alert(
        translations.add_edit_group.popups.blank_group_name_title,
        translations.add_edit_group.popups.blank_group_name_message,
        [{ text: translations.general.ok, onPress: () => {} }]
      )
      return true
    }
    return false
  }

  // const [pages, setPages] = useState([])

  // useEffect(() => {
  //   setPages(pages => pages.concat(<OnboardingPage></OnboardingPage>))
  // }, [])

  return (
    <SafeAreaView style={styles.screen}>
      <PagerView
        ref={pagerRef}
        // showPageIndicator
        style={styles.pager}
        initialPage={isRTL ? pages.length - 1 : 0}
        onPageSelected={stuff => setActivePage(stuff.nativeEvent.position + 1)}
      >
        <OnboardingPage
          key='1'
          title={translations.onboarding.onboarding_1_title}
          message={translations.onboarding.onboarding_1_message}
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri:
                  'https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/_assets%2Fonboarding_2.gif?alt=media'
              }}
            />
          </View>
        </OnboardingPage>
        <OnboardingPage
          key='2'
          title={translations.onboarding.onboarding_2_title}
          message={translations.onboarding.onboarding_2_message}
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri:
                  'https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/_assets%2Fonboarding_2.gif?alt=media'
              }}
            />
          </View>
        </OnboardingPage>
        <OnboardingPage
          key='3'
          title={translations.onboarding.onboarding_3_title}
          message={translations.onboarding.onboarding_3_message}
        >
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri:
                  'https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/_assets%2Fonboarding_2.gif?alt=media'
              }}
            />
          </View>
        </OnboardingPage>
        <OnboardingPage
          key='4'
          title={translations.onboarding.onboarding_4_title}
          message={translations.onboarding.onboarding_4_message}
        >
          <GroupNameTextInput
            groupNameInput={groupNameInput}
            setGroupNameInput={setGroupNameInput}
          />
          <EmojiViewer emojiInput={emojiInput} setEmojiInput={setEmojiInput} />
        </OnboardingPage>
      </PagerView>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20
        }}
      >
        <PageDots numDots={4} activeDot={activePage} />
        <View
          style={{
            height: 65 * scaleMultiplier,
            flex: 1,
            alignItems: 'center',
            // justifyContent: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-end'
            // paddingRight: 10
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setHasOnboarded(true)
              navigate('Loading', {
                selectedLanguage: selectedLanguage
              })
            }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text
              style={StandardTypography(
                { font, isRTL },
                'h4',
                'Bold',
                'center',
                colors.shark
              )}
            >
              Skip
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: 20 }} />
        <WahaButton
          label='Continue'
          onPress={
            isRTL
              ? activePage === 1
                ? finishOnboarding
                : () => pagerRef.current.setPage(activePage - 1)
              : activePage === 4
              ? finishOnboarding
              : // Confusing, but since the pagerRef pages start at 0 and our page counter starts at 1, we set it to the active page which is actually the next page.
                () => pagerRef.current.setPage(activePage)
          }
          type='filled'
          color={colors.apple}
          style={{
            flex: 2
          }}
        />
      </View>
      {/* <OnboardingSwiper
        sources={[
          require('../assets/onboardingImages/onboarding1.png'),
          require('../assets/onboardingImages/onboarding2.png'),
          require('../assets/onboardingImages/onboarding3.png'),
          require('../assets/onboardingImages/onboarding4.png')
        ]}
        titles={[
          i18n.t('title0'),
          i18n.t('title1'),
          i18n.t('title2'),
          i18n.t('title3')
        ]}
        messages={[
          i18n.t('body0'),
          i18n.t('body1'),
          i18n.t('body2'),
          i18n.t('body3')
        ]}
        onFinish={finishOnboarding}
        nextTranslation={i18n.t('next')}
        startTranslation={i18n.t('start')}
        useDefaultFont={true}
        isRTL={getSystemIsRTL()}
      /> */}
    </SafeAreaView>
  )
}

//+ STYLES

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.aquaHaze,
    justifyContent: 'center'
  },
  pager: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    flex: 1,
    // width: '100%',
    maxWidth: Dimensions.get('window').width - 60,
    maxHeight: Dimensions.get('window').width - 60,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.athens,
    aspectRatio: 1,
    overflow: 'hidden',
    justifyContent: 'center'
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%'
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WahaOnboardingSlidesScreen)
