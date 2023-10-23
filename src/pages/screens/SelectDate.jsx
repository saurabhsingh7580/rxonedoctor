import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import color from '../../assets/theme/color';
import BookHeader from '../../compontents/comman/BookHeader';
import size from '../../assets/theme/size';
import weight from '../../assets/theme/weight';
import DoctorCard from '../../compontents/comman/DoctorCard';
import GetDate from '../../compontents/GetDate';
import Slot from '../../compontents/comman/Slot';
import Button from '../../compontents/comman/Button';
import Loader from '../../compontents/comman/Loader';
import { BASE_URL, API_MODE } from '@env'

const SelectDate = props => {
  const navigation = useNavigation();
  const data = props.route.params;
  // console.log(
  //   data,
  //   '.......................select date ...............................',

  // );

  // console.log(data,'..................data.....')
  const item = data.item;
  const doc_id = item.doc_id;
  const hos_id = item.hos_id ? item.hos_id : data.hos_id;
  const profile_id = data.profile_id;
  const patProfile = data.patProfile;
  const [loading, setLoading] = useState(false);
  const [pt_token, setPt_Token] = useState('');
  const [pt_key, setPt_Key] = useState('');
  const [type, setType] = useState('online');
  const [mode, setMode] = useState('online');
  const [current, setCurrent] = useState();
  const [condition, setCondition] = useState('False');
  const [slot, setSlot] = useState('');
  const [endSlot, setEndSlot] = useState('');
  const [endTime, setEndTime] = useState('');

  const [slotData, setSlotData] = useState([]);
  const [time, setTime] = useState('');
  const [slot_duration, setSlot_duration] = useState('');
  const [imagePlace, setImage] = useState(''); // initial it to an empty string
  const [loadImage, setLoadImage] = useState(''); // initial it to an empty string
  const [response, setResponse] = useState();

  const getImage = async () => {
    setLoadImage(false);
    try {
      const res = await fetch(
        `${BASE_URL}patient/get/facility/logo/${API_MODE}/${hos_id}`,
      );
      const data = await res.url;
      setImage(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadImage(true);
    }
  };

  useEffect(() => {
    getImage();
  }, [hos_id]);

  useEffect(() => {
    AsyncStorage.getItem('pt_token').then(value => {
      setPt_Token(value);
    });
    AsyncStorage.getItem('pt_key').then(value => {
      setPt_Key(value);
    });
  });

  const getDate = date => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return setCurrent([year, month, day].join('-'));
  };

  const getDate1 = () => {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return setCurrent([year, month, day].join('-'));
  };

  useEffect(() => {
    getDate1();
  }, []);

  const slots = slot => {
    setSlot(slot);
  };

  const slotsData = item => {
    setSlotData(item);
    // console.log(item,'item')
  };

  const duration = item => {
    setSlot_duration(item);
    //    console.log(item,'item')
  };

  const end_slot = item => {
    setEndSlot(item);
    // console.log(item, 'item');
  };



  const minuteConverter = time => {
    let timeString = time;
    let convertedTime = timeString.replace(/:/g, '.');
    // console.log(convertedTime, '///////////'); // Output: "12.30.45"
    setTime(convertedTime);
  };

  const minuteConverterEnd = time => {
    let timeString = time;
    let convertedTime = timeString.replace(/:/g, '.');
    // console.log(convertedTime, '///////////'); // Output: "12.30.45"
    setEndTime(convertedTime);
  };
  useEffect(() => {
    minuteConverter(slot);
    minuteConverterEnd(endSlot);
  });

  const newDate = new Date(current).toDateString();

  const handleBookButton = () => {
    const end_time = parseFloat(time) + slot_duration;
    setLoading(true);
    var dataToSend = JSON.stringify({
      appointment_date: `${current}`,
      // time_alloted: `${time}0`,
      time_alloted: `${time}`,
      is_inperson: `${condition}`,
      slot_duration: `${slot_duration}`,
      // end_time: `${end_time}0`,
      end_time: `${endTime}`,
      is_walkin_appointment: 'False',
    });
    console.log(dataToSend, 'dataToSend.....................................');
    fetch(
      `${BASE_URL}patient/book/appointment/${API_MODE}/${hos_id}/${doc_id}/${profile_id}`,
      {
        method: 'POST',
        body: dataToSend,
        headers: {
          //Header Defination
          pt_token: pt_token,
          pt_key: pt_key,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        //Hide Loader
        console.log(responseJson, '..........handleBookButton..........');
        setResponse(responseJson);
        // If server response message same as Data Matched

        if (responseJson.appointment_id && mode === 'online') {
          navigation.replace('CheckOutPage', {
            imagePlace,
            item,
            patProfile,
            raiseResponse: '',
            bookResponse: responseJson,
            type,
            appointment_id: responseJson.appointment_id,
            slot,
            newDate,
            slot_duration,
            mode,
          });
          // handleRaiseButton(responseJson)

          return;
        }
        else if (mode === 'cash') {
          navigation.replace('Payment', {
            imagePlace,
            item,
            patProfile,
            raiseResponse: '',
            bookResponse: responseJson,
            type,
            appointment_id: responseJson.appointment_id,
            slot,
            newDate,
            slot_duration,
            mode,
          });

          return;
        } else {
          console.log(responseJson.message);
          setLoading(false);
          alert(responseJson.message);
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error, 'error handleBookButton');
      });
  };



  // const handleRaiseButton = value => {
  //   // setErrortext('');
  //   //Show Loader
  //   setLoading(true);
  //   // console.log(first)
  //   fetch(
  //     `${BASE_URL}patient/book/appointment/order/${API_MODE}/${mode}/${value.appointment_id}/${profile_id}`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         //Header Defination
  //         pt_token: pt_token,
  //         pt_key: pt_key,
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //     },
  //   )
  //     .then(response => response.json())
  //     .then(responseJson => {
  //       //Hide Loader
  //       setLoading(false);
  //       console.log(
  //         responseJson,
  //         '/..................handleRaiseButton................',
  //       );
  //       // If server response message same as Data Matched
  //       if (responseJson) {
  //         navigation.replace('CheckOutPage', {
  //           imagePlace,
  //           item,
  //           patProfile,
  //           raiseResponse: responseJson,
  //           bookResponse: value,
  //           type,
  //           appointment_id: value.appointment_id,
  //           slot,
  //           newDate,
  //           slot_duration,
  //           mode
  //         });
  //       } else {
  //         console.log(responseJson.message);
  //         alert(responseJson.message);
  //       }
  //     })
  //     .catch(error => {
  //       //Hide Loader
  //       setLoading(false);
  //       console.error(error, 'handleRaiseButton error');
  //     });
  // };
  // console.log(type ,'..............SelectDateType....................')
  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <BookHeader name={item.hospital} image={imagePlace} />
      <ScrollView>
        <View style={styles.body}>
          <Text style={styles.bookText}>Booking Appointment for</Text>
          <View style={styles.top}>
            <Text style={styles.topText}>{patProfile.name}</Text>
          </View>

          <DoctorCard item={item} touch="off" />

          <View style={styles.type}>
            <Text style={styles.text}>Select Type</Text>

            <View style={styles.typeBox}>
              <TouchableOpacity
                onlineAppointment
                onPress={() => {
                  setType('online');
                  setCondition('False');
                  setMode('online');
                }}
                style={[
                  styles.typeInner,
                  {
                    backgroundColor:
                      type == 'online' ? color.primary : color.secondary,
                  },
                ]}>
                <Text
                  style={[
                    styles.textStyle,
                    { color: type == 'online' ? color.white : color.primary },
                  ]}>
                  Online (Video)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setType('in-person');
                  setCondition('True');
                  setMode('cash');
                  setSlot('')
                }}
                style={[
                  styles.typeInner,
                  {
                    backgroundColor:
                      type == 'in-person' ? color.primary : color.secondary,
                  },
                ]}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      color: type == 'in-person' ? color.white : color.primary,
                    },
                  ]}>
                  In-Person (at Facility)
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.text}>Select Date</Text>
            <GetDate
              getDate={getDate}
              type={type}
              current={current}
              hos_id={hos_id}
              doc_id={item.doc_id}
              dt={item => {
                // console.log(item);
              }}
            />

            {current == null ? null : (
              <>
                <Text style={styles.text}>Select Time</Text>
                <Slot slots={slots} duration={duration} end_slot={end_slot} />
              </>
            )}
          </View>
          {slot === '' ? null : (
            <TouchableOpacity
              style={{ width: '100%' }}
              onPress={() => {
                setLoading(true);
                handleBookButton();
              }}>
              <Button text="Book" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectDate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundColor,
  },
  body: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    height: 25,
    backgroundColor: color.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  topText: {
    fontSize: size.font12,
    fontWeight: weight.low,
    color: color.white,
  },
  bookText: {
    fontSize: size.font14,
    fontWeight: weight.semi,
    color: color.black,
    marginVertical: 20,
  },
  type: {
    width: '100%',
  },
  text: {
    fontSize: size.font14,
    fontWeight: weight.semi,
    color: color.black,
    marginTop: 10,
  },
  typeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeInner: {
    height: 25,
    borderRadius: 50,
    paddingHorizontal: 15,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.primary,
  },
  loader: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: color.primary,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
});