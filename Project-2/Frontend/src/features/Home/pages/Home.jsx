import React from 'react'
import Player from '../components/Player'
import FaceExpression from '../../Expression/components/FaceExpression'
import { useSong } from '../hooks/useSong'
import SongList from '../components/SongsList'

const Home = () => {
  return (
    <> 
      <FaceExpression 
        onClick={(expression) => { handleGetSong({mood: expression}) }}
      />
      <SongList />
      <Player />
    </>
  )
}

export default Home