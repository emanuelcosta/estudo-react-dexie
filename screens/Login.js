import React, { useState, useEffect } from 'react'
import { View, Text, Button, FlatList, Modal, StyleSheet, Pressable, TextInput } from 'react-native';
import db from '../db';
import styles from '../Styles';

export default function Login({ navigation }) {
  
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const saltRounds = 10;


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
            
            <Text style={styles.modalText}>Email</Text>
            <TextInput value={valor} onChangeText={setValor} style={styles.input}></TextInput>
            <Text style={styles.modalText}>Senha</Text>
            <TextInput value={quantidade} onChangeText={setQuantidade} style={styles.input}></TextInput>

            <Pressable style={styles.button} onPress={salvarProduto}>
              <Text>Salvar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>


      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Cadastrar</Text>
      </Pressable>

    </View>
  );
}
