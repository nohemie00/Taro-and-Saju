import { showToast } from '@/shared/components/Toast';

const TABS = [
  { id: 'home', label: '홈', icon: 'fas fa-home', active: true },
  { id: 'tarot', label: '타로', icon: 'fas fa-moon', active: false },
  { id: 'mission', label: '미션', icon: 'fas fa-star', active: false },
  { id: 'diary', label: '다이어리', icon: 'fas fa-book', active: false },
  { id: 'scan', label: '스캔', icon: 'fas fa-qrcode', active: false },
];

export function BottomTabBar() {
  const handleTab = (tab: (typeof TABS)[number]) => {
    if (!tab.active) {
      showToast('준비 중이에요', 'info');
    }
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-bg-top/90 backdrop-blur-lg border-t border-white/5 safe-bottom z-50">
      <div className="flex items-center justify-around py-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTab(tab)}
            className={`flex flex-col items-center gap-0.5 py-1.5 px-3 min-w-[56px] transition-colors ${
              tab.active ? 'text-gold' : 'text-lavender/50'
            }`}
          >
            <i className={`${tab.icon} text-lg`} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
