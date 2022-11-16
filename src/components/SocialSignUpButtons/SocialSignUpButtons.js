import { View, Text } from 'react-native';
import React from 'react';
import CustomButton from '../CustomButton';

const SocialSignUpButtons = () => {
  const onSignInFacebook = () => {
    console.warn("Sign In Facebook");
  }
  const onSignInGoogle = () => {
    console.warn("Sign In Google");
  }
  const onSignInApple = () => {
    console.warn("Sign In Apple");
  }

  return (
    <>
      <CustomButton
        onPress={onSignInFacebook}
        text="Sign In with Facebook"
        bgColor="#E7EAF4"
        fgColor="#4765A9" />
      <CustomButton
        onPress={onSignInGoogle}
        text="Sign In with Google"
        bgColor="#FAE9EA"
        fgColor="#DD4D44" />
      <CustomButton
        onPress={onSignInApple}
        text="Sign In with Apple"
        bgColor="#E3E3E3"
        fgColor="#363636" />
    </>
  );
};

export default SocialSignUpButtons;
