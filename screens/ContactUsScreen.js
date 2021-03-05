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
    isRTL: activeDatabaseSelector(state).isRTL,
    font: getLanguageFont(activeGroupSelector(state).language),
    translations: activeDatabaseSelector(state).translations
  }
}

function ContactUsScreen ({
  navigation: { setOptions, goBack },
  // Props passed from redux.
  activeGroup,
  isRTL,
  font,
  translations
}) {
  const [emailTextInput, setEmailTextInput] = useState(null)
  const [messageTextInput, setMessageTextInput] = useState(null)
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
            Email
            <Text
              style={[
                StandardTypography(
                  { font, isRTL },
                  'h3',
                  'Bold',
                  'left',
                  colors.red
                )
              ]}
            >
              {' *'}
            </Text>
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
            Message
            <Text
              style={[
                StandardTypography(
                  { font, isRTL },
                  'h3',
                  'Bold',
                  'left',
                  colors.red
                )
              ]}
            >
              {' *'}
            </Text>
          </Text>
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
                alignItems: 'flex-start',
                marginBottom: 10 * scaleMultiplier
              }
            ]}
            multiline
          />
        </View>
        {/* <KeyboardAvoidingView
          behavior='padding'
          // style={{ width: '100%', position: 'absolute', bottom: 0 }}
        > */}
        <WahaButton
          type={emailError ? 'inactive' : 'filled'}
          color={emailError ? colors.geyser : colors.apple}
          useDefaultFont={false}
          label={isSubmitting ? '' : 'Submit'}
          width={Dimensions.get('window').width / 3}
          onPress={() => {
            setIsSubmitting(true)
            db.collection('feedback')
              .add({
                language: activeGroup.language,
                contactEmail: 'trent@waha.app',
                email: emailTextInput,
                message: messageTextInput
              })
              .then(() => {
                setIsSubmitting(false)
                Alert.alert(
                  'Message sent successfully.',
                  "Thanks for contacting us! We'll get back to you as soon as we can.",
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
                Alert.alert(
                  'There was an error sending your message.',
                  'Please check your internet connection and try again.',
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
            alignSelf: 'flex-end'
            // marginBottom: 30 * scaleMultiplier
            // position: 'absolute',
            // bottom: 0
          }}
          extraComponent={
            isSubmitting ? (
              <View>
                <ActivityIndicator color={colors.white} />
              </View>
            ) : null
          }
        />
        {/* </KeyboardAvoidingView> */}
        {/* </ScrollView> */}
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
  },
  formItemContainer: {
    width: '100%',
    height: 100 * scaleMultiplier,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: 'green'
  }
})

export default connect(mapStateToProps)(ContactUsScreen)
