import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import color from '../../assets/theme/color';
import BackHeader from '../headers/BackHeader';
import Button from '../comman/Button';
import AddCard from '../AddCard';
import Loader from '../comman/Loader';
import {BASE_URL,API_MODE} from '@env'

const AddProfile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [pt_token, setPt_Token] = useState('');
  const [pt_key, setPt_Key] = useState('');
  const [list, setList] = useState();

  useEffect(() => {
    AsyncStorage.getItem('pt_token').then(value => {
      setPt_Token(value);
    });
    AsyncStorage.getItem('pt_key').then(value => {
      setPt_Key(value);
    });
  });

  const handleProfileList = () => {
    // show Loader
    setLoading(true);
    fetch( `${BASE_URL}list/patient/profiles/${API_MODE}`, {
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
        setList(responseJson.profiles);
        console.log(responseJson);
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error, '...... Profile Api Error......');
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      handleProfileList();
    }, [pt_token, pt_key]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Loader loading={loading} />
      <StatusBar backgroundColor={color.white} />
      <BackHeader />
      <ScrollView>
        <View style={styles.containerInner}>
          {list
            ? list.map(item => {
                return (
                  <TouchableOpacity
                    style={{
                      backgroundColor: color.white,
                      elevation: 1,
                      borderRadius: 10,
                      marginBottom: 20,
                    }}
                    onPress={() => {
                      navigation.replace('AddNewProfile', {
                        profile_id: item.profile_id,
                        status: 1,
                      });
                    }}>
                    <AddCard item={item} func={handleProfileList} />
                  </TouchableOpacity>
                );
              })
            : null}

          <TouchableOpacity
            onPress={() => {
              navigation.replace('AddNewProfile', {
                profile_id: '',
                status: 1,
              });
            }}
            style={styles.button}>
            <Button text="ADD NEW +" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundColor,
  },
  containerInner: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
  },
  button: {
    marginTop: 20,
  },
});
