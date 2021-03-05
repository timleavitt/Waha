import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import { connect } from 'react-redux'
import BackButton from '../components/standard/BackButton'
import WahaButton from '../components/standard/WahaButton'
import { scaleMultiplier } from '../constants'
import db from '../firebase/db'
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

function ContactUsScreen ({
  navigation: { setOptions, goBack },
  // Props passed from redux.
  activeGroup,
  activeDatabase,
  isRTL,
  font,
  translations
}) {
  const [emailTextInput, setEmailTextInput] = useState(null)
  const [messageTextInput, setMessageTextInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [emailError, setEmailError] = useState(null)

  const [emailInputRef, setEmailInputRef] = useState()

  function getNavOptions () {
    return {
      headerRight: isRTL
        ? () => <BackButton onPress={() => goBack()} />
        : () => {},
      headerLeft: isRTL
        ? () => {}
        : () => <BackButton onPress={() => goBack()} />
    }
  }

  useEffect(() => {
    setOptions(getNavOptions())
  }, [])

  useEffect(() => {
    if (emailTextInput !== null) {
      checkEmail()
    }
  }, [emailTextInput])

  function checkEmail () {
    if (emailTextInput.match(/^.+@.+\..+$/)) setEmailError(false)
    else setEmailError(true)
  }

  var asteriskComponent = isRTL ? (
    <Text
      style={[
        StandardTypography({ font, isRTL }, 'h3', 'Bold', 'left', colors.red)
      ]}
    >
      {'* '}
    </Text>
  ) : (
    <Text
      style={[
        StandardTypography({ font, isRTL }, 'h3', 'Bold', 'left', colors.red)
      ]}
    >
      {' *'}
    </Text>
  )

  var leftAsterisk = isRTL ? asteriskComponent : null
  var rightAsterisk = isRTL ? null : asteriskComponent

  return (
    <SafeAreaView style={styles.screen}>
      {/* <ScrollView> */}
      {/* <View
        style={{
          width: '100%',
          paddingHorizontal: 20,
          marginVertical: 20 * scaleMultiplier
        }}
      >
        <Text
          style={StandardTypography(
            { font, isRTL },
            'h2',
            'Black',
            'left',
            colors.shark
          )}
        >
          Contact Us
        </Text>
      </View> */}
      <ScrollView
        bounces={false}
        style={{
          width: Dimensions.get('window').width,
          flex: 1,
          paddingHorizontal: 20
        }}
      >
        <View
          style={{
            width: '100%',
            // paddingHorizontal: 20,
            justifyContent: 'center',
            marginVertical: 20 * scaleMultiplier
          }}
        >
          <Text
            style={[
              StandardTypography(
                { font, isRTL },
                'h3',
                'Bold',
                'left',
                colors.shark
              ),
              {
                marginVertical: 10
              }
            ]}
          >
            {leftAsterisk}
            {translations.contact_us.email_label}
            {rightAsterisk}
          </Text>
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TextInput
              onChangeText={text => setEmailTextInput(text)}
              autoCapitalize='none'
              autoCorrect={false}
              spellCheck={false}
              style={[
                StandardTypography(
                  { font, isRTL },
                  'h3',
                  'Regular',
                  'left',
                  colors.shark
                ),
                {
                  flex: 1,
                  borderRadius: 10,
                  height: 60 * scaleMultiplier,
                  backgroundColor: colors.porcelain,
                  paddingHorizontal: 20
                }
              ]}
              keyboardType='email-address'
            />
            {emailError !== null ? (
              <View
                style={{
                  width: 50 * scaleMultiplier,
                  height: 50 * scaleMultiplier,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Icon
                  name={emailError ? 'cancel' : 'check'}
                  color={emailError ? colors.red : colors.apple}
                  size={
                    emailError ? 45 * scaleMultiplier : 40 * scaleMultiplier
                  }
                />
              </View>
            ) : null}
          </View>
        </View>
        <View
          style={{
            width: '100%',
            // paddingHorizontal: 20,
            justifyContent: 'center'
          }}
        >
          <View
            style={{
              flexDirection: isRTL ? 'row-reverse' : 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text
              style={[
                StandardTypography(
                  { font, isRTL },
                  'h3',
                  'Bold',
                  'left',
                  colors.shark
                ),
                {
                  marginVertical: 10 * scaleMultiplier
                }
              ]}
            >
              {leftAsterisk}
              {translations.contact_us.message_label}
              {rightAsterisk}
            </Text>
            <Text
              style={[
                StandardTypography(
                  { font, isRTL },
                  'h4',
                  'regular',
                  'left',
                  messageTextInput.length > 500 ? colors.red : colors.chateau
                )
              ]}
            >
              {messageTextInput.length + '/500'}
            </Text>
          </View>
          <TextInput
            onChangeText={text => setMessageTextInput(text)}
            style={[
              StandardTypography(
                { font, isRTL },
                'h3',
                'Regular',
                'left',
                colors.shark
              ),
              {
                // flex: 1,
                borderRadius: 10,
                height: 200 * scaleMultiplier,
                backgroundColor: colors.porcelain,
                paddingTop: 20,
                paddingBottom: 20,
                paddingHorizontal: 20,
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }
            ]}
            multiline
          />
        </View>
        <WahaButton
          type={
            emailError ||
            emailTextInput === null ||
            messageTextInput.length > 500
              ? 'inactive'
              : 'filled'
          }
          color={
            emailError ||
            emailTextInput === null ||
            messageTextInput.length > 500
              ? colors.geyser
              : colors.apple
          }
          useDefaultFont={false}
          label={
            isSubmitting ? '' : translations.contact_us.submit_button_label
          }
          width={Dimensions.get('window').width / 3}
          onPress={() => {
            setIsSubmitting(true)
            db.collection('feedback')
              .add({
                language: activeGroup.language,
                contactEmail: activeDatabase.contactEmail,
                email: emailTextInput,
                message: messageTextInput
              })
              .then(() => {
                setIsSubmitting(false)
                Alert.alert(
                  translations.contact_us.popups.submitted_successfully_title,
                  translations.contact_us.popups.submitted_successfully_message,
                  [
                    {
                      text: translations.general.ok,
                      onPress: () => {
                        goBack()
                      }
                    }
                  ]
                )
              })
              .catch(() => {
                setIsSubmitting(false)
                Alert.alert(
                  translations.contact_us.popups.submit_error_title,
                  translations.contact_us.popups.submit_error_message,
                  [
                    {
                      text: translations.general.ok,
                      onPress: () => {}
                    }
                  ]
                )
              })
          }}
          style={{
            height: 68 * scaleMultiplier,
            alignSelf: isRTL ? 'flex-start' : 'flex-end'
          }}
          extraComponent={
            isSubmitting ? (
              <View>
                <ActivityIndicator color={colors.white} />
              </View>
            ) : null
          }
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.aquaHaze
  }
})

export default connect(mapStateToProps)(ContactUsScreen)
