import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';

import size from '../../assets/theme/size';
import color from '../../assets/theme/color';
import weight from '../../assets/theme/weight';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './Loader';

const Slot = ({
  type,
  current,
  slots,
  slotsData,
  hos_id,
  doc_id,
  duration,
  end_slot,
}) => {
  const [slot, setSlot] = useState('');
  const [loading, setLoading] = useState(true);

  const selectDate = useSelector(state => state.selectDate);
  const slotData = selectDate.selectDate.time_slots;
  console.log(selectDate, '000000000000000000000000000000000000000');
  // console.log(slotData);
  // useEffect(() => {
  //   slots(slot);
  // }, [slot, slotData]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3500);
  });
  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      {selectDate.loading === true ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 50,
          }}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              animating={true}
              color={color.primary}
              size={size.font25}
              style={styles.activityIndicator}
            />
          </View>
        </View>
      ) : (
        <>
          {!slotData ? (
            <Text style={styles.error}>{selectDate.selectDate.message}</Text>
          ) : (
            <>
              <>
                <View style={styles.timing}>
                  <Icon
                    name="partly-sunny-outline"
                    size={size.font20}
                    color={color.black}
                  />
                  <Text style={styles.timingText}>Morning</Text>
                </View>
                <FlatList
                  data={slotData}
                  numColumns={4}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <>
                      {item.slot <= '12:00' ? (
                        <TouchableOpacity
                          disabled={item.is_available === true ? false : true}
                          onPress={() => {
                            setSlot(item.slot);
                            slots(item.slot);
                            duration(item.slot_duration);
                            end_slot(item.end_time);
                          }}
                          style={[
                            styles.slotStyle,
                            {
                              backgroundColor:
                                item.slot === slot && item.is_available === true
                                  ? color.primary
                                  : color.secondary,
                              borderWidth: item.is_available === true ? 1 : 0,
                              borderColor: color.primary,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.text,
                              {
                                color:
                                  item.slot === slot
                                    ? color.white
                                    : color.textGrey,
                              },
                            ]}>
                            {item.slot} AM
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </>
                  )}
                />
              </>
              <>
                <View style={styles.timing}>
                  <Icon
                    name="sunny-outline"
                    size={size.font20}
                    color={color.black}
                  />
                  <Text style={styles.timingText}>Afternoon</Text>
                </View>
                <FlatList
                  data={slotData}
                  numColumns={4}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <>
                      {item.slot >= '12:20' && item.slot <= '17:00' ? (
                        <TouchableOpacity
                          disabled={item.is_available === true ? false : true}
                          onPress={() => {
                            setSlot(item.slot);
                            slots(item.slot);
                            duration(item.slot_duration);
                            end_slot(item.end_time);
                          }}
                          style={[
                            styles.slotStyle,
                            {
                              backgroundColor:
                                item.slot === slot && item.is_available === true
                                  ? color.primary
                                  : color.secondary,
                              borderWidth: item.is_available === true ? 1 : 0,
                              borderColor: color.primary,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.text,
                              {
                                color:
                                  item.slot === slot
                                    ? color.white
                                    : color.textGrey,
                              },
                            ]}>
                            {item.slot} PM
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </>
                  )}
                />
              </>
              <>
                <View style={styles.timing}>
                  <Icon
                    name="moon-outline"
                    size={size.font20}
                    color={color.black}
                  />
                  <Text style={styles.timingText}>Evening</Text>
                </View>
                <FlatList
                  data={slotData}
                  numColumns={4}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <>
                      {item.slot >= '17:20' ? (
                        <TouchableOpacity
                          disabled={item.is_available === true ? false : true}
                          onPress={() => {
                            setSlot(item.slot);
                            slots(item.slot);
                            duration(item.slot_duration);
                            end_slot(item.end_time);
                          }}
                          style={[
                            styles.slotStyle,
                            {
                              backgroundColor:
                                item.slot === slot && item.is_available === true
                                  ? color.primary
                                  : color.secondary,
                              borderWidth: item.is_available === true ? 1 : 0,
                              borderColor: color.primary,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.text,
                              {
                                color:
                                  item.slot === slot &&
                                  item.is_available === true
                                    ? color.white
                                    : color.textGrey,
                              },
                            ]}>
                            {item.slot} PM
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </>
                  )}
                />
              </>
            </>
          )}
        </>
      )}
    </View>
  );
};

export default Slot;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  slotStyle: {
    width: '22.5%',
    height: 25,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  text: {
    fontSize: size.font12,
    color: color.textGrey,
    fontWeight: weight.semi,
  },
  timing: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  timingText: {
    fontSize: size.font14,
    fontWeight: weight.low,
    color: color.black,
    marginLeft: 10,
  },
  error: {
    fontSize: size.font14,
    fontWeight: weight.low,
    color: color.errorColor,
    textAlign: 'center',
    marginTop: 50,
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 50,
    width: 50,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
