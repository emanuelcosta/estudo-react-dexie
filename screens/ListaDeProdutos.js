import React, { useState, useEffect } from 'react'
import { Box, HStack, Heading, Avatar, Text, FlatList, NativeBaseProvider, VStack, Spacer, Modal, FormControl, Input, Button, Ionicons } from 'native-base';
import db from '../db';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles, styles_login } from '../Styles';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ListaDeProdutos({ navigation }) {
  const [produtos, setProdutos] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [id, setId] = useState(null)
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  useEffect(() => {
    carregarProdutos()
  }, [])

  const salvarProduto = async () => {
    try {
      if (id) {
        let total = quantidade * valor;
        await db.produtos.update(id, { nome: nome, quantidade: quantidade, valor: valor, total: total }).then((updated) => {
          if (updated)
            console.log("Produto atualizado com sucesso!");
          else
            console.log("Não foi possível atualizar produto!");
        })
      } else {
        let total = quantidade * valor;
        await db.produtos.add({
          nome,
          quantidade,
          valor,
          total: total
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

  const deleteProduto = async (id_produto) => {
    try {
      await db.produtos.delete(id_produto)
      carregarProdutos()
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

  const handleInputNumeric = (text, action) => {
    // Permitir apenas números e um ponto decimal
    const numericValue = text.match(/^[0-9]*(\.?[0-9]*)?$/);
    if (numericValue) {
      action(numericValue[0]);
    }
  };

  const busca = async (input) => {
    setNome(input)
    console.log(input)
    const todosProdutos = await db.produtos.filter(produto => produto.nome.toLowerCase().includes(input.toLowerCase()))
      .toArray()
    setProdutos(todosProdutos)
  }

  return (<NativeBaseProvider><Box>

    {/* <HStack space={[2, 3]} justifyContent="space-between"> */}

    {/* <Heading fontSize="xl" p="4" pb="3">
        Produtos
      </Heading> */}


    <HStack alignSelf="flex-end" margin="15px">
      <Button leftIcon={<FontAwesome5 color="#fff" name="plus-circle"></FontAwesome5>} onPress={() => setModalVisible(true)}>Cadastrar Produto</Button>
    </HStack>

    {/* </HStack> */}

    <Box margin="15px">
      <FormControl>
        <Input onChangeText={(input) => busca(input)} value={nome} placeholder="Digite para pesquisar" />
      </FormControl>
    </Box>

    <FlatList data={produtos} renderItem={({
      item
    }) => <Box borderBottomWidth="1" _dark={{
      borderColor: "muted.50"
    }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
        <HStack space={[2, 3]} justifyContent="space-between">
          <Avatar size="48px" source={{
            uri: './assets/bolo.png'
          }} />
          <VStack>
            <Text _dark={{
              color: "warmGray.50"
            }} color="coolGray.800" bold>
              {item.nome}
            </Text>
            <Text color="coolGray.600" _dark={{
              color: "warmGray.200"
            }}>
              Produtos em estoque: {item.quantidade}
            </Text>
            <Text color="coolGray.600" _dark={{
              color: "warmGray.200"
            }}>
              Valor Unitário: {item.valor}
            </Text>
          </VStack>
          <Spacer />
          <HStack alignSelf="flex-start" marginRight="15px">
            <Button colorScheme="blue" onPress={() => montaModelEdicao(item.id)} leftIcon={<FontAwesome5 color="#fff" name="edit"></FontAwesome5>} mr="1"></Button>
            <Button colorScheme="danger" onPress={() => deleteProduto(item.id)} leftIcon={<FontAwesome5 name="trash" color="#fff" />}></Button>
            {item.timeStamp}
          </HStack>
        </HStack>
      </Box>}
      keyExtractor={item => item.id} />
  </Box>


    <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} initialFocusRef={initialRef} finalFocusRef={finalRef}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Cadastro de Produto</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Nome</FormControl.Label>
            <Input onChangeText={setNome} value={nome} />
          </FormControl>
          <FormControl mt="3">
            <FormControl.Label>Valor</FormControl.Label>
            <Input onChangeText={(input) => handleInputNumeric(input, setQuantidade)} value={valor} keyboardType="numeric" />
          </FormControl>
          <FormControl mt="3">
            <FormControl.Label>Quantidade</FormControl.Label>
            <Input type="text" keyboardType="numeric" onChangeText={(input) => handleInputNumeric(input, setQuantidade)} value={quantidade}></Input>
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setModalVisible(false);
            }}>
              Cancel
            </Button>
            <Button onPress={() => {
              salvarProduto()
            }}>
              Salvar
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>

  </NativeBaseProvider>);

}
