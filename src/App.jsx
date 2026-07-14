import React, { useEffect, useState } from 'react'
import './App.css'
import './LoveLetter.css'
import './BookCanvas.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import Layout from './layout/Layout'
import Home from './pages/Home'
import LoveLetter from './pages/LoveLetter'
import Test from './pages/Test'
import OpeningAnimation from './components/OpeningAnimation'
import { useRef } from 'react'

const App = () => {

  const MyRoute = createBrowserRouter(createRoutesFromElements(
    <Route>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />}></Route>
        <Route path='love-Letter' element={<LoveLetter />}></Route>
        <Route path='test' element={<Test />}></Route>
      </Route>
    </Route>
  ))


  // ------------------Cake loader 
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [animateOut, setAnimateOut] = useState(false); // New state for animation

  useEffect(() => {
    const handlePageLoad = () => {
      setTimeout(() => setAnimateOut(true), 8400);
      setTimeout(() => setLoading(false), 9000);
      setTimeout(() => setShowContent(true), 8600);
    };

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    return () => window.removeEventListener("load", handlePageLoad);
  }, []);

  // Site-level audio autoplay
  const audioRef = useRef(null)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const tryPlay = async () => {
      try {
        await audio.play()
      } catch (err) {
        // try muted autoplay
        try {
          audio.muted = true
          await audio.play()
        } catch (err2) {
          // still blocked; enable on first user gesture
          const enable = () => {
            audio.muted = false
            audio.play().catch(()=>{})
            window.removeEventListener('click', enable)
            window.removeEventListener('touchstart', enable)
          }
          window.addEventListener('click', enable)
          window.addEventListener('touchstart', enable)
        }
      }
    }
    tryPlay()
  }, [])

  return (
    <>
      <audio ref={audioRef} src="/song.mp3" preload="auto" playsInline loop />
      {
        loading && <OpeningAnimation animateOut={animateOut}/>
      }
      {
        showContent && <RouterProvider router={MyRoute} />
      }
    </>
  )
}

export default App