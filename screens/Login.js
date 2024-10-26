import React, { useState, useEffect } from 'react'
// import { View, Text, Modal, StyleSheet, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { ActivityIndicator } from 'react-native';
import db from '../db';
import { styles, styles_login } from '../Styles';
import { hash, compare, genSalt } from 'bcryptjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeBaseProvider, Text, Input, Button, Box, FormControl, WarningOutlineIcon, Stack, Container, Heading, Alert, VStack, HStack, IconButton, Center, CloseIcon, Divider, Pressable, Modal, View, Card } from 'native-base';

export default function Login({ navigation }) {

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [emailLogin, setEmailLogin] = useState('')
  const [senhaLogin, setSenhaLogin] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [msg_alert, setMsg_alert] = useState('')
  const [msg_type, setMsg_type] = useState('')
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);


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
        compare(senhaLogin, users[0].senha, async function (err, result) {

          if (result == true) {
            setSenhaLogin('')
            setEmailLogin('')
            let dadosUserLogado = [
              {
                isLogado: true,
                nome_usuario: users[0].nome,
                id: users[0].id
              }
            ];

            await AsyncStorage.setItem('dados_logado', JSON.stringify(dadosUserLogado[0]));
            navigation.navigate('AreaUsuario')
          } else {
            // alert('usuario ou senha invalido')
            setMsg_alert('usuario ou senha invalido')
            setMsg_type('error')
            loading()
          }
        })
      } else {
        setMsg_alert('usuario ou senha invalido')
        setMsg_type('error')
        loading()
      }

    } catch (e) {
      alert(e)
    }
  }

  const salvarUsuario = async () => {
    try {
      const saltRounds = 12;
      //FIXME Refatorar
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
      setMsg_alert('Deu tudo certo com o seu cadastro, agora só acessar o sistema!')
      setMsg_type('success')
    } catch (e) {
      setMsg_alert('Aconteceu algo inesperado e não foi possível cadastrar seu usuário, revise os seus dados e pressione o botão Cadastrar!')
      setMsg_type('error')
    }
  }


  useEffect(() => {
    isLogado()
  }, [])

  const isLogado = async () => {
    try {
      let dados_logado = await AsyncStorage.getItem('dados_logado')
      dados_logado = JSON.parse(dados_logado)
      if (dados_logado && dados_logado.isLogado == true) {
        navigation.navigate('AreaUsuario')
      }
    } catch (e) {

    }

  }
  loading()

  return (

    <NativeBaseProvider>

      <Box alignItems="center">

        {isLoading && (
          <View style={[styles_login.container, styles_login.horizontal]}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        )}

        <Heading>Area de acesso</Heading>
        {
          msg_alert && (
            <Box w="100%" maxWidth="400px">
              <Alert maxW="400px" status={msg_type} colorScheme={msg_type}>
                <VStack space={2} flexShrink={1} w="100%">
                  <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                    <HStack flexShrink={1} space={2} alignItems="center">
                      <Alert.Icon />
                      <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                        Atenção!
                      </Text>
                    </HStack>
                    <IconButton variant="unstyled" _focus={{
                      borderWidth: 0
                    }} icon={<CloseIcon size="3" />} _icon={{
                      color: "coolGray.600"
                    }} />
                  </HStack>
                  <Box pl="6" _text={{
                    color: "coolGray.600"
                  }}>
                    {msg_alert}
                  </Box>
                </VStack>
              </Alert>
            </Box>
          )
        }


        <Box w="100%" maxWidth="400px">
          <FormControl isRequired>
            <Stack mx="4">
              <FormControl.Label>Email</FormControl.Label>
              <Input type="text" defaultValue="" onPress={setEmail} placeholder="email" />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Atleast 6 characters are required.
              </FormControl.ErrorMessage>
            </Stack>
          </FormControl>
          <FormControl isRequired>
            <Stack mx="4">
              <FormControl.Label>Senha</FormControl.Label>
              <Input type="password" defaultValue="" onPress={setSenha} placeholder="senha" />
              {/* <FormControl.HelperText>
              Must be atleast 6 characters.
            </FormControl.HelperText> */}
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Atleast 6 characters are required.
              </FormControl.ErrorMessage>
            </Stack>
          </FormControl>
        </Box>
        <Box w="100%" maxWidth="400px" marginTop="15px">
          <Stack mx="4">
            <Button onPress={authenticate}>Login</Button>
            <Divider my="2" _light={{
              bg: "muted.800"
            }} _dark={{
              bg: "muted.50"
            }} />
            <Pressable onPress={() => setModalVisible(true)}>
              <Text>Não sou cadastrado? Cadastre-se</Text>
            </Pressable>
          </Stack>
        </Box>
      </Box>



      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} initialFocusRef={initialRef} finalFocusRef={finalRef}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Cadastre-se aqui</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Nome</FormControl.Label>
              <Input onChangeText={setNome} value={nome} />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Email</FormControl.Label>
              <Input onChangeText={setEmail} value={email} />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Email</FormControl.Label>
              <Input type="password" onChangeText={setSenha} value={senha}></Input>
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
                salvarUsuario()
              }}>
                Cadastrar
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

    </NativeBaseProvider>);


  // return (
  //   <View>
  //     {isLoading && (
  //       <View style={[styles_login.container, styles_login.horizontal]}>

  //         <ActivityIndicator size="large" color="#00ff00" />
  //       </View>
  //     )}
  //     <Text style={styles.modalText}>Email</Text>
  //     <TextInput value={emailLogin} onChangeText={setEmailLogin} style={styles.input}></TextInput>
  //     <Text style={styles.modalText}>Senha</Text>
  //     <TextInput value={senhaLogin} onChangeText={setSenhaLogin} style={styles.input} secureTextEntry></TextInput>

  //     <Pressable style={styles.button} onPress={authenticate}>
  //       <Text>Entrar</Text>
  //     </Pressable>



  //     <Pressable
  //       style={[styles.button, styles.buttonOpen]}
  //       onPress={() => setModalVisible(true)}>
  //       <Text style={styles.textStyle}>Cadastrar</Text>
  //     </Pressable>

  //   </View>
  // );
}
