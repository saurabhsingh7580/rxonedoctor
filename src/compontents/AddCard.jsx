import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';

import size from '../assets/theme/size';
import weight from '../assets/theme/weight';
import color from '../assets/theme/color';
import Loader from './comman/Loader';
import {BASE_URL,API_MODE} from '@env'

const AddCard = ({item, func}) => {
  const [pt_token, setPt_Token] = useState();
  const [pt_key, setPt_Key] = useState();
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState(''); // initial it to an empty string
  console.log(imageData, '...imageData......');
  useEffect(() => {
    AsyncStorage.getItem('pt_token').then(value => {
      setPt_Token(value);
    });
    AsyncStorage.getItem('pt_key').then(value => {
      setPt_Key(value);
    });
  });

  const handleProfileDelete = value => {
    setLoading(true);
    fetch(`${BASE_URL}patient/profile/detail/${API_MODE}/${value}`, {
      method: 'DELETE',
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
        console.log(responseJson);
        func();
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error, '......delete Profile Api Error......');
      });
  };

  const getImage = async value => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}patient/profile/pic/${API_MODE}/${value}`,
        {
          headers: {
            pt_token: pt_token,
            pt_key: pt_key,
          },
        },
      );
      const data = await res.url;
      ImageShowFunc(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const ImageShowFunc = value => {
    RNFetchBlob.config({
      // response data will be saved to this path if it has access right.
      fileCache: true,
      appendExt: 'png',
    })
      .fetch('GET', value, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: token,
        pt_token: pt_token,
        pt_key: pt_key,
      })
      .then(res => {
        console.log('response body>>>', res);
        if (Platform.OS === 'android') {
          const data = 'file://' + res.path();
          setImageData(data);
          AsyncStorage.setItem('profileImage', data);
        } else {
          const data = '' + res.path();
          setImageData(data);
          AsyncStorage.setItem('profileImage', data);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  useEffect(() => {
    getImage(item.profile_id);
  }, [pt_token, pt_key, item.profile_id]);

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.containerInner}>
        <View
          style={{
            height: 50,
            width: 50,
            borderRadius: 100,
            borderColor: color.primary,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
          }}>
          {imageData ? (
            <Image
              source={{
                uri: imageData,
              }}
              style={{
                height: 50,
                width: 50,
                resizeMode: 'cover',
                borderRadius: 100,
              }}
            />
          ) : (
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 100,
                borderColor: color.primary,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
              }}>
              <Image
                source={require('../assets/images/user.png')}
                style={{height: 25, width: 25, resizeMode: 'contain'}}
              />
            </View>
          )}
        </View>
        <View style={styles.body}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.name}>{item.name}</Text>
            {item.profile_type === 'Self' ? null : (
              <TouchableOpacity
                onPress={() => handleProfileDelete(item.profile_id)}>
                <Icon
                  name="trash-outline"
                  size={size.font20}
                  color={color.textGrey}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View style={styles.bodyInner}>
              <Icon
                name="mail-outline"
                size={size.font12}
                color={color.textGrey}
              />
              <Text numberOfLines={2} style={styles.email}>
                {item.email}
              </Text>
            </View>
            <Text style={styles.age}>
              ( {item.gender.slice(0, 1)} / {item.age} )
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: color.backgroundColor,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 0.8,
    borderColor: color.borderColor,
  },
  containerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  body: {
    width: '80%',
  },
  bodyInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: size.font16,
    fontWeight: weight.semi,
    color: color.black,
    textTransform: 'capitalize',
    width: '70%',
  },
  email: {
    fontSize: size.font12,
    fontWeight: weight.low,
    color: color.textGrey,
    marginLeft: 10,
    width: '70%',
  },
  age: {
    fontSize: size.font14,
    fontWeight: weight.low,
    color: color.textGrey,
  },
  imageView: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: color.primary,
  },
  imageText: {
    fontSize: size.font25,
    fontWeight: weight.bold,
    color: color.primary,
  },
  image: {
    borderRadius: 100,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});
