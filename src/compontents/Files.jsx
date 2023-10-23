import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import size from '../assets/theme/size';
import color from '../assets/theme/color';
import weight from '../assets/theme/weight';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {BASE_URL,API_MODE} from '@env'

const Files = ({item, profile_id, handleRecordData}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [pt_token, setPt_Token] = useState('');
  const [pt_key, setPt_Key] = useState('');
  const [share_with_hospital, setShare_with_hospital] = useState();
  const [share_with_doctor, setShare_with_doctor] = useState();
  useEffect(() => {
    AsyncStorage.getItem('pt_token').then(value => {
      setPt_Token(value);
    });
    AsyncStorage.getItem('pt_key').then(value => {
      setPt_Key(value);
    });
  });

  const handleRecordDelete = value => {
    setLoading(true);
    fetch(`${BASE_URL}patient/remove/record/test/${profile_id}/${value}`, {
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
        handleRecordData();
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error, '......delete  Api Error......');
      });
  };

  const handleFacility = value => {
    console.log(value);
    setLoading(true);
    let dataToSend = JSON.stringify({share_with_hospital: value.status});
    console.log(dataToSend, 'dataToSend');
    fetch(
        `${BASE_URL}patient/facility/record/consent/${API_MODE}/${profile_id}/${value.record_code}`,
      {
        method: 'PUT',
        headers: {
          //Header Defination
          'Content-Type': 'application/json',
          pt_token: pt_token,
          pt_key: pt_key,
        },
        body: dataToSend,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson, 'facility');
        handleRecordData();
      })
      .catch(error => {
        //Hide Loader
        setLoading(false);
        console.error(error, '......facility......');
      });
  };

  const handleDoctor = value => {
    console.log(value);
    setLoading(true);
    let dataToSend = JSON.stringify({share_with_doctor: value.status});
    console.log(dataToSend, 'dataToSend');
    fetch(
        `${BASE_URL}patient/doctor/record/consent/${API_MODE}/${profile_id}/${value.record_code}`,
      {
        method: 'PUT',
        headers: {
          //Header Defination
          'Content-Type': 'application/json',
          pt_token: pt_token,
          pt_key: pt_key,
        },
        body: dataToSend,
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

  const downloadFile = (url, fileName, fileType, record_code) => {
    setLoading(true);
    let dirs = RNFetchBlob.fs.dirs;
    // let fileExt = fileType === 'pdf' ? '.pdf' : '.png'; // Change the file extension depending on the file type

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
      .fetch(
        'GET',
        BASE_URL + url + '/' + API_MODE + `/${profile_id}/${record_code}`,
        {pt_token, pt_key},
      )
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
    <>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 5,
          }}>
          <Text style={styles.date}>{item.uploaded_on.slice(10, 30)}</Text>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setCode(item.record_code);
            }}>
            <Icon name="trash-outline" style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View
            style={{
              width: '30%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.box}>
              <Text numberOfLines={1} style={styles.type}>
                {item.record_category}
              </Text>
            </View>

            <Text numberOfLines={2} style={styles.innerText}>
              {item.display_name}
            </Text>
          </View>

          <View style={{width: '47%'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text style={styles.innerText}>Share with Facility</Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    let record_code = item.record_code;
                    let status = false;
                    const params = {record_code, status};
                    handleFacility(params);
                  }}
                  style={{
                    width: 15,
                    height: 13,
                    backgroundColor: 'red',
                    backgroundColor:
                      item.share_with_hospital === false
                        ? color.buttonGray
                        : color.secondary,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    let record_code = item.record_code;
                    let status = true;
                    const params = {record_code, status};
                    handleFacility(params);
                  }}
                  style={{
                    width: 15,
                    height: 13,
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                    backgroundColor: 'green',

                    backgroundColor:
                      item.share_with_hospital === true
                        ? color.primary
                        : color.secondary,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.innerText}>Share with Doctor</Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    let record_code = item.record_code;
                    let status = false;
                    const params = {record_code, status};
                    handleDoctor(params);
                  }}
                  style={{
                    width: 15,
                    height: 13,
                    backgroundColor:
                      item.share_with_doctor === false
                        ? color.buttonGray
                        : color.secondary,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    let record_code = item.record_code;
                    let status = true;
                    const params = {record_code, status};
                    handleDoctor(params);
                  }}
                  style={{
                    width: 15,
                    height: 13,
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,

                    backgroundColor:
                      item.share_with_doctor === true
                        ? color.primary
                        : color.secondary,
                  }}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              width: '15%',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={() =>
                downloadFile(
                  'patient/get/record',
                  item.display_name,
                  'image',
                  item.record_code,
                )
              }
              style={styles.pdf}>
              <Image
                source={require('../assets/images/pdf.png')}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalInner}>
            <Text style={styles.modalText}>
              Are you sure you would like to permanently delete the file?
            </Text>
            <View
              style={{
                height: 45,
                position: 'absolute',
                width: '100%',
                bottom: 0,
                flexDirection: 'row',
                borderTopWidth: 1,
                borderTopColor: color.borderColor,
              }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  width: '50%',
                  borderRightWidth: 1,
                  borderRightColor: color.borderColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: size.font14,
                    fontWeight: weight.semi,
                    color: color.black,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false), handleRecordDelete(code);
                }}
                style={{
                  width: '50%',
                  borderRightWidth: 1,
                  borderRightColor: color.borderColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: size.font14,
                    fontWeight: weight.semi,
                    color: color.black,
                  }}>
                  Proceed
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Files;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: color.white,
    padding: 10,
    borderRadius: 10,
    borderColor: 'grey',
    elevation: 3,
  },
  icon: {
    fontSize: size.font18,
    color: color.black,
    textAlign: 'right',
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '74%',
  },
  date: {
    fontSize: size.font14,
    fontWeight: weight.semi,
    color: color.black,
  },
  inner: {
    flexDirection: 'row',
    width: 145,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  innerText: {
    fontSize: 12,
    fontWeight: weight.low,
    color: color.textPrimary,
    textAlign: 'center',
  },
  pdf: {
    backgroundColor: color.errorColor,
    borderRadius: 4,
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  box: {
    padding: 5,
    backgroundColor: color.secondary,
    width: '100%',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  type: {
    fontSize: size.font10,
    color: color.primary,
    fontWeight: weight.semi,
  },
  modal: {
    width: '100%',
    alignSelf: 'center',
    height: '100%',
    backgroundColor: '#000000aa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInner: {
    width: '87%',
    height: '20%',
    backgroundColor: color.backgroundColor,
    alignSelf: 'center',
    position: 'absolute',
    borderRadius: 5,
  },
  modalText: {
    fontSize: size.font14,
    fontWeight: weight.low,
    color: color.black,
    padding: 20,
  },
});
