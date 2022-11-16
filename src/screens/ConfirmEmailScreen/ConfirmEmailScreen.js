import { View, Text, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useForm } from 'react-hook-form';

const ConfirmEmailScreen = ({ navigation, route }) => {
  const { control, handleSubmit } = useForm();

  const user = route.params.user;
  const code = route.params.code;
  let checkCode = code;

  const onConfirmPressed = (data) => {
    if (data.code === checkCode) {
      fetch(`http://192.168.1.51:8000/api/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
          email: user.email,
          first_name: user.first_name
        })
      })
        .then(navigation.navigate('SignIn'))
        .catch(err => console.log(err))
    } else {
      ToastAndroid.showWithGravity(
        "Code not valid. Resend one.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      )
    }
  }

  const generateCode = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text
  }

  const onSignInPressed = () => {
    navigation.navigate('SignIn');
  }
  const onResendPressed = () => {
    var newCode = generateCode();
    fetch(`http://192.168.1.51:8000/send/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email,
        subject: 'FORGOT PASSWORD - HABIT TRACKER',
        message: `Hi ${user.username}! Your code for reset a new password is ${newCode}`,
      })
    })
      .then(res => {
        checkCode = newCode;
      })
      .then(ToastAndroid.showWithGravity(
        "Code resent. Check your email.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      ))
  }

  return (
    <ScrollView>
      <View style={styles.root}>
        <Text style={styles.title}>Confirm your Email</Text>
        <CustomInput
          placeholder="Enter your confirmation code"
          control={control}
          name="code"
          rules={{
            required: 'Confirmation code is required',
            validate: value => value === checkCode || 'Code do not match',
          }}
        />
        <CustomButton
          onPress={handleSubmit(onConfirmPressed)}
          text="Confirm" />
        <CustomButton
          onPress={onResendPressed}
          text="Resend code"
          type="SECONDARY" />
        <CustomButton
          onPress={onSignInPressed}
          text="Back to Sign In"
          type="TERTIARY" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB065',
  }
});

export default ConfirmEmailScreen;
