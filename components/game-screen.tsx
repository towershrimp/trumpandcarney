"use client"

import { useEffect, useRef, useState } from "react"
import { useGame } from "./game-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Volume2, VolumeX } from "lucide-react"

export default function GameScreen() {
  const { state, makeChoice, advanceStage, resetGame, toggleLanguage, toggleAudio } = useGame()
  const [showingResults, setShowingResults] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Handle audio playback
  useEffect(() => {
    if (audioRef.current) {
      if (state.audioEnabled) {
        audioRef.current.play().catch((e) => {
          console.log("Audio playback failed. This is expected if no audio file is available.")
          // We'll still keep the toggle button functional for demonstration purposes
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [state.audioEnabled])

  // Screen reader announcement
  const announceToScreenReader = (text: string) => {
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "assertive")
    announcement.setAttribute("class", "sr-only")
    announcement.textContent = text
    document.body.appendChild(announcement)
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  // Translate text based on current language
  const translate = (english: string, korean: string) => {
    return state.language === "english" ? english : korean
  }

  if (state.gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-red-900 flex items-center justify-center p-4">
        <audio
          ref={audioRef}
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Battle%20Field-MGM5JTwY5c49o88ZMMSz2Vzf0MMcol.mp3"
          loop
          onError={(e) => {
            console.log("Audio file could not be loaded. This is expected in the preview environment.")
            // Keep the audio controls working visually even if the file doesn't exist
          }}
        />
        <div className="fixed top-4 right-4 flex gap-2">
          {/* Audio toggle button - Note: In preview, audio may not play due to missing file */}
          <Button
            variant="outline"
            size="icon"
            className="bg-white/20 hover:bg-white/30"
            onClick={toggleAudio}
            aria-label={state.audioEnabled ? "Mute background music" : "Play background music"}
          >
            {state.audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button variant="outline" className="bg-white/20 hover:bg-white/30 text-white" onClick={toggleLanguage}>
            {state.language === "english" ? "한국어" : "English"}
          </Button>
        </div>

        <Card className="w-full max-w-2xl">
          <CardHeader
            className={`${state.disastrousOutcome ? "bg-red-700" : state.dealMade ? "bg-green-600" : "bg-red-600"} text-white p-6`}
          >
            <h2 className="text-2xl font-bold">
              {state.disastrousOutcome
                ? translate("Negotiations Collapsed!", "협상 결렬!")
                : state.dealMade
                  ? translate("Deal Successfully Made!", "거래 성공!")
                  : translate("Negotiations Failed", "협상 실패")}
            </h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {state.disastrousOutcome ? (
                <div>
                  <h3 className="font-semibold mb-2">{translate("What Happened:", "무슨 일이 일어났나:")}</h3>
                  <p>
                    {translate(
                      state.character === "trump"
                        ? "Your heated outburst caused the negotiations to collapse completely. Mark Carney abruptly ended the meeting, and both delegations left in anger. The media is reporting on the diplomatic incident, and relations between the U.S. and Canada have reached a new low. Trade tensions have escalated dramatically."
                        : "Your heated response to Trump's provocations caused the negotiations to collapse completely. Trump stormed out of the meeting, and both delegations left in anger. The media is reporting on the diplomatic incident, and relations between the U.S. and Canada have reached a new low. Trade tensions have escalated dramatically.",
                      state.character === "trump"
                        ? "당신의 격렬한 분노로 인해 협상이 완전히 붕괴되었습니다. Mark Carney는 갑자기 회의를 종료했고, 양측 대표단은 분노 속에 떠났습니다. 언론은 이 외교적 사건을 보도하고 있으며, 미국과 캐나다 간의 관계는 새로운 최저점에 도달했습니다. 무역 긴장이 극적으로 고조되었습니다."
                        : "Trump의 도발에 대한 당신의 격렬한 반응으로 인해 협상이 완전히 붕괴되었습니다. Trump는 회의에서 성난 채로 나갔고, 양측 대표단은 분노 속에 떠났습니다. 언론은 이 외교적 사건을 보도하고 있으며, 미국과 캐나다 간의 관계는 새로운 최저점에 도달했습니다. 무역 긴장이 극적으로 고조되었습니다.",
                    )}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">{translate("Final Deal Terms:", "최종 거래 조건:")}</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        {translate("Steel Tariffs:", "철강 관세:")}{" "}
                        {translate(
                          state.dealPoints.steelTariffs === 0
                            ? "Completely Removed"
                            : state.dealPoints.steelTariffs < 50
                              ? "Significantly Reduced"
                              : state.dealPoints.steelTariffs < 100
                                ? "Partially Reduced"
                                : "Maintained",
                          state.dealPoints.steelTariffs === 0
                            ? "완전히 제거됨"
                            : state.dealPoints.steelTariffs < 50
                              ? "크게 감소됨"
                              : state.dealPoints.steelTariffs < 100
                                ? "부분적으로 감소됨"
                                : "유지됨",
                        )}
                      </li>
                      <li>
                        {translate("Dairy Market Access:", "유제품 시장 접근:")}{" "}
                        {translate(
                          state.dealPoints.dairyAccess > 75
                            ? "Fully Open"
                            : state.dealPoints.dairyAccess > 50
                              ? "Significantly Increased"
                              : state.dealPoints.dairyAccess > 0
                                ? "Slightly Increased"
                                : "Unchanged",
                          state.dealPoints.dairyAccess > 75
                            ? "완전히 개방됨"
                            : state.dealPoints.dairyAccess > 50
                              ? "크게 증가됨"
                              : state.dealPoints.dairyAccess > 0
                                ? "약간 증가됨"
                                : "변화 없음",
                        )}
                      </li>
                      <li>
                        {translate("Stability Clause:", "안정성 조항:")}{" "}
                        {translate(
                          state.dealPoints.stabilityClause ? "Included" : "Not Included",
                          state.dealPoints.stabilityClause ? "포함됨" : "포함되지 않음",
                        )}
                      </li>
                      <li>
                        {translate("Retaliation Rights:", "보복 권리:")}{" "}
                        {translate(
                          state.dealPoints.retaliationRights ? "Preserved" : "Limited",
                          state.dealPoints.retaliationRights ? "보존됨" : "제한됨",
                        )}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">{translate("Satisfaction Levels:", "만족도:")}</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Trump</span>
                          <span className="text-sm font-medium">{state.trumpSatisfaction}%</span>
                        </div>
                        <Progress value={state.trumpSatisfaction} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Carney</span>
                          <span className="text-sm font-medium">{state.carneySatisfaction}%</span>
                        </div>
                        <Progress value={state.carneySatisfaction} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">{translate("Outcome:", "결과:")}</h3>
                    <p>
                      {translate(
                        state.dealMade
                          ? `Congratulations! As ${state.character === "trump" ? "President Trump" : "Prime Minister Carney"}, you've successfully negotiated a trade deal that both sides can accept. Your diplomatic skills have prevented a trade war and strengthened the relationship between the United States and Canada.`
                          : `Unfortunately, as ${state.character === "trump" ? "President Trump" : "Prime Minister Carney"}, you were unable to reach a deal that satisfied both parties. The trade tensions continue to escalate, harming businesses and workers on both sides of the border.`,
                        state.dealMade
                          ? `축하합니다! ${state.character === "trump" ? "트럼프 대통령" : "카니 총리"}으로서, 당신은 양측이 수용할 수 있는 무역 거래를 성공적으로 협상했습니다. 당신의 외교적 기술은 무역 전쟁을 방지하고 미국과 캐나다 간의 관계를 강화했습니다.`
                          : `안타깝게도, ${state.character === "trump" ? "트럼프 대통령" : "카니 총리"}으로서, 당신은 양측을 만족시키는 거래에 도달하지 못했습니다. 무역 긴장은 계속 고조되어 국경 양쪽의 기업과 노동자들에게 해를 끼치고 있습니다.`,
                      )}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">
                      {translate("Negotiation Strategy Analysis:", "협상 전략 분석:")}
                    </h3>
                    <p className="text-sm">
                      {translate(
                        state.character === "trump"
                          ? "In trade negotiations, smart dealmakers scale their demands proportionally to their concessions. When you give up more on tariffs, you should demand more market access in return. Keeping some leverage (like partial tariffs) while securing significant gains shows strategic thinking."
                          : state.dealPoints.stabilityClause && state.dealPoints.retaliationRights
                            ? "Your comprehensive approach balanced concrete concessions with strong safeguards. By securing both stability guarantees and retaliation rights, you've protected Canada from future policy shifts while making meaningful concessions on dairy access."
                            : state.dealPoints.stabilityClause
                              ? "Including a stability clause was smart, as it protects Canadian industries from sudden policy changes. However, without specific terms or retaliation rights, your position could be stronger."
                              : "While you've made progress on specific trade terms, the lack of stability guarantees or retaliation rights leaves Canada vulnerable to future policy changes. The strongest trade deals balance concrete concessions with structural safeguards.",
                        state.character === "trump"
                          ? "무역 협상에서 현명한 협상가는 자신의 양보에 비례하여 요구를 조정합니다. 관세에서 더 많이 양보할 때는 그 대가로 더 많은 시장 접근을 요구해야 합니다. 상당한 이득을 확보하면서 일부 레버리지(부분 관세 등)를 유지하는 것은 전략적 사고를 보여줍니다."
                          : state.dealPoints.stabilityClause && state.dealPoints.retaliationRights
                            ? "당신의 포괄적인 접근 방식은 구체적인 양보와 강력한 안전장치 사이의 균형을 이루었습니다. 안정성 보장과 보복 권리를 모두 확보함으로써, 유제품 접근에 의미 있는 양보를 하면서도 캐나다를 미래 정책 변화로부터 보호했습니다."
                            : state.dealPoints.stabilityClause
                              ? "안정성 조항을 포함한 것은 현명했습니다. 이는 캐나다 산업을 갑작스러운 정책 변화로부터 보호합니다. 그러나 구체적인 조건이나 보복 권리가 없다면, 당신의 입장은 더 강력할 수 있었습니다."
                              : "특정 무역 조건에 진전을 이루었지만, 안정성 보장이나 보복 권리가 없으면 캐나다는 미래 정책 변화에 취약합니다. 가장 강력한 무역 거래는 구체적인 양보와 구조적 안전장치 사이의 균형을 이룹니다.",
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={resetGame} className="w-full">
              {translate("Play Again", "다시 하기")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-red-900 flex flex-col">
      <audio
        ref={audioRef}
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Battle%20Field-MGM5JTwY5c49o88ZMMSz2Vzf0MMcol.mp3"
        loop
        onError={(e) => {
          console.log("Audio file could not be loaded. This is expected in the preview environment.")
          // Keep the audio controls working visually even if the file doesn't exist
        }}
      />

      <header className="bg-black/30 p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">
              {translate("Trade Wars: The Art of the Deal", "무역 전쟁: 거래의 기술")}
            </h1>
            <div className="flex gap-2">
              {/* Audio toggle button - Note: In preview, audio may not play due to missing file */}
              <Button
                variant="outline"
                size="icon"
                className="bg-white/20 hover:bg-white/30"
                onClick={toggleAudio}
                aria-label={state.audioEnabled ? "Mute background music" : "Play background music"}
              >
                {state.audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button variant="outline" className="bg-white/20 hover:bg-white/30 text-white" onClick={toggleLanguage}>
                {state.language === "english" ? "한국어" : "English"}
              </Button>
            </div>
          </div>
          <p className="text-white/80 text-sm mt-2 max-w-3xl">
            {translate(
              "A Private Meeting Between Donald Trump and Mark Carney on Tariff Policies. The Oval Office, The White House. The room is filled with tension as both leaders prepare to discuss the ongoing tariff dispute between their nations.",
              "관세 정책에 관한 도널드 트럼프와 마크 카니 사이의 비공개 회담. 백악관 오벌 오피스. 두 지도자가 양국 간의 진행 중인 관세 분쟁에 대해 논의할 준비를 하면서 방은 긴장감으로 가득 차 있습니다.",
            )}
          </p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-4">
              <div>
                <span className="text-xs text-white/80">{translate("Playing as:", "플레이어:")}</span>
                <span className="ml-2 text-sm font-bold text-white">
                  {state.character === "trump"
                    ? translate("Donald Trump", "도널드 트럼프")
                    : translate("Mark Carney", "마크 카니")}
                </span>
              </div>
              <div>
                <span className="text-xs text-white/80">{translate("Stage:", "단계:")}</span>
                <span className="ml-2 text-sm font-bold text-white">{state.stage}/5</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex-1 flex flex-col md:flex-row gap-4 p-4">
        <div className="w-full md:w-3/4 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-100 p-4 flex items-start gap-4">
            <div className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden">
              {state.character === "trump" ? (
                <img src="/trump.webp" alt="Donald Trump" className="w-full h-full object-cover" aria-hidden="true" />
              ) : (
                <img src="/carney.webp" alt="Mark Carney" className="w-full h-full object-cover" aria-hidden="true" />
              )}
            </div>
            <div>
              <h2 className="font-bold">
                {state.character === "trump"
                  ? translate("You (Donald Trump)", "당신 (도널드 트럼프)")
                  : translate("You (Mark Carney)", "당신 (마크 카니)")}
              </h2>
              <p className="text-sm break-words whitespace-pre-wrap">
                {translate(
                  getDialogue(state.stage, state.character, "player"),
                  getKoreanDialogue(state.stage, state.character, "player"),
                )}
              </p>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden">
                {state.character === "trump" ? (
                  <img src="/carney.webp" alt="Mark Carney" className="w-full h-full object-cover" aria-hidden="true" />
                ) : (
                  <img src="/trump.webp" alt="Donald Trump" className="w-full h-full object-cover" aria-hidden="true" />
                )}
              </div>
              <div>
                <h2 className="font-bold">
                  {state.character === "trump"
                    ? translate("Mark Carney", "마크 카니")
                    : translate("Donald Trump", "도널드 트럼프")}
                </h2>
                <p className="text-sm break-words whitespace-pre-wrap">
                  {translate(
                    getDialogue(state.stage, state.character, "opponent"),
                    getKoreanDialogue(state.stage, state.character, "opponent"),
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">{translate("Your Response:", "당신의 응답:")}</h3>
              {getChoices(state.stage, state.character, state.language).map((choice, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => {
                    makeChoice(choice.effects)
                    setShowingResults(true)
                    // Announce to screen reader
                    if (state.audioEnabled) {
                      announceToScreenReader(choice.text)
                    }
                  }}
                >
                  {choice.text}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-sm font-semibold">{translate("Satisfaction Levels", "만족도")}</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">Trump</span>
                  <span className="text-xs">{state.trumpSatisfaction}%</span>
                </div>
                <Progress value={state.trumpSatisfaction} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">Carney</span>
                  <span className="text-xs">{state.carneySatisfaction}%</span>
                </div>
                <Progress value={state.carneySatisfaction} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-sm font-semibold">{translate("Current Deal Terms", "현재 거래 조건")}</h3>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>{translate("Steel Tariffs:", "철강 관세:")}</span>
                <span>{state.dealPoints.steelTariffs}%</span>
              </div>
              <div className="flex justify-between">
                <span>{translate("Dairy Access:", "유제품 접근:")}</span>
                <span>{state.dealPoints.dairyAccess}%</span>
              </div>
              <div className="flex justify-between">
                <span>{translate("Stability Clause:", "안정성 조항:")}</span>
                <span>
                  {translate(
                    state.dealPoints.stabilityClause ? "Yes" : "No",
                    state.dealPoints.stabilityClause ? "예" : "아니오",
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{translate("Retaliation Rights:", "보복 권리:")}</span>
                <span>
                  {translate(
                    state.dealPoints.retaliationRights ? "Yes" : "No",
                    state.dealPoints.retaliationRights ? "예" : "아니오",
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showingResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-xl font-bold">{translate("Round Results", "라운드 결과")}</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{translate("Satisfaction Changes:", "만족도 변화:")}</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Trump</span>
                      <span className="text-sm">{state.trumpSatisfaction}%</span>
                    </div>
                    <Progress value={state.trumpSatisfaction} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Carney</span>
                      <span className="text-sm">{state.carneySatisfaction}%</span>
                    </div>
                    <Progress value={state.carneySatisfaction} className="h-2" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{translate("Deal Terms:", "거래 조건:")}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{translate("Steel Tariffs:", "철강 관세:")}</span>
                    <span>{state.dealPoints.steelTariffs}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{translate("Dairy Access:", "유제품 접근:")}</span>
                    <span>{state.dealPoints.dairyAccess}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{translate("Stability Clause:", "안정성 조항:")}</span>
                    <span>
                      {translate(
                        state.dealPoints.stabilityClause ? "Yes" : "No",
                        state.dealPoints.stabilityClause ? "예" : "아니오",
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{translate("Retaliation Rights:", "보복 권리:")}</span>
                    <span>
                      {translate(
                        state.dealPoints.retaliationRights ? "Yes" : "No",
                        state.dealPoints.retaliationRights ? "예" : "아니오",
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  setShowingResults(false)
                  advanceStage()
                }}
                className="w-full"
              >
                {translate("Continue", "계속하기")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

function getDialogue(stage: number, character: "trump" | "carney", speaker: "player" | "opponent"): string {
  const isTrumpSpeaking =
    (character === "trump" && speaker === "player") || (character === "carney" && speaker === "opponent")

  if (isTrumpSpeaking) {
    switch (stage) {
      case 1:
        return "Mark, great to see you. You know, I like Canada, I really do. Great people, great maple syrup. But the thing is, Canada's been taking advantage of us for decades. I mean, look at the numbers—our trade deficit, the ridiculous tariffs you guys have on American dairy. We can't let that stand anymore. That's why we put tariffs on your steel and aluminum. Fair trade, that's all I'm asking for."
      case 2:
        return "Look, Mark, I know trade, okay? I wrote The Art of the Deal. What I want is for American companies to stop getting ripped off. Our farmers, our steelworkers, they're the backbone of this country. Canada's been slapping tariffs on U.S. dairy, making it impossible for our farmers to compete. That's gotta stop."
      case 3:
        return "Bad economics? Come on, Mark. Look at China—they've been playing us for years. I put tariffs on them, and guess what? They came to the table. Mexico? Same thing. They said they wouldn't renegotiate NAFTA, but I pushed hard, and now we've got the USMCA. You gotta be tough, Mark."
      case 4:
        return "We're the biggest economy in the world. Canada needs us more than we need Canada. If you retaliate, we'll just put more tariffs on."
      case 5:
        return "Alright, alright. You're a tough guy, Mark, I'll give you that. I respect it. But I need something that looks like a win. Can we at least agree on reducing some of those dairy tariffs? Give me something I can sell to my farmers."
      default:
        return ""
    }
  } else {
    switch (stage) {
      case 1:
        return "Mr. President, I appreciate you taking the time to meet. Let's be clear—Canada isn't taking advantage of the United States. Our economies are deeply integrated, and these tariffs are hurting businesses and workers on both sides of the border. You want a deal that benefits the U.S., but I need a deal that also works for Canadians. That's how trade works—it's about mutual benefit, not just winning or losing."
      case 2:
        return "Trade isn't just about one sector. Yes, we have protections for dairy, just like the U.S. has protections for its own industries. Your tariffs on our steel and aluminum are costing thousands of jobs in Canada—and in America. U.S. car manufacturers rely on Canadian aluminum. Your policies are driving up their costs, making your own companies less competitive. That's not 'America First'; that's just bad economics."
      case 3:
        return "You forced their hand, but at what cost? Investors hate uncertainty. Markets react negatively to tariff wars. Supply chains don't adjust overnight. Canada is your closest ally and your largest trading partner. We don't respond well to threats. If you keep escalating tariffs, we will have to respond in kind. We've done it before. You might recall the retaliatory tariffs we placed in 2018. That didn't go well for either of us."
      case 4:
        return "Mr. President, you're focusing on short-term wins while risking long-term economic harm. Your own businesses are lobbying against these tariffs because they're hurting American workers. And let's not forget the bigger picture—our countries are stronger when we stand together. I'd rather find a solution that benefits both of us than escalate a trade war that will hurt our economies."
      case 5:
        return "We can have a conversation about market access for dairy, but we need assurances on steel and aluminum tariffs. If you remove those, we can negotiate further on dairy. But we need predictability—no sudden tariff hikes. Businesses need stability. Let's work toward a structured deal rather than a trade war."
      default:
        return ""
    }
  }
}

function getKoreanDialogue(stage: number, character: "trump" | "carney", speaker: "player" | "opponent"): string {
  const isTrumpSpeaking =
    (character === "trump" && speaker === "player") || (character === "carney" && speaker === "opponent")

  if (isTrumpSpeaking) {
    switch (stage) {
      case 1:
        return "마크, 만나서 반갑네. 내가 캐나다를 좋아한다는 걸 알테지, 정말로 그래. 훌륭한 사람들, 훌륭한 메이플 시럽을 가진 국가야. 하지만 문제는 캐나다가 수십 년 동안 우리를 이용해 왔다는 거야. 숫자를 봐—우리의 무역 적자, 그리고 미국 유제품에 대한 터무니없는 관세를 보라고. 우리는 더 이상 이것을 용납할 수 없어. 그래서 우리가 너희 철강과 알루미늄에 관세를 부과한 거야. 공정한 무역, 그게 내가 요구하는 전부니까."
      case 2:
        return "봐, 마크, 내가 당신보다 무역을 얼마나 많이 해 봤겠나, 그렇지 않나? 난 '거래의 기술'이란 책도 썼어. 내가 원하는 건 미국 기업들이 더 이상 속지 않는 거야. 우리 농부들, 우리 철강 노동자들, 그들이 이 나라의 뼈대야. 캐나다는 미국 유제품에 관세를 부과해서 우리 농부들이 경쟁할 수 없게 만들고 있어. 이건 멈춰야 해."
      case 3:
        return "나쁜 경제학? 말도 안 되는 소리, 마크. 중국을 봐—그들은 수년 동안 우리를 이용해 왔어. 내가 그들에게 관세를 부과했고, 그 결과는? 그들은 벌벌 떨며 협상 테이블에 왔지. 멕시코? 마찬가지야. 그들은 NAFTA를 재협상하지 않겠다고 했지만, 내가 강하게 밀어붙였고, 이제 우리는 USMCA를 갖게 됐어. 협상에서는 강해야 해, 마크."
      case 4:
        return "우리는 세계 최대 경제국이야. 캐나다는 우리가 캐나다를 필요로 하는 것보다 우리를 더 필요로 하지. 만약 너희가 보복한다면, 우리는 그냥 더 많은 관세를 부과할 거야. 기대하는게 좋아."
      case 5:
        return "좋아, 좋아. 넌 강한 사람이야, 마크, 인정해. 존중해. 하지만 나는 승리처럼 보이는 무언가가 필요해. 적어도 그 유제품 관세 중 일부를 줄이는 데 동의할 수 있을까? 내가 우리 농부들에게 팔 수 있는 무언가를 줘야 이 협상이 성공적으로 끝나게 될거야."
      default:
        return ""
    }
  } else {
    switch (stage) {
      case 1:
        return "대통령님, 시간을 내주셔서 감사합니다. 분명히 말씀드리자면—캐나다는 미국을 이용하고 있지 않습니다. 우리 경제는 깊이 통합되어 있으며, 이러한 관세는 국경 양쪽의 기업과 노동자들에게 피해를 주고 있습니다. 당신은 미국에 이익이 되는 거래를 원하지만, 저는 캐나다인들에게도 효과가 있는 거래가 필요합니다. 그것이 무역이 작동하는 방식입니다—단순히 이기거나 지는 것이 아니라 상호 이익에 관한 것입니다."
      case 2:
        return "무역은 단지 한 부문에 관한 것이 아닙니다. 네, 우리는 유제품에 대한 보호무역을 하고 있습니다, 이건 미국이 자국 산업에 대한 보호를 하고 있는 것과 같죠. 우리 철강과 알루미늄에 대한 당신의 관세는 캐나다에서—그리고 미국에서—수천 개의 일자리를 잃게 하고 있습니다. 미국 자동차 제조업체는 캐나다 알루미늄에 의존합니다. 당신의 정책은 그들의 비용을 증가시켜 자국 기업의 경쟁력을 약화시키고 있습니다. 그것은 '미국 우선'이 아닙니다; 그것은 단지 나쁜 경제학입니다."
      case 3:
        return "당신은 다른 국가의 리더들을 굴복시켰다고 하지만, 어떤 대가를 치렀나요? 투자자들은 불확실성을 싫어합니다. 시장은 관세 전쟁에 부정적으로 반응합니다. 공급망은 하룻밤 사이에 조정되지 않습니다. 캐나다는 당신의 가장 가까운 동맹국이자 가장 큰 무역 파트너입니다. 그러나 우리는 위협에 잘 반응하지 않습니다. 만약 당신이 계속해서 관세를 높인다면, 우리는 같은 방식으로 대응할 수밖에 없을 것입니다. 우리는 이전에도 그렇게 했었죠. 2018년에 우리가 부과한 보복 관세를 기억하실 겁니다. 그것은 우리 둘 다에게 좋지 않았습니다."
      case 4:
        return "대통령님, 당신은 장기적인 경제적 해를 감수하면서 단기적인 승리에 집중하고 있습니다. 당신 자신의 기업들까지 이러한 관세에 반대하는 로비를 하고 있다는 것을 알고 있습니다. 왜냐하면 그것들이 미국 기업인과 노동자들에게 해를 끼치고 있기 때문입니다. 그리고 더 큰 그림을 잊지 맙시다—우리는 함께 설 때 더 강합니다. 저는 우리 경제에 해를 끼칠 무역 전쟁을 고조시키기보다는 우리 둘 다에게 이익이 되는 해결책을 찾고 싶습니다."
      case 5:
        return "우리는 유제품 시장 접근에 대해 대화할 수 있지만, 철강과 알루미늄 관세에 대한 철회 보장이 필요합니다. 만약 당신이 그것들을 제거한다면, 우리는 유제품에 대해 더 협상할 수 있습니다. 하지만 우리는 예측 가능성이 필요합니다—갑작스러운 관세 인상은 안 됩니다. 기업들은 안정성이 필요합니다. 무역 전쟁보다는 구조화된 거래를 향해 노력합시다."
      default:
        return ""
    }
  }
}

function getChoices(stage: number, character: "trump" | "carney", language: "english" | "korean") {
  const isEnglish = language === "english"

  if (character === "trump") {
    switch (stage) {
      case 1:
        return [
          {
            text: isEnglish
              ? "Double down: 'The tariffs stay until you open your dairy market. America first!'"
              : "강경하게 나가기: '당신이 유제품 시장을 개방할 때까지 관세는 유지됩니다. 어떤 거래든 미국이 우선시 되야하는건 변함 없죠!'",
            effects: {
              trumpEffect: 5,
              carneyEffect: -10,
              dairyAccessEffect: 0,
            },
          },
          {
            text: isEnglish
              ? "Moderate stance: 'I understand your concerns, but we need to see movement on dairy access.'"
              : "중도적 입장: '당신의 우려를 이해합니다만, 우리는 유제품 접근 요구에 대한 당신의 대응을 지켜 볼 필요가 있습니다.'",
            effects: {
              trumpEffect: 0,
              carneyEffect: 5,
              dairyAccessEffect: 10,
            },
          },
          {
            text: isEnglish
              ? "Threaten: 'If you don't cooperate, we'll put tariffs on your auto industry too.'"
              : "위협하기: '협조하지 않으면 자동차 산업에도 관세를 부과할 것입니다.'",
            effects: {
              trumpEffect: 10,
              carneyEffect: -15,
              steelTariffsEffect: 0,
            },
          },
        ]
      case 2:
        return [
          {
            text: isEnglish
              ? "Appeal to fairness: 'All I want is fair trade. Our farmers deserve access to your markets.'"
              : "공정성에 호소하기: '내가 원하는 것은 공정한 무역뿐입니다. 우리 농부들은 당신의 시장에 접근할 자격이 있죠.'",
            effects: {
              trumpEffect: 5,
              carneyEffect: 0,
              dairyAccessEffect: 15,
            },
          },
          {
            text: isEnglish
              ? "Offer a concession: 'Maybe we can reduce some steel tariffs if you open dairy markets.'"
              : "양보 제안하기: '만약 당신이 유제품 시장을 개방한다면 우리는 일부 철강 관세를 줄일 수 있을 것입니다.'",
            effects: {
              trumpEffect: -5,
              carneyEffect: 10,
              steelTariffsEffect: -20,
              dairyAccessEffect: 20,
            },
          },
          {
            text: isEnglish
              ? "Stand firm: 'The numbers don't lie, Mark. Canada's been taking advantage of us.'"
              : "단호하게 서기: '숫자는 거짓말을 하지 않습니다, 마크. 캐나다는 우리를 이용해 왔습니다.'",
            effects: {
              trumpEffect: 10,
              carneyEffect: -10,
              steelTariffsEffect: 0,
              dairyAccessEffect: 0,
            },
          },
        ]
      case 3:
        return [
          {
            text: isEnglish
              ? "Boast about success: 'My tariff strategy works. Look at China and Mexico.'"
              : "성공을 자랑하기: '내 관세 전략은 효과가 있습니다. 중국과 멕시코를 보세요.'",
            effects: {
              trumpEffect: 10,
              carneyEffect: -5,
              steelTariffsEffect: 0,
            },
          },
          {
            text: isEnglish
              ? "Suggest compromise: 'Let's find a middle ground that works for both countries.'"
              : "타협 제안하기: '양국 모두에게 효과적인 중간 지점을 찾읍시다.'",
            effects: {
              trumpEffect: 0,
              carneyEffect: 15,
              steelTariffsEffect: -30,
              dairyAccessEffect: 15,
              stabilityClauseEffect: true,
            },
          },
          {
            text: isEnglish
              ? "Focus on specific sectors: 'Let's talk about dairy specifically. What can you offer?'"
              : "특정 부문에 집중하기: '유제품에 대해 구체적으로 이야기합시다. 무엇을 제안할 수 있습니까?'",
            effects: {
              trumpEffect: 5,
              carneyEffect: 5,
              dairyAccessEffect: 25,
            },
          },
        ]
      case 4:
        return [
          {
            text: isEnglish
              ? "Soften stance: 'Look, we're allies. Let's not let this get out of hand.'"
              : "입장 완화하기: '보세요, 우리는 동맹입니다. 이것이 통제를 벗어나지 않게 합시다.'",
            effects: {
              trumpEffect: -5,
              carneyEffect: 15,
              steelTariffsEffect: -40,
            },
          },
          {
            text: isEnglish
              ? "Maintain pressure: 'The U.S. economy can handle a trade dispute better than Canada can.'"
              : "압력 유지하기: '미국 경제는 캐나다보다 무역 분쟁을 더 잘 견딜 수 있습니다.'",
            effects: {
              trumpEffect: 10,
              carneyEffect: -10,
              steelTariffsEffect: 0,
            },
          },
          {
            text: isEnglish
              ? "Propose a deal: 'Let's reduce steel tariffs by 50% if you increase dairy access by 30%.'"
              : "거래 제안하기: '만약 당신이 유제품 접근을 30% 증가시킨다면 우리는 철강 관세를 50% 줄이겠습니다.'",
            effects: {
              trumpEffect: 5,
              carneyEffect: 5,
              steelTariffsEffect: -50,
              dairyAccessEffect: 30,
            },
          },
        ]
      case 5:
        return [
          {
            text: isEnglish
              ? "Accept compromise: 'I'll remove steel tariffs if you open dairy markets by 75%.'"
              : "타협 수용하기: '만약 당신이 유제품 시장을 75% 개방한다면 철강 관세를 제거하겠습니다.'",
            effects: {
              trumpEffect: 10,
              carneyEffect: 0,
              steelTariffsEffect: -100,
              dairyAccessEffect: 75,
            },
          },
          {
            text: isEnglish
              ? "Partial concession: 'I'll reduce steel tariffs by 70% for a 55% increase in dairy access.'"
              : "부분 양보: '유제품 접근을 55% 증가시키는 대가로 철강 관세를 70% 줄이겠습니다.'",
            effects: {
              trumpEffect: 15,
              carneyEffect: 5,
              steelTariffsEffect: -70,
              dairyAccessEffect: 55,
            },
          },
          {
            text: isEnglish
              ? "Strategic leverage: 'Steel tariffs at 30%, dairy access at 60%, with a stability clause.'"
              : "전략적 레버리지: '철강 관세 30%, 유제품 접근 60%, 안정성 조항 포함.'",
            effects: {
              trumpEffect: 20,
              carneyEffect: 10,
              steelTariffsEffect: -70,
              dairyAccessEffect: 60,
              stabilityClauseEffect: true,
            },
          },
          {
            text: isEnglish
              ? "Heated outburst: 'This is ridiculous! You're wasting my time! [Pounds fist on table] Either you open your markets or we'll crush your economy with tariffs!'"
              : "격렬한 분노: '이건 말도 안 됩니다! 당신은 내 시간을 낭비하고 있어요! [테이블을 주먹으로 내리치며] 당신이 시장을 개방하든지, 아니면 우리가 관세로 당신의 경제를 무너뜨릴 것입니다!'",
            effects: {
              disastrousOutcome: true,
            },
          },
        ]
      default:
        return []
    }
  } else {
    switch (stage) {
      case 1:
        return [
          {
            text: isEnglish
              ? "Diplomatic response: 'We need to find a solution that works for both countries.'"
              : "외교적 대응: '우리는 양국 모두에게 효과적인 해결책을 찾아야 합니다.'",
            effects: {
              trumpEffect: 5,
              carneyEffect: 5,
              steelTariffsEffect: -10,
            },
          },
          {
            text: isEnglish
              ? "Stand firm: 'These tariffs are unjustified and harmful to both economies.'"
              : "단호하게 서기: '이러한 관세는 정당화되지 않으며 양국 경제에 해롭습니다.'",
            effects: {
              trumpEffect: -10,
              carneyEffect: 10,
              steelTariffsEffect: 0,
            },
          },
          {
            text: isEnglish
              ? "Highlight consequences: 'If these tariffs continue, we'll have to respond with our own measures.'"
              : "결과 강조하기: '만약 이러한 관세가 계속된다면, 우리는 우리만의 조치로 대응해야 할 것입니다.'",
            effects: {
              trumpEffect: -5,
              carneyEffect: 10,
              retaliationRightsEffect: true,
            },
          },
        ]
      case 2:
        return [
          {
            text: isEnglish
              ? "Focus on facts: 'Our economies are integrated. These tariffs hurt American manufacturers too.'"
              : "사실에 집중하기: '우리 경제는 통합되어 있습니다. 이러한 관세는 미국 제조업체에도 해를 끼칩니다.'",
            effects: {
              trumpEffect: 0,
              carneyEffect: 10,
              steelTariffsEffect: -15,
            },
          },
          {
            text: isEnglish
              ? "Offer limited concession: 'We can discuss dairy, but steel tariffs must be addressed first.'"
              : "제한된 양보 제안하기: '우리는 유제품에 대해 논의할 수 있지만, 철강 관세가 먼저 해결되어야 합니다.'",
            effects: {
              trumpEffect: 10,
              carneyEffect: 5,
              steelTariffsEffect: -20,
              dairyAccessEffect: 10,
            },
          },
          {
            text: isEnglish
              ? "Appeal to alliance: 'As your closest ally, we deserve better treatment than China.'"
              : "동맹에 호소하기: '당신의 가장 가까운 동맹으로서, 우리는 중국보다 더 나은 대우를 받을 자격이 있습니다.'",
            effects: {
              trumpEffect: 5,
              carneyEffect: 5,
              steelTariffsEffect: -10,
            },
          },
        ]
      case 3:
        return [
          {
            text: isEnglish
              ? "Challenge comparison: 'Canada is not China. We're your largest trading partner and closest ally.'"
              : "비교 도전하기: '캐나다는 중국이 아닙니다. 우리는 당신의 가장 큰 무역 파트너이자 가장 가까운 동맹입니다.'",
            effects: {
              trumpEffect: -5,
              carneyEffect: 10,
              steelTariffsEffect: -10,
            },
          },
          {
            text: isEnglish
              ? "Warn about consequences: 'A trade war will hurt American workers and businesses too.'"
              : "결과에 대해 경고하기: '무역 전쟁은 미국 노동자와 기업에도 해를 끼칠 것입니다.'",
            effects: {
              trumpEffect: -10,
              carneyEffect: 5,
              retaliationRightsEffect: true,
            },
          },
          {
            text: isEnglish
              ? "Propose framework: 'Let's create a structured agreement with predictability for businesses.'"
              : "프레임워크 제안하기: '기업들을 위한 예측 가능성을 갖춘 구조화된 협약을 만들어 봅시다.'",
            effects: {
              trumpEffect: 10,
              carneyEffect: 10,
              stabilityClauseEffect: true,
              steelTariffsEffect: -25,
            },
          },
        ]
      case 4:
        return [
          {
            text: isEnglish
              ? "Appeal to mutual interests: 'Our economies are so integrated that harming one harms both.'"
              : "상호 이익에 호소하기: '우리 경제는 너무 통합되어 있어서 하나에 해를 끼치면 둘 다 해를 입습니다.'",
            effects: {
              trumpEffect: 5,
              carneyEffect: 10,
              steelTariffsEffect: -30,
            },
          },
          {
            text: isEnglish
              ? "Firm but respectful: 'We will protect Canadian interests while seeking common ground.'"
              : "단호하지만 존중하는: '우리는 공통점을 찾으면서 캐나다의 이익을 보호할 것입니다.'",
            effects: {
              trumpEffect: 0,
              carneyEffect: 15,
              retaliationRightsEffect: true,
            },
          },
          {
            text: isEnglish
              ? "Propose specific terms: 'Remove steel tariffs and we'll increase dairy access by 20%.'"
              : "구체적인 조건 제안하기: '철강 관세를 제거하면 우리는 유제품 접근을 20% 증가시킬 것입니다.'",
            effects: {
              trumpEffect: 15,
              carneyEffect: 5,
              steelTariffsEffect: -60,
              dairyAccessEffect: 20,
            },
          },
        ]
      case 5:
        return [
          {
            text: isEnglish
              ? "Accept with conditions: 'We can increase dairy access by 50% if all steel tariffs are removed.'"
              : "조건부 수용: '모든 철강 관세가 제거된다면 우리는 유제품 접근을 50% 증가시킬 수 있습니다.'",
            effects: {
              trumpEffect: 10,
              carneyEffect: 5,
              steelTariffsEffect: -100,
              dairyAccessEffect: 50,
            },
          },
          {
            text: isEnglish
              ? "Insist on stability: 'Any deal must include a stability clause to prevent future tariff surprises.'"
              : "안정성 주장하기: '어떤 거래든 미래의 관세 변화을 방지하기 위한 안정성 조항을 포함해야 합니다.'",
            effects: {
              trumpEffect: 0,
              carneyEffect: 10,
              stabilityClauseEffect: true,
              steelTariffsEffect: -60,
              dairyAccessEffect: 30,
            },
          },
          {
            text: isEnglish
              ? "Comprehensive proposal: 'Let's remove steel tariffs, increase dairy access by 45%, with stability guarantees and retaliation rights.'"
              : "포괄적 제안: '철강 관세를 제거하고, 유제품 접근을 45% 증가시키며, 안정성 보장과 보복 권리를 포함합시다.'",
            effects: {
              trumpEffect: 10,
              carneyEffect: 20,
              steelTariffsEffect: -90,
              dairyAccessEffect: 45,
              stabilityClauseEffect: true,
              retaliationRightsEffect: true,
            },
          },
          {
            text: isEnglish
              ? "Heated response: 'This is absurd! Your tariffs are illegal and your threats are unacceptable! [Stands up angrily] Canada will not be bullied by the United States!'"
              : "격렬한 반응: '이건 터무니없습니다! 당신의 관세는 불법이고 위협은 용납할 수 없습니다! [화나서 일어서며] 캐나다는 미국에 의해 괴롭힘을 당하지 않을 것입니다!'",
            effects: {
              disastrousOutcome: true,
            },
          },
        ]
      default:
        return []
    }
  }
}

