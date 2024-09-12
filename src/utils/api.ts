export type Chat = {
  senderId: number
  id: number
  message: string
  createdAt: string
}

type PageData<Content> = {
  totalElements: number
  totalPages: number
  page: number
  size: number
  content: Content[]
}

type Params = {
  page?: number
  size?: number
}

const chatMessages = Array.from({ length: 1000 }, () => {
  const messages = [
    '안녕? 반가워요',
    '당신의 취미는 무엇인가요?',
    '저는 자전거 타는거 좋아해요.',
    '어디로 자전거 타러가시나요?',
    '저는 보통 한강으로 자전거 타러가요.',
    '한강이 정말 좋은 장소죠.',
    '다른 취미가 있나요?',
    '영화나 드라마를 보는 것을 좋아하시나요?',
    '네, 영화를 보는 것을 좋아해요.',
    '어떤 장르를 좋아하세요?',
    '로맨스 장르를 좋아해요.',
    '스포츠 경기도 즐기시나요?',
    '요즘 읽고 있는 책이 있나요?',
    '저는 요리하는 걸 좋아해요.',
    '무슨 요리를 자주 하세요?',
    '여행을 좋아하세요?',
    '어디로 여행을 가고 싶으세요?',
    '이번 주말에는 무엇을 할 예정인가요?',
    '최근 본 영화 중에서 추천할 만한 영화가 있나요?',
    '고양이 키우는 걸 좋아하시나요?',
    '음악을 듣는 것을 좋아하시나요?',
    '어떤 음악 장르를 좋아하세요?',
    '여름에는 보통 어떻게 시간을 보내세요?',
    '겨울에 스키 타러 가본 적 있나요?',
    '책 읽는 걸 좋아해요. 당신은요?',
    '저는 자연을 산책하는 걸 좋아해요.',
    '요즘 어떤 드라마를 보고 계세요?',
    '최근 본 책 중에서 인상 깊었던 것이 있나요?',
    '주말에는 보통 무엇을 하세요?',
    '주로 어떤 운동을 하세요?',
    '좋아하는 음식은 무엇인가요?',
    '저는 강아지를 키우고 있어요. 당신은요?',
    '최근에 어디에서 맛있는 음식을 드셨나요?',
    '바다에서 수영하는 걸 좋아하시나요?',
    '오늘 날씨가 정말 좋네요.',
    '커피 좋아하세요? 차는요?',
    '저는 아침형 인간이에요. 당신은요?',
    '음악을 연주할 줄 아세요?',
    '예술에 관심이 있나요?',
    '당신의 고향은 어디인가요?',
    '운동은 자주 하시나요?',
    '당신은 어떤 음식을 잘 만드세요?',
    '요즘 유행하는 운동을 해보고 싶으세요?',
    '제가 추천하는 취미가 있어요. 들어보실래요?',
    '당신의 꿈은 무엇인가요?',
    '책을 쓰고 싶다고 생각한 적이 있나요?',
    '새로운 언어를 배우고 싶으신가요?',
    '이번 주말에 여행을 갈 계획이 있나요?',
    '당신의 직업은 무엇인가요?',
    '게임하는 걸 좋아하세요?',
    '저는 음악 감상할 때 휴식을 취해요.',
    '같이 운동하러 갈래요?',
    '요즘 어떤 음악을 자주 들으세요?',
    '당신은 어떤 계절을 좋아하세요?',
  ];

  return messages[Math.floor(Math.random() * messages.length)];
});

const mockChats: Chat[] = Array.from({ length: 1000 }, (_, index) => ({
  senderId: Math.floor(Math.random() * 3),
  id: index,
  message: chatMessages[index],
  createdAt: new Date(Date.now() - index * 1000 * 60).toISOString(),
}));

export const get_chat = async (params?: Params): Promise<PageData<Chat>> => {
  const { page = 0, size = 20 } = params ?? {}

  return new Promise((resolve) => {
    setTimeout(() => {
      const start = page * size;
      const end = start + size;
      const paginatedContent = mockChats.slice(start, end);

      const response: PageData<Chat> = {
        totalElements: mockChats.length,
        totalPages: Math.ceil(mockChats.length / size),
        page,
        size,
        content: paginatedContent,
      }
      console.log('fetching chat data', { page, size, start, end, response });

      resolve(response);
    }, 500); // 500ms의 딜레이를 추가해 실제 API 요청처럼 비동기 상황을 모방
  });
}


