import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import color from '../../assets/theme/color';
import BackHeader from '../../compontents/headers/BackHeader';
import size from '../../assets/theme/size';
import weight from '../../assets/theme/weight';
import Chart from '../../compontents/comman/Chart';
import { Slider } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Loader from '../../compontents/comman/Loader';
import { BASE_URL, API_MODE } from '@env'

const TrackDetail = props => {
  const navigation = useNavigation();
  const profile = props.route.params;
  const name = profile.profile.name;
  const profile_id = profile.profile.profile_id;
  const [loading, setLoading] = useState(false);
  const [pt_token, setPt_Token] = useState('');
  const [pt_key, setPt_Key] = useState('');
  const [record, setRecord] = useState();
  const [bio_marker, setBio_Marker] = useState('');
  const [selectBioData, setSelectBioData] = useState();
  const [value, setValue] = useState('');
  const [count, setCount] = useState();
  const [bioDataType, setBioDataType] = useState();
  const [painObject, setPainObject] = useState();
  const [updatePaindata, setUpdatePainData] = useState('');

  if (selectBioData) {
    var uniqueArray = selectBioData.filter((obj, index, self) => {
      return (
        index ===
        self.findIndex(t => t.id === obj.id && t.bio_marker === obj.bio_marker)
      );
    });
  }

  useEffect(() => {
    AsyncStorage.getItem('pt_token').then(value => {
      setPt_Token(value);
      // console.log(value);
    });
    AsyncStorage.getItem('pt_key').then(value => {
      setPt_Key(value);
      // console.log(value);
    });
  });


  const handleRecordData = async () => {
    setLoading(true);
    const response = await fetch(
       `${BASE_URL}patient/list/bio/trackers/${API_MODE}`,
      {
        headers: {
          pt_token: pt_token,
          pt_key: pt_key,
        },
      },
    );
    if (response.status === 401) {
      console.log(response);
      console.log('Could not authenticate user with the provided details');
      setLoading(false);
    } else {
      const data = await response.json();
      setRecord(data.records);
      setLoading(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      if (pt_token) {
        handleRecordData();
      }
    }, [pt_token, pt_key]),
  );

  const bio = item => {
    let data = [];
    if (!selectBioData) {
      data.push(item);
    } else {
      data.push(...selectBioData, item);
    }
    console.log(item);
    setBioDataType(item);
    setSelectBioData(data);
  };

  const handleUpdateData = data => {
    setLoading(true);
    console.log(
      `${BASE_URL}patient/upsert/master/tracker/${API_MODE}/${profile_id}/${bio_marker ? bio_marker : data
      }`,
    );
    fetch(
      `${BASE_URL}patient/upsert/master/tracker/${API_MODE}/${profile_id}/${bio_marker ? bio_marker : data
      }`,
      {
        method: 'PUT',
        body: JSON.stringify({ measure: value ? `${value}` : '' }),
        headers: {
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
        console.log(responseJson, 'share_with_doctor');
        handleRecordData();
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error, '......share_with_doctor......');
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (value) {
        handleUpdateData();
      }
    }, [pt_token, pt_key, profile_id, bio_marker, value]),
  );

  const handlePainData = value => {
    setLoading(true);
    console.log(
      `${BASE_URL}patient/upsert/pain/tracker/${API_MODE}/${profile_id}/chronic_pain/${value}`,
    );
    fetch(
      `${BASE_URL}patient/upsert/pain/tracker/${API_MODE}/${profile_id}/chronic_pain/${value}`,
      {
        method: 'GET',
        headers: {
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
        console.log(responseJson, '...............pain..............');
        setPainObject(responseJson.records);
        setCount(value);
        handleUpdatePainData();
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error, '......pain......');
      });
  };

  const handleUpdatePainData = () => {
    console.log(count, '.............count............');
    setLoading(true);
    console.log(
      `${BASE_URL}patient/upsert/pain/tracker/${API_MODE}/${profile_id}/chronic_pain/${count}`,
    );
    fetch(
      `${BASE_URL}patient/upsert/pain/tracker/${API_MODE}/${profile_id}/chronic_pain/${count}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          measure: updatePaindata ? `${updatePaindata}` : '',
        }),
        headers: {
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
        console.log(responseJson, '...............pain..............');
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error, '......pain......');
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      if (chronic_pain_data === 'chronic_pain') {
        handleUpdatePainData();
      }
    }, [pt_token, pt_key, profile_id, bio_marker, updatePaindata, count]),
  );

  const chronic_pain_data = bioDataType ? bioDataType.bio_marker : null;

  const interpolate = (start: number, end: number) => {
    let k = (value - 0) / 10; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  const colors = () => {
    let r = interpolate(20, 120);
    let g = interpolate(100, 155);
    let b = interpolate(1000, 255);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <BackHeader />
      <ScrollView>
        <View style={styles.body}>
          <Text style={styles.text}>
            Click on below bubbles to add and record the parameters you would
            like to track or as advised by doctor for
          </Text>

          <View style={styles.profileName}>
            <Text style={styles.nameText}>{name}</Text>
          </View>

          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={record}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10 }}>
                <Chart
                  item={item}
                  bio={bio}
                  handleUpdateData={handleUpdateData}
                // firstIndex={bioDataType}
                />
              </View>
            )}
          />

          <FlatList
            data={uniqueArray}
            renderItem={({ item }) => (
              <View style={{ marginTop: 20 }}>
                {item.bio_marker === 'chronic_pain' ? null : (
                  <View>
                    <Text style={styles.title}>{item.display_name}</Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <Text style={styles.desc}>
                        {item.display_name} ({item.measuring_unit})
                      </Text>
                    </View>

                    <Slider
                      maximumValue={item.upper_limit}
                      minimumValue={0}
                      step={item.step}
                      value={item.median}
                      onValueChange={value => {
                        setValue(value);
                        setBio_Marker(item.bio_marker);
                      }}
                      thumbTintColor={color.primary}
                      thumbStyle={{
                        height: 15,
                        width: 15,
                      }}
                      // thumbStyle={{
                      //   height: 20,
                      //   width: 20,
                      //   backgroundColor: 'transparent',
                      // }}
                      trackStyle={{ height: 6 }}
                      maximumTrackTintColor={color.secondary}
                      minimumTrackTintColor={color.primary}
                    // thumbProps={{
                    //   children: (
                    //     <Icon
                    //       name="ellipse-sharp"
                    //       size={20}
                    //       reverse
                    //       containerStyle={{bottom: 20, right: 20}}
                    //       color={colors()}
                    //     />
                    //   ),
                    // }}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.bpm}>
                        {item.lower_limit} {item.measuring_unit}
                      </Text>
                      <Text style={styles.bpm}>
                        {value ? value : item.median} {item.measuring_unit}
                      </Text>
                      <Text style={styles.bpm}>
                        {item.upper_limit} {item.measuring_unit}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          />

          {chronic_pain_data === 'chronic_pain' ? (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.title}>Pain Intensity</Text>
              <Text style={styles.desc}>
                Select body part and record intensity of pain
              </Text>
            </View>
          ) : null}
        </View>
        {chronic_pain_data === 'chronic_pain' ? (
          <View
            style={{
              backgroundColor: '#4F3F59',
              width: '100%',
              height: 560,
              marginTop: 20,
            }}>
            <View
              style={{
                paddingVertical: 20,
                width: '90%',
                alignSelf: 'center',
              }}>
              <Image
                style={{
                  width: '90%',
                  height: 440,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
                source={require('../../assets/images/body.png')}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: -435,
                  width: 35,
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  marginRight: 8,
                }}>
                <TouchableOpacity
                  onPress={() => handlePainData('1')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '1' ? color.errorColor : 'green',
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => handlePainData('2')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '2' ? color.errorColor : 'green',
                    },
                  ]}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: 40,
                }}>
                <TouchableOpacity
                  onPress={() => handlePainData('3')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '3' ? color.errorColor : 'green',
                    },
                  ]}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 5,
                  width: 66,
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  marginRight: 8,
                }}>
                <TouchableOpacity
                  onPress={() => handlePainData('4')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '4' ? color.errorColor : 'green',
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => handlePainData('5')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '5' ? color.errorColor : 'green',
                    },
                  ]}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  width: 145,
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  marginRight: 8,
                }}>
                <TouchableOpacity
                  onPress={() => handlePainData('6')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '6' ? color.errorColor : 'green',
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => handlePainData('12')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '12' ? color.errorColor : 'green',
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => handlePainData('13')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '13' ? color.errorColor : 'green',
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => handlePainData('7')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '7' ? color.errorColor : 'green',
                    },
                  ]}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 27,
                  width: 196,
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  marginRight: 7,
                }}>
                <TouchableOpacity
                  onPress={() => handlePainData('8')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '8' ? color.errorColor : 'green',
                    },
                  ]}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    width: 50,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => handlePainData('14')}
                    style={[
                      styles.pain,
                      {
                        backgroundColor:
                          count === '14' ? color.errorColor : 'green',
                      },
                    ]}
                  />
                  <TouchableOpacity
                    onPress={() => handlePainData('15')}
                    style={[
                      styles.pain,
                      {
                        backgroundColor:
                          count === '15' ? color.errorColor : 'green',
                      },
                    ]}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => handlePainData('9')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '9' ? color.errorColor : 'green',
                    },
                  ]}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  width: 254,
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  marginRight: 8,
                }}>
                <TouchableOpacity
                  onPress={() => handlePainData('10')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '10' ? color.errorColor : 'green',
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => handlePainData('16')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '16' ? color.errorColor : 'green',
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => handlePainData('11')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '11' ? color.errorColor : 'green',
                    },
                  ]}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 17,
                  width: 60,
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  marginRight: 10,
                }}>
                <TouchableOpacity
                  onPress={() => handlePainData('17')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '17' ? color.errorColor : 'green',
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => handlePainData('18')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '18' ? color.errorColor : 'green',
                    },
                  ]}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 50,
                  width: 55,
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  marginRight: 10,
                }}>
                <TouchableOpacity
                  onPress={() => handlePainData('19')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '19' ? color.errorColor : 'green',
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => handlePainData('20')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '20' ? color.errorColor : 'green',
                    },
                  ]}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 24,
                  width: 53,
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  marginRight: 10,
                }}>
                <TouchableOpacity
                  onPress={() => handlePainData('21')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '21' ? color.errorColor : 'green',
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => handlePainData('22')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '22' ? color.errorColor : 'green',
                    },
                  ]}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 50,
                  width: 55,
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                  marginRight: 10,
                }}>
                <TouchableOpacity
                  onPress={() => handlePainData('23')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '23' ? color.errorColor : 'green',
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => handlePainData('24')}
                  style={[
                    styles.pain,
                    {
                      backgroundColor:
                        count === '24' ? color.errorColor : 'green',
                    },
                  ]}
                />
              </View>
            </View>
            {count ? (
              <View style={{ width: 350, margin: 20 }}>
                <Slider
                  maximumValue={10.0}
                  minimumValue={0.0}
                  step={1}
                  value={1}
                  onValueChange={value => {
                    setUpdatePainData(value);
                  }}
                  thumbTintColor={color.primary}
                  thumbStyle={{
                    height: 16,
                    width: 16,
                  }}
                  trackStyle={{ height: 6, width: 350 }}
                  maximumTrackTintColor={color.secondary}
                  minimumTrackTintColor={color.primary}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.bpm, { color: color.white }]}>
                    0.00 Intensity
                  </Text>

                  <Text style={[styles.bpm, { color: color.white }]}>
                    10.00 Intensity
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrackDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundColor,
  },
  body: {
    width: '90%',
    alignSelf: 'center',
  },
  text: {
    fontSize: size.font14,
    fontWeight: weight.semi,
    color: color.black,
    textAlign: 'center',
    marginVertical: 10,
  },
  profileName: {
    height: 25,
    backgroundColor: color.primary,
    borderRadius: 32,
    alignSelf: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  nameText: {
    fontSize: size.font12,
    fontWeight: weight.low,
    color: color.white,
  },
  title: {
    fontSize: size.font16,
    fontWeight: weight.low,
    color: color.black,
  },
  desc: {
    fontSize: size.font12,
    fontWeight: weight.low,
    color: color.textPrimary,
  },
  bpm: {
    fontSize: size.font10,
    fontWeight: weight.low,
    color: color.textPrimary,
  },
  pain: {
    width: 17,
    height: 17,
    backgroundColor: color.errorColor,
    borderRadius: 100,
  },
});
