import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import color from '../../assets/theme/color';
import size from '../../assets/theme/size';
import weight from '../../assets/theme/weight';
import BackHeader from '../../compontents/headers/BackHeader';
import DatePicker from 'react-native-date-picker';
import Loader from '../../compontents/comman/Loader';
import {useFocusEffect} from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import { BASE_URL, API_MODE } from '@env'

const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState('');
  const [date1, setDate1] = useState('');
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [pt_token, setPt_Token] = useState('');
  const [pt_key, setPt_Key] = useState('');
  const [start_Date, setStart_Date] = useState();
  const [end_Date, setEnd_Date] = useState();
  const [orders, setOrders] = useState();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('pt_token').then(value => {
      setPt_Token(value);
    });
    AsyncStorage.getItem('pt_key').then(value => {
      setPt_Key(value);
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

  useEffect(() => {
    formatDate(date);
    formatDate1(date1);
  });

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      setMessage('');
      fetch(
         `${BASE_URL}patient/list/orders/${API_MODE}/${start_Date}/${end_Date}`,
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
          setOrders(responseJson.orders);
          setMessage(responseJson.message);
          setLoading(false);
        })
        .catch(error => {
          //Hide Loader
          setLoading(false);
          console.error(error);
          console.log('api error');
        });
    }, [pt_token, pt_key, end_Date, start_Date]),
  );

  const fetchInvoice = async value => {
    await fetch(
      `${BASE_URL}patient/generate/order/invoice/${API_MODE}/${value}`,

      {
        method: 'POSt',
        headers: {pt_token: pt_token, pt_key: pt_key},
      },
    )
      .then(response => response.json())
      .then(json => {
        console.log(json, '......order response......');
      })
      .catch(error => {
        console.log(error, '......order error......');
      });
  };

  const downloadFile = (url, fileName, fileType, order_id) => {
    console.log(url, fileName, fileType, order_id);
    setLoading(true);
    let dirs = RNFetchBlob.fs.dirs;
    // let fileExt = fileType === 'pdf' ? '.pdf' : '.png'; // Change the file extension depending on the file type
    console.log(fileName);
    console.log(Base_URL + url + '/' + API_MODE + `/${order_id}`);

    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: fileName,
        path: `${dirs.DownloadDir}/${fileName}`,
      },
    })
      .fetch('GET', BASE_URL + url + '/' + API_MODE + `/${order_id}`, {
        pt_token,
        pt_key,
      })

      .then(res => {
        console.log('File downloaded successfully');
        alert('File downloaded successfully');
        setLoading(false);
      })
      .catch(error => {
        console.log('Error downloading file:', error);
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <DatePicker
        modal
        mode="date"
        open={open}
        minimumDate={new Date('1900-01-01')}
        maximumDate={new Date('2100-01-01')}
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
        minimumDate={new Date('1900-01-01')}
        maximumDate={new Date('2100-01-01')}
        date={new Date()}
        onConfirm={date => {
          setOpen1(false);
          setDate1(date);
        }}
        onCancel={() => {
          setOpen1(false);
        }}
      />
      <BackHeader />

      <ScrollView>
        <View style={styles.body}>
          <View style={[styles.datebox, {marginTop: 20}]}>
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
          <Text style={styles.title}>
            Click on the card below to view or print receipt.
          </Text>
          <>
            {orders && orders.length > 0 ? (
              orders.map(item => {
                return (
                  <View style={styles.card}>
                    <Text style={styles.title}>{item.particulars} </Text>
                    <View style={styles.priceView}>
                      <Text style={styles.title}>
                        {item.currency ? item.currency : 'INR'}{' '}
                        {item.amount_paid}
                      </Text>
                      <Text style={styles.title}>{item.payment_date}</Text>
                    </View>
                    <View style={styles.priceView}>
                      <View style={styles.paidView}>
                        <Text style={styles.text}>{item.status}</Text>
                      </View>
                      {item.show_generate_invoice_button === true ? (
                        <TouchableOpacity
                          onPress={() =>
                            downloadFile(
                              'patient/generate/order/invoice',
                              'Invoice',
                              'image',
                              item.order_id,
                            )
                          }
                          style={styles.receiptView}>
                          <Text
                            style={[
                              styles.text,
                              {color: color.onlineColor, marginRight: 10},
                            ]}>
                            Show Receipt
                          </Text>
                          <Icon
                            name="eye-outline"
                            size={size.font14}
                            color={color.onlineColor}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                );
              })
            ) : (
              <View
                style={{
                  // height: '65%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 100,
                }}>
                {message === 'Please login using Phone and OTP.' ? (
                  <ActivityIndicator size={25} />
                ) : (
                  <Text
                    style={{
                      fontSize: size.font14,
                      color: color.errorColor,
                      fontWeight: weight.semi,
                    }}>
                    Data Not Available
                  </Text>
                )}
              </View>
            )}
          </>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundColor,
  },
  body: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
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
  title: {
    fontSize: size.font14,
    fontWeight: weight.low,
    color: color.black,
    marginVertical: 5,
    marginTop: 20,
  },
  card: {
    width: '100%',
    borderRadius: 10,
    marginTop: 15,
    elevation: 5,
    backgroundColor: color.white,
    padding: 10,
  },
  priceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paidView: {
    width: 70,
    height: 20,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  receiptView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: size.font10,
    fontWeight: weight.low,
    color: color.primary,
  },
});
