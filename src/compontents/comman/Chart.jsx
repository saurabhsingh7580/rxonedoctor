import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import color from '../../assets/theme/color';
import LinearGradient from 'react-native-linear-gradient';
import weight from '../../assets/theme/weight';
import size from '../../assets/theme/size';
import {Image} from 'react-native';

const Chart = ({item, bio, touch, handleUpdateData, firstIndex}) => {
  console.log(item);
  // console.log(firstIndex, 'flsdjlgj');

  return (
    <TouchableOpacity
      onPress={() => {
        if (touch === 'on') {
          bio(item);
        } else {
          handleUpdateData(item.bio_marker);
          bio(item);
        }
      }}
      style={[
        styles.container,
        {
          backgroundColor: firstIndex?
            item.bio_marker === firstIndex[0].bio_marker
              ? color.primary
              : 'rgba(255, 104, 104, 0.5)':'rgba(255, 104, 104, 0.5)'
        },
      ]}>
      {/* <LinearGradient
        colors={[
          'rgba(255, 104, 104, 0.5)  ',
          'rgba(235, 104, 104, 0.6)  ',
          'rgba(255, 114, 100, 0.7)',
        ]}
        style={{flex: 1, borderRadius: 14}}> */}
      <View style={styles.imageView}>
        <Image
          source={require('../../assets/images/online.png')}
          style={{width: 20, height: 20, resizeMode: 'contain'}}
        />
      </View>
      <Text style={styles.text}>{item.display_name}</Text>
      <Text style={styles.number}>
        {item.median ? item.median : item.latest_measure}
        {/* {item.measuring_unit.slice(0, 2)} */}
      </Text>
      {/* </LinearGradient> */}
    </TouchableOpacity>
  );
};

export default Chart;

const styles = StyleSheet.create({
  container: {
    width: 85,
    height: 90,
    borderRadius: 15,
    marginRight: 20,
  },
  imageView: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  text: {
    fontWeight: weight.normal,
    fontSize: size.font10,
    color: color.white,
    marginLeft: 5,
  },
  number: {
    fontSize: size.font16,
    fontWeight: weight.semi,
    color: color.white,
    marginLeft: 5,
    position: 'absolute',
    bottom: 5,
  },
});
