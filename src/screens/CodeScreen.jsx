import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

const CodeScreen = ({ route }) => {

    const { cccd, code} = route.params;
    const navigation = useNavigation();
    const [fcode, setFcode] = useState("");

    const handleForgotPassword = () => {
        if (fcode == code) {
            navigation.navigate('ResetPassword', { cccd: cccd });
        } else {
            Alert.alert('Thất bại', 'Mã không chính xác.');
        }
    }
  return (
    <View className="flex-1  bg-white" >
                <Image source={require('../../assets/logo.png')} style={{ width: 220, height: 200, alignSelf: 'center' }}
                    resizeMode="contain"
                    className="mt-20"></Image>
                <Text className="mx-auto justify-center font-bold text-xl">QUÊN MẬT KHẨU </Text>
                <TextInput
                    value={fcode}
                    onChangeText={(text) => setFcode(text)}
                    className="p-2 ml-4 mr-4 mt-2 border-2 border-black rounded-lg text-black"
                    placeholder="Nhập mã"
                />
                <TouchableOpacity onPress={handleForgotPassword}
                    style={{ alignItems: 'center', backgroundColor: 'blue', padding: 10, margin: 10, borderRadius: 6 }}
                    className="items-center bg-blue-500 p-4 m-4 rounded-md" >
                    <Text className="text-white font-bold">XÁC NHẬN MÃ</Text>
                </TouchableOpacity>
            </View>
  )
}

export default CodeScreen