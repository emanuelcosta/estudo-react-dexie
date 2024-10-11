import React, { useState, useEffect } from 'react'
import { View, Text, Button, FlatList, Modal, StyleSheet, Pressable, TextInput } from 'react-native';
import db from '../db';
import styles from '../Styles';
import {hash, compare} from 'bcrypt'

export default function Login({ navigation }) {

  const [nome,setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [emailLogin, setEmailLogin] = useState('')
  const [senhaLogin, setSenhaLogin] = useState('')
  const saltRounds = 10;
  const [modalVisible, setModalVisible] = useState(false)

  const authenticate = async () => {
    try {
      let users = await db.users.where("email").equalsIgnoreCase(emailLogin).toArray()
      alert(users.length)
      if(users.length > 0){
        compare(users[0]['senha'], function(err, result){
          if(result == true){
            alert('logado')
          }else{
            alert('usuario ou senha invalido')
          }
        })
      }

    } catch (e) {
      alert(e)
    }
  }

  const salvarUsuario = async () => {
    try {

      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      const myPlaintextPassword = 's0/\/\P4$$w0rD';
      const someOtherPlaintextPassword = 'not_bacon';

      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
            // Store hash in your password DB.
            alert(hash)
        });
    });

      await db.users.add({
        nome,
        email,
        senha
      });


      setNome('')
      setEmail('')
      setSenha('')
      setModalVisible(false)
    } catch (e) {
      alert("Não foi possível salvar." + e)
    }
  }


  return (
    <View>
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

          <Text style={styles.modalText}>Nome</Text>
          <TextInput value={nome} onChangeText={setNome} style={styles.input}></TextInput>
          <Text style={styles.modalText}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.input}></TextInput>
            <Text style={styles.modalText}>Senha</Text>
            <TextInput value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry></TextInput>
            <Pressable style={styles.button} onPress={salvarUsuario}>
              <Text>Salvaar</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Voltar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>


      <Text style={styles.modalText}>Email</Text>
      <TextInput value={emailLogin} onChangeText={setEmailLogin} style={styles.input}></TextInput>
      <Text style={styles.modalText}>Senha</Text>
      <TextInput value={senhaLogin} onChangeText={setSenhaLogin} style={styles.input} secureTextEntry></TextInput>

      <Pressable style={styles.button} onPress={authenticate}>
        <Text>Entrar</Text>
      </Pressable>



      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Cadastrar</Text>
      </Pressable>

    </View>
  );
}
