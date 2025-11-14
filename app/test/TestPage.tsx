import { useEffect, useState } from "react";
import "../../styles/Pages/Test/TestPage.css";
import axios from "axios";

export default function Test(){

    interface ResponseAPI{
        lichessToken:string | null,
        lichessUsername:JSON | null,
    }

    const [lichessToken, setLichessToken] = useState<ResponseAPI | null>(null);

    useEffect(() =>{
        axios.get('/api/me').then(res =>{
            const apiResponse: ResponseAPI = {
                lichessToken: res.data.lichessToken,
                lichessUsername: res.data.lichessUsername
            };
            setLichessToken(apiResponse);
        });
    })

    //

    while(lichessToken == null){
        return(
            <>
            </>
        )
    }

    if (lichessToken.lichessUsername == null) {
        return(
            <div>
                <button className="test-button" onClick={async() =>  await HandleLogin()}>Lichess Login Button </button>
            </div>
        )
    }

    else{
        return(
            <div>
                <h1>{lichessToken.lichessToken}</h1>
            </div>
        )
    }
    
}

async function HandleLogin() {
    console.log("Hi");
    const fetchAPI = async () =>{
        const url =  "http://localhost:3000/login"
        window.location.href = url;
        const res = axios.get('/me');
        console.log(res);

    };
    fetchAPI();
    
}