import React, { useState } from 'react'

import { Modal, Text, TextInput, Pressable, View } from 'react-native'
import styles from './Styles';


const FormComponent = (id = null) => {
    
    const [modalVisibleForm, setModalVisible] = useState(false)

    
    const [nome, setNome] = useState('')
    const [valor, setValor] = useState('')
    const [quantidade, setQuantidade] = useState('')
   

    const salvarProduto = async () => {
        try {
            await db.produtos.add({
                nome,
                quantidade,
                valor
            });
            carregarProdutos()
        } catch (e) {
            alert("Não foi possível salvar." + e)
        }
    }

    return (<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleForm}
        onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisibleForm);
        }}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Nome</Text>
                <TextInput value={nome} onChangeText={setNome} style={styles.input}></TextInput>
                <Text style={styles.modalText}>Valor</Text>
                <TextInput value={valor} onChangeText={setValor} style={styles.input}></TextInput>
                <Text style={styles.modalText}>Quantidade</Text>
                <TextInput value={quantidade} onChangeText={setQuantidade} style={styles.input}></TextInput>

                <Pressable style={styles.button} onPress={salvarProduto}>
                    <Text>Salvar</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisibleForm)}>
                    <Text style={styles.textStyle}>Hide Modal</Text>
                </Pressable>
            </View>
        </View>
    </Modal>);
};

export default FormComponent;
