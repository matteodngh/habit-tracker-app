import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePassword = ({ navigation, route }) => {
  const { control, handleSubmit, watch } = useForm();
  const password = watch('password');

  const onSavePressed = async data => {
    const user_id = await AsyncStorage.getItem('user_id');
    fetch(`http://192.168.1.51:8000/api/users/${user_id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: data.password
      })
    })
      .then(navigation.goBack())
      .catch(err => console.log(err))
  }


  return (
    <ScrollView>
      <View style={styles.root}>
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
        <CustomInput
          name="password-repeat"
          control={control}
          placeholder="Repeat Password"
          secureTextEntry
          rules={{
            validate: value => value === password || 'Password do not match',
          }}
        />
        <CustomButton
          onPress={handleSubmit(onSavePressed)}
          text="Save" />
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

export default ChangePassword;
