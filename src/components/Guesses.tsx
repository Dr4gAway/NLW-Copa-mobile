import { api } from '../services/api';
import { useState, useEffect } from 'react';
import { useToast, FlatList } from 'native-base';

import { Loading } from '../components/Loading';
import { Game, GameProps} from '../components/Game';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')
  const [games, setGames] = useState<GameProps[]>([])


  async function fetchGames() {
    try {
      setIsLoading(true)
      const response = await api.get(`/pools/${poolId}/games`)
      setGames(response.data.games)

    } catch (error) {
      console.log(error)

      toast.show({
          title: 'Não foi possível carregar os jogos.',
          placement: 'top',
          bgColor: 'red.500'
      })
    } finally {
        setIsLoading(false)
    }
  }

  async function handleGuessConfirm(gameId: string) {
  
  try {
    if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
      return toast.show({
        title: 'Informe o placar de seu palpite.',
        placement: 'top',
        bgColor: 'red.500'
      })
    }

    await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
      firstTeamPoints: Number(firstTeamPoints),
      secondTeamPoints: Number(secondTeamPoints),
    })

    toast.show({
      title: 'Seu palpite foi realizado.',
      placement: 'top',
      bgColor: 'green.500'
    })

    fetchGames();
  } catch (error) {
    console.log(error)

    toast.show({
        title: 'Não foi possível enviar o seu palpite.',
        placement: 'top',
        bgColor: 'red.500'
    })
  } finally {
      setIsLoading(false)
  }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId])

  if(isLoading) {
    return (
      <Loading/>
    )
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <Game 
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id) }
        />
      )}

      _contentContainerStyle={{pb: 10}}
      ListEmptyComponent={() => <EmptyMyPoolList code={code}/>}
    />
  );
}
