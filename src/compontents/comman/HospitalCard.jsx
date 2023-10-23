import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {BASE_URL,API_MODE} from '@env'


const HospitalCard = ({item}) => {
  const [imagePlace, setImage] = useState(''); // initial it to an empty string
  const [loadImage, setLoadImage] = useState(''); // initial it to an empty string

  const getImage = async () => {
    setLoadImage(false);
    try {
      const res = await fetch(
       `${BASE_URL}patient/get/facility/logo/${API_MODE}/${item}`,
      );
      const data = await res.url;
      console.log(data);
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

  return <Image source={{uri: imagePlace}} style={styles.clinicImage} />;
};

export default HospitalCard;

const styles = StyleSheet.create({
  clinicImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
});
