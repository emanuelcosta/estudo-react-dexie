import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import ListaDeProdutos from './ListaDeProdutos';
import Profile from './Profile';
import {FontAwesome5} from '@expo/vector-icons';

const Tab = createBottomTabNavigator()

export default function AreaUsuario({navigation}) {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Produtos" component={ListaDeProdutos} options={{ tabBarIcon: (focused, color, size) => {
                return <FontAwesome5 name="home" color={color} size={size} />
            }}}></Tab.Screen>
            <Tab.Screen name="Profile" component={Profile} options={{
                tabBarIcon: (focused, color,size) => {
                    return <FontAwesome5 name="user" color={color} size={size}></FontAwesome5>
                },
                title: 'Perfil'
            }}></Tab.Screen>
        </Tab.Navigator>
    )    
}