import { View, Text, ScrollView, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../components/CustomButton';
import DatePicker from 'react-native-neat-date-picker'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomInput from '../../components/CustomInput';
import { useForm } from 'react-hook-form';


const AddHabitScreen = ({ navigation, route }) => {
  const title = route.params.title;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const openDatePicker = () => {
    setShowDatePicker(true)
  }

  const onCancel = () => {
    // You should close the modal in here
    setShowDatePicker(false)
  }

  const onConfirm = (start, end) => {
    // You should close the modal in here
    setShowDatePicker(false)
    // The parameter 'date' is a Date object so that you can use any Date prototype method.
    setStartDate((new Date(start.getTime() - (new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
    setEndDate((new Date(end.getTime() - (new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  }
  function CheckError(response) {
    if (response.status >= 200 && response.status <= 299) {
      return false
    } else {
      return true
    }
  }
  const saveHabit = async data => {
    var token = await AsyncStorage.getItem('HT_token');
    var user_id = await AsyncStorage.getItem('user_id');
    if (endDate == '' || startDate == '') {
      Alert.alert('Please select the range of dates');
    } else {
      fetch(`http://192.168.1.51:8000/api/habits/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          public: false,
          sdate: startDate,
          edate: endDate,
          created_by: user_id
        })
      })
        .then(CheckError)
        .then((res) => {
          res ? Alert.alert('Already exists this habit title') :
            navigation.navigate("InitialTab", { screen: "Home" }
            )
        })
        .catch(err => console.log(err))

    }
  };

  return (
    <View style={styles.root}>
      <CustomInput
        name="title"
        placeholder="Title"
        title={title}
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
        rules={{
          required: 'Description is required',
          maxLength: {
            value: 100,
            message: 'Description should be max 100 characters long',
          },
        }}
      />
      <View style={styles.container}>
        <Text style={styles.labelDate}>Select date range</Text>
        <TouchableOpacity onPress={openDatePicker}>
          <Ionicons name='calendar-outline' size={25} />
        </TouchableOpacity>
        <DatePicker
          isVisible={showDatePicker}
          mode={'range'}
          onCancel={onCancel}
          onConfirm={onConfirm}
          minDate={new Date(new Date().toISOString().slice(0, 10))}
        />
      </View>
      <View style={styles.containerDates}>
        <Text>START DATE: {startDate}    </Text>
        <Text>END DATE: {endDate}</Text>
      </View>
      <CustomButton
        style={styles.addbutton}
        onPress={handleSubmit(saveHabit)}
        text="Add"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    margin: 10,
  },
  labelDate: {
    fontSize: 20,
    width: '90%',
    paddingLeft: 10
  },
  selectedDateContainerStyle: {
    height: 35,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
  },
  selectedDateStyle: {
    fontWeight: "bold",
    color: "white",
  },
  containerPicker: {
    margin: 10,
    height: 35,
    width: '90%',
  },
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 35,
    margin: 20,
  },
  addbutton: {
    width: '100%',
    marginTop: 20
  },
  containerDates: {
    width: '95%',
    margin: 10
  }
});

export default AddHabitScreen;
