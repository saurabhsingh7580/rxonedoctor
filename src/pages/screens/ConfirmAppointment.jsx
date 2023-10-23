import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import color from '../../assets/theme/color';
import size from '../../assets/theme/size';
import weight from '../../assets/theme/weight';
import DoctorCard from '../../compontents/comman/DoctorCard';
import BookHeader from '../../compontents/comman/BookHeader';
import Loader from '../../compontents/comman/Loader';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, API_MODE } from '@env'

const ConfirmAppointment = props => {
  const navigation = useNavigation();
  const {
    imagePlace,
    image,
    item,
    patName,
    hos_name,
    hos_id,
    profile_id,
    patProfile,
  } = props.route.params;

  const [loading, setLoading] = useState(false);
  const [pt_token, setPt_Token] = useState('');
  const [pt_key, setPt_Key] = useState('');
  useEffect(() => {
    AsyncStorage.getItem('pt_token').then(value => {
      setPt_Token(value);
    });
    AsyncStorage.getItem('pt_key').then(value => {
      setPt_Key(value);
    });
  });
  const handleBookButton = () => {
    //Show Loader
    setLoading(true);
    fetch(
      `${BASE_URL}patient/book/walkin/appointment/${API_MODE}/${hos_id}/${item.doc_id}/${profile_id}`,
      {
        method: 'POST',
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
        console.log(responseJson, 'walkin..........');
        // If server response message same as Data Matched
        if (responseJson.appointment_id) {
          navigation.replace('Payment', {
            walkin: 'walkin',
            imagePlace,
            item,
            patProfile,
            raiseResponse: '',
            bookResponse: responseJson,
            type: 'walkin',
            appointment_id: responseJson.appointment_id,
            hos_name,
            patName,
            image,
          });
        } else {
          console.log(responseJson.message);
          setLoading(false);
          alert(responseJson.message);
        }
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error, 'errors');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <BookHeader name={hos_name} image={image} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.containerInner}>
          <Text style={styles.text}>Booking Appointment for</Text>
          <View style={styles.boxInner}>
            <Text style={styles.textStyle}>{patName}</Text>
          </View>

          <Text style={styles.des}>
            Select the available Doctors from {hos_name}
          </Text>
        </View>

        <View style={styles.card}>
          <DoctorCard
            item={item}
            patName={patName}
            hospital_name={hos_name}
            profile_id={profile_id}
            patProfile={patProfile}
            hos_id={hos_id}
            touch="off"
          />
        </View>
        <View style={styles.cards}>
          <Text style={styles.description}>Hello</Text>
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            onPress={handleBookButton}
            style={styles.buttonInner}>
            <Text style={styles.buttontext}>Meet Now</Text>

          </TouchableOpacity>
          <Text style={styles.buttonOuttext}>(For next available slot of the doctor)</Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SelectDate', {
                item,
                profile_id,
                patName,
                imagePlace,
                patProfile,
                hos_name,
                hos_id,
                image,
              })
            }
            style={[
              styles.buttonInner,
              { backgroundColor: color.onlinePayment, marginTop: 30 },
            ]}>
            <Text style={styles.buttontext}>Schedule Later</Text>
          </TouchableOpacity>
          <Text style={styles.buttonOuttext2}>(Schedule consultation as per your preference)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfirmAppointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundColor,
  },
  containerInner: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 30,
  },
  text: {
    textAlign: 'center',
    fontSize: size.font16,
    fontWeight: weight.semi,
    color: color.black,
  },
  boxInner: {
    height: 25,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: color.primary,
    alignSelf: 'center',
    marginVertical: 20,
    backgroundColor: color.primary,
  },
  textStyle: {
    fontSize: size.font12,
    color: color.white,
  },
  des: {
    fontSize: size.font14,
    fontWeight: weight.low,
    textAlign: 'center',
    color: color.black,
    width: '70%',
    alignSelf: 'center',
  },
  card: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 5,
  },
  block: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: size.font16,
    fontWeight: weight.semi,
    color: color.black,
  },
  type: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignItems: 'center',
  },
  typeInner: {
    height: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 15,
    alignSelf: 'center',
    marginVertical: 10,
    backgroundColor: color.primary,
    flexDirection: 'row',
  },
  date: {
    fontSize: size.font14,
    color: color.black,
    fontWeight: weight.low,
  },
  button: {
    marginVertical: 40,
    alignSelf: 'center',
    width: '90%',
  },
  buttonInner: {
    width: '100%',
    height: 45,
    backgroundColor: 'orange',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttontext: {
    fontSize: size.font14,
    fontWeight: weight.semi,
    color: color.white,
  },
  buttonOuttext: {
    color: color.black,
    fontSize: size.font14,
    fontWeight: weight.semi,
    alignSelf: "center",
    mariginButtom: 10
  },
  buttonOuttext2: {
    color: color.black,
    fontSize: size.font14,
    fontWeight: weight.semi,
    alignSelf: "center",
    mariginButtom: 10,
    width: "110%",
    paddingStart: 8,
  },
  cards: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
  },
});