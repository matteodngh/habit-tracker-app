import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  ToastAndroid
} from 'react-native';
import Logo from '../../../assets/images/Logo_3.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignUpButtons from '../../components/SocialSignUpButtons';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = () => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getData();
  }, [])

  const saveData = async (token, user_id) => {
    try {
      await AsyncStorage.setItem('HT_token', token);
      await AsyncStorage.setItem('user_id', user_id.toString())
      return true;
    } catch {
      return false;
    }

  }

  const getData = async () => {
    const token = await AsyncStorage.getItem('HT_token');
    if (token) navigation.navigate("InitialTab");
  }

  const onSignInPressed = async data => {
    fetch(`http://192.168.1.51:8000/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: data.username, password: data.password })
    })
      .then(res => res.json())
      .then(res => {
        if (res.token) {
          const ret = saveData(res.token, res.user_id);
          if (ret) {
            navigation.navigate("InitialTab", { screen: 'Home' });
          } else {
            ToastAndroid.showWithGravity(
              "Credentials are not valid",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          }
        } else {
          ToastAndroid.showWithGravity(
            "Credentials are not valid",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
        }
      })
      .catch(err => console.log(err))
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, { height: height * 0.3 }]}
          resizeMode="contain"
        />

        <CustomInput
          name="username"
          placeholder="Username"
          control={control}
          rules={{ required: 'Username is required' }}
        />

        <CustomInput
          name="password"
          placeholder="Password"
          secureTextEntry
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 3,
              message: 'Password should be minimum 3 characters long',
            },
          }}
        />

        <CustomButton
          text='Sign In'
          onPress={handleSubmit(onSignInPressed)}
        />

        <CustomButton
          text="Forgot password?"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />

        <CustomButton
          text="Don't have an account? Create one"
          onPress={onSignUpPress}
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
});

export default SignInScreen;