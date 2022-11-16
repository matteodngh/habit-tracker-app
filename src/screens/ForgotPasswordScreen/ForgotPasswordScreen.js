import { View, Text, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';


const ForgotPasswordScreen = () => {
  const { control, handleSubmit } = useForm();

  const navigation = useNavigation();

  const generateCode = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text
  }

  const testEmail = (user) => {
    var code = generateCode();
    fetch(`http://192.168.1.51:8000/forgot/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email,
        subject: 'FORGOT PASSWORD - HABIT TRACKER',
        message: `Hi ${user.username}! Your code for reset a new password is ${code}`,
      })
    })
      .then(ToastAndroid.showWithGravity(
        "Email sent successfully.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      ))
      .then(navigation.navigate('NewPassword', { user: user, code: code }))
  };

  const onSendPressed = (data) => {
    fetch(`http://192.168.1.51:8000/api/users/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(jsonRes => {
        const x = jsonRes.find(({ email }) => email === data.email);
        if (x) {
          testEmail(x);
        }
        else {
          ToastAndroid.showWithGravity(
            "This email is not registered. Go to Sign Up.",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
        }
      })
      .catch(err => console.log(err))
  };

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Reset your password</Text>
        <CustomInput
          name="email"
          control={control}
          placeholder="Email"
          rules={{
            required: 'Email is required',
          }}
        />
        <CustomButton text="Send" onPress={handleSubmit(onSendPressed)} />
        <CustomButton
          text="Back to Sign in"
          onPress={onSignInPress}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
    marginTop: 30
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

export default ForgotPasswordScreen;
