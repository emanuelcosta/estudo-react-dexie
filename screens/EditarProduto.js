import React, {useState, useEffect} from "react";
import { View, TextInput, Button  } from "react-native";
import db from "../db";

export default function EditarProduto({ route, navigation}) {
    const { id } = route.params;
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [quantidade, setQuantidade] = useState('');

    useEffect(() => {
        carregarProdutoPorId();
    }, []);

    const carregarProdutoPorId = async () => {
        const produto = await db.produtos.get(id);
        setNome(produto.nome);
        setValor(produto.valor);
        setQuantidade(produto.quantidade);
    };

    const atualizarProduto = async() => {
        const total = valor * quantidade;
        await db.produtos.update(id, {nome, valor, quantidade, total});
        navigation.navigate('ListaDeProdutos');
    };

    return (
        <View>
            <TextInput placeholder="Nome" value={nome} onChangeText={setNome}/>
            <TextInput placeholder="Valor" value={valor} onChangeText={setValor} keyboardType="numeric"/>
            <TextInput placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} keyboardType="numeric"/>
            <Button title="Atualizar Produto" onPress={atualizarProduto}/>
        </View>
    );

}