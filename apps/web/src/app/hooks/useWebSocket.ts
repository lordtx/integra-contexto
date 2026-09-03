'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

type WSStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export function useWebSocket(url: string) {
  const [status, setStatus] = useState<WSStatus>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<Map<string, (data: any) => void>>(new Map());
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    setStatus('connecting');
    try {
      const ws = new WebSocket(url);
      ws.onopen = () => { setStatus('connected'); };
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          const handler = handlersRef.current.get(data.event);
          if (handler) handler(data);
        } catch {}
      };
      ws.onclose = () => { setStatus('disconnected'); wsRef.current = null; reconnect(); };
      ws.onerror = () => { setStatus('error'); ws.close(); };
      wsRef.current = ws;
    } catch { setStatus('error'); reconnect(); }
  }, [url]);

  const reconnect = useCallback(() => {
    clearTimeout(reconnectTimer.current);
    reconnectTimer.current = setTimeout(connect, 3000);
  }, [connect]);

  const subscribe = useCallback((gameId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN)
      wsRef.current.send(JSON.stringify({ type: 'subscribe', gameId }));
  }, []);

  const on = useCallback((event: string, handler: (data: any) => void) => {
    handlersRef.current.set(event, handler);
    return () => { handlersRef.current.delete(event); };
  }, []);

  const send = useCallback((data: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN)
      wsRef.current.send(JSON.stringify(data));
  }, []);

  useEffect(() => { connect(); return () => { clearTimeout(reconnectTimer.current); wsRef.current?.close(); }; }, [connect]);

  return { status, subscribe, on, send };
}