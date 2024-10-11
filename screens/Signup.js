import React, { useState, useEffect } from 'react'
import { View, Text, Button, FlatList, Modal, StyleSheet, Pressable, TextInput } from 'react-native';
import db from './db';
import styles from './Styles';

export default function ListaDeProdutos({ navigation }) {
  const [produtos, setProdutos] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [id, setId] = useState(null)

  useEffect(() => {
    carregarProdutos()
  }, [])

  const salvarProduto = async () => {
    try {
      if (id) {
        total = quantidade * valor;
        alert(total)
        await db.produtos.update(id, { nome: nome, quantidade: quantidade, valor: valor }).then((updated) => {
          if (updated)
            console.log("Friend number 2 was renamed to Number 2");
          else
            console.log("Nothing was updated - there was no friend with primary key: 2");
        })
      } else {
        await db.produtos.add({
          nome,
          quantidade,
          valor
        });
      }

      carregarProdutos()
      setNome('')
      setValor('')
      setQuantidade('')
      setModalVisible(false)
    } catch (e) {
      alert("Não foi possível salvar." + e)
    }
  }

  const montaModelEdicao = async (id) => {
    const produtoSelecionado = await db.produtos.get(id)
    setNome(produtoSelecionado.nome)
    setValor(produtoSelecionado.valor)
    setQuantidade(produtoSelecionado.quantidade)
    setId(produtoSelecionado.id)
    setModalVisible(true)
  }

  const carregarProdutos = async () => {
    const todosProdutos = await db.produtos.toArray();
    setProdutos(todosProdutos)
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
            <TextInput value={valor} onChangeText={setValor} style={styles.input}></TextInput>
            <Text style={styles.modalText}>Senha</Text>
            <TextInput value={quantidade} onChangeText={setQuantidade} style={styles.input}></TextInput>
            <Text style={styles.modalText}>Repita a senha</Text>
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

      <FlatList
        data={produtos}
        keyExtractor={(item) => {
          item.id.toString()
        }}
        renderItem={({ item }) => (
          <View>
            <Text>{item.nome} - {item.valor} x {item.quantidade} = {item.total}</Text>
            <Button title="Editar" onPress={() => montaModelEdicao(item.id)}></Button>
            <Button title="Excluir"></Button>
          </View>
        )} />
    </View>
  );
}
