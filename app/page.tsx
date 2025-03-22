"use client"

import { useState } from "react"
import DisclaimerPopup from "@/components/disclaimer-popup"
import CharacterSelection from "@/components/character-selection"
import GameScreen from "@/components/game-screen"
import { GameProvider } from "@/components/game-context"
import Footer from "@/components/Footer"

export default function Home() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<"trump" | "carney" | null>(null)

  if (!disclaimerAccepted) {
    return <DisclaimerPopup onAccept={() => setDisclaimerAccepted(true)} />
  }

  if (!selectedCharacter) {
    return <CharacterSelection onSelect={setSelectedCharacter} />
  }

  return (
    <>
    <GameProvider initialCharacter={selectedCharacter}>
      <GameScreen />
    </GameProvider>
    <Footer/>
   </> 
  )
}

