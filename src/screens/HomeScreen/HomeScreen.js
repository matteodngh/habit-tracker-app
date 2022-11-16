import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, BackHandler, ToastAndroid, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import HorizontalDatepicker from '@awrminkhodaei/react-native-horizontal-datepicker';
import moment from 'moment-jalaali';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useIsFocused } from '@react-navigation/native';


const HomeScreen = ({ navigation, route }) => {
  const [gregorianDate, setGregorianDate] = useState(new Date(new Date().toISOString().slice(0, 10)));
  const [update, setUpdate] = useState(false);
  const [dailychecks, setDailyChecks] = useState([]);

  const isFocused = useIsFocused();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    getDailyChecks();
  }, [gregorianDate, update, isFocused])


  const getDailyChecks = async () => {
    var token = await AsyncStorage.getItem('HT_token');
    var user_id = await AsyncStorage.getItem('user_id');
    fetch(`http://192.168.1.51:8000/api/dailychecks/?date=${moment(gregorianDate).locale('en').format('YYYY-MM-DD')}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(jsonRes => {
        const tmp = []
        jsonRes.map((item) => {
          if (item.habit_user == user_id) {
            tmp.push(item);
          }
        })
        setDailyChecks(tmp);
      })
      .catch(err => console.log(err))
  }

  const changeDailyCheck = async (item) => {
    if (new Date(item.date).getTime() <= new Date(new Date().toISOString().slice(0, 10)).getTime() + (60 * 60 * 1000)) {
      var token = await AsyncStorage.getItem('HT_token');
      fetch(`http://192.168.1.51:8000/api/dailychecks/${item.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ done: !item.done })
      })
        .then(resp => {
          setUpdate(!update);
          if (item.done) {
            ToastAndroid.showWithGravity(
              "You changed the habit to NOT DONE",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          } else {
            ToastAndroid.showWithGravity(
              "You have done it, Congratulations!",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          }
        })
        .catch(err => console.log(err))
    } else {
      ToastAndroid.showWithGravity(
        "It's not time to think in future!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  }

  const cardGap = 16;

  const cardWidth = (Dimensions.get('window').width - cardGap * 4) / 2;
  return (
    <View style={styles.container}>
      <View>
        <HorizontalDatepicker
          mode="gregorian"
          startDate={new Date().setDate(new Date().getDate() - 2)}
          endDate={new Date().setDate(new Date().getDate() + 5)}
          initialSelectedDate={new Date(new Date().toISOString().slice(0, 10))}
          onSelectedDateChange={(date) => setGregorianDate(date)}
          selectedItemBackgroundColor="#222831"
          unselectedItemBackgroundColor="#ececec"
          flatListContainerStyle={styles.flatListContainerStyle}
        />
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {dailychecks.length === 0 ?
            (
              (new Date(new Date(gregorianDate).getTime() - (new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0] === (new Date(new Date().getTime() - (new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0] ?
                <Text style={styles.notodo}>No daily habits Today! Start one!</Text> :
                <Text style={styles.notodo}>No daily habits!</Text>
            ) :
            dailychecks.map((item, i) => {
              return (
                <TouchableOpacity
                  onPress={() => changeDailyCheck(item)}
                  key={i}
                  style={{
                    elevation: 12,
                    marginVertical: cardGap,
                    marginLeft: i % 2 !== 0 ? cardGap : 0,
                    width: cardWidth,
                    height: 100,
                    borderRadius: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: item.done ? '#adebad' : '#ffcccc',
                  }}
                >
                  {item.done
                    ? <Ionicons name='checkmark-circle' size={40} color={'#2eb82e'} />
                    : <Ionicons name='close-circle' size={40} color={'#e60000'} />}
                  <Text style={styles.itemText}>{item.habit_name}</Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  containerList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemText: {
    fontSize: 20,
  },
  notodo: {
    fontSize: 24,
    padding: 20,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#618685'
  }
});

export default HomeScreen;