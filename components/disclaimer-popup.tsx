"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface DisclaimerPopupProps {
  onAccept: () => void
}

export default function DisclaimerPopup({ onAccept }: DisclaimerPopupProps) {
  const [language, setLanguage] = useState<"english" | "korean">("english")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "english" ? "korean" : "english"))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">{language === "english" ? "Disclaimer" : "면책 조항"}</CardTitle>
            <Button variant="outline" className="text-sm" onClick={toggleLanguage}>
              {language === "english" ? "한국어" : "English"}
            </Button>
          </div>
          <CardDescription>
            {language === "english" ? "Please read before continuing" : "계속하기 전에 읽어주세요"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {language === "english"
              ? "This is a fictional work created by Inky. The characters, dialogues, and scenarios presented in this game are fictional and are not intended to represent real-world individuals or events accurately. Any resemblance to actual persons, living or dead, or actual events is purely coincidental."
              : "이것은 Inky가 만든 가상의 작품입니다. 이 게임에 등장하는 캐릭터, 대화 및 시나리오는 가상이며 실제 인물이나 사건을 정확하게 표현하기 위한 것이 아닙니다. 실제 인물(생존자 또는 사망자)이나 실제 사건과의 유사성은 순전히 우연의 일치입니다."}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {language === "english"
              ? "This game is meant for entertainment purposes only and does not reflect the actual policies, personalities, or negotiation styles of the depicted individuals."
              : "이 게임은 오직 엔터테인먼트 목적으로만 제작되었으며, 묘사된 인물들의 실제 정책, 성격 또는 협상 스타일을 반영하지 않습니다."}
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={onAccept} className="w-full">
            {language === "english" ? "I Understand" : "이해했습니다"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

