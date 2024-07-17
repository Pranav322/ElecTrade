import { StyleSheet, Text, View, Pressable, SafeAreaView, ActivityIndicator } from "react-native";
import {
  WalletConnectModal,
  useWalletConnectModal,
} from "@walletconnect/modal-react-native";
import * as yup from 'yup';
import { Formik } from 'formik';
import { useState } from 'react';
import axios from './../api/axios';
import { COLORS } from "./../constants";
import {
  Line,
  MsgBox,
  SubTitle,
  TextLink,
  ExtraView,
  PageTitle,
  ExtraText,
  ButtonText,
  FormikError,
  StyledButton,
  InnerContainer,
  StyledFormArea,
  StyledContainer,
  TextLinkContent,
} from './../components/StyledComponents';
import { FocusedStatusBar, SharedTextInput } from './../components';
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

const projectId = "eb06f2058f29317486a4c09cc5308530";

const providerMetadata = {
  name: "YOUR_PROJECT_NAME",
  description: "YOUR_PROJECT_DESCRIPTION",
  url: "https://your-project-website.com/",
  icons: ["https://your-project-logo.com/"],
  redirect: {
    native: "YOUR_APP_SCHEME://",
    universal: "YOUR_APP_UNIVERSAL_LINK.com",
  },
};
const Signup = ({ navigation }) => {
  const { open, isConnected, address, provider } = useWalletConnectModal();

  const handleButtonPress = async () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    return open();
  };

  const signupValidationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is Required'),
    lastName: yup.string()
    .required('last name is Required'),
    // .matches(/^[0-9a-fA-F]+$/, 'Please enter a valid hexadecimal Meter ID'),
    email: yup.string().email("Please enter a valid email").required('Email Address is Required'),
    password: yup.string().min(8, ({ min }) => `Password must be at least ${min} characters`).required('Password is required'),
    walletAddress: yup.string().required('Wallet Address is Required'),
  });

  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const handleSignup = async (formValues, setSubmitting) => {
    handleMessage(null);

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await axios.post("/api/users", JSON.stringify({
        first_name: formValues.firstName,
        last_name: formValues.lastName,
        email: formValues.email,
        profile_image: "",
        user_status: "UNVERIFIED",
        hashed_password: formValues.password,
        wallet_address: formValues.walletAddress
      }), config);

      const result = response.data;
      const { status, message, email } = result;

      if (status !== 'SUCCESS') {
        handleMessage(message, status);
      } else {
        navigation.navigate('Verification', {
          email: email
        });
      }
    } catch (error) {
      handleMessage('An error occurred. Check your network and try again');
    }
    setSubmitting(false);
  };

  const handleMessage = (message, type = '') => {
    setMessage(message);
    setMessageType(type);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingWrapper>
        <StyledContainer>
          <FocusedStatusBar background={COLORS.primary} />
          <InnerContainer>
            <PageTitle>ElecTrade</PageTitle>
            <SubTitle>Create Account</SubTitle>
            <Formik
              initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', walletAddress: '' }}
              validationSchema={signupValidationSchema}
              onSubmit={(values, { setSubmitting }) => {
                if (
                  values.email === '' ||
                  values.password === '' ||
                  values.firstName === '' ||
                  values.lastName === '' ||
                  values.confirmPassword === '' ||
                  values.walletAddress === ''
                ) {
                  handleMessage('Please fill in all fields');
                  setSubmitting(false);
                } else if (values.password !== values.confirmPassword) {
                  handleMessage('Passwords do not match');
                  setSubmitting(false);
                } else {
                  handleSignup(values, setSubmitting);
                }
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, errors, touched, setFieldValue }) => {
                // Set walletAddress field value when connected
                if (isConnected && values.walletAddress !== address) {
                  setFieldValue('walletAddress', address);
                }

                return (
                  <StyledFormArea>
                    <SharedTextInput
                      label="First Name"
                      placeholder="Otsogile "
                      placeholderTextColor={COLORS.darkLight}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      value={values.firstName}
                      icon="person"
                    />
                    {touched.firstName && errors.firstName && <FormikError>{errors.firstName}</FormikError>}

                    <SharedTextInput
                      label="last name"
                      placeholder="Onalepelo "
                      placeholderTextColor={COLORS.darkLight}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      value={values.lastName}
                      icon="person"
                    />
                    {touched.lastName && errors.lastName && <FormikError>{errors.lastName}</FormikError>}

                    <SharedTextInput
                      label="Email Address"
                      placeholder="hireme@morena.dev"
                      placeholderTextColor={COLORS.darkLight}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      keyboardType="email-address"
                      icon="mail"
                    />
                    {touched.email && errors.email && <FormikError>{errors.email}</FormikError>}

                    <SharedTextInput
                      label="Password"
                      placeholder="* * * * * * * *"
                      placeholderTextColor={COLORS.darkLight}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureTextEntry={hidePassword}
                      icon="lock"
                      isPassword={true}
                      hidePassword={hidePassword}
                      setHidePassword={setHidePassword}
                    />
                    {touched.password && errors.password && <FormikError>{errors.password}</FormikError>}

                    <SharedTextInput
                      label="Confirm Password"
                      placeholder="* * * * * * * *"
                      placeholderTextColor={COLORS.darkLight}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      value={values.confirmPassword}
                      secureTextEntry={hidePassword}
                      icon="lock"
                      isPassword={true}
                      hidePassword={hidePassword}
                      setHidePassword={setHidePassword}
                    />
                    {touched.confirmPassword && errors.confirmPassword && <FormikError>{errors.confirmPassword}</FormikError>}

                    <Pressable onPress={handleButtonPress} style={styles.walletButton}>
                      <Text style={styles.walletButtonText}>{isConnected ? "Disconnect Wallet" : "Connect Wallet"}</Text>
                    </Pressable>

                    <SharedTextInput
                      label="Wallet Address"
                      placeholder="Connect to get address"
                      placeholderTextColor={COLORS.darkLight}
                      onChangeText={handleChange('walletAddress')}
                      onBlur={handleBlur('walletAddress')}
                      value={isConnected ? address : values.walletAddress}
                      icon="credit-card"
                      editable={false}
                    />
                    {touched.walletAddress && errors.walletAddress && <FormikError>{errors.walletAddress}</FormikError>}

                    <MsgBox type={messageType}>{message}</MsgBox>

                    {!isSubmitting && (
                      <StyledButton onPress={handleSubmit}>
                        <ButtonText>Signup</ButtonText>
                      </StyledButton>
                    )}

                    {isSubmitting && (
                      <StyledButton disabled={true}>
                        <ActivityIndicator size="large" color={COLORS.white} />
                      </StyledButton>
                    )}

                    <Line />
                    <ExtraView>
                      <ExtraText>Already have an account? </ExtraText>
                      <TextLink onPress={() => navigation.navigate('Login')}>
                        <TextLinkContent>Login</TextLinkContent>
                      </TextLink>
                    </ExtraView>
                  </StyledFormArea>
                );
              }}
            </Formik>
            <WalletConnectModal
              projectId={projectId}
              providerMetadata={providerMetadata}
            />
          </InnerContainer>
        </StyledContainer>
      </KeyboardAvoidingWrapper>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  walletButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  walletButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
});
