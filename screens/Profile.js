import React, { useState, useEffect } from 'react'
import { View, Text, Button, FlatList, Modal, StyleSheet, Pressable, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles,styles_login} from '../Styles';
import db from '../db';
import {encriptarSenha} from './Encrypt';
import { hash, compare, genSalt } from 'bcryptjs';


export default function Profile({ navigation }) {
  
  const logout = async() => {
    try{
      await AsyncStorage.removeItem('dados_logado')
      alert('Saindo')
      navigation.navigate('Login')
    }catch(err){
      console.error(err)
    }
  }

  const [nome, setNome] = useState('')
  const [id,setId] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [senha, setSenha] = useState('')

  useEffect(() => {
    dadosUserLogado()
  }, [])

  const dadosUserLogado = async () => {
    dados_logado = await AsyncStorage.getItem('dados_logado')
    dados_logado = JSON.parse(dados_logado)
    setNome(dados_logado.nome_usuario)
    setId(dados_logado.id)
  }

  const montaModalAlterarSenha = () => {
    setModalVisible(true)
  }

  const salvarNovaSenha = async () => {
    try{

      //FIXME Refatorar para função reaproveitavel
      let saltRounds = 12;
      genSalt(saltRounds, function (err, salt) {
        hash(senha, salt, async function (err, hash) {
          // Store hash in your password DB.
          await db.users.update(id, {senha: hash})
        });
      });

      setSenha('')
      alert('Senha atualizada com sucesso!')
      setModalVisible(false)
    }catch(err){
      console.error(err)
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>


            <Text style={styles.modalText}>Nova Senha</Text>
            <TextInput value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry></TextInput>


            <Text style={styles.modalText}>Confirme a senha</Text>
            <TextInput value='' onChangeText={setSenha} style={styles.input} secureTextEntry></TextInput>

            <View style={styles_login.row}>
              <Pressable style={styles.button} onPress={salvarNovaSenha}>
                <Text>Alterar Senha</Text>
              </Pressable>

              <Pressable
                style={[styles.button]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Voltar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Text>Ola, {nome}</Text>


      <Pressable onPress={ montaModalAlterarSenha} title='Logout' style={[styles.button, styles.buttonOpen]}>
      <Text>Alterar Senha</Text>
        </Pressable>

      <Pressable onPress={ logout} title='Logout' style={[styles.button, styles.buttonOpen]}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}


