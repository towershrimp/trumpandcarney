"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CharacterSelectionProps {
  onSelect: (character: "trump" | "carney") => void
}

export default function CharacterSelection({ onSelect }: CharacterSelectionProps) {
  const [language, setLanguage] = useState<"english" | "korean">("english")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "english" ? "korean" : "english"))
  }

  const translate = (english: string, korean: string) => {
    return language === "english" ? english : korean
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-red-900 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button variant="outline" className="bg-white/20 hover:bg-white/30 text-white" onClick={toggleLanguage}>
          {language === "english" ? "한국어" : "English"}
        </Button>
      </div>

      <h1 className="text-4xl font-bold text-white mb-8">
        {translate("Trade Wars: The Art of the Deal", "무역 전쟁: 거래의 기술")}
      </h1>
      <h2 className="text-xl text-white mb-4">{translate("Choose Your Side", "당신의 편을 선택하세요")}</h2>

      <p className="text-white/80 text-sm mb-8 max-w-3xl text-center">
        {translate(
          "A Private Meeting Between Donald Trump and Mark Carney on Tariff Policies. The Oval Office, The White House. The room is filled with tension as both leaders prepare to discuss the ongoing tariff dispute between their nations.",
          "관세 정책에 관한 도널드 트럼프와 마크 카니 사이의 비공개 회담. 백악관 오벌 오피스. 두 지도자가 양국 간의 진행 중인 관세 분쟁에 대해 논의할 준비를 하면서 방은 긴장감으로 가득 차 있습니다.",
        )}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card
          className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
          onClick={() => onSelect("trump")}
        >
          <CardHeader className="bg-red-600 text-white">
            <CardTitle>{translate("Donald Trump", "도널드 트럼프")}</CardTitle>
            <CardDescription className="text-white/80">
              {translate("United States President", "미국 대통령")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="aspect-square bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden">
              <img
                src="/trump.webp"
                alt={translate("Donald Trump", "도널드 트럼프")}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm">
              {translate(
                "Play as Donald Trump and use your aggressive negotiation tactics to secure a deal that puts America first. Your goal is to reduce Canadian tariffs while maintaining leverage.",
                "도널드 트럼프로 플레이하고 공격적인 협상 전술을 사용하여 미국을 우선시하는 거래를 확보하세요. 당신의 목표는 레버리지를 유지하면서 캐나다 관세를 줄이는 것입니다.",
              )}
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-red-600 hover:bg-red-700">{translate("Select Trump", "트럼프 선택")}</Button>
          </CardFooter>
        </Card>

        <Card
          className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
          onClick={() => onSelect("carney")}
        >
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle>{translate("Mark Carney", "마크 카니")}</CardTitle>
            <CardDescription className="text-white/80">
              {translate("Canadian Prime Minister", "캐나다 총리")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="aspect-square bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden">
              <img
                src="/carney.webp"
                alt={translate("Mark Carney", "마크 카니")}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm">
              {translate(
                "Play as Mark Carney and use your diplomatic approach to protect Canadian interests while finding common ground. Your goal is to end steel tariffs while minimizing concessions.",
                "마크 카니로 플레이하고 공통점을 찾으면서 캐나다의 이익을 보호하기 위해 외교적 접근 방식을 사용하세요. 당신의 목표는 양보를 최소화하면서 철강 관세를 종료하는 것입니다.",
              )}
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">{translate("Select Carney", "카니 선택")}</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

