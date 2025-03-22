"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Character = "trump" | "carney"
type Language = "english" | "korean"

interface GameState {
  character: Character
  stage: number
  trumpSatisfaction: number
  carneySatisfaction: number
  dealPoints: {
    steelTariffs: number // 0-100 (0 = removed, 100 = full tariffs)
    dairyAccess: number // 0-100 (0 = no access, 100 = full access)
    stabilityClause: boolean
    retaliationRights: boolean
  }
  gameOver: boolean
  dealMade: boolean
  disastrousOutcome: boolean
  language: Language
  audioEnabled: boolean
}

interface GameContextType {
  state: GameState
  makeChoice: (choice: {
    trumpEffect: number
    carneyEffect: number
    steelTariffsEffect?: number
    dairyAccessEffect?: number
    stabilityClauseEffect?: boolean
    retaliationRightsEffect?: boolean
    disastrousOutcome?: boolean
  }) => void
  advanceStage: () => void
  resetGame: () => void
  toggleLanguage: () => void
  toggleAudio: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({
  children,
  initialCharacter,
}: {
  children: ReactNode
  initialCharacter: Character
}) {
  const [state, setState] = useState<GameState>({
    character: initialCharacter,
    stage: 1,
    trumpSatisfaction: 50,
    carneySatisfaction: 50,
    dealPoints: {
      steelTariffs: 100,
      dairyAccess: 0,
      stabilityClause: false,
      retaliationRights: false,
    },
    gameOver: false,
    dealMade: false,
    disastrousOutcome: false,
    language: "english",
    audioEnabled: false,
  })

  const makeChoice = (choice: {
    trumpEffect: number
    carneyEffect: number
    steelTariffsEffect?: number
    dairyAccessEffect?: number
    stabilityClauseEffect?: boolean
    retaliationRightsEffect?: boolean
    disastrousOutcome?: boolean
  }) => {
    setState((prev) => {
      // If this is a disastrous outcome choice, handle it specially
      if (choice.disastrousOutcome) {
        return {
          ...prev,
          gameOver: true,
          dealMade: false,
          disastrousOutcome: true,
        }
      }

      const newTrumpSatisfaction = Math.max(0, Math.min(100, prev.trumpSatisfaction + choice.trumpEffect))
      const newCarneySatisfaction = Math.max(0, Math.min(100, prev.carneySatisfaction + choice.carneyEffect))

      const newSteelTariffs =
        choice.steelTariffsEffect !== undefined
          ? Math.max(0, Math.min(100, prev.dealPoints.steelTariffs + choice.steelTariffsEffect))
          : prev.dealPoints.steelTariffs

      const newDairyAccess =
        choice.dairyAccessEffect !== undefined
          ? Math.max(0, Math.min(100, prev.dealPoints.dairyAccess + choice.dairyAccessEffect))
          : prev.dealPoints.dairyAccess

      const newStabilityClause =
        choice.stabilityClauseEffect !== undefined ? choice.stabilityClauseEffect : prev.dealPoints.stabilityClause

      const newRetaliationRights =
        choice.retaliationRightsEffect !== undefined
          ? choice.retaliationRightsEffect
          : prev.dealPoints.retaliationRights

      return {
        ...prev,
        trumpSatisfaction: newTrumpSatisfaction,
        carneySatisfaction: newCarneySatisfaction,
        dealPoints: {
          steelTariffs: newSteelTariffs,
          dairyAccess: newDairyAccess,
          stabilityClause: newStabilityClause,
          retaliationRights: newRetaliationRights,
        },
      }
    })
  }

  const advanceStage = () => {
    setState((prev) => {
      if (prev.stage >= 5) {
        // Check if deal is successful
        const playerSatisfaction = prev.character === "trump" ? prev.trumpSatisfaction : prev.carneySatisfaction
        const opponentSatisfaction = prev.character === "trump" ? prev.carneySatisfaction : prev.trumpSatisfaction

        const dealMade = playerSatisfaction >= 40 && opponentSatisfaction >= 30

        return {
          ...prev,
          stage: prev.stage + 1,
          gameOver: true,
          dealMade,
        }
      }

      return {
        ...prev,
        stage: prev.stage + 1,
      }
    })
  }

  const resetGame = () => {
    setState({
      character: initialCharacter,
      stage: 1,
      trumpSatisfaction: 50,
      carneySatisfaction: 50,
      dealPoints: {
        steelTariffs: 100,
        dairyAccess: 0,
        stabilityClause: false,
        retaliationRights: false,
      },
      gameOver: false,
      dealMade: false,
      disastrousOutcome: false,
      language: state.language,
      audioEnabled: state.audioEnabled,
    })
  }

  const toggleLanguage = () => {
    setState((prev) => ({
      ...prev,
      language: prev.language === "english" ? "korean" : "english",
    }))
  }

  const toggleAudio = () => {
    setState((prev) => ({
      ...prev,
      audioEnabled: !prev.audioEnabled,
    }))
  }

  return (
    <GameContext.Provider value={{ state, makeChoice, advanceStage, resetGame, toggleLanguage, toggleAudio }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}

