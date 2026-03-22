export const TEA_NAMES = {
  '덖음차 (Roasted Tea)': '덖음차',
  '청차 (Cheongcha)': '청차',
  '발효차 (Fermented Tea)': '발효차',
}

export const BUTTON_LABELS = {
  addStock: '재고 추가',
  removeStock: '재고 제거',
  addTea: '차 추가',
  export: '내보내기',
  all: '전체',
  packaging: '포장',
  flush: '등급',
  year: '연도',
  viewCustomers: '고객 관리',
}

export const TRANSACTION_TYPE_LABELS = {
  harvest: '수확',
  sale: '판매',
  donation: '기증',
  ceremony: '다례',
  damaged: '손상',
}

export const FORM_LABELS = {
  transactionSelect: '이유 선택',
  allOptions: '전체',
  exportTransactions: '거래 내보내기',
  cancel: '취소',
  download: '다운로드',
  startDate: '시작 날짜',
  endDate: '종료 날짜',
}

export const LANGUAGE = 'ko'

export const t = (key: string): string => {
  return (TRANSLATIONS[LANGUAGE] as Record<string, string>)[key] ?? key
}

export const TRANSLATIONS = {
  ko: {
    emailPlaceholder: '이메일',
    passwordPlaceholder: '비밀번호',
    submitButton: '제출',
    authError: '이메일 또는 비밀번호가 올바르지 않습니다',
    requiredField: '필수 입력 항목입니다',
    loading: '로딩 중...',
    allYears: '전체',
    addStock: '재고 추가',
    removeStock: '재고 제거',
    manageTeas: '차 관리',
    manageCustomers: '고객 관리',
    weightPlaceholder: '무게 (g)',
    quantityPlaceholder: '수량',
    notesPlaceholder: '메모',
    otherWeight: '직접 입력',
    teaRequired: '차를 선택해주세요',
    packagingRequired: '포장 방식을 선택해주세요',
    flushRequired: '등급을 선택해주세요',
    invalidYear: '올바른 연도를 입력해주세요',
    futureYear: '수확 연도는 미래일 수 없습니다',
    invalidWeight: '올바른 무게를 입력해주세요',
    invalidQuantity: '올바른 수량을 입력해주세요',
    positiveQuantity: '수량은 양수여야 합니다',
    silver: '은박',
    wing: '날개',
    gift: '선물',
    first: '첫물',
    second: '두물',
    mixed: '혼합',
  },
  en: {
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    submitButton: 'Submit',
    authError: 'Email or password is incorrect',
    requiredField: 'This is a required field',
    loading: 'Loading...',
    allYears: 'All',
    addStock: 'Add Stock',
    removeStock: 'Remove Stock',
    manageTeas: 'Manage Teas',
    manageCustomers: 'Manage Customers',
    weightPlaceholder: 'Weight (g)',
    quantityPlaceholder: 'Quantity',
    notesPlaceholder: 'Notes',
    otherWeight: 'Other',
    teaRequired: 'Please select a tea',
    packagingRequired: 'Please select a packaging type',
    flushRequired: 'Please select a flush',
    invalidYear: 'Please enter a valid year',
    futureYear: 'Harvest year cannot be in the future',
    invalidWeight: 'Please enter a valid weight',
    invalidQuantity: 'Please enter a valid quantity',
    positiveQuantity: 'Value must be positive',
    silver: 'Silver',
    wing: 'Wing',
    gift: 'Gift',
    first: 'First',
    second: 'Second',
    mixed: 'Mixed',
  },
}
