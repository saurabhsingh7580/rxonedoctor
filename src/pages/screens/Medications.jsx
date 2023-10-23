import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackHeader from '../../compontents/headers/BackHeader';
import size from '../../assets/theme/size';
import weight from '../../assets/theme/weight';
import color from '../../assets/theme/color';
import Loader from '../../compontents/comman/Loader';
import GetProfile from '../../compontents/comman/GetProfile';
import {useFocusEffect} from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import { BASE_URL, API_MODE } from '@env'

const Medications = () => {
  const [pt_key, setPt_Key] = useState('');
  const [pt_token, setPt_Token] = useState('');
  const [medicationRecords, setMedicationRecords] = useState();
  const [loading, setLoading] = useState(false);
  const [profile_id, setProfile_id] = useState('');
  const [patProfile, setPatProfile] = useState();
  const [patName, setPatName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('pt_token').then(value => {
      setPt_Token(value);
      // console.log(value)
    });
    AsyncStorage.getItem('pt_key').then(value => {
      setPt_Key(value);
      // console.log(value)
    });
  });

  const getProfile_Id = item => {
    setPatProfile(item);
    setProfile_id(item.profile_id);
    setPatName(item.name);
  };

  const fetchMedication = () => {
    setMessage('');
    setLoading(true);
    fetch(`${BASE_URL}patient/list/medications/${API_MODE}/${profile_id}`, {
      method: 'GET',
      headers: {
        //Header Defination
        pt_token: pt_token,
        pt_key: pt_key,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //Hide Loader
        setLoading(false);
        setMedicationRecords(responseJson.records);
        setMessage(responseJson.message);
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error, '......Home Api Error......');
      });
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchMedication();
    }, [pt_token, pt_key, profile_id]),
  );

  const MedCard = ({item, fetchMedication}) => {
    const [imagePlace, setImage] = useState(); // initial it to an empty string
    const [loadImage, setLoadImage] = useState(''); // initial it to an empty string
    const getImage = async value => {
      setLoadImage(false);
      try {
        const res = await fetch(
           `${BASE_URL}patient/doctor/pic/${API_MODE}/${item.doc_id}`,
        );
        const data = await res.url;
        // console.log(data);
        setImage(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadImage(true);
      }
    };

    useEffect(() => {
      getImage();
    }, [item]);

    const handleMedi = value => {
      console.log(value);
      setLoading(true);
      fetch(
        
          `${BASE_URL}patient/medic/reminder/switch/${API_MODE}/${value.appointment_id}/${value.med_id}`,
        {
          method: 'PUT',
          headers: {
            //Header Defination
            'Content-Type': 'application/json',
            pt_token: pt_token,
            pt_key: pt_key,
          },
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          //Hide Loader
          setLoading(false);
          console.log(responseJson, 'facility');
          fetchMedication();
        })
        .catch(error => {
          //Hide Loader
          setLoading(false);
          console.error(error, '......facility......');
        });
    };

    const downloadFile = (url, fileName, fileType, appointment_id) => {
      setLoading(true);
      let dirs = RNFetchBlob.fs.dirs;
      // let fileExt = fileType === 'pdf' ? '.pdf' : '.png'; // Change the file extension depending on the file type
      console.log(fileName);
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
        .fetch('GET', BASE_URL+ url + '/' + API_MODE + `/${appointment_id}`, {
          pt_token,
          pt_key,
        })
        .then(res => {
          // console.log('File downloaded successfully',res);
          alert('File downloaded successfully');
          setLoading(false);
        })
        .catch(error => {
          console.log('Error downloading file:', error);
          setLoading(false);
        });
    };

    return (
      <View style={styles.card}>
        <View style={styles.top}>
          <View style={styles.topView}>
            <Text style={styles.text}>{item.appointment_date_formatted}</Text>
            <Text style={styles.text}>{item.appointment_time_formatted}</Text>
          </View>
          <View style={[styles.topView, {width: '45%'}]}>
            <View style={styles.topViewStyle}>
              <Image
                source={{uri: imagePlace}}
                // source={require('../../assets/images/profile.png')}
                style={styles.image}
              />
              <View style={{marginLeft: 5, width: 110}}>
                <Text numberOfLines={2} style={styles.text}>
                  {item.doc_name}
                </Text>
                <Text numberOfLines={1} style={styles.textLight}>
                  {item.doc_speciality}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              downloadFile(
                'patient/download/prescription',
                'Prescription',
                'image',
                item.appointment_id,
              )
            }
            style={styles.topView}>
            <Text style={[styles.text, {color: color.onlineColor}]}>
              Download Prescription
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.bold}>Medications</Text>
        </View>
        {item.medications.map(element => {
          return (
            <View style={styles.bodyInner}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}>
                <View style={{width: '75%'}}>
                  <Text style={[styles.title, {fontSize: 13}]}>
                    {element.medication_msg}
                  </Text>
                  <Text style={styles.light}>{element.side_effects}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="notifications-outline"
                    size={size.font20}
                    color={color.black}
                  />
                  <View style={styles.switchBox}>
                    <TouchableOpacity
                      onPress={() => {
                        let appointment_id = item.appointment_id;
                        let med_id = element.med_id;
                        const params = {appointment_id, med_id};
                        handleMedi(params);
                      }}
                      style={{
                        width: 20,
                        height: 15,
                        backgroundColor:
                          element.medication_reminder === false
                            ? color.buttonGray
                            : color.secondary,
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        let appointment_id = item.appointment_id;
                        let med_id = element.med_id;
                        const params = {appointment_id, med_id};
                        handleMedi(params);
                      }}
                      style={{
                        width: 20,
                        height: 15,
                        borderTopRightRadius: 5,
                        borderBottomRightRadius: 5,
                        backgroundColor:
                          element.medication_reminder === true
                            ? color.primary
                            : color.secondary,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        <View
          style={[
            styles.top,
            {
              paddingHorizontal: 10,
              borderTopWidth: 1,
              borderBottomWidth: 0,
            },
          ]}>
          <Text style={styles.light}>Do Betadine gargle for 4 times daily</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <StatusBar backgroundColor={color.white} barStyle={'dark-content'} />
      <BackHeader />
      <ScrollView>
        <View style={styles.body}>
          <View style={{width: '100%', marginVertical: 5}}>
            <GetProfile getProfile_Id={getProfile_Id} />
          </View>
          <Text style={styles.title}>
            You can switch off reminders for particular medication using switch
            button
          </Text>

          {medicationRecords && medicationRecords.length > 0 ? (
            medicationRecords.map(item => {
              return <MedCard item={item} fetchMedication={fetchMedication} />;
            })
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 100,
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Medications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundColor,
  },
  body: {
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    fontSize: size.font14,
    fontWeight: weight.low,
    color: color.black,
    marginVertical: 5,
  },
  card: {
    width: '100%',
    borderRadius: 10,
    marginVertical: 5,
    elevation: 5,
    backgroundColor: color.white,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: color.borderColor,
    paddingVertical: 10,
  },
  topView: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: size.font12,
    fontWeight: weight.low,
    color: color.black,
    textAlign: 'center',
  },
  textLight: {
    fontSize: size.font12,
    fontWeight: weight.low,
    color: color.textGrey,
  },
  topViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 100,
    resizeMode: 'contain',
  },
  bodyInner: {
    padding: 10,
    paddingTop: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
    padding: 10,
  },
  bold: {
    fontSize: size.font16,
    fontWeight: weight.semi,
    color: color.black,
  },
  light: {
    fontSize: size.font12,
    fontWeight: weight.low,
    color: color.black,
  },
  switchBox: {
    flexDirection: 'row',
    marginLeft: 10,
  },
});
