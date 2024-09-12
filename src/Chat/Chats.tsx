import dayjs from 'dayjs'
import ChatBubble from './ChatBubble'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import styles from './Chats.module.scss'
import { useLayoutEffect, useRef, useState } from 'react'
import { useLoadMore } from '../utils/useLoadMore'
import { get_chat } from '../utils/api'
import { scrollToBottom, useChatScroll } from '../utils/scroll'

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
            = index === 0 // 1. first message
            || chat.senderId !== chatList[index - 1].senderId // 2. different sender with previous message
            || dayjs(chatList[index - 1].createdAt).diff(dayjs(chat.createdAt), 'minute') > 1 // 3. 1 minute difference with previous message
          const isLastMessage
              = index === chatList.length - 1 // 1. last message
              || chat.senderId !== chatList[index + 1].senderId // 2. different sender with next message
              || dayjs(chatList[index + 1].createdAt).diff(dayjs(chat.createdAt), 'minute') > 1 // 3. 1 minute difference with next message

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
