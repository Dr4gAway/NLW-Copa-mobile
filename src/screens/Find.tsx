import { Heading, useToast, VStack } from "native-base";
import { useState } from 'react';
import { api } from '../services/api'

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";

export function Find() {
    const [isLoading, setIsLoading] = useState(false)
    const [code, setCode] = useState('');
    
    const toast = useToast();
    const { navigate } = useNavigation();

    async function handleJoinPools() {

        try {
            setIsLoading(true)

            if(!code.trim()) {
                return toast.show({
                    title: 'Código não digitado!',
                    placement: 'top',
                    bgColor: 'red.500'
                });
            }

            await api.post('/pools/join', { code })

            navigate('pools');

            toast.show({
                title: 'Você entrou no Bolão com sucesso!',
                placement: 'top',
                bgColor: 'green.500'
            });

        } catch (error) {
            console.log(error)

            setIsLoading(false)

            if(error.response?.data?.message === 'Pool not found') {
                return toast.show({
                    title: 'Bolão não encontrado.',
                    placement: 'top',
                    bgColor: 'red.500'
                });
            }

            if(error.response?.data?.message === 'You already joined this pool') {
                return toast.show({
                    title: 'Você já está nesse bolão!',
                    placement: 'top',
                    bgColor: 'red.500'
                });
            }
            
            return toast.show({
                title: 'Bolão não encontrado.',
                placement: 'top',
                bgColor: 'red.500'
            });
            
        }
    }

    return(
        <VStack flex={1} bgColor={'gray.900'}>
            <Header title="Buscar por código" showBackButton/>

            <VStack mt={8} mx={5} alignItems="center">

                <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
                Encontre um bolão através de{'\n'} seu código único
                </Heading>

                <Input 
                    mb={2} placeholder="Qual o código do bolão?"
                    autoCapitalize="characters"
                    onChangeText={setCode}
                />

                <Button
                    title="BUSCAR BOLÃO"
                    isLoading={isLoading}
                    onPress={handleJoinPools}
                />
            </VStack>

        </VStack>
    )
}