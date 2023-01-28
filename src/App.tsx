import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import { io } from "socket.io-client";
import socketService from "./services/socketService";
import { JoinRoom } from "./components/joinRoom";
import GameContext, { IGameContextProps } from "./gameContext";
import { Game } from "./components/game";
import Login from "./components/login/login.jsx";
import useToken from "./Hooks/useToken.js";

const AppContainer = styled.div`
position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
`;

const WelcomeText = styled.h1`
  margin: 0;
  color: #8e44ad;
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  const [token, setToken] = useToken()
  const [isInRoom, setInRoom] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<"x" | "o">("x");
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);
  const [user, setUser] = useState()
  const connectSocket = async () => {
    const socket = await socketService
      .connect("https://backend7.onrender.com")
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  fetch(`https://backend6.onrender.com/user`, {
    headers: { "Content-Type": "application/json", },
  })
    .then(res => res.json())
    .then(data => {
      data.map((el: any) => {
        if (el?._id == token) {
          setUser(el?.name)
        }
      })
    })




  useEffect(() => {
    connectSocket();
  }, []);

  const gameContextValue: IGameContextProps = {
    isInRoom,
    setInRoom,
    playerSymbol,
    setPlayerSymbol,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
  };



  if (token) {

    return (
      <GameContext.Provider value={gameContextValue}>
        <AppContainer>
          <WelcomeText>Welcome {user} to Tic-Tac-Toe</WelcomeText>
          <button className="btnname" onClick={() => setToken(false)}> change name</button>
          <MainContainer>
            {!isInRoom && <JoinRoom />}
            {isInRoom && <Game />}
          </MainContainer>
        </AppContainer>
      </GameContext.Provider>
    );
  } else {
    return (
      <Login />
    )
  }

}

export default App;