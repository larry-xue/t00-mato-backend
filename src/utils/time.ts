import * as dayjs from "dayjs"

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}