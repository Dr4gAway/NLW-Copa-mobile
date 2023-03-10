import { VStack, useToast, HStack } from 'native-base';
import { Header } from '../components/Header';
import { useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { Share } from 'react-native'

import { api } from '../services/api'

import { Option } from '../components/Option';
import { Loading } from '../components/Loading';
import { Guesses } from '../components/Guesses';
import { PoolHeader } from '../components/PoolHeader';
import { PoolCardProps } from '../components/PoolCard';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';

interface routeParams {
    id: string

}

export function Details() {
    const route = useRoute()
    const toast = useToast();
    
    const { id } = route.params as routeParams
    
    const [optionSelected, setOptionSelected]  = useState<'guesses' | 'ranking' >('guesses');
    const [isLoading, setIsLoading] = useState(true);
    const [poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps);

    async function fetchPoolDetails() {
        try {
            setIsLoading(true)

            const response = await api.get(`/pools/${id}`)
            console.log(response.data.pool)
            setPoolDetails(response.data.pool)

        } catch (error) {
            console.log(error)

            toast.show({
                title: 'Não foi possível acessar os detalhes do bolão.',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function handleCodeShare() {
        await Share.share({
            message: poolDetails.code
        })
    }

    useEffect(() => {
        fetchPoolDetails()
    }, [id]);

    if(isLoading) {
        return (
            <Loading/>
        )
    }

    return(
        <VStack flex={1} bgColor={'gray.900'}>
            <Header title={poolDetails.tittle} showBackButton showShareButton onShare={handleCodeShare}/>

            {
                poolDetails._count?.participants > 0 ?
                <VStack px={5} flex={1}>
                    <PoolHeader data={poolDetails} />
                
                    <HStack bgColor={"gray.800"} p={1} rounded="sm" mb={5}>
                        <Option
                            title='Seus Palpites'
                            isSelected={optionSelected === 'guesses'}
                            onPress={() => setOptionSelected('guesses')}
                        />
                        <Option
                            title='Ranking do Grupo'
                            isSelected={optionSelected === 'ranking'}
                            onPress={() => setOptionSelected('ranking')}
                        />
                    </HStack>

                    <Guesses poolId={poolDetails.id} code={poolDetails.code}/>
                </VStack>

                : <EmptyMyPoolList code={poolDetails.code} />
                
            }

        </VStack>

    )
}