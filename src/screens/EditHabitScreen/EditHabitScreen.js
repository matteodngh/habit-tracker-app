import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { useForm } from 'react-hook-form';
import Ionicons from 'react-native-vector-icons/Ionicons'

const EditDetailScreen = ({ navigation, route }) => {
  const habit = route.params.habit;

  const deleteYes = async (habit_id) => {
    var token = await AsyncStorage.getItem('HT_token');
    fetch(`http://192.168.1.51:8000/api/habits/${habit_id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(navigation.goBack())
      .catch(err => console.log(err))
  }

  const deleteHabit = (habit_id) => {
    Alert.alert("Delete", "Are you sure?", [
      {
        text: "yes",
        onPress: () => deleteYes(habit_id)
      },
      {
        text: "no",
      }
    ]);
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons name='trash-outline' size={25} onPress={() => deleteHabit(habit.id)} style={styles.trash} />
      ),
    });
  }, [navigation]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const editHabit = async data => {
    var token = await AsyncStorage.getItem('HT_token');
    fetch(`http://192.168.1.51:8000/api/habits/${habit.id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description
      })
    })
      .then(navigation.navigate("ListHabits"))
      .catch(err => console.log(err))
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <CustomInput
          name="title"
          placeholder="Title"
          title={habit.title}
          control={control}
          rules={{
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title should be minimum 3 characters long',
            },
            maxLength: {
              value: 24,
              message: 'Title should be max 24 characters long',
            },
          }}
        />
        <CustomInput
          name="description"
          placeholder="Description"
          control={control}
          title={habit.description}
          rules={{
            required: 'Description is required',
            maxLength: {
              value: 100,
              message: 'Description should be max 100 characters long',
            },
          }}
        />
        <CustomButton
          text="edit"
          onPress={handleSubmit(editHabit)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  label: {
    fontSize: 20,
    width: 250
  },
  labelDate: {
    fontSize: 20,
    width: 250
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    width: 250
  },
});

export default EditDetailScreen;

