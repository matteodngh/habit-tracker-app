import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { summary } from 'date-streaks';
import Swiper from 'react-native-swiper'
import { Calendar } from "react-native-calendars";

import ProgressCircle from 'react-native-progress-circle'

const today = new Date().toISOString().split('T')[0]

const StatsScreen = () => {
  const [habits, setHabits] = useState([]);
  const [dates, setDates] = useState([]);
  const [markedDays, setMarkedDays] = useState(null);
  const [habitFocused, setHabitFocused] = useState();
  const [dailychecks, setDailychecks] = useState([]);

  const getData = async () => {
    var token = await AsyncStorage.getItem('HT_token');
    var user_id = await AsyncStorage.getItem('user_id');
    fetch(`http://192.168.1.51:8000/api/habits/?created_by=${user_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(jsonRes => {
        setHabits(jsonRes);
      })
      .catch(err => console.log(err))
  };


  useEffect(() => {
    getData();
  }, [habitFocused])

  const searchDailyhabits = async (habit_id) => {
    var token = await AsyncStorage.getItem('HT_token');
    fetch(`http://192.168.1.51:8000/api/dailychecks/?habit=${habit_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        setDailychecks(res);
        var dones = [];
        var md = {};
        res.map((item) => {
          if (item.done) {
            md[item.date] = {
              selected: true,
              selectedColor: '#8cc68c',
            };
            dones.push(new Date(item.date));
          } else {
            md[item.date] = {
              selected: true,
              selectedColor: "#ff6666",
            };
          }
          setMarkedDays(md);
          setDates(dones);
        });
      })
      .catch(err => console.log(err))
  }
  const habitClicked = (habit) => {
    setHabitFocused(habit);
    searchDailyhabits(habit.id);
  }


  return (
    <View style={styles.container}>
      {habitFocused && <Text style={{ fontSize: 24, marginVertical: 10 }}>{habitFocused.title.toUpperCase()}</Text>}
      <View style={styles.stats}>
        <Swiper style={styles.wrapper}>
          <View style={styles.slide1}>
            <Text>Summary</Text>
            <View style={styles.circle}>
              <View style={styles.currStreak}>
                <Text style={{ fontSize: 24, fontWeight: '900' }}>{summary(dates).currentStreak}</Text>
                <Text>CURRENT</Text>
                <Text>STREAK</Text>
              </View>
              <ProgressCircle
                percent={~~((dates.length * 100) / dailychecks.length)}
                radius={90}
                borderWidth={8}
                color="#3399FF"
                shadowColor="#999"
                bgColor="#fff"
              >
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 36, marginBottom: 5 }}>{~~((dates.length * 100) / dailychecks.length)}%</Text>
                  <Text style={{ fontSize: 14 }}>COMPLETION RATE</Text>
                </View>
              </ProgressCircle>
              <View style={styles.longStreak}>
                <Text style={{ fontSize: 24, fontWeight: '900' }}>{summary(dates).longestStreak}</Text>
                <Text>LONGEST</Text>
                <Text>STREAK</Text>
              </View>
            </View>
            <View style={styles.counters}>
              <View style={styles.completed}>
                <Text style={{ fontSize: 24, fontWeight: '900', color: 'green' }}>{dates.length}</Text>
                <Text>COMPLETED</Text>
                <Text>DAYS</Text>
              </View>
              <View style={styles.notdone}>
                <Text style={{ fontSize: 24, fontWeight: '900', color: 'red' }}>{dailychecks.length - dates.length}</Text>
                <Text >INCOMPLETED</Text>
                <Text >DAYS</Text>
              </View>
            </View>
          </View>
          <View style={styles.slide2}>
            <Text>Calendar</Text>
            <View style={styles.calendar}>
              <Calendar
                markingType={'custom'}
                markedDates={markedDays}
                current={
                  habitFocused ?
                    ((new Date(habitFocused.edate).getMonth() < new Date(today).getMonth()) ||
                      (new Date(habitFocused.sdate).getMonth() > new Date(today).getMonth()) ? habitFocused.sdate : today)
                    : today}
              />
            </View>
          </View>
        </Swiper>
      </View>
      <FlatList
        keyExtractor={item => item.id}
        horizontal={true}
        data={habits}
        inverted={true}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => habitClicked(item)}
            style={styles.item}>
            <Text style={styles.itemText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  list: {
    flex: 2,
    borderTopColor: '#808080',
    borderTopWidth: 3,
    width: '100%',
  },
  wrapper: {
  },
  slide1: {
    flex: 1,
    alignItems: 'center',
  },
  slide2: {
    flex: 1,
    alignItems: 'center',
  },
  calendar: {
    width: '90%',
    height: '90%'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  item: {
    elevation: 12,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#97b4b3',
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 120,
  },
  itemText: {
    color: 'black',
    fontSize: 20
  },
  stats: {
    flex: 4,
    alignItems: 'center',
  },
  circle: {
    marginTop: 30,
    height: 180,
    flexDirection: 'row',
  },
  currStreak: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 10,
  },
  longStreak: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 10,
  },
  counters: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  },
  completed: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 35
  },
  notdone: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 35
  },

});

export default StatsScreen;

