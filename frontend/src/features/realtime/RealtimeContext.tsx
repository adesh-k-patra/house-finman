import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react"
import { io, Socket } from "socket.io-client"
import { apiClient } from "../../services/apiClient"

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5007"

interface RealtimeContextType {
  isConnected: boolean
  newResponse: any | null
  subscribe: (channel: string, callback: (data: any) => void) => () => void
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(
  undefined,
)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [newResponse, setNewResponse] = useState(null)
  const socketRef = useRef<Socket | null>(null)
  const subscribersRef = useRef<Map<string, ((data: any) => void)[]>>(new Map())

  useEffect(() => {
    // Initialize socket connection
    const socket = io(SOCKET_URL, {
      auth: {
        // In a real app, we'd get this from an auth hook/store
        // For now, peek the current state of apiClient
        token: (apiClient as any).accessToken,
      },
      transports: ["websocket"],
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log("⚡️ Realtime connected")
      setIsConnected(true)
    })

    socket.on("disconnect", () => {
      console.log("⚡️ Realtime disconnected")
      setIsConnected(false)
    })

    // Listen for survey responses
    socket.on("survey_response", (data) => {
      setNewResponse(data)
      const callbacks = subscribersRef.current.get("responses")
      if (callbacks) callbacks.forEach((cb) => cb(data))
    })

    // Fallback Mock Logic (Only if disconnected after 3s)
    const mockInterval = setInterval(() => {
      if (!socket.connected && Math.random() > 0.8) {
        const mockEvent = {
          id: `MOCK-${Math.floor(Math.random() * 1000)}`,
          type: "new_response",
          timestamp: new Date().toISOString(),
        }
        setNewResponse(mockEvent as any)
        const callbacks = subscribersRef.current.get("responses")
        if (callbacks) callbacks.forEach((cb) => cb(mockEvent))
      }
    }, 10000)

    return () => {
      socket.close()
      clearInterval(mockInterval)
    }
  }, [])

  const subscribe = (channel: string, callback: (data: any) => void) => {
    const current = subscribersRef.current.get(channel) || []
    subscribersRef.current.set(channel, [...current, callback])

    return () => {
      const list = subscribersRef.current.get(channel) || []
      subscribersRef.current.set(
        channel,
        list.filter((cb) => cb !== callback),
      )
    }
  }

  return (
    <RealtimeContext.Provider value={{ isConnected, newResponse, subscribe }}>
      {children}
    </RealtimeContext.Provider>
  )
}

export const useRealtime = () => {
  const context = useContext(RealtimeContext)
  if (!context)
    throw new Error("useRealtime must be used within RealtimeProvider")
  return context
}
