import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import color from '../../assets/theme/color'
import size from '../../assets/theme/size'
import weight from '../../assets/theme/weight'

const Button = ({text}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

export default Button

const styles = StyleSheet.create({
  container : {
    width:'100%',
    height:50,
    backgroundColor:color.primary,
    borderRadius:32,
    justifyContent:'center',
    alignItems:'center',
    marginVertical:20
  },
  text : {
    fontSize:size.font14,
    fontWeight:weight.semi,
    color:color.white
  }
})