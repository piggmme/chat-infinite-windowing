import dayjs from 'dayjs'
import styles from './ChatBubble.module.scss'
import classNames from 'classnames'
import { Chat } from '../utils/api'

export type ChatBubbleProps = Chat & {
  isStartMessage: boolean
  isMyMessage: boolean
  isLastMessage: boolean
}

export default function ChatBubble ({
  senderId,
  message,
  createdAt,
  isStartMessage,
  isMyMessage,
  isLastMessage,
}: ChatBubbleProps) {

  const user = {
    id: senderId,
    name: '테스트',
    avatar: 'https://avatars.githubusercontent.com/u/44080404?v=4',
  }

  if (isMyMessage) {
    return (
      <div className={styles.MyMessageContainer}>
        {isLastMessage && <div className={styles.SendTime}>{dayjs(createdAt).format('A h:mm')}</div>}
        <div className={styles.MyMessageList}>
          <div className={styles.MessageItem}>{message}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={classNames(styles.OtherMessageContainer, {
        [styles.isStartMessage]: isStartMessage,
      })}
    >
      <div>
        {isStartMessage && <div className={styles.MemberName}>{user.name}</div>}
        <div
          className={classNames(styles.MessageItem, {
            [styles.singleMessage]: !isStartMessage,
          })}
        >
          {message}
        </div>
      </div>
      {isLastMessage && <div className={styles.SendTime}>{dayjs(createdAt).format('A h:MM')}</div>}
    </div>
  )
}
