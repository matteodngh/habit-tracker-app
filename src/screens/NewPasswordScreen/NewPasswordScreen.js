import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useForm } from 'react-hook-form';

const NewPasswordScreen = ({ navigation, route }) => {
  const { control, handleSubmit } = useForm();

  const code = route.params.code;
  const user = route.params.user;

  const testEmail = () => {
    fetch(`http://192.168.1.51:8000/forgot/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email,
        subject: 'PASSWORD UPDATED - HABIT TRACKER',
        message: `Hi ${user.username}! Your Password has been updated! Go to Login!`,
      })
    })
  }

  const onSubmitPressed = (data) => {
    if (data.code === code) {
      fetch(`http://192.168.1.51:8000/api/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: data.password,
        })
      })
        .then(testEmail())
        .then(navigation.navigate('SignIn'))
        .catch(err => console.log(err))
    }
  }
  const onSignInPressed = () => {
    navigation.navigate('SignIn');
  }

  return (
    <ScrollView>
      <View style={styles.root}>
        <Text style={styles.title}>Reset your password</Text>
        <CustomInput
          name="code"
          placeholder="Code"
          control={control}
          rules={{
            required: 'Code is required',
            validate: value => value === code || 'Code do not match',
          }}
        />
        <CustomInput
          name="password"
          placeholder="Enter your new password"
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password should be at least 8 characters long',
            }
          }}
          secureTextEntry
        />
        <CustomButton
          onPress={handleSubmit(onSubmitPressed)}
          text="Submit" />
        <CustomButton
          onPress={onSignInPressed}
          text="Back to Sign In"
          type='TERTIARY' />
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

export default NewPasswordScreen;
