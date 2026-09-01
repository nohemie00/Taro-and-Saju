import { useNavigate } from 'react-router-dom';
import { GradientBackground } from '@/shared/components/GradientBackground';

export function PrivacyScreen() {
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
          <h1 className="font-display text-lg text-gold">개인정보처리방침</h1>
        </header>

        <main className="flex-1 px-5 pb-10">
          <div className="prose-legal space-y-6 text-ivory/80 text-sm leading-relaxed">
            <p className="text-lavender/50 text-xs">시행일: 2026년 9월 1일</p>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">1. 개인정보의 수집 및 이용 목적</h2>
              <p>
                오색운(五色運)(이하 "서비스")은 사용자에게 사주 오행 분석, 타로 카드 리딩, 오늘의 컬러·미션 등
                운세 관련 서비스를 제공하기 위해 최소한의 개인정보를 수집·이용합니다.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">2. 수집하는 개인정보 항목</h2>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-gold/80 font-medium">구분</th>
                      <th className="text-left py-2 text-gold/80 font-medium">항목</th>
                    </tr>
                  </thead>
                  <tbody className="text-ivory/70">
                    <tr className="border-b border-white/5">
                      <td className="py-2 align-top">필수</td>
                      <td className="py-2">토스 사용자 식별키, 닉네임, 생년월일, 태어난 시간(12지지), 성별</td>
                    </tr>
                    <tr>
                      <td className="py-2 align-top">자동 생성</td>
                      <td className="py-2">서비스 이용 기록(타로 리딩 결과, 미션 완료 기록, 오늘의 운세 캐시)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">3. 개인정보의 보유 및 이용 기간</h2>
              <p>
                수집된 개인정보는 서비스 이용 기간 동안 보유·이용되며, 회원 탈퇴 시 즉시 파기됩니다.
                단, 관련 법령에 의하여 보존할 필요가 있는 경우에는 해당 법령에서 정한 기간 동안 보존합니다.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-ivory/60">
                <li>전자상거래법에 의한 표시·광고에 관한 기록: 6개월</li>
                <li>계약 또는 청약철회에 관한 기록: 5년</li>
                <li>소비자 불만 또는 분쟁 처리에 관한 기록: 3년</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">4. 개인정보의 제3자 제공</h2>
              <p>
                서비스는 사용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
                다만, 다음의 경우에는 예외로 합니다.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-ivory/60">
                <li>사용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">5. 개인정보 처리의 위탁</h2>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-gold/80 font-medium">수탁자</th>
                      <th className="text-left py-2 text-gold/80 font-medium">위탁 업무</th>
                    </tr>
                  </thead>
                  <tbody className="text-ivory/70">
                    <tr>
                      <td className="py-2">Cloudflare, Inc.</td>
                      <td className="py-2">데이터 저장 및 서비스 호스팅 (Cloudflare D1, Pages)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">6. 개인정보의 파기 절차 및 방법</h2>
              <p>
                사용자가 프로필 화면에서 "회원 탈퇴"를 요청하면, 해당 사용자의 모든 데이터
                (사용자 정보, 타로 리딩 기록, 미션 기록, 운세 캐시, 카드 컬렉션)가 즉시 영구 삭제됩니다.
              </p>
              <p className="mt-2">
                전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며,
                종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각합니다.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">7. 사용자의 권리와 의무</h2>
              <p>사용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-ivory/60">
                <li>개인정보 열람 요구: 프로필 화면에서 본인의 정보를 확인할 수 있습니다.</li>
                <li>개인정보 정정·삭제 요구: 프로필 화면의 "사주 정보 수정"에서 변경 가능합니다.</li>
                <li>개인정보 처리 정지 요구: "회원 탈퇴"를 통해 모든 데이터 처리를 중단할 수 있습니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">8. 개인정보의 안전성 확보 조치</h2>
              <p>서비스는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-ivory/60">
                <li>모든 통신은 HTTPS(TLS 1.3) 암호화를 적용합니다.</li>
                <li>데이터베이스는 Cloudflare의 글로벌 보안 인프라로 보호됩니다.</li>
                <li>사용자 식별에 비밀번호가 아닌 토스 앱 인증 키를 사용합니다.</li>
                <li>개인정보 접근 권한을 최소화하여 관리합니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">9. 쿠키(Cookie)의 사용</h2>
              <p>
                서비스는 별도의 쿠키를 사용하지 않습니다.
                사용자 인증은 토스 앱의 인증 시스템(x-toss-user-key)을 통해 이루어집니다.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">10. 개인정보 보호 책임자</h2>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-xs text-ivory/70 space-y-1">
                <p><span className="text-ivory/90 font-medium">성명:</span> 개인정보 보호 담당자</p>
                <p><span className="text-ivory/90 font-medium">이메일:</span> nohemie2525@gmail.com</p>
              </div>
              <p className="mt-2 text-ivory/60 text-xs">
                기타 개인정보 침해에 대한 신고나 상담이 필요하신 경우 아래 기관에 문의하시기 바랍니다.
              </p>
              <ul className="mt-1 space-y-1 text-xs text-ivory/50">
                <li>• 개인정보침해신고센터 (privacy.kisa.or.kr / 국번 없이 118)</li>
                <li>• 대검찰청 사이버수사과 (www.spo.go.kr / 02-3480-3573)</li>
                <li>• 경찰청 사이버안전국 (ecrm.police.go.kr / 국번 없이 182)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-ivory mb-2">11. 방침 변경에 관한 사항</h2>
              <p>
                본 개인정보처리방침은 2026년 9월 1일부터 시행됩니다.
                변경 사항이 있을 경우, 서비스 내 공지를 통해 안내해 드립니다.
              </p>
            </section>
          </div>
        </main>
      </div>
    </GradientBackground>
  );
}
