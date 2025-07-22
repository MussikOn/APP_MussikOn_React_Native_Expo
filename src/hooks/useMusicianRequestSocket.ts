import { useEffect, useRef, useState } from 'react';
import { socket } from '@utils/socket';

export type MusicianRequestStatus = 'idle' | 'buscando' | 'encontrado' | 'no_encontrado' | 'cancelado' | 'error';

interface Musician {
  id: string;
  name: string;
  instrument: string;
  rating?: number;
  // ...otros campos relevantes
}

interface UseMusicianRequestSocketProps {
  requestId?: string;
  onFound?: (musician: Musician) => void;
  onNotFound?: () => void;
  onCancel?: () => void;
}

export const useMusicianRequestSocket = ({ requestId, onFound, onNotFound, onCancel }: UseMusicianRequestSocketProps = {}) => {
  const [status, setStatus] = useState<MusicianRequestStatus>('idle');
  const [musician, setMusician] = useState<Musician | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentRequestId, setCurrentRequestId] = useState<string | undefined>(requestId);

  // Emitir nueva solicitud
  const emitRequest = (data: any) => {
    setStatus('buscando');
    setMusician(null);
    setError(null);
    setCurrentRequestId(data.id);
    socket.emit('new_event_request', data);
  };

  // Cancelar solicitud
  const cancelRequest = () => {
    if (currentRequestId) {
      socket.emit('request_cancelled', { requestId: currentRequestId });
      setStatus('cancelado');
      setMusician(null);
      setError(null);
      onCancel && onCancel();
    }
  };

  // Reintentar
  const onRetry = () => {
    setStatus('idle');
    setMusician(null);
    setError(null);
  };

  useEffect(() => {
    if (!currentRequestId) return;
    // Escuchar eventos de socket
    const handleMusicianAccepted = (data: any) => {
      if (data.requestId === currentRequestId) {
        setStatus('encontrado');
        setMusician(data.musician);
        onFound && onFound(data.musician);
      }
    };
    const handleNotFound = (data: any) => {
      if (data.requestId === currentRequestId) {
        setStatus('no_encontrado');
        setMusician(null);
        onNotFound && onNotFound();
      }
    };
    const handleRequestTaken = (data: any) => {
      if (data.requestId === currentRequestId) {
        setStatus('no_encontrado');
        setMusician(null);
        setError('La solicitud fue tomada por otro músico.');
      }
    };
    const handleError = (err: any) => {
      setStatus('error');
      setError(err?.message || 'Error desconocido');
    };
    socket.on('musician_accepted', handleMusicianAccepted);
    socket.on('musician_not_found', handleNotFound);
    socket.on('musician_request_taken', handleRequestTaken);
    socket.on('request_error', handleError);
    return () => {
      socket.off('musician_accepted', handleMusicianAccepted);
      socket.off('musician_not_found', handleNotFound);
      socket.off('musician_request_taken', handleRequestTaken);
      socket.off('request_error', handleError);
    };
  }, [currentRequestId]);

  return {
    status,
    musician,
    error,
    emitRequest,
    cancelRequest,
    onRetry,
  };
}; 