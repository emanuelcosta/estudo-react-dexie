import React, { useState, useEffect } from 'react'
import { View, Text, Button, FlatList, Modal, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import db from '../db';
import styles from '../Styles';
import { hash, compare, genSalt } from 'bcryptjs'

export default function Login({ navigation }) {

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [emailLogin, setEmailLogin] = useState('')
  const [senhaLogin, setSenhaLogin] = useState('')
  const saltRounds = 10;
  const [modalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)


  const loading = () => {
    setTimeout(function () {
      setIsLoading(false)
    }, 1000)
  }

  const authenticate = async () => {
    setIsLoading(true)
    try {
      let users = await db.users.where("email").equalsIgnoreCase(emailLogin).toArray()
      if (users.length > 0) {
        compare(senhaLogin, users[0].senha, function (err, result) {

          if (result == true) {
            setSenhaLogin('')
            setEmailLogin('')
            navigation.navigate('ListaDeProdutos')
          } else {
            alert('usuario ou senha invalido')
            loading()
          }
        })
      } else {
        alert('usuario ou senha invalido')
        loading()
      }

    } catch (e) {
      alert(e)
    }
  }

  const salvarUsuario = async () => {
    try {
      const saltRounds = 12;
      genSalt(saltRounds, function (err, salt) {
        hash(senha, salt, async function (err, hash) {
          // Store hash in your password DB.
          await db.users.add({
            nome,
            email,
            senha: hash
          });
        });
      });

      setNome('')
      setEmail('')
      setSenha('')
      setModalVisible(false)
    } catch (e) {
      alert("Não foi possível salvar." + e)
    }
  }

  loading()

  return (
    <View>
      {isLoading && (
        <View style={[styles_login.container, styles_login.horizontal]}>

          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )}
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

            <View style={styles_login.row}>
              <Pressable style={styles.button} onPress={salvarUsuario}>
                <Text>Salvaar</Text>
              </Pressable>

              <Pressable
                style={[ styles.button]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Voltar</Text>
              </Pressable>
            </View>
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


const styles_login = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});