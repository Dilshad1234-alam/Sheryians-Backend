import { useContext } from "react"
import { SongContext } from "../song.context"
import { getSong } from "../services/song.api"

export const useSong = () => {
    const context = useContext(SongContext)

    const { loading, setLoading, song, setSong, songs, setSongs } = context 

    async function handleGetSong({ mood }) {
        setLoading(true)
        const data = await getSong({mood})
        setSong(data.song)
        setSongs(data.songs)
        setLoading(false)
    }

    return ({ loading, song, songs, setSong, handleGetSong })
}