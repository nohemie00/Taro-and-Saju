import { useNavigate } from 'react-router-dom';
import { GradientBackground } from '@/shared/components/GradientBackground';

export function TermsScreen() {
  const navigate = useNavigate();

  return (
    <GradientBackground>
      <div className="min-h-screen min-h-[100dvh] flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 px-5 pt-5 pb-4 sticky top-0 z-10 bg-midnight/80 backdrop-blur-md">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5"
          >
            <i className="fas fa-arrow-left text-sm text-ivory/70" />
          </button>
          <h1 className="font-display text-lg text-gold">이용약관</h1>
        </header>

        <main className="flex-1 px-5 pb-10">
          <div className="prose-legal space-y-6 text-ivory/80 text-sm leading-relaxed">
            <p className="text-lavender/50 text-xs">시행일: 2026년 9월 1일</p>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">제1조 (목적)</h2>
              <p>
                본 약관은 오색운(五色運)(이하 "서비스")의 이용과 관련하여 서비스 제공자(이하 "운영자")와
                이용자(이하 "사용자") 간의 권리·의무 및 책임 사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">제2조 (정의)</h2>
              <ol className="list-decimal list-inside space-y-2 text-ivory/70">
                <li>"서비스"란 오색운(五色運) 애플리케이션을 통해 제공되는 사주 오행 분석, 타로 카드 리딩, 오늘의 컬러, 일일 미션 등 모든 기능을 말합니다.</li>
                <li>"사용자"란 본 약관에 동의하고 서비스를 이용하는 자를 말합니다.</li>
                <li>"토스 미니앱"이란 주식회사 비바리퍼블리카의 토스 플랫폼 내에서 실행되는 애플리케이션을 말합니다.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">제3조 (약관의 효력 및 변경)</h2>
              <ol className="list-decimal list-inside space-y-2 text-ivory/70">
                <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 사용자에게 공지함으로써 효력이 발생합니다.</li>
                <li>운영자는 관련 법률을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 변경 시 최소 7일 전 서비스 내 공지합니다.</li>
                <li>변경된 약관에 동의하지 않는 사용자는 서비스 이용을 중단하고 회원 탈퇴를 할 수 있습니다.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">제4조 (서비스의 내용)</h2>
              <p>서비스는 다음과 같은 기능을 제공합니다.</p>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 mt-2">
                <ul className="space-y-2 text-xs text-ivory/70">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-yin-yang text-gold/60 mt-0.5 shrink-0" />
                    <span><strong className="text-ivory/90">사주 오행 분석</strong> — 생년월일·시간 기반 오행 분포 산출</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-moon text-purple-400/60 mt-0.5 shrink-0" />
                    <span><strong className="text-ivory/90">타로 카드 리딩</strong> — 하루 1회 3장 카드 뽑기 및 해석</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-palette text-pink-400/60 mt-0.5 shrink-0" />
                    <span><strong className="text-ivory/90">오늘의 컬러</strong> — 오행 기반 일일 행운 색상 제공</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-star text-emerald-400/60 mt-0.5 shrink-0" />
                    <span><strong className="text-ivory/90">일일 미션</strong> — 부족한 오행을 보완하는 맞춤 미션</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">제5조 (서비스 이용)</h2>
              <ol className="list-decimal list-inside space-y-2 text-ivory/70">
                <li>서비스는 토스 앱 내에서 이용할 수 있으며, 토스 계정 인증을 통해 사용자를 식별합니다.</li>
                <li>사용자는 최초 이용 시 닉네임, 생년월일, 태어난 시간(선택), 성별(선택)을 입력해야 합니다.</li>
                <li>타로 카드 리딩은 1일 1회로 제한됩니다.</li>
                <li>서비스 이용은 무료이며, 향후 유료 프리미엄 기능이 추가될 수 있습니다.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">제6조 (운영자의 의무)</h2>
              <ol className="list-decimal list-inside space-y-2 text-ivory/70">
                <li>운영자는 관련 법령과 본 약관이 금지하는 행위를 하지 않으며, 지속적이고 안정적으로 서비스를 제공하기 위해 노력합니다.</li>
                <li>운영자는 사용자의 개인정보를 안전하게 관리하며, 개인정보처리방침에 따라 보호합니다.</li>
                <li>서비스 장애 발생 시 신속하게 복구하기 위해 최선을 다합니다.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">제7조 (사용자의 의무)</h2>
              <p>사용자는 다음 행위를 해서는 안 됩니다.</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-ivory/60">
                <li>타인의 정보를 도용하여 서비스를 이용하는 행위</li>
                <li>서비스의 운영을 방해하는 행위 (비정상적 자동화 요청, 해킹 시도 등)</li>
                <li>서비스를 통해 얻은 정보를 운영자의 사전 동의 없이 상업적으로 이용하는 행위</li>
                <li>기타 관련 법령에 위배되는 행위</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">제8조 (서비스 이용의 제한 및 중단)</h2>
              <ol className="list-decimal list-inside space-y-2 text-ivory/70">
                <li>운영자는 다음의 경우 서비스 이용을 제한하거나 중단할 수 있습니다.
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-ivory/50">
                    <li>서비스 설비의 보수·점검·교체 및 고장, 통신 두절 등의 경우</li>
                    <li>천재지변, 국가비상사태 등 불가항력적 사유가 있는 경우</li>
                    <li>사용자가 본 약관을 위반한 경우</li>
                  </ul>
                </li>
                <li>운영자는 서비스 중단 시 사전에 공지하며, 불가피한 경우 사후에 공지할 수 있습니다.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">제9조 (회원 탈퇴 및 데이터 삭제)</h2>
              <ol className="list-decimal list-inside space-y-2 text-ivory/70">
                <li>사용자는 언제든지 서비스 내 프로필 화면을 통해 회원 탈퇴를 요청할 수 있습니다.</li>
                <li>탈퇴 시 사용자의 모든 데이터(사용자 정보, 리딩 기록, 미션 기록 등)는 즉시 영구 삭제됩니다.</li>
                <li>삭제된 데이터는 복구할 수 없으며, 운영자는 이에 대해 책임지지 않습니다.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">제10조 (면책 조항)</h2>
              <ol className="list-decimal list-inside space-y-2 text-ivory/70">
                <li>서비스에서 제공하는 사주 분석, 타로 리딩, 운세 결과 등은 <strong className="text-ivory/90">오락 및 참고 목적</strong>으로만 제공되며, 전문적인 상담이나 조언을 대체하지 않습니다.</li>
                <li>사용자가 서비스의 결과를 토대로 내린 결정이나 행동에 대해 운영자는 책임을 지지 않습니다.</li>
                <li>천재지변 또는 이에 준하는 불가항력으로 인한 서비스 중단에 대해 운영자는 책임을 지지 않습니다.</li>
              </ol>
              <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 mt-3">
                <p className="text-xs text-gold/80 flex items-start gap-2">
                  <i className="fas fa-exclamation-triangle mt-0.5 shrink-0" />
                  <span>
                    본 서비스의 모든 운세·리딩 결과는 전통 문화와 오행 이론에 기반한 재미 요소이며,
                    의학적·법률적·재정적 판단의 근거로 사용해서는 안 됩니다.
                  </span>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">제11조 (저작권 및 지적재산권)</h2>
              <ol className="list-decimal list-inside space-y-2 text-ivory/70">
                <li>서비스에 포함된 카드 이미지, 텍스트, 디자인, 로고 등 일체의 콘텐츠에 대한 저작권은 운영자에게 있습니다.</li>
                <li>사용자는 운영자의 사전 서면 동의 없이 서비스의 콘텐츠를 복제·배포·전송·변형할 수 없습니다.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">제12조 (분쟁 해결)</h2>
              <ol className="list-decimal list-inside space-y-2 text-ivory/70">
                <li>본 약관에 관한 분쟁은 대한민국 법률을 적용합니다.</li>
                <li>서비스 이용과 관련하여 운영자와 사용자 간 분쟁이 발생한 경우, 쌍방 협의에 의해 해결하며, 합의가 이루어지지 않을 경우 관할 법원에 소를 제기할 수 있습니다.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">부칙</h2>
              <p>본 약관은 2026년 9월 1일부터 시행합니다.</p>
            </section>
          </div>
        </main>
      </div>
    </GradientBackground>
  );
}
