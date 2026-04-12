"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"

export function RelativeTime({ timestamp }: { timestamp: string | Date }) {
  const [timeAgo, setTimeAgo] = useState("")

  useEffect(() => {
    const updateTime = () => {
      try {
        let shortSuffix = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
        
        // Custom formatting to match the old short style if desired, though formatDistanceToNow is fine.
        // The original was "10m ago", "1h ago", etc. 
        // formatDistanceToNow produces "10 minutes ago", "about 1 hour ago"
        // Let's just use the default text from date-fns for proper grammar, but we could replace text.
        shortSuffix = shortSuffix
          .replace("about ", "")
          .replace(" minutes", "m")
          .replace(" minute", "m")
          .replace(" hours", "h")
          .replace(" hour", "h")
          .replace(" days", "d")
          .replace(" day", "d")
          .replace(" months", "mo")
          .replace(" month", "mo")
          .replace(" years", "y")
          .replace(" year", "y");

        setTimeAgo(shortSuffix)
      } catch (e) {
        setTimeAgo("just now")
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [timestamp])

  // Don't render until client side hydration to prevent hydration mismatch
  if (!timeAgo) {
    return <span className="opacity-0">loading...</span>
  }

  return <>{timeAgo}</>
}
