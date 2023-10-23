import {
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import size from '../../assets/theme/size';
import weight from '../../assets/theme/weight';
import color from '../../assets/theme/color';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Loader from '../../compontents/comman/Loader';
import RatingCard from '../RatingCard';
import BackHeader from '../headers/BackHeader';
import {BASE_URL,API_MODE} from '@env'

const ViewRating = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState('');
  const [date1, setDate1] = useState('');
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [pt_token, setPt_Token] = useState('');
  const [pt_key, setPt_Key] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [records, setRecords] = useState('');
  const [start_Date, setStart_Date] = useState();
  const [end_Date, setEnd_Date] = useState();
  const [newEndDate, setNewEndDate] = useState();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    AsyncStorage.getItem('pt_token').then(value => {
      setPt_Token(value);
    });
    AsyncStorage.getItem('pt_key').then(value => {
      setPt_Key(value);
      console.log(value);
    });
  });

  function formatDate(date) {
    const date1 = date ? date : new Date();
    var d = new Date(date1),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return setStart_Date([year, month, day].join('-'));
  }

  function formatDate1(date1) {
    const date = date1 ? date1 : new Date();
    var d = new Date(date),
      month = '' + (d.getMonth() + 2),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return setEnd_Date([year, month, day].join('-'));
  }

  const newDate = new Date(end_Date).toDateString();
  console.log(newDate, 'newDate');

  function formatDate2(newDate) {
    const date = newDate ? newDate : new Date();
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return setNewEndDate([year, month, day].join('-'));
  }

  React.useEffect(() => {
    formatDate(date);
    formatDate1(date1);
    formatDate2(newDate);
  }, [date, date1, newDate]);

  const handleComplatedData = () => {
    setErrortext('');
    setLoading(true);
    fetch(
      `${BASE_URL}list/appointments/${API_MODE}/${start_Date}/${newEndDate}`,
      {
        method: 'GET',
        headers: {
          //Header Defination
          pt_token: pt_token,
          pt_key: pt_key,
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson, 'appointment');
        //Hide Loader
        setRecords(responseJson.records);
        setErrortext(responseJson.message);
        setLoading(false);
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error);
        console.log('api error');
      });
  };
  useFocusEffect(
    React.useCallback(() => {
      handleComplatedData();
    }, [pt_token, pt_key, start_Date, newEndDate]),
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        backgroundColor={color.backgroundColor}
        barStyle={'dark-content'}
      />
      <Loader loading={loading} />

      <BackHeader />

      <DatePicker
        modal
        mode="date"
        open={open}
        date={new Date()}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <DatePicker
        modal
        mode="date"
        open={open1}
        date={new Date()}
        onConfirm={date => {
          setOpen1(false);
          setDate1(date);
        }}
        onCancel={() => {
          setOpen1(false);
        }}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleComplatedData}
          />
        }>
        <View style={styles.topbox}>
          <Text style={styles.subtitle}>
            Select start date and end date from calendar to list appointments
          </Text>
          <View style={[styles.datebox, {marginTop: 0}]}>
            <View
              style={{
                width: '45%',
              }}>
              <Text style={styles.datetext}>Start Date</Text>
            </View>
            <View
              style={{
                width: '45%',
              }}>
              <Text style={styles.datetext}>End Date</Text>
            </View>
          </View>
          <View style={styles.datebox}>
            <TouchableOpacity
              onPress={() => setOpen(true)}
              style={styles.dateboxinner}>
              <Text style={styles.datetext}>
                {new Date(start_Date).toDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setOpen1(true)}
              style={styles.dateboxinner}>
              <Text style={styles.datetext}>
                {new Date(end_Date).toDateString()}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            Click on the appointment card to view or action
          </Text>
        </View>

        {records ? (
          <SectionList
            sections={records.reduce(
              (
                newArray: {title: any, data: any[]}[],
                dataArray: {appointment_date_formatted: any},
              ) => {
                const index = newArray.findIndex(
                  (item: {title: any}) =>
                    item.title === dataArray.appointment_date_formatted,
                );
                if (index >= 0) {
                  newArray[index].data.push(dataArray);
                } else {
                  newArray.push({
                    title: dataArray.appointment_date_formatted,
                    data: [dataArray],
                  });
                }
                return newArray;
              },
              [],
            )}
            keyExtractor={item => item.id}
            renderItem={({item}) => <RatingCard data={item} />}
            renderSectionHeader={({section: {title}}) => (
              <View style={styles.today}>
                <View style={styles.innertoday}>
                  <Text style={styles.todaytext}>{title}</Text>
                </View>
              </View>
            )}
          />
        ) : (
          <Text
            style={{
              textAlign: 'center',
              fontSize: size.font14,
              fontWeight: weight.semi,
              color: color.errorColor,
              marginVertical: 100,
            }}>
            {errortext === 'Please login using Phone and OTP.'
              ? null
              : errortext}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewRating;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.white,
  },
  topbox: {
    width: '92%',
    alignSelf: 'center',
  },
  title: {
    fontSize: size.font20,
    fontWeight: weight.semi,
    lineHeight: 25,
    color: color.black,
  },
  subtitle: {
    fontSize: size.font14,
    color: color.textPrimary,
    fontWeight: weight.low,
    lineHeight: 18,
    marginVertical: 10,
  },
  datebox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateboxinner: {
    width: '45%',
    padding: 7,
    paddingHorizontal: 15,
    backgroundColor: color.secondary,
    borderRadius: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  datetext: {
    fontSize: size.font14,
    fontWeight: color.textPrimary,
    color: color.black,
  },
  today: {
    width: '100%',
    height: 40,
    backgroundColor: color.secondary,
  },
  innertoday: {
    width: '92%',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 40,
  },
  todaytext: {
    fontSize: size.font14,
    fontWeight: weight.bold,
    color: color.primary,
  },
});
