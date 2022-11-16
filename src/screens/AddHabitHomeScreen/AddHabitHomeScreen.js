import { View, Text, StyleSheet, TouchableOpacity, SectionList, Dimensions, ScrollView } from 'react-native';
import React from 'react';
import Icon from '../../utils/icons';
import Ionicons from 'react-native-vector-icons/Ionicons'

import { DATA } from '../../utils/datahabits'


const AddHabitHomeScreen = ({ navigation }) => {
  const cardGap = 20;
  const cardWidth = (Dimensions.get('window').width - cardGap * 10) / 2;

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.custom} onPress={() => navigation.navigate("AddHabit", { title: '' })}>

        <Ionicons name='add-circle-outline' size={30} />
        <Text style={{ fontSize: 22, fontWeight: '200' }}>Create Custom Habit</Text>
      </TouchableOpacity>
      <ScrollView style={styles.containerList}>
        {DATA.map((item, i) => {
          return (
            <View
              key={i * 10}
              style={styles.singleList}>
              <View >
                <Text style={styles.header}>{item.header}</Text>
              </View>
              <View
                style={styles.cardContainer}
              >
                {item.data.map((doc, j) => {
                  return (
                    <TouchableOpacity
                      key={i * 10 + (j + 1)}
                      onPress={() => navigation.navigate("AddHabit", { title: doc.text })}
                      style={{
                        marginVertical: cardGap / 2,
                        marginLeft: (cardGap * 3) / 2,
                        width: cardWidth,
                        height: cardWidth,
                        borderRadius: 16,
                        borderWidth: 2,
                        shadowOpacity: 0.2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f2f2f2'

                      }}
                    >
                      <Icon type={doc.type} name={doc.iconName} color={doc.iconColor} size={25} />
                      <Text style={styles.itemTitle}>{doc.text}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View >
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white'
  },
  custom: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    width: '80%',
    height: 60,
    padding: 10,
    margin: '5%',
    borderWidth: 2,
    backgroundColor: '#f2f2f2'
  },
  containerList: {
    width: '100%',
  },
  singleList: {
  },
  header: {
    fontSize: 22,
    paddingLeft: 5,
    backgroundColor: '#e6e6e6'
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  itemTitle: {
    fontSize: 14
  }
});


export default AddHabitHomeScreen;
