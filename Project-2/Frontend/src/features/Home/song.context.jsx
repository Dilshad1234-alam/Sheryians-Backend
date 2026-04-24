import { createContext, useState } from "react";

export const  SongContext = createContext() 

export const  SongContextProvider = ({ children }) => {

    const [song, setSong] = useState({
        "url": "https://ik.imagekit.io/Dilshad/cohort-2/moodify/songs/Aaraaro_Aararo__From__quot_Bholaa_quot____DownloadMing.WS__8IxVchXxV.mp3",
        "posterUrl": "https://ik.imagekit.io/Dilshad/cohort-2/moodify/posters/Aaraaro_Aararo__From__quot_Bholaa_quot____DownloadMing.WS__s3nJC0SJZ.jpeg",
        "title": "Aaraaro Aararo (From &quot;Bholaa&quot;) [DownloadMing.WS]",
        "mood": "happy",
    })

    const [songs, setSongs] = useState([]);

    const [loading, setLoading] = useState(false)

    return (
        <SongContext.Provider value={{ loading, setLoading, song, setSong, songs, setSongs }}>
            { children }
        </SongContext.Provider>
    )
}