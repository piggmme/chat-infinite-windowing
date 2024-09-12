import dayjs from 'dayjs'
import ChatBubble from './ChatBubble'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import styles from './Chats.module.scss'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLoadMore } from '../utils/useLoadMore'
import { get_chat } from '../utils/api'

const useChats = () => {
  return useSuspenseInfiniteQuery({
    queryKey: ['chats'],
    queryFn: ({ pageParam }) => get_chat({ page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: lastPage =>
      lastPage.totalPages <= lastPage.page ? null : lastPage.page + 1,
  })
}

const myId = 0

export default function Chats () {
  const { data, fetchNextPage, isFetched, hasNextPage } = useChats()

  const chatList = data.pages.map(page => page.content).flat().reverse()
  const showLoadMore = isFetched && hasNextPage

  const [isScrolled, setIsScrolled] = useState(false)
  const chatListRef = useChatScroll(chatList, isScrolled)
  const snapshotRef = useRef<{ scrollHeight: number, scrollTop: number } | null>(null)

  const loadMoreRef = useLoadMore(async () => {
    if (chatListRef.current) {
      snapshotRef.current = {
        scrollHeight: chatListRef.current.scrollHeight,
        scrollTop: chatListRef.current.scrollTop,
      }
      await fetchNextPage()
    }
  })

  useLayoutEffect(() => {
    if (snapshotRef.current && chatListRef.current) {
      const { scrollHeight, scrollTop } = snapshotRef.current
      chatListRef.current.scrollTo({
        top: chatListRef.current.scrollHeight - scrollHeight + scrollTop,
        left: 0,
        behavior: 'instant',
      })
      snapshotRef.current = null
    }
  }, [data.pages])

  const hasNewMessage = true

  return (
    <div>
      <ul
        ref={chatListRef}
        className={styles.ChatBubbleList}
        onScroll={() => {
          if (chatListRef.current) {
            setIsScrolled(chatListRef.current.scrollTop + chatListRef.current.clientHeight < chatListRef.current.scrollHeight)
          }
        }}
      >
        {showLoadMore && <li ref={loadMoreRef} />}
        {chatList.map((chat, index) => {
          const isStartMessage
            = index === 0 // 1. 첫 번째 메시지
            || chat.senderId !== chatList[index - 1].senderId // 2. 이전 메시지와 다른 사용자
            || dayjs(chatList[index - 1].createdAt).diff(dayjs(chat.createdAt), 'minute') > 1 // 3. 이전 메시지와 1분 이상 차이
          const isLastMessage
              = index === chatList.length - 1 // 1. 마지막 메시지
              || chat.senderId !== chatList[index + 1].senderId // 2. 다음 메시지와 다른 사용자
              || dayjs(chatList[index + 1].createdAt).diff(dayjs(chat.createdAt), 'minute') > 1 // 3. 다음 메시지와 1분 이상 차이

          return (
            <li key={`chat-${chat.id}-${chat.createdAt}`}>
              <ChatBubble
                {...chat}
                isStartMessage={isStartMessage}
                isLastMessage={isLastMessage}
                isMyMessage={myId === chat.senderId}
              />
            </li>
          )
        })}
      </ul>
      {isScrolled && hasNewMessage && (
        <button
          onClick={() => {
            setIsScrolled(false)
            scrollToBottom(chatListRef.current!)
          }}
          className={styles.ChatNewMssage}
        >
          <span>새로운 메세지 확인하기</span>
        </button>
      )}
    </div>
  )
}

const scrollToBottom = (element: HTMLUListElement) => {
  element.scrollTo({
    top: element.scrollHeight,
    left: 0,
    behavior: 'instant',
  })
}

function useChatScroll<T> (dep: T, disabled: boolean) {
  const ref = useRef<HTMLUListElement>(null)
  useEffect(() => {
    if (disabled) return
    if (ref.current) {
      scrollToBottom(ref.current)
    }
  }, [dep, disabled])
  return ref as React.RefObject<HTMLUListElement>
}
